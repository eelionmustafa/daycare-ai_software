import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { Hero } from "@/components/home/Hero";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";

export const dynamic = "force-dynamic";

const pillars = [
  {
    emoji: "🤗",
    title: "Kujdes i ngrohtë",
    text: "Secili fëmijë njihet me emër, me hobi dhe me ditët e mira e të vështira. Këtu askush nuk është 'një nga grupi'.",
  },
  {
    emoji: "📚",
    title: "Detyrat pa stres",
    text: "Çdo mëngjes, para shkollës, fëmijët bëjnë detyrat e shtëpisë dhe përgatiten për teste me ndihmën e mësueseve tona.",
  },
  {
    emoji: "🎨",
    title: "Krijimtari çdo ditë",
    text: "Vizatim, punime dore, eksperimente dhe projekte grupi. Duart e vogla këtu gjithmonë kanë diçka për të krijuar.",
  },
  {
    emoji: "⚽",
    title: "Lojë dhe shoqëri",
    text: "Lojëra në oborr, turne shahu dhe miqësi që zgjasin. Fëmijët mësojnë të bashkëpunojnë duke u argëtuar.",
  },
];

const daySteps = [
  {
    time: "07:00",
    emoji: "🌅",
    title: "Mirëmëngjesi",
    text: "Dyert hapen dhe fëmijët mbërrijnë. Mëngjesi është gati — nisim ditën bashkë, pa nxitim.",
  },
  {
    time: "08:00 – 12:30",
    emoji: "📖",
    title: "Mësim & krijimtari",
    text: "Detyrat e shtëpisë, përgatitja për teste, aktivitete kreative dhe një dalje në park a në natyrë. Në mes, edhe dreka bashkë.",
  },
  {
    time: "13:00",
    emoji: "🎒",
    title: "Drejt shkollës",
    text: "Mësueset tona i shoqërojnë vetë fëmijët në shkollë — të ushqyer, të përgatitur dhe të qetë.",
  },
  {
    time: "Pas shkollës",
    emoji: "🏡",
    title: "Rikthimi te ne",
    text: "Mësueset i marrin nga shkolla. Kush ka nevojë për ndihmë shtesë, vazhdon me kurse — pastaj presin së bashku deri vijnë prindërit.",
  },
  {
    time: "17:30",
    emoji: "👋",
    title: "Mirupafshim",
    text: "Dita mbyllet me përqafime dhe tregime — më së largu në orën 17:30, prindërit vijnë t'i marrin.",
  },
];

