"use client";

import React, { useState, useEffect } from "react";
import { tripMeta, itineraryDays } from "../data/trip-config";
import { Navigation } from "../components/Navigation";
import { TodaySignalCards } from "../components/TodaySignalCards";
import { ItineraryView } from "../components/ItineraryView";
import { PlacesAndGuides } from "../components/PlacesAndGuides";
import { TripTools } from "../components/TripTools";
import { EmergencyHub } from "../components/EmergencyHub";
import { Sparkles, Calendar, Compass, Wrench, ShieldAlert, ArrowRight } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"today" | "itinerary" | "guides" | "tools" | "emergency">("today");
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  // Automatically determine if today falls within trip dates (Sept 1–7, 2026)
  useEffect(() => {
    try {
      const now = new Date();
      const tripStart = new Date("2026-09-01T00:00:00+09:00");
      const diffDays = Math.floor((now.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < itineraryDays.length) {
        setCurrentDayIndex(diffDays);
      }
    } catch {
      // default to Day 1
      setCurrentDayIndex(0);
    }
  }, []);

  const scrollToSection = (tab: "today" | "itinerary" | "guides" | "tools" | "emergency") => {
    setActiveTab(tab);
    const el = document.getElementById(tab);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#2A2620] selection:bg-[#FF5F93] selection:text-white pb-24 md:pb-12">
      {/* Navigation Header & Floating Dock */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#132540] via-[#1F3A5F] to-[#2A4870] pt-12 pb-16 text-white sm:pt-16 sm:pb-24">
        {/* Subtle Background Ornament */}
        <div className="pointer-events-none absolute -right-12 -top-12 font-serif text-[280px] font-black text-white/[0.03] select-none">
          東京
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF86A8] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Family Companion · {tripMeta.dateDisplay}</span>
            </div>

            <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-none">
              Tokyo, <br />
              <em className="text-[#FF86A8] not-italic font-light">ready when you are.</em>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-stone-200/90 font-medium max-w-xl">
              {tripMeta.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection("today")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF5F93] px-5 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#e84e80] transition"
              >
                <span>Open Today Mode</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => scrollToSection("itinerary")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-sm"
              >
                <span>See All {tripMeta.stats.days} Days</span>
              </button>
            </div>

            {/* Trip Stats Counters */}
            <div className="flex items-center gap-8 pt-6 border-t border-white/10">
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-bold text-[#FFD66B]">
                  {tripMeta.stats.days}
                </strong>
                <span className="ml-1.5 text-xs text-stone-300 font-medium">Days</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-bold text-[#FFD66B]">
                  {tripMeta.stats.travelers}
                </strong>
                <span className="ml-1.5 text-xs text-stone-300 font-medium">Travelers</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-bold text-[#FFD66B]">
                  {tripMeta.stats.highlights}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="overflow-hidden bg-[#FF5F93] py-2.5 text-white shadow-sm font-bold text-[11px] uppercase tracking-widest">
        <div className="flex justify-around gap-6 whitespace-nowrap">
          {tripMeta.marqueeHighlights.map((highlight, idx) => (
            <span key={idx} className="flex items-center gap-4">
              <span>{highlight}</span>
              <span className="text-[#FFD66B]">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-16">
        {/* SECTION 1: TODAY SIGNAL CARDS */}
        <section id="today" className="scroll-mt-20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
                Today Mode · Active Trip Day
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                Day {itineraryDays[currentDayIndex].dayNumber} · {itineraryDays[currentDayIndex].title}
              </h2>
            </div>
            <button
              onClick={() => scrollToSection("itinerary")}
              className="text-xs font-bold text-[#1F3A5F] hover:underline self-start sm:self-auto"
            >
              Open Full 7-Day Timeline →
            </button>
          </div>

          <TodaySignalCards
            currentDayIndex={currentDayIndex}
            onOpenItinerary={() => scrollToSection("itinerary")}
          />
        </section>

        {/* SECTION 2: 7-DAY WEATHER ITINERARY */}
        <section id="itinerary" className="scroll-mt-20">
          <ItineraryView
            selectedDayIndex={currentDayIndex}
            setSelectedDayIndex={setCurrentDayIndex}
          />
        </section>

        {/* SECTION 3: PLACES & GUIDES */}
        <section id="guides" className="scroll-mt-20">
          <PlacesAndGuides />
        </section>

        {/* SECTION 4: TRIP TOOLS & VAULT */}
        <section id="tools" className="scroll-mt-20">
          <TripTools />
        </section>

        {/* SECTION 5: EMERGENCY HUB */}
        <section id="emergency" className="scroll-mt-20">
          <EmergencyHub />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-100 py-12 text-center text-xs text-stone-600">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="rounded bg-[#1F3A5F] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              {tripMeta.japaneseTitle}
            </span>
            <span className="font-serif text-base font-bold text-stone-900">
              {tripMeta.tripName}
            </span>
          </div>
          <p>
            Reusable Personal Travel Companion · Built for {tripMeta.destination} ({tripMeta.dateDisplay})
          </p>
          <p className="text-[11px] text-stone-400 font-mono">
            Clean Data-Driven Architecture · Ready for GitHub & Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}
