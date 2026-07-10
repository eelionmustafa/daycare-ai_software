import Link from "next/link";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function AdminInvoicesPage() {
  const invoices = await db.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: { parent: true, child: true, payments: true },
  });

  const open = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");
  const openTotal = open.reduce((s, i) => s + i.amountCents, 0);
  const paidThisMonth = invoices
    .filter(
      (i) =>
        i.paidAt &&
        i.paidAt.getMonth() === new Date().getMonth() &&
        i.paidAt.getFullYear() === new Date().getFullYear()
    )
    .reduce((s, i) => s + i.amountCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Faturat</h1>
          <p className="mt-1 text-ink-soft">
            Pa paguar: <strong>{formatMoney(openTotal)}</strong> · Paguar këtë muaj:{" "}
            <strong>{formatMoney(paidThisMonth)}</strong>
          </p>
        </div>
        <Link
          href="/admin/faturat/shto"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-terracotta-deep"
        >
          + Faturë e re
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4">Fatura</th>
              <th className="hidden px-4 py-4 md:table-cell">Prindi</th>
              <th className="hidden px-4 py-4 sm:table-cell">Afati</th>
              <th className="px-4 py-4">Shuma</th>
              <th className="px-6 py-4">Statusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition-colors hover:bg-cream/70">
                <td className="px-6 py-4">
                  <Link href={`/admin/faturat/${inv.id}`} className="font-semibold hover:text-terracotta">
                    {inv.title}
                    <span className="block text-xs font-normal text-ink-soft">
                      {inv.number}
                      {inv.child ? ` · ${inv.child.firstName}` : ""}
                    </span>
                  </Link>
                </td>
                <td className="hidden px-4 py-4 text-ink-soft md:table-cell">{inv.parent.name}</td>
                <td className="hidden px-4 py-4 text-ink-soft sm:table-cell">
                  {formatShortDate(inv.dueAt)}
                </td>
                <td className="px-4 py-4 font-display font-semibold">
                  {formatMoney(inv.amountCents, inv.currency)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-soft">
                  Ende pa fatura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