export default async function HomePage() {
  const [settings, heroPhotos, featured, testimonials] = await Promise.all([
    getSettings(),
    db.photo.findMany({
      where: { homepage: true, visible: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    db.photo.findMany({
      where: { featured: true, visible: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
      include: { album: true },
    }),
    db.testimonial.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  return (
    <>
      <Hero
        headline={settings.hero_headline}
        subline={settings.hero_subline}
        photos={heroPhotos.map((p) => ({
          id: p.id,
          url: p.url,
          caption: p.caption,
          width: p.width,
          height: p.height,
        }))}
      />

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Pse Mësimi Kreativ"
            title={
              <>
                Një pasdite që fëmijët <span className="underline-hand">e presin me gëzim</span>
              </>
            }
            intro="Nuk jemi thjesht një vend ku fëmijët presin prindërit. Jemi vendi ku dita e tyre bëhet më e plotë."
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-soft transition-shadow hover:shadow-lift">
                <span className="text-3xl" aria-hidden>
                  {p.emoji}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{p.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* A day with us */}
      <section className="texture-paper bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              center
              eyebrow="Si duket dita"
              title="Nga ora 7 e mëngjesit deri te përqafimi i mbrëmjes"
              intro="Një ritëm i qetë dhe i njohur, që u jep fëmijëve siguri dhe prindërve qetësi."
            />
          </Reveal>

          <div className="relative mx-auto mt-16 max-w-3xl">
            {/* the timeline spine */}
            <div
              aria-hidden
              className="absolute left-6 top-2 bottom-2 w-0.5 bg-sage/25 sm:left-1/2 sm:-translate-x-1/2"
            />
            <div className="space-y-10">
              {daySteps.map((s, i) => {
                const flip = i % 2 === 1;
                return (
                  <Reveal key={s.time} delay={i * 0.08}>
                    <div
                      className={`relative flex items-start gap-5 sm:gap-8 ${
                        flip ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      {/* icon marker on the spine */}
                      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-soft ring-4 ring-paper">
                        {s.emoji}
                      </span>
                      <div
                        className={`flex-1 rounded-3xl bg-white p-6 shadow-soft sm:max-w-sm ${
                          flip ? "sm:text-right" : ""
                        }`}
                      >
                        <span className="inline-block rounded-full bg-sage/15 px-3 py-1 font-display text-xs font-bold text-sage-deep">
                          {s.time}
                        </span>
                        <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                          {s.text}
                        </p>
                      </div>
                      <div className="hidden flex-1 sm:block" />
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal className="mt-14 text-center">
            <Link
              href="/rreth-nesh"
              className="inline-flex items-center gap-2 font-bold text-terracotta transition-colors hover:text-terracotta-deep"
            >
              Lexoni historinë tonë të plotë
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured photos */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Kujtimet tona"
            title={
              <>
                Fotot flasin <span className="underline-hand">më shumë se fjalët</span>
              </>
            }
            intro="Momente të vërteta nga ditët tona — të njëjtat që i ndajmë me prindërit në faqen tonë të Facebook-ut."
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <RevealItem key={p.id}>
              <Link href="/galeria" className="group block">
                <figure className="polaroid" style={{ rotate: `${(i % 3) - 1}deg` }}>
                  <div className="overflow-hidden rounded-sm">
                    <Image
                      src={p.url}
                      alt={p.caption ?? "Moment nga Mësimi Kreativ"}
                      width={p.width ?? 800}
                      height={p.height ?? 600}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 px-1 pt-2.5 pb-1">
                    <span className="font-display text-sm text-ink-soft">{p.caption}</span>
                    {p.album && (
                      <span className="shrink-0 rounded-full bg-blush px-2.5 py-0.5 text-xs font-bold text-terracotta-deep">
                        {p.album.name}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal className="mt-10 text-center">
          <Link
            href="/galeria"
            className="inline-block rounded-full border-2 border-terracotta px-7 py-3 font-bold text-terracotta transition-all hover:-translate-y-0.5 hover:bg-terracotta hover:text-white"
          >
            Shikoni galerinë e plotë
          </Link>
        </Reveal>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="texture-paper bg-sage/10 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <SectionHeading
                center
                eyebrow="Fjalët e prindërve"
                title="Besimi që na e japin çdo ditë"
              />
            </Reveal>
            <RevealStagger className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <RevealItem key={t.id}>
                  <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-soft">
                    <svg width="28" height="22" viewBox="0 0 28 22" className="text-sun" fill="currentColor" aria-hidden>
                      <path d="M0 22V11.6C0 4.9 4.2.8 11 0l1.4 3.4c-3.9 1-6 3.2-6.3 6.6H12V22H0Zm16 0V11.6C16 4.9 20.2.8 27 0l1 3.4c-3.9 1-6 3.2-6.3 6.6H28V22H16Z" />
                    </svg>
                    <blockquote className="mt-4 flex-1 leading-relaxed text-ink">
                      {t.text}
                    </blockquote>
                    <figcaption className="mt-5 text-sm font-bold text-sage-deep">
                      — {t.parentName}
                    </figcaption>
                  </figure>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="texture-paper relative overflow-hidden rounded-[2.5rem] bg-terracotta px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sun/25 blur-2xl" />
            <div aria-hidden className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">
              Ejani të njihemi!
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
              Regjistroni fëmijën tuaj online për pak minuta, ose ejani për një vizitë —
              e shihni vetë ambientin, njiheni me stafin dhe pyesni gjithçka.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/regjistrohu"
                className="rounded-full bg-white px-7 py-3.5 font-bold text-terracotta-deep shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Regjistro fëmijën
              </Link>
              <Link
                href="/kontakti"
                className="rounded-full border-2 border-white/60 px-7 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Caktoni një vizitë
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
