import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stafi ynë — Njerëz me përvojë dhe kujdes",
  description:
    "Stafi i Mësimit Kreativ: edukatore dhe instruktorë me përvojë, që kujdesen çdo ditë për fëmijët tuaj me ngrohtësi dhe profesionalizëm.",
};

const points = [
  {
    emoji: "🎓",
    title: "Përvojë e vërtetuar",
    text: "Çdo anëtar i stafit sjell vite përvoje pune me fëmijë të moshës shkollore — jo vetëm dashuri për punën, por edhe njohuri profesionale.",
  },
  {
    emoji: "🤗",
    title: "Njohin çdo fëmijë personalisht",
    text: "Nuk trajtojmë fëmijët si grup — stafi ynë njeh emrin, karakterin dhe nevojat e secilit fëmijë veç e veç.",
  },
  {
    emoji: "🛡️",
    title: "Kujdes i vazhdueshëm",
    text: "Nga mëngjesi e deri te dera e shkollës, e prapë deri te prindërit — një sy i kujdesshëm i shoqëron fëmijët gjatë gjithë ditës.",
  },
  {
    emoji: "📚",
    title: "Ndihmë reale në mësime",
    text: "Stafi ynë ndihmon në detyra, përgatit fëmijët për teste dhe ofron orë shtesë për ata që kanë nevojë për më shumë mbështetje.",
  },
];

export default function StaffPage() {
  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Stafi ynë
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Njerëz me <span className="underline-hand">përvojë dhe kujdes</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Për arsye privatësie nuk ndajmë profile individuale këtu — por mund t&apos;ju
              themi me siguri të plotë: fëmija juaj do të jetë në duar të sigurta,
              me njerëz që e duan këtë punë.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <RevealStagger className="grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <RevealItem key={p.title}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-soft">
                <span className="text-3xl" aria-hidden>
                  {p.emoji}
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">{p.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-16 text-center">
          <p className="text-lg text-ink-soft">
            Mënyra më e mirë për t&apos;i njohur? Ejani për një vizitë dhe takohuni personalisht.
          </p>
          <Link
            href="/kontakti"
            className="mt-4 inline-block rounded-full bg-sage px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-sage-deep"
          >
            Caktoni një takim
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
