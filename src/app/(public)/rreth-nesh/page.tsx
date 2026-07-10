import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rreth nesh — Historia jonë",
  description:
    "Si lindi Mësimi Kreativ, çfarë besojmë për fëmijët dhe si duket një ditë brenda qendrës sonë.",
};

function ChapterMark({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta font-display text-lg font-semibold text-white shadow-soft">
        {n}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage-deep">
          Kapitulli {n}
        </p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

const beginnings = [
  {
    year: "Fillimi",
    title: "Një pyetje e thjeshtë",
    text: "Gjithçka nisi nga një pyetje që e bëjnë shumë prindër: 'Ku ta lë fëmijën pas shkolle, diku ku vërtet kujdesen për të?' Nuk gjetëm përgjigjen që donim — kështu që e ndërtuam vetë.",
  },
  {
    year: "Rritja",
    title: "Nga një grup i vogël, në një familje të madhe",
    text: "Fjalët e mira të prindërve na sollën familje të reja. U rritëm bashkë me fëmijët: më shumë aktivitete, më shumë punëtori, më shumë kujtime.",
  },
  {
    year: "Sot",
    title: "Shtëpia e dytë e shumë fëmijëve",
    text: "Sot Mësimi Kreativ është vendi ku fëmijët 6–11 vjeç kalojnë pasditet mes detyrave, krijimtarisë dhe miqësisë. Dhe historia jonë sapo ka filluar.",
  },
];

const philosophy = [
  {
    emoji: "🛡️",
    title: "Siguria para së gjithash",
    text: "Prindërit duhet ta dinë gjithmonë se fëmija i tyre është në duar të sigurta. Prezenca mbahet çdo ditë dhe çdo detaj i rëndësishëm ndahet me familjen.",
  },
  {
    emoji: "🎨",
    title: "Krijimtaria si gjuhë",
    text: "Fëmijët shprehen përmes duarve: vizatojnë, ndërtojnë, ngjyrosin. Ne u japim materialet, hapësirën dhe lirinë — pjesën tjetër e bëjnë vetë.",
  },
  {
    emoji: "🌱",
    title: "Vetëbesimi rritet ngadalë",
    text: "Një detyrë e zgjidhur vetë, një vizatim i lavdëruar, një lojë e fituar në grup. Vetëbesimi ndërtohet me momente të vogla, çdo ditë.",
  },
  {
    emoji: "🤝",
    title: "Shoqëria është mësim",
    text: "Të presësh radhën, të ndihmosh shokun, të kërkosh falje. Këto nuk shkruhen në fletore, por mësohen vetëm bashkë me të tjerët.",
  },
  {
    emoji: "✨",
    title: "Mësimi përmes përvojës",
    text: "Një eksperiment me ngjyra vlen sa dhjetë faqe teori. Fëmijët mësojnë duke bërë, duke provuar dhe nganjëherë duke gabuar.",
  },
  {
    emoji: "🎯",
    title: "Ndihmë shtesë kur nevojitet",
    text: "Për fëmijët që kanë nevojë për më shumë kohë me një lëndë, ofrojmë orë shtesë si kurse — pas orarit shkollor, derisa vijnë prindërit.",
  },
];

const dayMoments = [
  { title: "Ardhja", text: "Dyert hapen dhe qendra mbushet me zëra. Fëmijët presin njëri-tjetrin me buzëqeshje, gati për një ditë të re." },
  { title: "Mëngjesi", text: "Fëmijët hanë mëngjes bashkë, në qetësi, para se të nisë dita e mësimit." },
  { title: "Ora e detyrave", text: "Detyrat e shtëpisë dhe përgatitja për teste në lëndë të ndryshme, me ndihmën e mësueseve — secili me ritmin e vet." },
  { title: "Aktivitete & park", text: "Aktivitete kreative, dalje në park e natyrë, ose festimi i festave zyrtare kur bie rasti." },
  { title: "Dreka", text: "Një drekë e ngrohtë bashkë, para se fëmijët të nisen për në shkollë." },
  { title: "Shkolla", text: "Mësueset tona i dërgojnë vetë fëmijët në shkollë, të përgatitur dhe të qetë." },
  { title: "Rikthimi", text: "Mësueset i marrin fëmijët nga shkolla dhe kthehen te qendra. Kush ka nevojë për ndihmë shtesë, vazhdon me orë shtesë të organizuara nga ne." },
  { title: "Përcjellja", text: "Fëmijët presin në qetësi, me lojëra e miq, derisa vijnë prindërit t'i marrin." },
];

export default async function AboutPage() {
  const photos = await db.photo.findMany({
    where: { visible: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: 12,
  });
  const dayPhotos = photos.slice(0, 4);
  const communityPhotos = photos.slice(4, 10);

  return (
    <div className="pt-24">
      {/* Intro */}
      <section className="texture-paper bg-blush/50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Historia jonë
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Çdo qendër ka një adresë.{" "}
              <span className="underline-hand">Kjo ka një histori.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Mësimi Kreativ nuk lindi si biznes — lindi si përgjigje ndaj një nevoje që e
              ndjenim edhe vetë si prindër. Kjo është historia jonë, e treguar ashtu siç
              ndodhi.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Chapter 1 — timeline */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <Reveal>
          <ChapterMark n={1} title="Fillimi ynë" />
        </Reveal>
        <div className="relative ml-6 border-l-2 border-dashed border-sage/50 pl-8 sm:ml-10 sm:pl-12">
          {beginnings.map((b, i) => (
            <Reveal key={b.year} delay={i * 0.08} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[2.95rem] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-sun text-xs shadow-soft sm:-left-[3.95rem]" aria-hidden>
                ●
              </span>
              <p className="text-sm font-bold uppercase tracking-wider text-terracotta">
                {b.year}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Chapter 2 — philosophy */}
      <section className="texture-paper bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <ChapterMark n={2} title="Filozofia jonë" />
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
              Pesë bindje të thjeshta që i ndjekim çdo ditë — jo sepse janë të shkruara
              diku, por sepse i besojmë vërtet.
            </p>
          </Reveal>
          <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {philosophy.map((p) => (
              <RevealItem key={p.title}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-soft">
                  <span className="text-3xl" aria-hidden>{p.emoji}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Chapter 3 — a day inside */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <ChapterMark n={3} title="Një ditë brenda Mësimit Kreativ" />
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-8">
            {dayMoments.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.06}>
                <div className="flex gap-5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 font-display text-sm font-semibold text-sage-deep">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                    <p className="mt-1 leading-relaxed text-ink-soft">{m.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <RevealStagger className="grid grid-cols-2 content-start gap-4">
            {dayPhotos.map((p, i) => (
              <RevealItem key={p.id}>
                <figure className={`polaroid ${i % 2 === 1 ? "mt-6" : ""}`} style={{ rotate: `${((i * 2) % 5) - 2}deg` }}>
                  <Image
                    src={p.url}
                    alt={p.caption ?? "Moment nga dita jonë"}
                    width={p.width ?? 800}
                    height={p.height ?? 600}
                    className="h-44 w-full rounded-sm object-cover"
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
        </div>
      </section>

      {/* Chapter 4 — community */}
      <section className="texture-paper bg-sage/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <ChapterMark n={4} title="Komuniteti ynë" />
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
              Mësimi Kreativ janë fëmijët, prindërit dhe stafi — bashkë. Festat që i
              organizojmë, eventet ku mblidhemi dhe kujtimet që i ndajmë në{" "}
              <a
                href="https://www.facebook.com/mesimikreativ/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky hover:underline"
              >
                faqen tonë të Facebook-ut
              </a>{" "}
              janë dëshmia më e bukur e kësaj rritjeje.
            </p>
          </Reveal>
          <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {communityPhotos.map((p, i) => (
              <RevealItem key={p.id}>
                <figure className="polaroid" style={{ rotate: `${((i * 3) % 5) - 2}deg` }}>
                  <Image
                    src={p.url}
                    alt={p.caption ?? "Komuniteti i Mësimit Kreativ"}
                    width={p.width ?? 800}
                    height={p.height ?? 600}
                    className="h-36 w-full rounded-sm object-cover sm:h-44"
                  />
                </figure>
              </RevealItem>
            ))}
          </RevealStagger>
          <Reveal className="mt-12 text-center">
            <p className="font-display text-xl text-ink">
              Dëshironi që edhe fëmija juaj të jetë pjesë e kësaj historie?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/regjistrohu"
                className="rounded-full bg-terracotta px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
              >
                Regjistro fëmijën
              </Link>
              <Link
                href="/galeria"
                className="rounded-full border-2 border-sage px-7 py-3.5 font-bold text-sage-deep transition-all hover:-translate-y-0.5 hover:bg-sage hover:text-white"
              >
                Shiko kujtimet tona
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
