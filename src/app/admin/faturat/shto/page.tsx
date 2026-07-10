import Link from "next/link";
import { db } from "@/lib/db";
import { createInvoice } from "@/app/actions/admin";
import { Field, SubmitButton } from "@/components/ui";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  const { gabim } = await searchParams;
  const parents = await db.user.findMany({
    where: { role: "PARENT" },
    orderBy: { name: "asc" },
    include: { children: { where: { active: true } } },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/admin/faturat" className="text-sm font-bold text-terracotta hover:underline">
        ← Kthehu te faturat
      </Link>
      <h1 className="font-display text-3xl font-semibold">Faturë e re</h1>

      {gabim && (
        <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
          Plotësoni prindin, titullin dhe shumën.
        </p>
      )}

      <form action={createInvoice} className="space-y-4 rounded-3xl bg-white p-8 shadow-soft">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">
            Prindi <span className="text-terracotta">*</span>
          </span>
          <select
            name="parentId"
            required
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-soft"
          >
            <option value="">— Zgjidh prindin —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.children.map((c) => c.firstName).join(", ") || "pa fëmijë"})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Fëmija (opsionale)</span>
          <select
            name="childId"
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-soft"
          >
            <option value="">— Për gjithë familjen —</option>
            {parents.flatMap((p) =>
              p.children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({p.name})
                </option>
              ))
            )}
          </select>
        </label>
        <Field label="Titulli" name="title" required placeholder="p.sh. Muaji korrik — Era" />
        <Field label="Përshkrimi" name="description" placeholder="Qëndrimi ditor dhe aktivitetet" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Shuma (EUR)" name="amount" type="number" required placeholder="80.00" />
          <Field label="Afati i pagesës" name="dueAt" type="date" />
        </div>
        <SubmitButton>Krijo faturën</SubmitButton>
      </form>
    </div>
  );
}
