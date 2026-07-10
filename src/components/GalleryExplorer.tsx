"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryCarousel } from "@/components/GalleryCarousel";

export type GalleryPhoto = {
  id: string;
  url: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  albumSlug: string | null;
  albumName: string | null;
  source: string;
  featured?: boolean;
};

export type GalleryAlbum = { slug: string; name: string; count: number };

export function GalleryExplorer({
  photos,
  albums,
}: {
  photos: GalleryPhoto[];
  albums: GalleryAlbum[];
}) {
  const [filter, setFilter] = useState<string>("te-gjitha");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const visible = useMemo(
    () => (filter === "te-gjitha" ? photos : photos.filter((p) => p.albumSlug === filter)),
    [filter, photos]
  );

  const close = useCallback(() => {
    setLightbox(null);
    setZoomed(false);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setZoomed(false);
      setLightbox((i) =>
        i === null ? null : (i + dir + visible.length) % visible.length
      );
    },
    [visible.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const current = lightbox !== null ? visible[lightbox] : null;

  const featured = useMemo(() => photos.filter((p) => p.featured), [photos]);

  const openFromCarousel = useCallback(
    (photo: GalleryPhoto) => {
      setFilter("te-gjitha");
      const i = photos.findIndex((p) => p.id === photo.id);
      setZoomed(false);
      setLightbox(i >= 0 ? i : null);
    },
    [photos]
  );

  return (
    <div>
      {featured.length > 0 && (
        <div className="mb-12">
          <GalleryCarousel photos={featured} onOpen={openFromCarousel} />
        </div>
      )}

      {/* Album filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("te-gjitha")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            filter === "te-gjitha"
              ? "bg-terracotta text-white shadow-soft"
              : "bg-white text-ink-soft shadow-soft hover:text-ink"
          }`}
        >
          Të gjitha · {photos.length}
        </button>
        {albums.map((a) => (
          <button
            key={a.slug}
            onClick={() => setFilter(a.slug)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              filter === a.slug
                ? "bg-terracotta text-white shadow-soft"
                : "bg-white text-ink-soft shadow-soft hover:text-ink"
            }`}
          >
            {a.name} · {a.count}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <motion.div layout className="masonry mt-8">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.button
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightbox(i)}
              className="group block w-full text-left"
              aria-label={`Hap foton: ${p.caption ?? "pa titull"}`}
            >
              <figure className="polaroid">
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src={p.url}
                    alt={p.caption ?? "Moment nga Mësimi Kreativ"}
                    width={p.width ?? 800}
                    height={p.height ?? 600}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="flex items-start justify-between gap-2 px-1 pt-2.5 pb-1">
                  <span className="font-display text-sm leading-snug text-ink-soft">
                    {p.caption}
                  </span>
                  {p.albumName && (
                    <span className="shrink-0 rounded-full bg-blush px-2.5 py-0.5 text-[11px] font-bold text-terracotta-deep">
                      {p.albumName}
                    </span>
                  )}
                </figcaption>
              </figure>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-ink-soft">
          Ky album do të mbushet së shpejti me kujtime të reja. 📷
        </p>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Galeria në ekran të plotë"
          >
            <div className="flex items-center justify-between px-5 py-4 text-white/80">
              <p className="text-sm font-semibold">
                {lightbox! + 1} / {visible.length}
                {current.source === "FACEBOOK" && (
                  <span className="ml-3 rounded-full bg-sky/30 px-2.5 py-0.5 text-xs">
                    nga Facebook
                  </span>
                )}
              </p>
              <button
                onClick={close}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label="Mbyll"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
            <div
              className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => step(-1)}
                className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Fotoja e mëparshme"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
                transition={{ duration: 0.3 }}
                className={`max-h-full ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setZoomed((z) => !z)}
              >
                <Image
                  src={current.url}
                  alt={current.caption ?? "Foto nga Mësimi Kreativ"}
                  width={current.width ?? 1200}
                  height={current.height ?? 900}
                  className="max-h-[72vh] w-auto rounded-lg object-contain shadow-lift"
                />
              </motion.div>
              <button
                onClick={() => step(1)}
                className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Fotoja tjetër"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
            {current.caption && (
              <p className="px-6 pb-6 text-center font-display text-white/90">
                {current.caption}
                {current.albumName && (
                  <span className="ml-2 text-sm text-white/50">· {current.albumName}</span>
                )}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
