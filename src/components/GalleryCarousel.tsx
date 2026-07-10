"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryPhoto } from "@/components/GalleryExplorer";

const AUTOPLAY_MS = 5000;

export function GalleryCarousel({
  photos,
  onOpen,
}: {
  photos: GalleryPhoto[];
  onOpen: (photo: GalleryPhoto) => void;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number, direction: 1 | -1) => {
      setDir(direction);
      setIndex((next + photos.length) % photos.length);
    },
    [photos.length]
  );

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const t = setInterval(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, paused, photos.length, go]);

  if (photos.length === 0) return null;
  const current = photos[index];

  return (
    <div
      className="group relative overflow-hidden rounded-[2rem] bg-ink shadow-lift"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx > 40) go(index - 1, -1);
        else if (dx < -40) go(index + 1, 1);
        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <div className="relative h-[60vh] max-h-[560px] min-h-[320px] w-full">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.button
            key={current.id}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? 60 : -60, scale: 1.02 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir > 0 ? -60 : 60, scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.21, 0.65, 0.36, 1] }}
            onClick={() => onOpen(current)}
            className="absolute inset-0 h-full w-full cursor-zoom-in"
            aria-label={`Hap foton: ${current.caption ?? "pa titull"}`}
          >
            <Image
              src={current.url}
              alt={current.caption ?? "Moment nga Mësimi Kreativ"}
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/10" />
          </motion.button>
        </AnimatePresence>

        {(current.caption || current.albumName) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-7">
            <p className="font-display text-lg text-white sm:text-xl">{current.caption}</p>
            {current.albumName && (
              <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {current.albumName}
              </span>
            )}
          </div>
        )}

        {/* Prev/next */}
        <button
          onClick={() => go(index - 1, -1)}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white opacity-0 transition-opacity duration-200 hover:bg-white/20 group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Fotoja e mëparshme"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => go(index + 1, 1)}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white opacity-0 transition-opacity duration-200 hover:bg-white/20 group-hover:opacity-100 focus-visible:opacity-100"
          aria-label="Fotoja tjetër"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Thumbnail strip / dots */}
      <div className="flex items-center justify-center gap-2 bg-ink/95 px-4 py-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => go(i, i > index ? 1 : -1)}
            className="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
            style={{ width: i === index ? "28px" : "8px" }}
            aria-label={`Shko te fotoja ${i + 1}`}
            aria-current={i === index}
          >
            {i === index && !paused && (
              <motion.span
                key={`${p.id}-progress`}
                className="absolute inset-y-0 left-0 bg-sun"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
              />
            )}
            {i === index && paused && <span className="absolute inset-0 bg-sun" />}
          </button>
        ))}
      </div>
    </div>
  );
}
