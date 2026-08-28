import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1F3A5F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "TravelTokyo (東京旅) — Personal Family Trip Companion",
  description:
    "A clean, mobile-first Tokyo trip companion for September 1–7, 2026, with weather-aware itineraries, live transit signals, booking vault, budget tracking, and packing tools.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TravelTokyo — Ready when you are",
    description: "Seven days, one calm personal travel companion for Tokyo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-[#FBF8F0] font-sans text-[#2A2620]">{children}</body>
    </html>
  );
}
