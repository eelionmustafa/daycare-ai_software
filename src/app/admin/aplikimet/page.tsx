import { db } from "@/lib/db";
import { setApplicationStatus } from "@/app/actions/admin";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/format";

export default async function ApplicationsPage() {
  const apps = await db.enrollmentApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Aplikimet për regjistrim</h1>
        <p className="mt-1 text-ink-soft">
          Aplikimet e reja nga formulari online. Pas kontaktit, përditësoni statusin.
        </p>
      </div>

      <div className="space-y-4">
        {apps.map((a) => (
          <article key={a.id} className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {a.childName}
                  {a.childAge ? `, ${a.childAge} vjeç` : ""}
                </h2>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Aplikuar më {formatDate(a.createdAt)}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="font-bold text-ink-soft">Prindi</dt>
                <dd className="mt-0.5">{a.parentName}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink-soft">Kontakti</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="font-semibold text-terracotta">
                    {a.phone}
                  </a>
                  {a.email ? ` · ${a.email}` : ""}
                </dd>
              </div>
              {a.childBirthday && (
                <div>
                  <dt className="font-bold text-ink-soft">Ditëlindja</dt>
                  <dd className="mt-0.5">{a.childBirthday}</dd>
                </div>
              )}
              {(a.emergencyName || a.emergencyPhone) && (
                <div>
                  <dt className="font-bold text-ink-soft">Kontakti emergjent</dt>
                  <dd className="mt-0.5">
                    {a.emergencyName} {a.emergencyPhone ? `· ${a.emergencyPhone}` : ""}
                  </dd>
                </div>
              )}
              {a.previousCare && (
                <div>
                  <dt className="font-bold text-ink-soft">Përvoja e mëparshme</dt>
                  <dd className="mt-0.5">{a.previousCare}</dd>
                </div>
              )}
            </dl>
            {a.notes && (
              <p className="mt-4 rounded-xl bg-blush/60 px-4 py-3 text-sm leading-relaxed">
                <strong>Shënime:</strong> {a.notes}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["CONTACTED", "Shëno: Kontaktuar"],
                ["ACCEPTED", "Shëno: Pranuar"],
                ["DECLINED", "Shëno: Refuzuar"],
                ["NEW", "Kthe si: E re"],
              ]
                .filter(([s]) => s !== a.status)
                .map(([s, label]) => (
                  <form key={s} action={setApplicationStatus}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value={s} />
                    <button className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
                      {label}
                    </button>
                  </form>
                ))}
            </div>
          </article>
        ))}
        {apps.length === 0 && (
          <p className="rounded-3xl bg-white p-8 text-center text-ink-soft shadow-soft">
            Ende pa aplikime. Aplikimet nga formulari online shfaqen këtu.
          </p>
        )}
      </div>
    </div>
  );
}
