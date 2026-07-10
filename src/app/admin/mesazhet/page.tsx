import { db } from "@/lib/db";
import { markMessageRead } from "@/app/actions/admin";
import { formatDate } from "@/lib/format";

export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Mesazhet e kontaktit</h1>
        <p className="mt-1 text-ink-soft">Mesazhet e dërguara nga faqja e kontaktit.</p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`rounded-3xl p-6 shadow-soft ${m.read ? "bg-white" : "bg-sun/10 ring-1 ring-sun/40"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-semibold">
                  {m.name}
                  {!m.read && (
                    <span className="ml-2 rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold text-ink">
                      E re
                    </span>
                  )}
                </p>
                <p className="text-sm text-ink-soft">
                  {formatDate(m.createdAt)}
                  {m.phone ? ` · ${m.phone}` : ""}
                  {m.email ? ` · ${m.email}` : ""}
                </p>
              </div>
              {!m.read && (
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-bold text-ink-soft hover:border-ink hover:text-ink">
                    Shëno si të lexuar
                  </button>
                </form>
              )}
            </div>
            <p className="mt-3 leading-relaxed">{m.message}</p>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="rounded-3xl bg-white p-8 text-center text-ink-soft shadow-soft">
            Ende pa mesazhe.
          </p>
        )}
      </div>
    </div>
  );
}
