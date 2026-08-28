"use client";

import React, { useState } from "react";
import {
  disneyGuides,
  disneyRestaurants,
  transportRoutes,
  etiquetteRules,
  souvenirDistricts,
} from "../data/trip-config";
import {
  RollerCoaster,
  UtensilsCrossed,
  TrainFront,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

export const PlacesAndGuides: React.FC = () => {
  const [guideTab, setGuideTab] = useState<"rides" | "dining" | "transport" | "etiquette" | "shopping">(
    "rides"
  );
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
      {/* Guides Section Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
          Trip Knowledge & Destination Guides
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Everything you need on the ground.
        </h2>
      </div>

      {/* Guide Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setGuideTab("rides")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            guideTab === "rides"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
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
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
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
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
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
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
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
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <ShoppingBag className="h-4 w-4 text-[#FFD66B]" />
          <span>Souvenirs & Shopping</span>
        </button>
      </div>

      {/* 1. DISNEY RIDE GUIDE */}
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

      {/* 2. DISNEY DINING GUIDE */}
      {guideTab === "dining" && (
        <div className="space-y-6">
          {/* Park Filter */}
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

          {/* Dining Tip Box */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-950 leading-relaxed">
            <b>Priority Seating (PS) Tip:</b> Priority Seating opens 1 month ahead at 10:00 AM on the official app, and same-day slots open at 9:00 AM. For quick meals without reservations, Hungry Bear (Disneyland) and Casbah Food Court (DisneySea) have 600+ seats and fast turnaround.
          </div>

          {/* Restaurant Cards */}
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

      {/* 3. TRANSPORT DIRECTIONS */}
      {guideTab === "transport" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-4 text-xs text-stone-800 leading-relaxed font-medium">
            💳 <b>Transit Tip:</b> Use digital Suica / PASMO in Apple Wallet or Google Wallet. Tap on and tap off at all gates; fares are deducted automatically. Narita Access Express and Ginza Line run directly from your Asakusa base.
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

      {/* 4. MANNERS & ETIQUETTE */}
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
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
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

      {/* 5. SOUVENIRS & SHOPPING */}
      {guideTab === "shopping" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-200 bg-[#FBF0DC]/80 p-4 text-xs text-stone-800 leading-relaxed">
            🛍️ <b>Tax-Free Shopping Note:</b> Spend at least <b>¥5,000 pre-tax</b> at one store on the same day (e.g. Don Quijote, Yodobashi, department stores) and present your physical passport with entry stamp at checkout for instant 10% tax exemption.
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
