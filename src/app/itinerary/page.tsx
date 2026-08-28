"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  tripMeta,
  itineraryDays,
  placeGuides,
  disneyGuides,
  disneyRestaurants,
  transportRoutes,
} from "../../data/trip-config";
import { useFXRate } from "../../hooks/useFXRate";
import { TransportRoute, TransitClickRef } from "../../types/trip";
import {
  Calendar,
  Sun,
  CloudRain,
  MapPin,
  Train,
  Clock,
  Compass,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Navigation,
  Utensils,
  Sparkles,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function DetailedItineraryPage() {
  const { rate: liveFxRate } = useFXRate(
    tripMeta.defaultCurrencies.homeCurrency,
    tripMeta.defaultCurrencies.destCurrency
  );
  const fxRate = liveFxRate || 2.70;

  // Selected Day Filter / Jump
  const [selectedDayTab, setSelectedDayTab] = useState<number>(0);
  // Sun vs Rain Mode per Day
  const [weatherMode, setWeatherMode] = useState<Record<string, "sun" | "rain">>({});
  // Expanded Place Guides
  const [expandedGuides, setExpandedGuides] = useState<Record<string, boolean>>({
    "asakusa-sensoji": true,
    "tokyo-disneyland": true,
    "warner-bros-studio": true,
    "tokyo-disneysea": true,
  });

  // Transit Modal State
  const [activeTransitRoute, setActiveTransitRoute] = useState<TransportRoute | null>(null);
  const [activeTransitRef, setActiveTransitRef] = useState<TransitClickRef | null>(null);

  const toggleWeatherMode = (dayNum: string) => {
    setWeatherMode((prev) => ({
      ...prev,
      [dayNum]: prev[dayNum] === "rain" ? "sun" : "rain",
    }));
  };

  const toggleGuide = (guideId: string) => {
    setExpandedGuides((prev) => ({
      ...prev,
      [guideId]: !prev[guideId],
    }));
  };

  const handleOpenTransit = (routeIdOrRef: string | TransitClickRef) => {
    if (typeof routeIdOrRef === "string") {
      const found = transportRoutes.find((r) => r.id === routeIdOrRef);
      if (found) {
        setActiveTransitRoute(found);
        setActiveTransitRef(null);
      }
    } else {
      const found = transportRoutes.find((r) => r.id === routeIdOrRef.routeId);
      if (found) {
        setActiveTransitRoute(found);
      } else {
        setActiveTransitRoute(null);
      }
      setActiveTransitRef(routeIdOrRef);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#2A2620] pb-28 selection:bg-[#FF5F93] selection:text-white">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#1F3A5F]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-stone-200 hover:bg-white/20 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wider">
              Detailed Itinerary & Destination Guide
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/weather"
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#FFD66B] hover:bg-white/20 transition flex items-center gap-1"
            >
              <Sun className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live Weather</span>
            </Link>
            <Link
              href="/budget"
              className="rounded-full bg-[#FF5F93] px-3.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-[#e84e80] transition"
            >
              Budget
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-12">
        {/* Page Banner */}
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
            7-Day Tokyo Master Plan
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Detailed Itinerary & Destination Visual Guides
          </h2>
          <p className="mt-1.5 text-xs text-stone-600 max-w-3xl leading-relaxed">
            Real destination photography, dual Sun/Rain plans, park ride guides with photos, actual dining menus, and 1-tap clickable transit directions with exact travel times and fares.
          </p>
        </div>

        {/* Quick Day Jumper Navigation Bar */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-2.5 bg-[#FBF8F0]/90 backdrop-blur-md border-b border-stone-200/60 overflow-x-auto scrollbar-none flex gap-2">
          {itineraryDays.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setSelectedDayTab(idx);
                const el = document.getElementById(`day-${day.dayNumber}`);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex-shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 border ${
                selectedDayTab === idx
                  ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <span>{day.icon}</span>
              <span>Day {day.dayNumber}: {day.shortDate}</span>
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 7-DAY ITINERARY BLOCKS (COMBINED TIMELINES & DESTINATION GUIDES) */}
        {/* ========================================================================= */}
        <div className="space-y-16">
          {itineraryDays.map((day, idx) => {
            const isRain = weatherMode[day.dayNumber] === "rain";
            const events = isRain ? day.rainPlan : day.sunPlan;
            const placeGuide = placeGuides.find((p) => {
              if (day.dayNumber === "01") return p.id === "asakusa-sensoji";
              if (day.dayNumber === "02") return p.id === "tokyo-disneyland";
              if (day.dayNumber === "03") return p.id === "warner-bros-studio";
              if (day.dayNumber === "04") return p.id === "tokyo-disneysea";
              if (day.dayNumber === "05") return p.id === "shibuya-harajuku";
              if (day.dayNumber === "06") return p.id === "akihabara-electric-town";
              return false;
            });
            const disneyGuide =
              day.dayNumber === "02"
                ? disneyGuides.find((g) => g.parkId === "disneyland")
                : day.dayNumber === "04"
                ? disneyGuides.find((g) => g.parkId === "disneysea")
                : null;
            const relatedRestaurants =
              day.dayNumber === "02"
                ? disneyRestaurants.filter((r) => r.land.includes("Disneyland"))
                : day.dayNumber === "04"
                ? disneyRestaurants.filter((r) => r.land.includes("DisneySea"))
                : [];

            return (
              <section
                key={day.dayNumber}
                id={`day-${day.dayNumber}`}
                className="scroll-mt-32 space-y-6"
              >
                {/* Day Header Poster Card */}
                <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={day.image}
                      alt={day.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[#FF5F93] px-2.5 py-1 text-xs font-black tracking-widest text-white shadow-md">
                            DAY {day.dayNumber}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#FFD66B]">
                            {day.date}
                          </span>
                        </div>

                        {/* Weather Switcher Button */}
                        <button
                          onClick={() => toggleWeatherMode(day.dayNumber)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/30 transition shadow-sm"
                        >
                          {isRain ? (
                            <>
                              <CloudRain className="h-3.5 w-3.5 text-sky-300" />
                              <span>Rain Plan Active</span>
                            </>
                          ) : (
                            <>
                              <Sun className="h-3.5 w-3.5 text-amber-300" />
                              <span>Sun Plan Active</span>
                            </>
                          )}
                        </button>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
                        {day.icon} {day.title}
                      </h3>
                      <p className="text-xs text-stone-200 flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#FF5F93]" />
                        <span>{day.area}</span>
                      </p>
                    </div>
                  </div>

                  {/* Transit Callout Bar (Clickable) */}
                  {day.transitSummary && (
                    <div className="bg-stone-50 border-b border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-[#1F3A5F] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Train className="h-4 w-4 text-[#FFD66B]" />
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase text-stone-500">
                            Transit & Commute Route
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {day.transitSummary.routeTitle} ({day.transitSummary.time} · {day.transitSummary.fare})
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleOpenTransit({
                            routeId:
                              day.dayNumber === "01"
                                ? "narita-arrival"
                                : day.dayNumber === "02" || day.dayNumber === "04"
                                ? "hotel-disney"
                                : day.dayNumber === "03"
                                ? "hotel-studio-tour"
                                : day.dayNumber === "05"
                                ? "hotel-shibuya"
                                : day.dayNumber === "06"
                                ? "hotel-akihabara"
                                : "hotel-departure",
                            title: day.transitSummary?.routeTitle || day.title,
                            travelTime: day.transitSummary?.time || "30–50 min",
                            fare: day.transitSummary?.fare || "IC Card",
                            stepSummary: day.transitNote,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#1F3A5F] shadow-sm border border-stone-200 hover:bg-stone-100 transition self-start sm:self-auto"
                      >
                        <Navigation className="h-3.5 w-3.5 text-[#FF5F93]" />
                        <span>View Transit Directions</span>
                      </button>
                    </div>
                  )}

                  {/* Timeline Events with Real Pictures */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <h4 className="font-serif text-lg font-bold text-[#1F3A5F] flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#FF5F93]" />
                      <span>{isRain ? "Rain-Adaptive Timeline (Indoor focus)" : "Recommended Schedule & Sequence"}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/70 p-4 shadow-sm flex flex-col justify-between space-y-3 hover:bg-white hover:shadow-md transition"
                        >
                          <div className="space-y-2">
                            {/* Photo if available */}
                            {event.image && (
                              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="h-full w-full object-cover transition hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFD66B] backdrop-blur-sm">
                                  {event.time}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                {!event.image && (
                                  <span className="rounded-md bg-[#1F3A5F] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                                    {event.time}
                                  </span>
                                )}
                                {event.badges?.map((b, bi) => (
                                  <span
                                    key={bi}
                                    className="rounded-md bg-white px-2 py-0.5 text-[9px] font-bold text-stone-700 border border-stone-200"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>

                              <h5 className="font-serif text-base font-bold text-stone-900 leading-snug">
                                {event.icon} {event.title}
                              </h5>
                              <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                                {event.desc}
                              </p>
                            </div>
                          </div>

                          {/* Clickable Transit Pill */}
                          {event.transit && (
                            <button
                              onClick={() => handleOpenTransit(event.transit!)}
                              className="w-full text-left rounded-xl bg-white p-2.5 text-xs font-semibold text-[#1F3A5F] border border-stone-200 hover:bg-stone-100 transition flex items-center justify-between"
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <Train className="h-3.5 w-3.5 text-[#FF5F93] flex-shrink-0" />
                                <span className="truncate">{event.transit.title}</span>
                              </span>
                              <span className="font-mono text-[10px] text-stone-500 font-bold flex-shrink-0">
                                {event.transit.travelTime} · {event.transit.fare} →
                              </span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Food Quest Bar */}
                    <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-4 text-xs space-y-1">
                      <span className="font-black uppercase tracking-wider text-[#C1802E] flex items-center gap-1">
                        <Utensils className="h-3.5 w-3.5" /> Food Quest for Day {day.dayNumber}
                      </span>
                      <p className="text-stone-800 font-medium leading-relaxed">
                        {day.foodQuest}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* COMBINED DESTINATION GUIDE SECTION (EXPANDABLE) */}
                {/* ========================================================================= */}
                {placeGuide && (
                  <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-md space-y-5">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5F93]">
                          In-Depth Destination Guide
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                          {placeGuide.name} ({placeGuide.japaneseName})
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">{placeGuide.tagline}</p>
                      </div>

                      <button
                        onClick={() => toggleGuide(placeGuide.id)}
                        className="rounded-full bg-stone-100 p-2 text-stone-700 hover:bg-stone-200 transition"
                        aria-label="Toggle Guide"
                      >
                        {expandedGuides[placeGuide.id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {expandedGuides[placeGuide.id] && (
                      <div className="space-y-6 pt-2 animate-in fade-in duration-150">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-2">
                            <span className="text-xs font-bold text-stone-900">✨ What You&apos;ll See</span>
                            <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                              {placeGuide.whatYoullSee.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-2">
                            <span className="text-xs font-bold text-stone-900">⭐ Must-Do Highlights</span>
                            <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                              {placeGuide.mustDo.map((item, i) => (
                                <li key={i} className="font-medium text-stone-800">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Specs & Facilities Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5">
                            <span className="text-[10px] font-black uppercase text-stone-500">Duration</span>
                            <div className="font-bold text-stone-900 mt-0.5">{placeGuide.recommendedDuration}</div>
                          </div>
                          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5">
                            <span className="text-[10px] font-black uppercase text-stone-500">Expected Cost</span>
                            <div className="font-bold text-stone-900 mt-0.5">{placeGuide.expectedCost}</div>
                          </div>
                          <div className="rounded-2xl border border-stone-100 bg-stone-50 p-3.5">
                            <span className="text-[10px] font-black uppercase text-stone-500">Restrooms</span>
                            <div className="font-bold text-stone-900 mt-0.5">{placeGuide.facilities.toilets}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* DISNEY RIDES & ATTRACTIONS WITH REAL PICTURES */}
                {/* ========================================================================= */}
                {disneyGuide && (
                  <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
                    <div className="border-b border-stone-100 pb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
                        Attraction Guide with Real Photos
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#1F3A5F]">
                        {disneyGuide.parkName} Headliner Rides & Lands
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">
                        <b>Rope drop strategy:</b> {disneyGuide.ropeDropStrategy}
                      </p>
                    </div>

                    {/* Lands & Rides Grid */}
                    <div className="space-y-6">
                      {disneyGuide.lands.map((land, landIdx) => (
                        <div key={landIdx} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{land.icon}</span>
                            <div>
                              <h5 className="font-serif text-base font-bold text-stone-900">{land.name}</h5>
                              <span className="text-[10px] text-stone-500 font-medium">{land.sub}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {land.rides.map((ride, rideIdx) => (
                              <div
                                key={rideIdx}
                                className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm flex flex-col justify-between hover:shadow-md transition"
                              >
                                <div className="relative h-40 w-full overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={ride.image}
                                    alt={ride.name}
                                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                  />
                                  <div className="absolute top-2 left-2 rounded-md bg-[#1F3A5F] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                                    Tier {ride.tier} {ride.tier === 1 ? "★ Must Ride" : ""}
                                  </div>
                                </div>

                                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <h6 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                                      {ride.name}
                                    </h6>
                                    <p className="text-xs text-stone-600 line-clamp-3 mt-1">
                                      {ride.desc}
                                    </p>
                                  </div>

                                  <div className="pt-2 border-t border-stone-200/60 text-[10px] font-mono text-stone-500 flex items-center justify-between">
                                    <span>{ride.heightRequirement || "No height limit"}</span>
                                    {ride.isHighFall && <span className="text-amber-700 font-bold">⚠️ Drop</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ========================================================================= */}
                    {/* DISNEY DINING WITH RESTAURANT & SIGNATURE MENU PHOTOS */}
                    {/* ========================================================================= */}
                    {relatedRestaurants.length > 0 && (
                      <div className="pt-8 border-t border-stone-200 space-y-4">
                        <div className="border-b border-stone-100 pb-3">
                          <span className="text-xs font-black uppercase tracking-widest text-[#C1802E]">
                            Disney Dining & Signature Menus
                          </span>
                          <h4 className="font-serif text-xl font-bold text-stone-900">
                            Restaurant Ambiance & Actual Food Photos
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {relatedRestaurants.map((rest, restIdx) => (
                            <div
                              key={restIdx}
                              className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 shadow-md flex flex-col justify-between"
                            >
                              <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] font-black uppercase text-[#FF5F93]">
                                    {rest.land}
                                  </span>
                                  <h5 className="font-serif text-base font-bold text-stone-900">
                                    {rest.icon} {rest.name}
                                  </h5>
                                  <span className="text-xs text-stone-500 font-medium">
                                    {rest.cuisine} · {rest.serviceType}
                                  </span>
                                </div>

                                {rest.isPrioritySeating && (
                                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-900 border border-amber-200">
                                    Priority Seating
                                  </span>
                                )}
                              </div>

                              {/* Dual Photos: Restaurant Ambiance + Signature Dish */}
                              <div className="grid grid-cols-2 gap-1 p-2 bg-stone-200/50">
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={rest.image}
                                    alt={`${rest.name} Ambiance`}
                                    className="h-full w-full object-cover"
                                  />
                                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                    Restaurant
                                  </span>
                                </div>

                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={rest.menuImage}
                                    alt={`${rest.name} Signature Menu`}
                                    className="h-full w-full object-cover"
                                  />
                                  <span className="absolute bottom-1 left-1 rounded bg-[#C1502E]/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                    Signature Menu
                                  </span>
                                </div>
                              </div>

                              <div className="p-5 space-y-2">
                                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                                  {rest.desc}
                                </p>
                                <div className="rounded-xl bg-white p-3 border border-stone-200 text-xs">
                                  <span className="font-bold text-stone-900">🍽️ Recommended Menu: </span>
                                  <span className="text-stone-700">{rest.signatureMenu}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* TRANSIT DIRECTIONS MODAL / BOTTOM SHEET */}
      {/* ========================================================================= */}
      {(activeTransitRoute || activeTransitRef) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-[#1F3A5F] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-[#FFD66B]" />
                <div>
                  <h4 className="font-serif text-base font-bold">
                    {activeTransitRoute?.title || activeTransitRef?.title || "Transit Directions"}
                  </h4>
                  <span className="text-xs text-stone-300 font-mono">
                    {activeTransitRoute?.estimatedTime || activeTransitRef?.travelTime} · {activeTransitRoute?.totalFare || activeTransitRef?.fare}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTransitRoute(null);
                  setActiveTransitRef(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Summary Pill */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>Estimated Commute:</span>
                  <span className="text-[#FF5F93]">
                    {activeTransitRoute?.estimatedTime || activeTransitRef?.travelTime}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Fare:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {activeTransitRoute?.totalFare || activeTransitRef?.fare}
                  </span>
                </div>
                {activeTransitRef?.stepSummary && (
                  <p className="text-stone-600 pt-1 border-t border-stone-200 leading-relaxed font-medium">
                    {activeTransitRef.stepSummary}
                  </p>
                )}
              </div>

              {/* Step-by-Step Legs */}
              {activeTransitRoute && activeTransitRoute.legs && (
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                    Step-by-Step Journey
                  </span>
                  <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white">
                    {activeTransitRoute.legs.map((leg, li) => (
                      <div key={li} className="p-3.5 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center font-bold text-[10px]">
                            {leg.step}
                          </span>
                          <span className="font-bold text-stone-900">{leg.title}</span>
                        </div>
                        <p className="text-stone-600 pl-7 leading-relaxed">{leg.detail}</p>
                        <div className="pl-7 flex flex-wrap gap-1 pt-1">
                          {leg.badges.map((b, bi) => (
                            <span
                              key={bi}
                              className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-semibold text-stone-700 border border-stone-200"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {activeTransitRoute?.tips && (
                <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-3.5 text-xs text-stone-700 flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#C1802E] flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{activeTransitRoute.tips}</p>
                </div>
              )}

              {/* 1-Tap Google Maps Link */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Hotel+Plus+Hostel+TOKYO+ASAKUSA+2&destination=${encodeURIComponent(
                  activeTransitRef?.mapQuery || activeTransitRoute?.title || "Tokyo"
                )}&travelmode=transit`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1F3A5F] p-3 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
              >
                <span>Open in Google Maps Transit</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
