import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import BottomNav from "@/components/BottomNav";
import TwibbonLauncher from "@/components/TwibbonLauncher";
import KritikSaranLauncher from "@/components/KritikSaranLauncher";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

// Fallback ke domain production (bukan localhost) supaya preview link di
// WhatsApp/grup RT tetap tampil kalau NEXT_PUBLIC_SITE_URL lupa di-set di Vercel.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://17an-blokc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Acara 17an Blok C Serpong Lagoon",
  description:
    "Website pendaftaran digital lomba 17 Agustus warga Blok C Pelican, Serpong Lagoon.",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Acara 17an Blok C Serpong Lagoon",
    description:
      "Website pendaftaran digital lomba 17 Agustus warga Blok C Pelican, Serpong Lagoon.",
    images: [
      {
        url: "/og-image.png",
        width: 640,
        height: 641,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acara 17an Blok C Serpong Lagoon",
    description:
      "Website pendaftaran digital lomba 17 Agustus warga Blok C Pelican, Serpong Lagoon.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        {children}
        <BottomNav />
        {/* <TwibbonLauncher /> */}
        <KritikSaranLauncher />
        <Analytics />
      </body>
    </html>
  );
}
