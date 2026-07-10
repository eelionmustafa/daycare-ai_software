import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/Reveal";
import { GalleryExplorer } from "@/components/GalleryExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeria — Kujtimet tona",
  description:
    "Fotot e vërteta nga ditët tona në Mësimi Kreativ: aktivitete, projekte kreative, festa dhe momente nga klasa.",
};

export default async function GalleryPage() {
  const [photos, albums, settings] = await Promise.all([
    db.photo.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { album: true },
    }),
    db.album.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { photos: { where: { visible: true } } } } },
    }),
    getSettings(),
  ]);

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Galeria jonë
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Kështu duken <span className="underline-hand">ditët tona</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Këto janë momentet e vërteta që i ndajmë me prindërit — të njëjtat foto që
              i gjeni edhe në{" "}
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky hover:underline"
              >
                faqen tonë të Facebook-ut
              </a>
              . Galeria përditësohet vazhdimisht me aktivitetet më të reja.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <GalleryExplorer
          photos={photos.map((p) => ({
            id: p.id,
            url: p.url,
            caption: p.caption,
            width: p.width,
            height: p.height,
            albumSlug: p.album?.slug ?? null,
            albumName: p.album?.name ?? null,
            source: p.source,
            featured: p.featured,
          }))}
          albums={albums
            .filter((a) => a._count.photos > 0)
            .map((a) => ({ slug: a.slug, name: a.name, count: a._count.photos }))}
        />
      </section>
    </div>
  );
}
