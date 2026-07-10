import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const COOKIE_NAME = "mk_session";
const SESSION_DAYS = 14;

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-mesimi-kreativ-change-me"
  );
}

export type SessionPayload = {
  userId: string;
  role: "ADMIN" | "PARENT";
  name: string;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      userId: payload.userId as string,
      role: payload.role as "ADMIN" | "PARENT",
      name: payload.name as string,
    };
  } catch {
    return null;
  }
});

/** Session + fresh user row; redirects to login when absent or stale. */
export async function requireUser(role?: "ADMIN" | "PARENT") {
  const session = await getSession();
  if (!session) redirect("/hyrje");
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/hyrje");
  if (role && user.role !== role) {
    redirect(user.role === "ADMIN" ? "/admin" : "/portali");
  }
  return user;
}
