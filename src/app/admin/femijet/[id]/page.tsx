import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateChild } from "@/app/actions/admin";
import { Field, SubmitButton, StatusBadge } from "@/components/ui";
import { formatShortDate, formatMoney } from "@/lib/format";

export default async function ChildDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sukses?: string }>;
}) {
  const [{ id }, { sukses }] = await Promise.all([params, searchParams]);
  const child = await db.child.findUnique({
    where: { id },
    include: {
      parent: true,
      attendance: { orderBy: { date: "desc" }, take: 10 },
      invoices: { orderBy: { issuedAt: "desc" }, take: 5 },
    },
  });
  if (!child) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/femijet" className="text-sm font-bold text-terracotta hover:underline">
        ← Kthehu te fëmijët
      </Link>
      <div>
        <h1 className="font-display text-3xl font-semibold">
          {child.firstName} {child.lastName}
        </h1>
        <p className="mt-1 text-ink-soft">
          Prindi: {child.parent.name} · {child.parent.phone ?? child.parent.email}
        </p>
      </div>

      {sukses && (
        <p className="rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
          Të dhënat u ruajtën.
        </p>
      )}

      <form action={updateChild} className="space-y-4 rounded-3xl bg-white p-8 shadow-soft">
        <input type="hidden" name="id" value={child.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Emri" name="firstName" required defaultValue={child.firstName} />
          <Field label="Mbiemri" name="lastName" defaultValue={child.lastName} />
        </div>
        <Field
          label="Ditëlindja"
          name="birthday"
          type="date"
          defaultValue={child.birthday ? child.birthday.toISOString().slice(0, 10) : undefined}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Kontakti emergjent" name="emergencyName" defaultValue={child.emergencyName ?? undefined} />
          <Field label="Telefoni" name="emergencyPhone" defaultValue={child.emergencyPhone ?? undefined} />
          <Field label="Lidhja" name="emergencyRelation" defaultValue={child.emergencyRelation ?? undefined} />
        </div>
        <Field label="Shënime" name="notes" type="textarea" defaultValue={child.notes ?? undefined} />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="active" defaultChecked={child.active} className="h-4 w-4" />
          Fëmijë aktiv në qendër
        </label>
        <SubmitButton>Ruaj ndryshimet</SubmitButton>
      </form>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Prezenca e fundit</h2>
        <ul className="mt-3 divide-y divide-ink/5 text-sm">
          {child.attendance.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-2">
              <span>{formatShortDate(a.date)}</span>
              <StatusBadge status={a.status} />
            </li>
          ))}
          {child.attendance.length === 0 && (
            <li className="py-2 text-ink-soft">Ende pa të dhëna.</li>
          )}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Faturat e fundit</h2>
        <ul className="mt-3 divide-y divide-ink/5 text-sm">
          {child.invoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-2 py-2">
              <Link href={`/admin/faturat/${inv.id}`} className="font-semibold hover:text-terracotta">
                {inv.title}
              </Link>
              <span className="flex items-center gap-2">
                {formatMoney(inv.amountCents, inv.currency)}
                <StatusBadge status={inv.status} />
              </span>
            </li>
          ))}
          {child.invoices.length === 0 && <li className="py-2 text-ink-soft">Ende pa fatura.</li>}
        </ul>
      </section>
    </div>
  );
}
