import Link from "next/link";
import { db } from "@/lib/db";
import { ageFromBirthday } from "@/lib/format";

export default async function AdminChildrenPage({
  searchParams,
}: {
  searchParams: Promise<{ sukses?: string }>;
}) {
  const { sukses } = await searchParams;
  const children = await db.child.findMany({
    orderBy: [{ active: "desc" }, { firstName: "asc" }],
    include: { parent: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Fëmijët</h1>
          <p className="mt-1 text-ink-soft">{children.length} fëmijë të regjistruar.</p>
        </div>
        <Link
          href="/admin/femijet/shto"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-terracotta-deep"
        >
          + Familje e re
        </Link>
      </div>

      {sukses && (
        <p className="rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
          Familja u regjistrua me sukses.
        </p>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4">Fëmija</th>
              <th className="hidden px-4 py-4 sm:table-cell">Mosha</th>
              <th className="hidden px-4 py-4 md:table-cell">Prindi</th>
              <th className="hidden px-4 py-4 md:table-cell">Kontakti</th>
              <th className="px-6 py-4">Statusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {children.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-cream/70">
                <td className="px-6 py-4">
                  <Link href={`/admin/femijet/${c.id}`} className="font-semibold hover:text-terracotta">
                    {c.firstName} {c.lastName}
                  </Link>
                </td>
                <td className="hidden px-4 py-4 text-ink-soft sm:table-cell">
                  {c.birthday ? `${ageFromBirthday(c.birthday)} vjeç` : "—"}
                </td>
                <td className="hidden px-4 py-4 text-ink-soft md:table-cell">{c.parent.name}</td>
                <td className="hidden px-4 py-4 text-ink-soft md:table-cell">
                  {c.parent.phone ?? c.parent.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      c.active ? "bg-sage/15 text-sage-deep" : "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {c.active ? "Aktiv" : "Joaktiv"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
