"use client";

import React, { useState, useEffect } from "react";
import { tripMeta, itineraryDays } from "../data/trip-config";
import { Navigation } from "../components/Navigation";
import { TodaySignalCards } from "../components/TodaySignalCards";
import { ItineraryView } from "../components/ItineraryView";
import { PlacesAndGuides } from "../components/PlacesAndGuides";
import { TripTools } from "../components/TripTools";
import { EmergencyHub } from "../components/EmergencyHub";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";

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
      {/* Navigation Header & Mobile Thumb Dock */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section with Real Tokyo Photography & Editorial Magazine Scrim */}
      <section className="relative overflow-hidden bg-[#132540] text-white">
        {/* Real High-Resolution Destination Background Image */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tripMeta.heroImage}
            alt="Tokyo Skyline at Twilight"
            className="h-full w-full object-cover object-center opacity-40 filter brightness-90 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#132540] via-[#132540]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#132540] via-[#132540]/70 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-2xl space-y-5">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF86A8] backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tokyo Travel Companion · {tripMeta.dateDisplay}</span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-md">
              Tokyo, <br />
              <em className="text-[#FF86A8] not-italic font-normal">ready when you are.</em>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base leading-relaxed text-stone-200 font-medium max-w-xl drop-shadow">
              {tripMeta.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => scrollToSection("today")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF5F93] px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#e84e80] transition-transform active:scale-95"
              >
                <span>Open Today Mode</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => scrollToSection("itinerary")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/25 transition backdrop-blur-md"
              >
                <span>See All {tripMeta.stats.days} Days</span>
              </button>

              <button
                onClick={() => scrollToSection("guides")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/25 transition backdrop-blur-md"
              >
                <MapPin className="h-4 w-4 text-[#FFD66B]" />
                <span>Destination Guides</span>
              </button>
            </div>

            {/* Trip Stats Counters */}
            <div className="flex items-center gap-6 sm:gap-10 pt-8 border-t border-white/15">
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FFD66B]">
                  {tripMeta.stats.days}
                </strong>
                <span className="ml-2 text-xs text-stone-300 font-semibold tracking-wide">Days</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FFD66B]">
                  {tripMeta.stats.travelers}
                </strong>
                <span className="ml-2 text-xs text-stone-300 font-semibold tracking-wide">Travelers</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <strong className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FFD66B]">
                  {tripMeta.stats.highlights}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker: Responsive, Continuous & Beautiful */}
      <section className="overflow-hidden bg-[#FF5F93] py-2.5 text-white shadow-sm font-bold text-[11px] uppercase tracking-widest border-y border-[#e84e80]">
        <div className="flex flex-wrap items-center justify-around gap-4 px-4 sm:px-6">
          {tripMeta.marqueeHighlights.map((highlight, idx) => (
            <span key={idx} className="inline-flex items-center gap-3">
              <span>{highlight}</span>
              <span className="text-[#FFD66B]">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-16 sm:space-y-20">
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

        {/* SECTION 2: 7-DAY WEATHER-ADAPTIVE ITINERARY */}
        <section id="itinerary" className="scroll-mt-20">
          <ItineraryView
            selectedDayIndex={currentDayIndex}
            setSelectedDayIndex={setCurrentDayIndex}
          />
        </section>

        {/* SECTION 3: PLACES & DESTINATION GUIDES */}
        <section id="guides" className="scroll-mt-20">
          <PlacesAndGuides />
        </section>

        {/* SECTION 4: TRIP TOOLS & DOCUMENTS */}
        <section id="tools" className="scroll-mt-20">
          <TripTools />
        </section>

        {/* SECTION 5: EMERGENCY HUB */}
        <section id="emergency" className="scroll-mt-20">
          <EmergencyHub />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 text-center text-xs text-stone-600">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="rounded bg-[#1F3A5F] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              {tripMeta.japaneseTitle}
            </span>
            <span className="font-serif text-base font-bold text-stone-900">
              {tripMeta.tripName}
            </span>
          </div>
          <p className="font-medium text-stone-700">
            {tripMeta.destination} · {tripMeta.dateDisplay}
          </p>
          <p className="text-[11px] text-stone-400 font-mono">
            Clean Data-Driven Architecture · Device-Local & Offline Capable
          </p>
        </div>
      </footer>
    </div>
  );
}
