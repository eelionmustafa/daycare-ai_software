"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !ok) {
    redirect("/hyrje?gabim=1");
  }

  await createSession({
    userId: user.id,
    role: user.role as "ADMIN" | "PARENT",
    name: user.name,
  });
  redirect(user.role === "ADMIN" ? "/admin" : "/portali");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
