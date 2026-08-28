"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tripMeta } from "../data/trip-config";
import { Calendar, ShieldAlert, Sparkles, Wrench, Wallet, CloudSun, Settings } from "lucide-react";
import { TripCustomizerModal } from "./TripCustomizerModal";

interface NavigationProps {
  activeTab?: "today" | "itinerary" | "guides" | "tools" | "emergency";
  setActiveTab?: (tab: "today" | "itinerary" | "guides" | "tools" | "emergency") => void;
  currentRoute?: "home" | "itinerary" | "weather" | "budget";
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab = "today",
  setActiveTab,
  currentRoute = "home",
}) => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const scrollToSection = (tab: "today" | "itinerary" | "guides" | "tools" | "emergency") => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#1F3A5F]/95 text-white backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-left focus:outline-none flex-shrink-0"
          >
            <span className="rounded-md bg-[#FF5F93] px-2 py-0.5 text-xs font-black tracking-widest text-white shadow-sm">
              {tripMeta.japaneseTitle}
            </span>
            <span className="font-serif text-base sm:text-xl font-bold tracking-wider truncate max-w-[180px] sm:max-w-none">
              {tripMeta.tripName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-stone-200">
            <Link
              href="/"
              className={`transition-colors hover:text-white ${currentRoute === "home" && activeTab === "today" ? "text-white font-bold" : ""}`}
            >
              Today
            </Link>
            <Link
              href="/itinerary"
              className={`transition-colors hover:text-white flex items-center gap-1 font-semibold ${currentRoute === "itinerary" ? "text-[#FFD66B] font-bold" : "text-[#FFD66B]"}`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Itinerary & Guides</span>
            </Link>
            <Link
              href="/weather"
              className={`transition-colors hover:text-white flex items-center gap-1 ${currentRoute === "weather" ? "text-amber-300 font-bold" : ""}`}
            >
              <CloudSun className="h-3.5 w-3.5 text-amber-300" />
              <span>Weather</span>
            </Link>
            <Link
              href="/budget"
              className={`transition-colors hover:text-white flex items-center gap-1 ${currentRoute === "budget" ? "text-[#FF86A8] font-bold" : ""}`}
            >
              <Wallet className="h-3.5 w-3.5 text-[#FF86A8]" />
              <span>Budget</span>
            </Link>
            <button
              onClick={() => {
                if (currentRoute === "home") {
                  scrollToSection("tools");
                } else {
                  window.location.href = "/#tools";
                }
              }}
              className={`transition-colors hover:text-white ${currentRoute === "home" && activeTab === "tools" ? "text-[#FF86A8] font-bold" : ""}`}
            >
              Trip Tools
            </button>
            <button
              onClick={() => {
                if (currentRoute === "home") {
                  scrollToSection("emergency");
                } else {
                  window.location.href = "/#emergency";
                }
              }}
              className={`transition-colors hover:text-white ${currentRoute === "home" && activeTab === "emergency" ? "text-red-300 font-bold" : ""}`}
            >
              Emergency
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-stone-200 hover:bg-white/20 hover:text-white transition shadow-sm backdrop-blur-sm"
              title="Configure Trip & Backup Data"
            >
              <Settings className="h-3.5 w-3.5 text-[#FFD66B]" />
              <span className="hidden sm:inline">Setup / Backup</span>
            </button>

            {currentRoute !== "itinerary" && (
              <Link
                href="/itinerary"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20"
              >
                <Calendar className="h-3.5 w-3.5 text-[#FFD66B]" />
                <span>Master Itinerary</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Thumb Dock (Persistent, >=44px touch targets with labels) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-2.5 left-1/2 z-50 flex -translate-x-1/2 items-center justify-around gap-1 rounded-full border border-white/25 bg-[#1F3A5F]/95 px-3 py-1.5 text-white shadow-2xl backdrop-blur-xl md:hidden w-[94%] max-w-[420px]"
      >
        {/* 1. Today Link */}
        <Link
          href="/"
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "home" && activeTab === "today"
              ? "bg-[#FF5F93] text-white shadow-md"
              : "text-stone-300 hover:text-white"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Today</span>
        </Link>

        {/* 2. Itinerary Link */}
        <Link
          href="/itinerary"
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "itinerary"
              ? "bg-[#FF5F93] text-white shadow-md"
              : "text-stone-300 hover:text-white"
          }`}
        >
          <Calendar className="h-4 w-4 text-[#FFD66B]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Plan</span>
        </Link>

        {/* 3. Weather Link */}
        <Link
          href="/weather"
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "weather"
              ? "bg-[#FF5F93] text-white shadow-md"
              : "text-stone-300 hover:text-white"
          }`}
        >
          <CloudSun className="h-4 w-4 text-amber-300" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Sky</span>
        </Link>

        {/* 4. Budget Link */}
        <Link
          href="/budget"
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "budget"
              ? "bg-[#FF5F93] text-white shadow-md"
              : "text-stone-300 hover:text-white"
          }`}
        >
          <Wallet className="h-4 w-4 text-[#FFD66B]" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Money</span>
        </Link>

        {/* 5. Tools / Vault Link */}
        <button
          onClick={() => {
            if (currentRoute === "home") {
              scrollToSection("tools");
            } else {
              window.location.href = "/#tools";
            }
          }}
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "home" && activeTab === "tools"
              ? "bg-[#FF5F93] text-white shadow-md"
              : "text-stone-300 hover:text-white"
          }`}
        >
          <Wrench className="h-4 w-4 text-sky-300" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Vault</span>
        </button>

        {/* 6. Emergency SOS Button */}
        <button
          onClick={() => {
            if (currentRoute === "home") {
              scrollToSection("emergency");
            } else {
              window.location.href = "/#emergency";
            }
          }}
          className={`flex min-h-[46px] min-w-[48px] flex-col items-center justify-center rounded-2xl px-2 py-1 transition ${
            currentRoute === "home" && activeTab === "emergency"
              ? "bg-red-600 text-white shadow-md"
              : "text-red-300 hover:text-white"
          }`}
        >
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">SOS</span>
        </button>
      </nav>

      {/* Trip Setup & Customizer Modal */}
      <TripCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </>
  );
};

