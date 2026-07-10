// Generates warm "memory card" placeholder images for the gallery.
// These are deliberate placeholders: once the real Mësimi Kreativ Facebook
// photos are synced (Admin → Galeria), they take over the gallery.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "gallery");
mkdirSync(outDir, { recursive: true });

// Soft construction-paper palette: [paper, ink, accent]
const palettes = [
  ["#F6E7D8", "#A9714B", "#E2936B"],
  ["#E8EDE3", "#6E8B74", "#9DB4A0"],
  ["#FBEFD9", "#C79A3D", "#E7BE6A"],
  ["#EDE4EE", "#8A6E93", "#B296BB"],
  ["#E4EAEF", "#5D7B93", "#8FA9BD"],
  ["#F9E3DE", "#C4705F", "#E09A8B"],
];

const motifs = {
  sun: (cx, cy, r, c) => {
    const rays = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * (r + 8);
      const y1 = cy + Math.sin(a) * (r + 8);
      const x2 = cx + Math.cos(a) * (r + 22);
      const y2 = cy + Math.sin(a) * (r + 22);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
    }).join("");
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>${rays}`;
  },
  wave: (cx, cy, r, c) =>
    `<path d="M ${cx - r * 2} ${cy} q ${r * 0.5} ${-r} ${r} 0 t ${r} 0 t ${r} 0 t ${r} 0" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
  star: (cx, cy, r, c) => {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const rr = i % 2 === 0 ? r : r * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="${c}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`;
  },
  heart: (cx, cy, r, c) =>
    `<path d="M ${cx} ${cy + r * 0.8} C ${cx - r * 1.4} ${cy - r * 0.4} ${cx - r * 0.6} ${cy - r * 1.3} ${cx} ${cy - r * 0.4} C ${cx + r * 0.6} ${cy - r * 1.3} ${cx + r * 1.4} ${cy - r * 0.4} ${cx} ${cy + r * 0.8} Z" fill="${c}"/>`,
  plane: (cx, cy, r, c) =>
    `<path d="M ${cx - r} ${cy + r * 0.4} L ${cx + r} ${cy - r * 0.6} L ${cx - r * 0.2} ${cy + r * 0.1} Z" fill="${c}"/><path d="M ${cx - r * 0.2} ${cy + r * 0.1} L ${cx + r * 0.05} ${cy + r * 0.75} L ${cx + r * 0.25} ${cy + r * 0.15} Z" fill="${c}" opacity="0.75"/>`,
  blob: (cx, cy, r, c) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${cx + r * 0.9}" cy="${cy + r * 0.5}" r="${r * 0.55}" fill="${c}" opacity="0.7"/><circle cx="${cx - r * 0.8}" cy="${cy + r * 0.6}" r="${r * 0.4}" fill="${c}" opacity="0.55"/>`,
};

const sizes = [
  [1200, 900],
  [900, 1200],
  [1080, 1080],
  [1200, 750],
];

function card(i, motifName) {
  const [paper, ink, accent] = palettes[i % palettes.length];
  const [w, h] = sizes[i % sizes.length];
  const motif = motifs[motifName](w * (0.28 + (i % 3) * 0.2), h * (0.3 + ((i * 7) % 4) * 0.12), Math.min(w, h) * 0.09, accent);
  const motif2 = motifs[motifName === "wave" ? "blob" : "wave"](w * 0.72, h * 0.72, Math.min(w, h) * 0.07, ink);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0"/><feComposite operator="over" in2="SourceGraphic"/></filter>
    <radialGradient id="v" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="${paper}"/><stop offset="100%" stop-color="${paper}" stop-opacity="0.92"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${paper}"/>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g opacity="0.5" filter="url(#g)">${motif}${motif2}</g>
  <g opacity="0.35">
    <text x="50%" y="${h - 54}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w * 0.024)}" fill="${ink}">Fotografia e vërtetë vjen nga faqja jonë në Facebook</text>
  </g>
</svg>`;
}

const motifNames = Object.keys(motifs);
const files = [];
for (let i = 0; i < 24; i++) {
  const name = `kujtim-${String(i + 1).padStart(2, "0")}.svg`;
  writeFileSync(join(outDir, name), card(i, motifNames[i % motifNames.length]));
  const [w, h] = sizes[i % sizes.length];
  files.push({ name, w, h });
}
console.log(JSON.stringify(files));
