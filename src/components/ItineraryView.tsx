"use client";

import React, { useState } from "react";
import Link from "next/link";
import { itineraryDays } from "../data/trip-config";
import { Sun, CloudRain, Utensils, Train, CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";

interface ItineraryViewProps {
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  selectedDayIndex,
  setSelectedDayIndex,
}) => {
  const [weatherMode, setWeatherMode] = useState<"sun" | "rain">("sun");

  const currentDay = itineraryDays[selectedDayIndex] || itineraryDays[0];
  const events = weatherMode === "sun" ? currentDay.sunPlan : currentDay.rainPlan;

  return (
    <div className="space-y-6">
      {/* Header & Weather Toggle Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
            7-Day Weather-Adaptive Plan
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
            Choose a day. Switch by the sky.
          </h2>
        </div>

        {/* Sun / Rain Plan Switcher */}
        <div className="inline-flex rounded-full bg-stone-100 p-1 border border-stone-200 shadow-inner">
          <button
            onClick={() => setWeatherMode("sun")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
              weatherMode === "sun"
                ? "bg-[#C1802E] text-white shadow-md"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>☀️ Good Weather</span>
          </button>
          <button
            onClick={() => setWeatherMode("rain")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
              weatherMode === "rain"
                ? "bg-[#2E6E8E] text-white shadow-md"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span>☔ Rain Plan</span>
          </button>
        </div>
      </div>

      {/* PROMINENT DEDICATED ITINERARY PAGE BANNER */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-r from-[#1F3A5F] to-[#132540] p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF86A8]">
            <Sparkles className="h-3.5 w-3.5 text-[#FFD66B]" />
            <span>Full Destination Visual Guides & Disney Menus</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
            Explore photos, ride guides, dining menus & clickable transit.
          </h3>
        </div>

        <Link
          href={`/itinerary#day-${currentDay.dayNumber}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5F93] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#e84e80] transition active:scale-95 flex-shrink-0"
        >
          <span>Open Detailed Itinerary & Guide</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Day Selector Tabs with Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itineraryDays.map((day, idx) => {
          const isActive = selectedDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIndex(idx)}
              className={`group relative flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl px-4 py-3 transition border text-left ${
                isActive
                  ? "border-[#1F3A5F] bg-[#1F3A5F] text-white shadow-lg -translate-y-0.5 ring-2 ring-[#FF5F93]/40"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{day.icon}</span>
                <b className="font-serif text-lg font-black leading-none">{day.dayNumber}</b>
              </div>
              <span className="mt-1.5 text-[10px] font-bold tracking-wider uppercase opacity-80">
                {day.date.split(" · ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Day Card with Rich Real Destination Photography */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Poster Banner with Real Destination Photo Background */}
        <div className="relative min-h-[280px] lg:min-h-[480px] lg:col-span-5 flex flex-col justify-between overflow-hidden p-6 sm:p-8 text-white">
          {/* Real Destination Photography */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentDay.image}
              alt={currentDay.title}
              className="h-full w-full object-cover object-center filter brightness-[0.75] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#132540] via-[#132540]/60 to-[#132540]/30" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-3.5 py-1 font-mono text-xs font-bold text-[#FFD66B] backdrop-blur-md border border-white/20">
                DAY {currentDay.dayNumber} · {currentDay.date}
              </span>
              <span className="text-3xl drop-shadow">{currentDay.icon}</span>
            </div>

            <div className="mt-8 sm:mt-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF86A8] drop-shadow">
                {currentDay.area}
              </span>
              <h3 className="font-serif text-2xl font-extrabold leading-tight text-white sm:text-4xl mt-1 drop-shadow-md">
                {currentDay.title}
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-200 drop-shadow">
              <CheckCircle2 className="h-4 w-4 text-[#FFD66B]" />
              <span>
                {weatherMode === "sun" ? "☀️ Good Weather Strategy" : "☔ Rain Plan Active"}
              </span>
            </div>

            <Link
              href={`/itinerary#day-${currentDay.dayNumber}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FFD66B] hover:underline"
            >
              <span>Full Details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right Content & Timeline */}
        <div className="p-6 sm:p-8 lg:col-span-7 space-y-6">
          {/* Transit Route Note */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900">
                <Train className="h-4 w-4 text-sky-600" />
                <span>Transit & Commute Route</span>
              </div>
              <Link
                href={`/itinerary#day-${currentDay.dayNumber}`}
                className="text-[11px] font-bold text-sky-700 hover:underline"
              >
                Directions & Fares →
              </Link>
            </div>
            <p className="mt-1.5 text-xs text-sky-950 leading-relaxed font-medium">
              {currentDay.transitNote}
            </p>
          </div>

          {/* Hourly Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Timeline Events ({weatherMode === "sun" ? "☀️ Sun Plan" : "☔ Rain Plan"})
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {events.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#FF5F93] shadow-sm ring-4 ring-[#FF5F93]/20" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-[#1F3A5F]">
                      {event.time}
                    </span>
                    {event.badges && (
                      <div className="flex flex-wrap gap-1">
                        {event.badges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700 border border-stone-200/60"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h5 className="font-serif text-base font-bold text-stone-900 mt-0.5">
                    {event.title}
                  </h5>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Food Quest Section */}
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/70 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C1802E]">
              <Utensils className="h-4 w-4 text-[#C1502E]" />
              <span>🍙 Food Quest & Recommended Eats</span>
            </div>
            <p className="mt-1.5 text-xs text-stone-800 leading-relaxed font-medium">
              {currentDay.foodQuest}
            </p>
          </div>

          {/* Weather Advice Footer */}
          {currentDay.weatherAdvice && (
            <p className="text-center text-xs italic text-stone-500 pt-2 border-t border-stone-100">
              💡 {weatherMode === "sun" ? currentDay.weatherAdvice.sun : currentDay.weatherAdvice.rain}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
