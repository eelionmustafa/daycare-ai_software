"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";

const enrollmentSchema = z.object({
  parentName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  childName: z.string().trim().min(2).max(120),
  childAge: z.coerce.number().int().min(3).max(15).optional(),
  childBirthday: z.string().trim().max(40).optional(),
  emergencyName: z.string().trim().max(120).optional(),
  emergencyPhone: z.string().trim().max(40).optional(),
  previousCare: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function submitEnrollment(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = enrollmentSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/regjistrohu?gabim=1");
  }
  const d = parsed.data;
  await db.enrollmentApplication.create({
    data: {
      parentName: d.parentName,
      phone: d.phone,
      email: d.email || null,
      childName: d.childName,
      childAge: d.childAge ?? null,
      childBirthday: d.childBirthday || null,
      emergencyName: d.emergencyName || null,
      emergencyPhone: d.emergencyPhone || null,
      previousCare: d.previousCare || null,
      notes: d.notes || null,
    },
  });
  redirect("/regjistrohu?sukses=1");
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(3000),
});

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect("/kontakti?gabim=1");
  }
  const d = parsed.data;
  await db.contactMessage.create({
    data: {
      name: d.name,
      phone: d.phone || null,
      email: d.email || null,
      message: d.message,
    },
  });
  redirect("/kontakti?sukses=1");
}
