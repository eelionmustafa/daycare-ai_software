import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Field, SubmitButton } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hyrja për prindër",
  description: "Portali i sigurt i prindërve të Mësimit Kreativ.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  const { gabim } = await searchParams;
  return (
    <div className="texture-paper flex min-h-screen items-center justify-center bg-blush/40 px-4 pt-24 pb-16">
      <Reveal className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-lift sm:p-10">
          <h1 className="font-display text-3xl font-semibold">Mirë se erdhët!</h1>
          <p className="mt-2 text-ink-soft">
            Hyni në portalin e prindërve për të parë prezencën, faturat dhe të dhënat e
            fëmijës suaj.
          </p>
          {gabim && (
            <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
              Email-i ose fjalëkalimi nuk është i saktë. Provoni përsëri.
            </p>
          )}
          <form action={login} className="mt-6 space-y-4">
            <Field label="Email" name="email" type="email" required placeholder="ju@email.com" />
            <Field label="Fjalëkalimi" name="password" type="password" required />
            <SubmitButton>Hyr në portal</SubmitButton>
          </form>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Nuk keni qasje ende?{" "}
            <Link href="/kontakti" className="font-bold text-terracotta hover:underline">
              Na kontaktoni
            </Link>{" "}
            dhe ju hapim llogarinë.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
