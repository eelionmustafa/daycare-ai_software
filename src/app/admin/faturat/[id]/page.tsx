import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { recordPayment, setInvoiceStatus } from "@/app/actions/admin";
import { Field, StatusBadge } from "@/components/ui";
import { formatMoney, formatDate, formatShortDate } from "@/lib/format";

export default async function AdminInvoiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { parent: true, child: true, payments: { orderBy: { paidAt: "desc" } } },
  });
  if (!invoice) notFound();

  const paid = invoice.payments.reduce((s, p) => s + p.amountCents, 0);
  const remaining = Math.max(0, invoice.amountCents - paid);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/faturat" className="text-sm font-bold text-terracotta hover:underline">
        ← Kthehu te faturat
      </Link>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              {invoice.number}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">{invoice.title}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {invoice.parent.name}
              {invoice.child ? ` · për ${invoice.child.firstName}` : ""}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <dl className="mt-6 grid gap-4 rounded-2xl bg-cream p-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="font-bold text-ink-soft">Shuma</dt>
            <dd className="mt-0.5 font-display font-semibold">
              {formatMoney(invoice.amountCents, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-ink-soft">Paguar</dt>
            <dd className="mt-0.5 font-display font-semibold text-sage-deep">
              {formatMoney(paid, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-ink-soft">Mbetja</dt>
            <dd className="mt-0.5 font-display font-semibold text-terracotta-deep">
              {formatMoney(remaining, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-ink-soft">Afati</dt>
            <dd className="mt-0.5 font-semibold">{formatShortDate(invoice.dueAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {["SENT", "PAID", "OVERDUE", "CANCELLED"]
            .filter((s) => s !== invoice.status)
            .map((s) => (
              <form key={s} action={setInvoiceStatus}>
                <input type="hidden" name="id" value={invoice.id} />
                <input type="hidden" name="status" value={s} />
                <button className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                  Shëno si: {s === "SENT" ? "E papaguar" : s === "PAID" ? "E paguar" : s === "OVERDUE" ? "E vonuar" : "E anuluar"}
                </button>
              </form>
            ))}
        </div>
      </div>

      {remaining > 0 && invoice.status !== "CANCELLED" && (
        <form action={recordPayment} className="space-y-4 rounded-3xl bg-white p-8 shadow-soft">
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <h2 className="font-display text-xl font-semibold">Regjistro pagesë</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Shuma (EUR)"
              name="amount"
              type="number"
              required
              defaultValue={(remaining / 100).toFixed(2)}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Mënyra</span>
              <select
                name="method"
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-soft"
              >
                <option value="CASH">Para në dorë</option>
                <option value="BANK">Transfertë bankare</option>
                <option value="CARD">Kartelë</option>
                <option value="OTHER">Tjetër</option>
              </select>
            </label>
          </div>
          <Field label="Shënim" name="note" placeholder="opsionale" />
          <button className="rounded-full bg-sage px-6 py-3 font-bold text-white transition-colors hover:bg-sage-deep">
            Regjistro pagesën
          </button>
        </form>
      )}

      {invoice.payments.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Pagesat</h2>
          <ul className="mt-3 divide-y divide-ink/5 text-sm">
            {invoice.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">
                    {formatMoney(p.amountCents, invoice.currency)}
                    <span className="ml-2 text-xs font-normal text-ink-soft">
                      {p.receiptNo}
                    </span>
                  </p>
                  <p className="text-xs text-ink-soft">
                    {formatDate(p.paidAt)}
                    {p.note ? ` · ${p.note}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-bold text-sage-deep">
                  {p.method === "CASH" ? "Në dorë" : p.method === "BANK" ? "Bankë" : p.method === "CARD" ? "Kartelë" : "Tjetër"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
