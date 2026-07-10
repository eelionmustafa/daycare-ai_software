import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aktivitetet — Çfarë përjetojnë fëmijët",
  description:
    "Aktivitetet kreative, mësimore, shoqërore dhe argëtuese që fëmijët përjetojnë çdo ditë në Mësimi Kreativ.",
};

const groups = [
  {
    emoji: "🎨",
    color: "bg-terracotta/10 text-terracotta-deep",
    title: "Aktivitete kreative",
    intro: "Duart e vogla këtu gjithmonë kanë diçka për të krijuar.",
    items: [
      "Vizatim dhe pikturë me teknika të ndryshme",
      "Punime dore me letër, karton dhe materiale natyrore",
      "Projekte kreative sezonale — nga maskat e karnavaleve te zbukurimet e festave",
    ],
    albumSlug: "projekte-kreative",
  },
  {
    emoji: "📚",
    color: "bg-sky/10 text-sky",
    title: "Përvoja mësimore",
    intro: "Mësimi këtu nuk duket si detyrim — duket si zbulim.",
    items: [
      "Detyrat e shtëpisë çdo mëngjes, para se të shkojnë në shkollë",
      "Përgatitje për teste në lëndë të ndryshme",
      "Orë shtesë si kurse, për ata që kanë nevojë për ndihmë shtesë",
    ],
    albumSlug: "momente-klase",
  },
  {
    emoji: "🤝",
    color: "bg-sage/15 text-sage-deep",
    title: "Zhvillimi shoqëror",
    intro: "Aftësitë që nuk mësohen nga librat, por nga njëri-tjetri.",
    items: [
      "Punë në grup dhe projekte të përbashkëta",
      "Komunikim: të dëgjosh, të tregosh, të kërkosh ndihmë",
      "Vetëbesim — të dalësh para grupit dhe të ndihesh krenar",
    ],
    albumSlug: "aktivitete",
  },
  {
    emoji: "⚽",
    color: "bg-sun/20 text-[#96700f]",
    title: "Lojë dhe argëtim",
    intro: "Sepse fëmijëria është edhe për të qeshur me zë të lartë.",
    items: [
      "Dalje në park dhe në natyrë çdo javë",
      "Lojëra grupi, shah dhe lojëra tavoline",
      "Festimi i festave zyrtare bashkë, si familje e madhe",
    ],
    albumSlug: "aktivitete-jashte",
  },
];

export default async function ActivitiesPage() {
  const photos = await db.photo.findMany({
    where: { visible: true, album: { isNot: null } },
    include: { album: true },
    orderBy: { sortOrder: "asc" },
  });
  const byAlbum = (slug: string) =>
    photos.filter((p) => p.album?.slug === slug).slice(0, 2);

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Aktivitetet tona
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Çfarë <span className="underline-hand">përjetojnë fëmijët</span> te ne
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Nuk i ndajmë fëmijët sipas klasave — i bashkojmë sipas kureshtjes. Çdo ditë
              ka nga pak prej gjithçkaje: mësim, krijim, lojë dhe shoqëri.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 pt-16 sm:px-6">
        {groups.map((g, gi) => {
          const gp = byAlbum(g.albumSlug);
          const flip = gi % 2 === 1;
          return (
            <section key={g.title} className="grid items-center gap-10 lg:grid-cols-2">
              <Reveal className={flip ? "lg:order-2" : ""}>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${g.color}`}
                >
                  <span aria-hidden>{g.emoji}</span> {g.title}
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                  {g.intro}
                </h2>
                <ul className="mt-6 space-y-3">
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-soft">
                      <span className="mt-1 text-sage" aria-hidden>
                        ✔
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <RevealStagger
                className={`grid grid-cols-2 gap-4 ${flip ? "lg:order-1" : ""}`}
              >
                {gp.map((p, i) => (
                  <RevealItem key={p.id}>
                    <figure
                      className={`polaroid ${i % 2 === 1 ? "mt-8" : ""}`}
                      style={{ rotate: `${(i + gi) % 2 === 0 ? -1.5 : 2}deg` }}
                    >
                      <Image
                        src={p.url}
                        alt={p.caption ?? g.title}
                        width={p.width ?? 800}
                        height={p.height ?? 600}
                        className="h-48 w-full rounded-sm object-cover sm:h-56"
                      />
                      {p.caption && (
                        <figcaption className="px-1 pt-2 font-display text-xs text-ink-soft">
                          {p.caption}
                        </figcaption>
                      )}
                    </figure>
                  </RevealItem>
                ))}
              </RevealStagger>
            </section>
          );
        })}
      </div>

      <Reveal className="mx-auto mt-20 max-w-3xl px-4 text-center sm:px-6">
        <p className="font-display text-2xl font-semibold">
          Mënyra më e mirë për t&apos;i parë aktivitetet? Fotot tona.
        </p>
        <Link
          href="/galeria"
          className="mt-5 inline-block rounded-full bg-terracotta px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
        >
          Hap galerinë
        </Link>
      </Reveal>
    </div>
  );
}
