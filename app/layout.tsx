import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import BottomNav from "@/components/BottomNav";
import TwibbonLauncher from "@/components/TwibbonLauncher";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
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
    images: ["/logo.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acara 17an Blok C Serpong Lagoon",
    description:
      "Website pendaftaran digital lomba 17 Agustus warga Blok C Pelican, Serpong Lagoon.",
    images: ["/logo.webp"],
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
        <TwibbonLauncher />
        <Analytics />
      </body>
    </html>
  );
}
