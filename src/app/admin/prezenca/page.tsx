import { db } from "@/lib/db";
import { setAttendance } from "@/app/actions/admin";
import { dateOnly, formatDate, formatWeekday } from "@/lib/format";

const statusOptions = [
  { value: "PRESENT", label: "Prezent", cls: "bg-sage text-white", off: "bg-sage/10 text-sage-deep hover:bg-sage/20" },
  { value: "ABSENT", label: "Mungon", cls: "bg-terracotta text-white", off: "bg-terracotta/10 text-terracotta-deep hover:bg-terracotta/20" },
  { value: "EXCUSED", label: "Arsyetuar", cls: "bg-sky text-white", off: "bg-sky/10 text-sky hover:bg-sky/20" },
];

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data } = await searchParams;
  const day = dateOnly(data && !isNaN(Date.parse(data)) ? data : new Date());
  const dayStr = day.toISOString().slice(0, 10);

  const [children, records] = await Promise.all([
    db.child.findMany({
      where: { active: true },
      orderBy: { firstName: "asc" },
    }),
    db.attendanceRecord.findMany({ where: { date: day } }),
  ]);
  const byChild = new Map(records.map((r) => [r.childId, r.status]));
  const marked = records.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Prezenca</h1>
          <p className="mt-1 text-ink-soft">
            {formatWeekday(day)}, {formatDate(day)} · {marked}/{children.length} të shënuar
          </p>
        </div>
        <form className="flex items-center gap-2">
          <label className="text-sm font-bold" htmlFor="data">Data:</label>
          <input
            id="data"
            type="date"
            name="data"
            defaultValue={dayStr}
            className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm shadow-soft"
          />
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
            Shko
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <ul className="divide-y divide-ink/5">
          {children.map((c) => {
            const current = byChild.get(c.id);
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <p className="font-semibold">
                  {c.firstName} {c.lastName}
                  {!current && (
                    <span className="ml-2 text-xs font-normal text-ink-soft">— pa shënuar</span>
                  )}
                </p>
                <div className="flex gap-2">
                  {statusOptions.map((opt) => (
                    <form key={opt.value} action={setAttendance}>
                      <input type="hidden" name="childId" value={c.id} />
                      <input type="hidden" name="date" value={dayStr} />
                      <input type="hidden" name="status" value={opt.value} />
                      <button
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                          current === opt.value ? opt.cls : opt.off
                        }`}
                      >
                        {opt.label}
                      </button>
                    </form>
                  ))}
                </div>
              </li>
            );
          })}
          {children.length === 0 && (
            <li className="px-6 py-8 text-center text-ink-soft">Nuk ka fëmijë aktivë.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
