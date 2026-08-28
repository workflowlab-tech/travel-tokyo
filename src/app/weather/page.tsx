"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tripMeta, itineraryDays } from "../../data/trip-config";
import { Navigation } from "../../components/Navigation";
import { useWeather, DailyForecast } from "../../hooks/useWeather";
import {
  CloudSun,
  ArrowLeft,
  Calendar,
  Clock,
  Droplets,
  Wind,
  Sun,
  Umbrella,
  Thermometer,
  ShieldCheck,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function WeatherPage() {
  const { weather, isLoading } = useWeather(
    tripMeta.homeBase.coordinates.lat,
    tripMeta.homeBase.coordinates.lng
  );

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const days = weather?.days || [];
  const selectedDay: DailyForecast | undefined = days[selectedDayIndex] || days[0];
  const relatedItineraryDay = itineraryDays[selectedDayIndex] || itineraryDays[0];

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#2A2620] pb-28 selection:bg-[#FF5F93] selection:text-white">
      {/* Universal Navigation Header & Persistent Mobile Thumb Dock */}
      <Navigation currentRoute="weather" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-10">
        {/* Section 1 Header */}
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
            {tripMeta.destination} Trip Forecast · {tripMeta.startDate} – {tripMeta.endDate}
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
            Trip Duration Weather & Hourly Signals
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Click any day below to view its detailed hourly temperature curve, rain risk, and clothing advice.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* UPPER PART: 7-DAY TRIP WEATHER CARDS GRID (CLICKABLE) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              const itinDay = itineraryDays[idx];

              return (
                <button
                  key={day.dayIndex}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col justify-between rounded-3xl p-4 text-left transition-all duration-200 border relative ${
                    isSelected
                      ? "bg-[#1F3A5F] text-white shadow-xl ring-4 ring-[#FF5F93]/30 scale-[1.03] border-[#1F3A5F]"
                      : "bg-white text-stone-800 border-stone-200 hover:border-stone-400 hover:shadow-md"
                  }`}
                >
                  {/* Day Badge */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${
                        isSelected ? "text-[#FF86A8]" : "text-stone-500"
                      }`}
                    >
                      Day 0{idx + 1}
                    </span>
                    <span className="text-xl">{day.icon}</span>
                  </div>

                  <div className="my-2">
                    <div className="font-serif text-xs font-bold truncate">
                      {itinDay ? itinDay.title.split("&")[0].split("—")[0] : day.dayName}
                    </div>
                    <div className="text-[10px] font-mono opacity-75">{day.dayName}</div>
                  </div>

                  {/* Temperature & Rain Prob */}
                  <div className="mt-auto pt-2 border-t border-stone-100/30 w-full flex items-baseline justify-between">
                    <div className="font-serif text-lg font-extrabold">
                      {day.high}° <span className="text-xs font-normal opacity-70">/ {day.low}°</span>
                    </div>
                    <div
                      className={`text-[10px] font-bold ${
                        day.rainProbability > 30
                          ? isSelected
                            ? "text-amber-300"
                            : "text-amber-600"
                          : isSelected
                          ? "text-emerald-300"
                          : "text-emerald-600"
                      }`}
                    >
                      {day.rainProbability}% 🌧️
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#FF5F93] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LOWER PART: SELECTED DAY HOURLY DETAIL & TIMELINE ADVICE */}
        {/* ========================================================================= */}
        {selectedDay && (
          <section className="space-y-6 animate-in fade-in duration-200">
            {/* Selected Day Main Banner */}
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#FF5F93] px-2 py-0.5 text-xs font-black tracking-widest text-white">
                      Day 0{selectedDay.dayIndex + 1}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#1F3A5F]">
                      {relatedItineraryDay?.title}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                    {selectedDay.dayName} · {selectedDay.condition}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Location focus: <b>{relatedItineraryDay?.area}</b>
                  </p>
                </div>

                {/* Day Vital Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                    <div className="text-[10px] font-black uppercase text-stone-500">High / Low</div>
                    <div className="font-serif text-xl font-extrabold text-stone-900">
                      {selectedDay.high}°C / {selectedDay.low}°C
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                    <div className="text-[10px] font-black uppercase text-stone-500">Rain Chance</div>
                    <div
                      className={`font-serif text-xl font-extrabold ${
                        selectedDay.rainProbability > 30 ? "text-amber-600" : "text-emerald-600"
                      }`}
                    >
                      {selectedDay.rainProbability}%
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                    <div className="text-[10px] font-black uppercase text-stone-500">UV Index</div>
                    <div className="font-serif text-xl font-extrabold text-stone-900">
                      {selectedDay.uvIndex} <span className="text-xs font-normal text-stone-500">(High)</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-center">
                    <div className="text-[10px] font-black uppercase text-stone-500">Wind</div>
                    <div className="font-serif text-xl font-extrabold text-stone-900">
                      {selectedDay.windSpeed} <span className="text-xs font-normal text-stone-500">km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HOURLY BREAKDOWN CURVE (06:00 to 21:00) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1F3A5F] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#FF5F93]" />
                    Hourly Temperature & Sky Progression
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Tokyo Standard Time (JST)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {selectedDay.hourly.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-center space-y-2 hover:bg-white hover:shadow-sm transition"
                    >
                      <div className="font-mono text-xs font-bold text-stone-600">{h.time}</div>
                      <div className="text-3xl my-1">{h.icon}</div>
                      <div className="font-serif text-xl font-extrabold text-stone-900">
                        {h.temp}°C
                      </div>
                      <div className="text-[11px] font-semibold text-stone-700 truncate">
                        {h.condition}
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                        <span>🌧️ {h.rainProbability}%</span>
                        <span>💧 {h.humidity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clothing & Daily Plan Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-5 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C1802E] flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-amber-600" /> What to Wear & Pack Today
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {selectedDay.clothingAdvice}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-bold text-stone-900">Umbrella:</span>
                    <span
                      className={`font-semibold ${
                        selectedDay.umbrellaNeeded ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {selectedDay.umbrellaNeeded
                        ? "⚠️ Recommended (bring compact umbrella or poncho)"
                        : "✓ Optional (low chance of rain)"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#1F3A5F] flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-[#FF5F93]" />
                      Itinerary Weather Recommendation
                    </span>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                      {selectedDay.rainProbability > 35
                        ? relatedItineraryDay?.weatherAdvice?.rain ||
                          "Consider the covered Rain Plan timeline if showers develop."
                        : relatedItineraryDay?.weatherAdvice?.sun ||
                          "Ideal for outdoor exploration. Front-load outdoor walking before midday heat."}
                    </p>
                  </div>

                  <Link
                    href={`/itinerary#day-${relatedItineraryDay?.dayNumber}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3A5F] hover:text-[#FF5F93] transition pt-2 border-t border-stone-200/60"
                  >
                    <span>View Day {relatedItineraryDay?.dayNumber} Detailed Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
