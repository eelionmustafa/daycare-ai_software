import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Mësimi Kreativ — Qendër ditore për fëmijë në Prishtinë",
    template: "%s | Mësimi Kreativ",
  },
  description:
    "Mësimi Kreativ është një qendër ditore dhe hapësirë mësimi kreativ për fëmijë 6–11 vjeç: kujdes i ngrohtë, ndihmë me detyra, aktivitete kreative dhe shoqëri e vërtetë.",
  openGraph: {
    siteName: "Mësimi Kreativ",
    locale: "sq_AL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
