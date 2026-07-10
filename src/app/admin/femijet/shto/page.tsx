import Link from "next/link";
import { createFamily } from "@/app/actions/admin";
import { Field, SubmitButton } from "@/components/ui";

export default async function NewFamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  const { gabim } = await searchParams;
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/admin/femijet" className="text-sm font-bold text-terracotta hover:underline">
        ← Kthehu te fëmijët
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold">Familje e re</h1>
        <p className="mt-1 text-ink-soft">
          Krijon llogarinë e prindit dhe profilin e fëmijës së parë. Fëmijë të tjerë mund
          të shtohen më vonë.
        </p>
      </div>

      {gabim === "email" && (
        <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
          Ky email është tashmë i regjistruar.
        </p>
      )}
      {gabim === "1" && (
        <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
          Plotësoni fushat e detyrueshme (fjalëkalimi min. 6 karaktere).
        </p>
      )}

      <form action={createFamily} className="space-y-6 rounded-3xl bg-white p-8 shadow-soft">
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Prindi</legend>
          <Field label="Emri dhe mbiemri" name="parentName" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email (për hyrje në portal)" name="email" type="email" required />
            <Field label="Telefoni" name="phone" type="tel" />
          </div>
          <Field
            label="Fjalëkalimi fillestar"
            name="password"
            type="text"
            required
            hint="Jepjani prindit — mund ta ndryshojë më vonë."
          />
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Fëmija</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emri" name="childFirst" required />
            <Field label="Mbiemri" name="childLast" />
          </div>
          <Field label="Ditëlindja" name="birthday" type="date" />
          <Field label="Shënime (alergji, interesa...)" name="notes" type="textarea" />
        </fieldset>
        <SubmitButton>Regjistro familjen</SubmitButton>
      </form>
    </div>
  );
}
