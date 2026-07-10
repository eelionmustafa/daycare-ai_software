# Mësimi Kreativ — Website & Platformë Menaxhimi

Website publik + portal prindërish + panel administrimi për qendrën ditore **Mësimi Kreativ**
([facebook.com/mesimikreativ](https://www.facebook.com/mesimikreativ/)) — fëmijë 6–11 vjeç.

## Nisja e shpejtë (development)

```bash
npm install
npm run db:setup     # krijon bazën SQLite, gjeneron fotot placeholder dhe mbush të dhënat demo
npm run dev          # http://localhost:3000
```

### Llogaritë demo

| Roli   | Email                     | Fjalëkalimi | Hyrja      |
|--------|---------------------------|-------------|------------|
| Admin  | `admin@mesimikreativ.com` | `admin123`  | `/hyrje` → `/admin`   |
| Prind  | `prind@shembull.com`      | `prind123`  | `/hyrje` → `/portali` |

> Ndryshojini këto kredenciale para se të shkoni në produksion.

## Çfarë përfshin

**Faqja publike (shqip):**
- Ballina kinematike me kolazh fotosh dhe animacione të buta (Framer Motion)
- "Rreth nesh" — histori me 4 kapituj (fillimi, filozofia, një ditë brenda, komuniteti)
- Galeria — masonry + lightbox me zoom, filtrim sipas albumeve
- Aktivitetet, Stafi, Dëshmitë e prindërve, Kontakti (hartë + formular), FAQ (me JSON-LD)
- Regjistrimi online i fëmijëve (aplikimet shkojnë te paneli i adminit)
- Asistenti AI "Pyet Mësimin Kreativ" — recepsionist digjital (nuk flet për çmime)

**Portali i prindërve (`/portali`):**
- Profilet e fëmijëve, historiku i prezencës (mbahet manualisht nga stafi)
- Faturat, statusi i pagesave, udhëzimet bankare, kuponat e printueshëm

**Paneli i adminit (`/admin`):**
- Fëmijët & familjet (krijon llogari prindërish), prezenca ditore me një klikim
- Faturimi: krijo fatura, regjistro pagesa (kupon automatik), statuse, raport i shpejtë
- Aplikimet e regjistrimit, mesazhet e kontaktit
- Galeria: **sinkronizim me Facebook** + ngarkim manual, aprovi/fshih/album/ballinë
- Cilësimet: adresa, orari, tekstet e ballinës, të dhënat bankare, tokenat e Facebook-ut

## Sinkronizimi me Facebook

Fotot e faqes suaj në Facebook importohen me Graph API:

1. Krijoni një app në [developers.facebook.com](https://developers.facebook.com/) dhe merrni
   një **Page Access Token** (leja `pages_read_engagement`) për faqen `mesimikreativ`.
2. Vendosni **Page ID** dhe **Token** te *Admin → Cilësimet* (ose env vars
   `FACEBOOK_PAGE_ID` / `FACEBOOK_ACCESS_TOKEN`).
3. *Admin → Galeria → "Sinkronizo tani"*. Fotot importohen **të fshehura**; ju aprovoni
   cilat publikohen. Imazhet ruhen lokalisht (ose në Vercel Blob në produksion), me
   përshkrimet e postimeve kur ekzistojnë.

Pa token, ngarkimi manual nga paneli funksionon gjithmonë. Fotot aktuale në galeri janë
placeholder-a artistikë — zëvendësohen automatikisht sapo të importohen fotot e vërteta.

## Asistenti AI

`/api/assistant` përdor (sipas radhës së disponueshmërisë):
1. **Vercel AI Gateway** (`AI_GATEWAY_API_KEY`) — modeli `anthropic/claude-haiku-4-5`
2. **Anthropic API** (`ANTHROPIC_API_KEY`)
3. **Baza e njohurive e brendshme** — funksionon pa asnjë çelës, me përgjigje të kuruara shqip

Asistenti nuk tregon kurrë çmime — i drejton prindërit te telefoni i qendrës.

## Teknologjia

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion · Prisma + SQLite
(lokalisht) · sesione JWT (jose) me bcrypt · Zod

## Produksion (Vercel)

1. Kaloni `prisma/schema.prisma` në `provider = "postgresql"` dhe lidhni një Postgres
   (p.sh. Neon nga Vercel Marketplace); ekzekutoni `npm run db:setup`.
2. Shtoni `BLOB_READ_WRITE_TOKEN` (Vercel Blob) që ngarkimet/sinkronizimi të ruhen në cloud.
3. Vendosni `AUTH_SECRET` të fortë dhe `NEXT_PUBLIC_SITE_URL` me domenin real.
4. Opsionale: `AI_GATEWAY_API_KEY` për asistentin me model të vërtetë.

## SEO

Meta title/description për çdo faqe, Open Graph, `sitemap.xml`, `robots.txt`
(portali/admin të bllokuar), JSON-LD `ChildCare` + `FAQPage`, imazhe të optimizuara me
`next/image`, gjuha `sq`.
