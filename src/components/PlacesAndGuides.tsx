"use client";

import React, { useState } from "react";
import {
  placeGuides,
  disneyGuides,
  disneyRestaurants,
  transportRoutes,
  etiquetteRules,
  souvenirDistricts,
} from "../data/trip-config";
import {
  MapPin,
  RollerCoaster,
  UtensilsCrossed,
  TrainFront,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  DollarSign,
  Utensils,
  Footprints,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const PlacesAndGuides: React.FC = () => {
  const [guideTab, setGuideTab] = useState<
    "destinations" | "rides" | "dining" | "transport" | "etiquette" | "shopping"
  >("destinations");

  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>("asakusa-sensoji");
  const [selectedPark, setSelectedPark] = useState<"disneyland" | "disneysea">("disneyland");
  const [diningPark, setDiningPark] = useState<"all" | "disneyland" | "disneysea">("all");

  const currentParkGuide = disneyGuides.find((g) => g.parkId === selectedPark) || disneyGuides[0];

  const filteredRestaurants = disneyRestaurants.filter((resto) => {
    if (diningPark === "disneyland") return resto.land.includes("Disneyland");
    if (diningPark === "disneysea") return resto.land.includes("DisneySea");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
          Curated Destination & Travel Guides
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Everything you need on the ground.
        </h2>
      </div>

      {/* Guide Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setGuideTab("destinations")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "destinations"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <MapPin className="h-4 w-4 text-[#FFD66B]" />
          <span>Destination Guides ({placeGuides.length})</span>
        </button>

        <button
          onClick={() => setGuideTab("rides")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "rides"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <RollerCoaster className="h-4 w-4 text-[#FFD66B]" />
          <span>Disney Ride Guide</span>
        </button>

        <button
          onClick={() => setGuideTab("dining")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "dining"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <UtensilsCrossed className="h-4 w-4 text-[#FFD66B]" />
          <span>Disney Dining</span>
        </button>

        <button
          onClick={() => setGuideTab("transport")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "transport"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <TrainFront className="h-4 w-4 text-[#FFD66B]" />
          <span>Transit Directions</span>
        </button>

        <button
          onClick={() => setGuideTab("etiquette")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "etiquette"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#FFD66B]" />
          <span>Manners & Etiquette</span>
        </button>

        <button
          onClick={() => setGuideTab("shopping")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "shopping"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <ShoppingBag className="h-4 w-4 text-[#FFD66B]" />
          <span>Souvenirs & Shopping</span>
        </button>
      </div>

      {/* 1. COMPREHENSIVE DESTINATION GUIDES WITH REAL PHOTOGRAPHY */}
      {guideTab === "destinations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {placeGuides.map((place) => {
              const isExpanded = expandedPlaceId === place.id;
              return (
                <div
                  key={place.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg transition-all"
                >
                  {/* Destination Card Header with Real Photo Banner */}
                  <div className="relative min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-8 text-white overflow-hidden">
                    {/* Real Destination Photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={place.image}
                      alt={place.name}
                      className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.75] transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#132540] via-[#132540]/60 to-transparent" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#FF5F93] px-3 py-0.5 font-mono text-[11px] font-bold text-white shadow-sm">
                            {place.japaneseName}
                          </span>
                          <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-semibold text-stone-200 backdrop-blur-md">
                            {place.district}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1.5 drop-shadow-md">
                          {place.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1 max-w-xl drop-shadow">
                          {place.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 font-mono text-xs font-bold text-[#FFD66B] backdrop-blur-md border border-white/20">
                          <Clock className="h-3.5 w-3.5" />
                          {place.recommendedDuration}
                        </span>
                        <button
                          onClick={() => setExpandedPlaceId(isExpanded ? null : place.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1F3A5F] shadow-md hover:bg-stone-100 transition"
                        >
                          <span>{isExpanded ? "Collapse Guide" : "Open Guide"}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Guide Details */}
                  {isExpanded && (
                    <div className="p-6 sm:p-8 space-y-6 border-t border-stone-200 bg-[#FBF8F0]/40">
                      {/* Grid: What You'll See + Suggested Sequence */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* What You'll See */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                          <h4 className="font-serif text-base font-bold text-[#1F3A5F] flex items-center gap-2">
                            <span>👀</span> What You&apos;ll See & Experience
                          </h4>
                          <ul className="space-y-2 text-xs text-stone-700 leading-relaxed font-medium">
                            {place.whatYoullSee.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#FF5F93] font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Suggested Sequence */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
                          <h4 className="font-serif text-base font-bold text-[#1F3A5F] flex items-center gap-2">
                            <Footprints className="h-4 w-4 text-[#C1802E]" /> Suggested Sequence
                          </h4>
                          <div className="space-y-2 text-xs text-stone-700 leading-relaxed font-medium">
                            {place.suggestedSequence.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="font-mono font-bold text-[#C1802E]">{idx + 1}.</span>
                                <span>{step.replace(/^[0-9]+\.\s*/, "")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Must-Do vs Optional / Skippable */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Must-Do */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Must-Do Highlights
                          </span>
                          <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                            {place.mustDo.map((must, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{must}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Optional / Skippable */}
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Info className="h-4 w-4 text-amber-600" /> Optional / Skippable
                          </span>
                          <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                            {place.optionalOrSkippable.map((opt, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-600 font-bold">~</span>
                                <span>{opt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Practical Ground Specs: Cost, Food, Facilities, Weather, Transit */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cost & Food */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-sm">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-stone-700" /> Expected Cost
                            </span>
                            <p className="mt-1 text-xs text-stone-800 font-medium leading-relaxed">
                              {place.expectedCost}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-stone-100">
                            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 flex items-center gap-1">
                              <Utensils className="h-3.5 w-3.5 text-[#C1502E]" /> Food Nearby
                            </span>
                            <p className="mt-1 text-xs text-stone-800 font-medium leading-relaxed">
                              {place.foodNearby}
                            </p>
                          </div>
                        </div>

                        {/* Facilities & Accessibility */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2 shadow-sm text-xs">
                          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                            🚻 Facilities & Lockers
                          </span>
                          <p className="text-stone-700 font-medium">
                            <b>Toilets:</b> {place.facilities.toilets}
                          </p>
                          <p className="text-stone-700 font-medium">
                            <b>Lockers:</b> {place.facilities.lockers}
                          </p>
                          {place.facilities.accessibility && (
                            <p className="text-stone-700 font-medium">
                              <b>Access:</b> {place.facilities.accessibility}
                            </p>
                          )}
                        </div>

                        {/* Weather Suitability */}
                        <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-2 shadow-sm text-xs">
                          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                            🌤️ Weather Suitability
                          </span>
                          <p className="text-stone-700 font-medium">
                            <b>☀️ Sun:</b> {place.weatherSuitability.sunAdvice}
                          </p>
                          <p className="text-stone-700 font-medium">
                            <b>☔ Rain:</b> {place.weatherSuitability.rainAdvice}
                          </p>
                        </div>
                      </div>

                      {/* Transit From Base Hotel */}
                      <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-sky-900 uppercase tracking-wider text-[11px]">
                            🚆 Transit from Asakusa Base:
                          </span>
                          <p className="mt-0.5 text-sky-950 font-medium">
                            {place.transitFromBase.route} (Exit: <b>{place.transitFromBase.exit}</b>)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="rounded-md bg-white px-2.5 py-1 font-mono font-bold text-sky-900 border border-sky-200">
                            {place.transitFromBase.time}
                          </span>
                          <span className="rounded-md bg-amber-100 px-2.5 py-1 font-mono font-bold text-amber-900 border border-amber-200">
                            {place.transitFromBase.fare}
                          </span>
                        </div>
                      </div>

                      {/* Next Destination Hint */}
                      {place.nextDestinationHint && (
                        <div className="text-right text-xs font-bold text-stone-500 flex items-center justify-end gap-1.5">
                          <span>Next suggested stop:</span>
                          <span className="text-[#FF5F93]">{place.nextDestinationHint}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#FF5F93]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DISNEY RIDE GUIDE */}
      {guideTab === "rides" && (
        <div className="space-y-6">
          {/* Park Selector */}
          <div className="flex items-center gap-2 rounded-2xl bg-stone-100 p-1.5 max-w-md border border-stone-200">
            <button
              onClick={() => setSelectedPark("disneyland")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                selectedPark === "disneyland"
                  ? "bg-[#1F3A5F] text-white shadow-md"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              🏰 Tokyo Disneyland (Sep 2)
            </button>
            <button
              onClick={() => setSelectedPark("disneysea")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                selectedPark === "disneysea"
                  ? "bg-[#1F3A5F] text-white shadow-md"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              🌊 Tokyo DisneySea (Sep 4)
            </button>
          </div>

          {/* Rope Drop Card */}
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C1802E] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Official Rope Drop Strategy ({currentParkGuide.dateStr})
            </h4>
            <p className="mt-1.5 text-sm text-stone-800 font-medium leading-relaxed">
              {currentParkGuide.ropeDropStrategy}
            </p>
          </div>

          {/* Lands & Rides List */}
          <div className="space-y-6">
            {currentParkGuide.lands.map((land, lIdx) => (
              <div key={lIdx} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{land.icon}</span>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#1F3A5F]">{land.name}</h4>
                      <p className="text-xs text-stone-500 font-mono">{land.sub}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-stone-400">
                    {land.rides.length} attractions
                  </span>
                </div>

                <div className="divide-y divide-stone-100">
                  {land.rides.map((ride, rIdx) => (
                    <div key={rIdx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:bg-stone-50/50 transition">
                      <div className="flex items-center gap-2 sm:flex-col sm:items-center">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                            ride.tier === 1
                              ? "bg-[#1F3A5F] text-white"
                              : ride.tier === 2
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          T{ride.tier}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 hidden sm:inline">
                          Tier {ride.tier}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-serif text-base font-bold text-stone-900">
                            {ride.name}
                          </h5>
                          {ride.heightRequirement && (
                            <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                              {ride.heightRequirement}
                            </span>
                          )}
                          {ride.isHighFall && (
                            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                              <AlertTriangle className="h-3 w-3" /> High Fall
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                          {ride.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Parades & Shows */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md p-5 sm:p-6">
            <h4 className="font-serif text-lg font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <span>🎉</span> Parades & Night Spectaculars
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentParkGuide.shows.map((show, sIdx) => (
                <div key={sIdx} className="rounded-xl border border-stone-200 bg-stone-50 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{show.icon}</span>
                      <span className="rounded-md bg-stone-200 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700">
                        {show.schedule}
                      </span>
                    </div>
                    <h5 className="font-serif text-base font-bold text-stone-900 mt-2">
                      {show.name}
                    </h5>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      {show.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DISNEY DINING GUIDE */}
      {guideTab === "dining" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 rounded-2xl bg-stone-100 p-1.5 max-w-md border border-stone-200">
            <button
              onClick={() => setDiningPark("all")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                diningPark === "all" ? "bg-[#1F3A5F] text-white shadow-md" : "text-stone-700"
              }`}
            >
              All Restaurants
            </button>
            <button
              onClick={() => setDiningPark("disneyland")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                diningPark === "disneyland" ? "bg-[#1F3A5F] text-white shadow-md" : "text-stone-700"
              }`}
            >
              Disneyland Only
            </button>
            <button
              onClick={() => setDiningPark("disneysea")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                diningPark === "disneysea" ? "bg-[#1F3A5F] text-white shadow-md" : "text-stone-700"
              }`}
            >
              DisneySea Only
            </button>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-950 leading-relaxed">
            <b>Priority Seating (PS) Tip:</b> Priority Seating opens 1 month ahead at 10:00 AM on the official Tokyo Disney Resort app, with same-day booking slots opening at 9:00 AM. For delicious meals without reservations, Hungry Bear (Disneyland) and Casbah Food Court (DisneySea) offer quick seating and fast turnaround.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRestaurants.map((resto, rIdx) => (
              <div key={rIdx} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{resto.icon}</span>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-stone-900">{resto.name}</h4>
                        <span className="text-[11px] font-mono text-stone-500">{resto.land}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-700">
                      {resto.serviceType}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">{resto.desc}</p>
                </div>

                <div className="rounded-lg bg-stone-50 p-2.5 border border-stone-100 text-xs">
                  <span className="font-bold text-[#C1502E]">Signature Menu: </span>
                  <span className="text-stone-700">{resto.signatureMenu}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TRANSIT DIRECTIONS */}
      {guideTab === "transport" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-4 text-xs text-stone-800 leading-relaxed font-medium">
            💳 <b>Transit Tip:</b> Tap on and tap off with digital Suica / PASMO in Apple Wallet or Google Wallet at all ticket gates. Narita Access Express and Ginza Line run directly from your Asakusa base.
          </div>

          <div className="space-y-6">
            {transportRoutes.map((route) => (
              <div key={route.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md">
                <div className="bg-stone-50 px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{route.icon}</span>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#1F3A5F]">{route.title}</h4>
                      <p className="text-xs text-stone-500 font-mono">{route.dateOrFrequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-stone-200 px-2.5 py-1 font-mono text-xs font-bold text-stone-800">
                      {route.estimatedTime}
                    </span>
                    <span className="rounded-md bg-amber-100 px-2.5 py-1 font-mono text-xs font-bold text-[#8B5E14]">
                      {route.totalFare}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                    {route.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="relative">
                        <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#1F3A5F] shadow-sm ring-4 ring-[#1F3A5F]/20" />
                        <h5 className="font-serif text-sm font-bold text-stone-900">{leg.title}</h5>
                        <p className="mt-0.5 text-xs text-stone-600 leading-relaxed">{leg.detail}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {leg.badges.map((badge, bIdx) => (
                            <span key={bIdx} className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {route.tips && (
                    <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs text-stone-600 italic">
                      💡 {route.tips}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MANNERS & ETIQUETTE */}
      {guideTab === "etiquette" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {etiquetteRules.map((rule, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-5 shadow-sm flex items-start gap-3.5 ${
                  rule.type === "do"
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-red-200 bg-red-50/40"
                }`}
              >
                {rule.type === "do" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-900 leading-snug">
                    {rule.title}
                  </h4>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SOUVENIRS & SHOPPING */}
      {guideTab === "shopping" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-4 text-xs text-stone-800 leading-relaxed">
            🛍️ <b>Tax-Free Shopping Note:</b> Spend at least <b>¥5,000 pre-tax</b> at one store on the same day (Don Quijote, Yodobashi, department stores) and present your physical passport with entry stamp at checkout for instant 10% tax exemption.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {souvenirDistricts.map((dist, idx) => (
              <div key={idx} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{dist.icon}</span>
                    <h4 className="font-serif text-lg font-bold text-[#1F3A5F]">{dist.district}</h4>
                  </div>
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-xs text-stone-600 font-bold">
                    {dist.dayRef}
                  </span>
                </div>

                <div className="space-y-3">
                  {dist.shops.map((shop, sIdx) => (
                    <div key={sIdx} className="rounded-xl bg-stone-50 p-3 border border-stone-100 text-xs">
                      <h5 className="font-bold text-stone-900">{shop.name}</h5>
                      <p className="text-stone-600 mt-0.5">{shop.desc}</p>
                      <div className="mt-1.5 text-stone-800 font-medium">
                        <span className="text-[#C1502E] font-bold">What to buy: </span>
                        {shop.whatToBuy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
