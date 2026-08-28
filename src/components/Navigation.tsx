"use client";

import React from "react";
import Link from "next/link";
import { tripMeta } from "../data/trip-config";
import { Calendar, Compass, ShieldAlert, Sparkles, Wrench, Wallet, CloudSun } from "lucide-react";

interface NavigationProps {
  activeTab: "today" | "itinerary" | "guides" | "tools" | "emergency";
  setActiveTab: (tab: "today" | "itinerary" | "guides" | "tools" | "emergency") => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const scrollToSection = (tab: "today" | "itinerary" | "guides" | "tools" | "emergency") => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#1F3A5F]/95 text-white backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="rounded-md bg-[#FF5F93] px-2 py-0.5 text-xs font-black tracking-widest text-white shadow-sm">
              {tripMeta.japaneseTitle}
            </span>
            <span className="font-serif text-lg font-bold tracking-wider sm:text-xl">
              {tripMeta.tripName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-stone-200">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Today
            </Link>
            <Link
              href="/itinerary"
              className="transition-colors hover:text-white flex items-center gap-1 font-semibold text-[#FFD66B]"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Itinerary & Guides</span>
            </Link>
            <Link
              href="/weather"
              className="transition-colors hover:text-white flex items-center gap-1"
            >
              <CloudSun className="h-3.5 w-3.5 text-amber-300" />
              <span>Weather</span>
            </Link>
            <Link
              href="/budget"
              className="transition-colors hover:text-white flex items-center gap-1"
            >
              <Wallet className="h-3.5 w-3.5 text-[#FF86A8]" />
              <span>Budget</span>
            </Link>
            <button
              onClick={() => scrollToSection("tools")}
              className={`transition-colors hover:text-white ${activeTab === "tools" ? "text-[#FF86A8] font-bold" : ""}`}
            >
              Trip Tools
            </button>
            <button
              onClick={() => scrollToSection("emergency")}
              className={`transition-colors hover:text-white ${activeTab === "emergency" ? "text-[#FF86A8] font-bold" : ""}`}
            >
              Emergency
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/itinerary"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20"
            >
              <Calendar className="h-3.5 w-3.5 text-[#FFD66B]" />
              <span>Master Itinerary</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Floating Thumb Dock (Bottom Navigation) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-[#1F3A5F]/95 p-1.5 text-white shadow-2xl backdrop-blur-lg sm:bottom-4 md:hidden"
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition text-stone-300 hover:text-white"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden">Today</span>
        </Link>

        <Link
          href="/itinerary"
          className="flex items-center gap-1.5 rounded-full bg-[#FF5F93] px-3 py-2 text-xs font-bold text-white shadow-md transition"
        >
          <Calendar className="h-4 w-4" />
          <span>Itinerary</span>
        </Link>

        <Link
          href="/weather"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition text-stone-300 hover:text-white"
        >
          <CloudSun className="h-4 w-4 text-amber-300" />
          <span className="hidden">Weather</span>
        </Link>

        <Link
          href="/budget"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition text-stone-300 hover:text-white"
        >
          <Wallet className="h-4 w-4 text-[#FFD66B]" />
          <span className="hidden">Budget</span>
        </Link>

        <button
          onClick={() => scrollToSection("tools")}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition ${
            activeTab === "tools" ? "bg-[#FF5F93] text-white shadow-md" : "text-stone-300 hover:text-white"
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span className="hidden">Tools</span>
        </button>

        <button
          onClick={() => scrollToSection("emergency")}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition ${
            activeTab === "emergency" ? "bg-red-600 text-white shadow-md" : "text-stone-300 hover:text-white"
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-red-300" />
          <span className="hidden">SOS</span>
        </button>
      </nav>
    </>
  );
};
