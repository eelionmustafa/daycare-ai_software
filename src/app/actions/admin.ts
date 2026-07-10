"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { setSetting, SETTING_DEFAULTS } from "@/lib/settings";
import { dateOnly } from "@/lib/format";

async function requireAdmin() {
  return requireUser("ADMIN");
}

// ---------- Families & children ----------

export async function createFamily(formData: FormData) {
  await requireAdmin();
  const parentName = String(formData.get("parentName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const childFirst = String(formData.get("childFirst") ?? "").trim();
  const childLast = String(formData.get("childLast") ?? "").trim();
  const birthday = String(formData.get("birthday") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!parentName || !email || password.length < 6 || !childFirst) {
    redirect("/admin/femijet/shto?gabim=1");
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) redirect("/admin/femijet/shto?gabim=email");

  await db.user.create({
    data: {
      email,
      name: parentName,
      phone: phone || null,
      role: "PARENT",
      passwordHash: await bcrypt.hash(password, 10),
      children: {
        create: {
          firstName: childFirst,
          lastName: childLast || parentName.split(" ").slice(-1)[0],
          birthday: birthday ? new Date(birthday) : null,
          notes: notes || null,
        },
      },
    },
  });
  revalidatePath("/admin/femijet");
  redirect("/admin/femijet?sukses=1");
}

export async function addChildToParent(formData: FormData) {
  await requireAdmin();
  const parentId = String(formData.get("parentId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const birthday = String(formData.get("birthday") ?? "");
  if (!parentId || !firstName) return;
  await db.child.create({
    data: {
      parentId,
      firstName,
      lastName,
      birthday: birthday ? new Date(birthday) : null,
    },
  });
  revalidatePath("/admin/femijet");
}

export async function updateChild(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const birthday = String(formData.get("birthday") ?? "");
  await db.child.update({
    where: { id },
    data: {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      birthday: birthday ? new Date(birthday) : null,
      notes: String(formData.get("notes") ?? "").trim() || null,
      emergencyName: String(formData.get("emergencyName") ?? "").trim() || null,
      emergencyPhone: String(formData.get("emergencyPhone") ?? "").trim() || null,
      emergencyRelation: String(formData.get("emergencyRelation") ?? "").trim() || null,
      active: formData.get("active") === "on",
    },
  });
  revalidatePath("/admin/femijet");
  redirect(`/admin/femijet/${id}?sukses=1`);
}

// ---------- Attendance ----------

export async function setAttendance(formData: FormData) {
  await requireAdmin();
  const childId = String(formData.get("childId") ?? "");
  const date = dateOnly(String(formData.get("date") ?? new Date().toISOString()));
  const status = String(formData.get("status") ?? "PRESENT");
  if (!["PRESENT", "ABSENT", "EXCUSED"].includes(status)) return;
  await db.attendanceRecord.upsert({
    where: { childId_date: { childId, date } },
    create: { childId, date, status },
    update: { status },
  });
  revalidatePath("/admin/prezenca");
}

// ---------- Invoices & payments ----------

async function nextNumber(prefix: string, model: "invoice" | "payment") {
  const year = new Date().getFullYear();
  const count =
    model === "invoice" ? await db.invoice.count() : await db.payment.count();
  return `${prefix}-${year}-${String(count + 1).padStart(3, "0")}`;
}

export async function createInvoice(formData: FormData) {
  await requireAdmin();
  const parentId = String(formData.get("parentId") ?? "");
  const childId = String(formData.get("childId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const amount = Number(String(formData.get("amount") ?? "0").replace(",", "."));
  const dueAt = String(formData.get("dueAt") ?? "");
  if (!parentId || !title || !(amount > 0)) {
    redirect("/admin/faturat/shto?gabim=1");
  }
  const invoice = await db.invoice.create({
    data: {
      number: await nextNumber("MK", "invoice"),
      parentId,
      childId: childId || null,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      amountCents: Math.round(amount * 100),
      dueAt: dueAt ? new Date(dueAt) : null,
      status: "SENT",
    },
  });
  revalidatePath("/admin/faturat");
  redirect(`/admin/faturat/${invoice.id}`);
}

export async function recordPayment(formData: FormData) {
  await requireAdmin();
  const invoiceId = String(formData.get("invoiceId") ?? "");
  const amount = Number(String(formData.get("amount") ?? "0").replace(",", "."));
  const method = String(formData.get("method") ?? "CASH");
  if (!invoiceId || !(amount > 0)) return;

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!invoice) return;

  await db.payment.create({
    data: {
      invoiceId,
      amountCents: Math.round(amount * 100),
      method,
      note: String(formData.get("note") ?? "").trim() || null,
      receiptNo: await nextNumber("KUP", "payment"),
    },
  });

  const paid =
    invoice.payments.reduce((s, p) => s + p.amountCents, 0) + Math.round(amount * 100);
  if (paid >= invoice.amountCents) {
    await db.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID", paidAt: new Date() },
    });
  }
  revalidatePath("/admin/faturat");
  revalidatePath(`/admin/faturat/${invoiceId}`);
}

export async function setInvoiceStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["SENT", "PAID", "OVERDUE", "CANCELLED"].includes(status)) return;
  await db.invoice.update({
    where: { id },
    data: { status, paidAt: status === "PAID" ? new Date() : null },
  });
  revalidatePath("/admin/faturat");
  revalidatePath(`/admin/faturat/${id}`);
}

// ---------- Enrollment applications ----------

export async function setApplicationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["NEW", "CONTACTED", "ACCEPTED", "DECLINED"].includes(status)) return;
  await db.enrollmentApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/aplikimet");
}

// ---------- Photos & albums ----------

export async function updatePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.photo.update({
    where: { id },
    data: {
      caption: String(formData.get("caption") ?? "").trim() || null,
      albumId: String(formData.get("albumId") ?? "") || null,
      visible: formData.get("visible") === "on",
      featured: formData.get("featured") === "on",
      homepage: formData.get("homepage") === "on",
    },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/");
}

export async function togglePhotoFlag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const flag = String(formData.get("flag") ?? "");
  if (!["visible", "featured", "homepage"].includes(flag)) return;
  const photo = await db.photo.findUnique({ where: { id } });
  if (!photo) return;
  await db.photo.update({
    where: { id },
    data: { [flag]: !photo[flag as "visible" | "featured" | "homepage"] },
  });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/");
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.photo.delete({ where: { id } });
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/");
}

// ---------- Contact messages ----------

export async function markMessageRead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/mesazhet");
}

// ---------- Settings ----------

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  for (const key of Object.keys(SETTING_DEFAULTS)) {
    const value = formData.get(key);
    if (value !== null) {
      await setSetting(key, String(value).trim());
    }
  }
  revalidatePath("/", "layout");
  redirect("/admin/cilesimet?sukses=1");
}
