import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
          {/* sun drawn with a crayon-like stroke */}
          <circle cx="20" cy="20" r="9" fill="#edb94e" />
          <g stroke="#d96c4f" strokeWidth="2.6" strokeLinecap="round">
            <line x1="20" y1="3" x2="20" y2="8" />
            <line x1="20" y1="32" x2="20" y2="37" />
            <line x1="3" y1="20" x2="8" y2="20" />
            <line x1="32" y1="20" x2="37" y2="20" />
            <line x1="8" y1="8" x2="11.5" y2="11.5" />
            <line x1="28.5" y1="28.5" x2="32" y2="32" />
            <line x1="8" y1="32" x2="11.5" y2="28.5" />
            <line x1="28.5" y1="11.5" x2="32" y2="8" />
          </g>
          <path
            d="M15 21 q 2.5 3.5 5 3.5 t 5 -3.5"
            fill="none"
            stroke="#3b322a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="17.5" r="1.4" fill="#3b322a" />
          <circle cx="23.5" cy="17.5" r="1.4" fill="#3b322a" />
        </svg>
      </span>
      <span
        className={`font-display text-xl font-semibold leading-none tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Mësimi{" "}
        <span className={light ? "text-sun" : "text-terracotta"}>Kreativ</span>
      </span>
    </Link>
  );
}
