"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Info,
  Utensils,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

// Every full destination/ride/dining guide already lives, in full, on the
// dedicated /itinerary page under each day. These tabs used to repeat that
// same content a second time here — this map just points each place at the
// day it belongs to, so Home can link out to the one real copy instead.
const placeIdToDay: Record<string, string> = {
  "asakusa-sensoji": "01",
  "tokyo-disneyland": "02",
  "warner-bros-studio": "03",
  "tokyo-disneysea": "04",
  "shibuya-harajuku": "05",
  "akihabara-electric-town": "06",
};

const parkDayNumber: Record<"disneyland" | "disneysea", string> = {
  disneyland: "02",
  disneysea: "04",
};

export const PlacesAndGuides: React.FC = () => {
  const [guideTab, setGuideTab] = useState<
    "destinations" | "rides" | "dining" | "transport" | "etiquette" | "shopping"
  >("destinations");

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

      {/* 1. DESTINATION GUIDES — compact index. The full write-up for each
          place (what you'll see, must-do list, facilities, transit) lives
          once, on its itinerary day at /itinerary — this just points there
          instead of repeating it. */}
      {guideTab === "destinations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {placeGuides.map((place) => (
            <Link
              key={place.id}
              href={`/itinerary#day-${placeIdToDay[place.id] || "01"}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative h-40 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.image}
                  alt={place.name}
                  className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.8] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#132540] via-[#132540]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
                  <div>
                    <span className="rounded-full bg-[#FF5F93] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm">
                      {place.japaneseName}
                    </span>
                    <h3 className="font-serif text-xl font-extrabold text-white mt-1 drop-shadow-md">
                      {place.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 font-mono text-[10px] font-bold text-[#FFD66B] backdrop-blur-md border border-white/20 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {place.recommendedDuration}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {place.tagline}
                </p>
                <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#1F3A5F] group-hover:text-[#FF5F93] transition">
                  Full Guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 2. DISNEY RIDE GUIDE — rope-drop strategy stays here since it's a
          quick, decision-relevant tip; the full ride-by-ride tier list and
          photos live once, on the matching park day at /itinerary. */}
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

          {/* Compact Lands Summary + Link Out */}
          <Link
            href={`/itinerary#day-${parkDayNumber[selectedPark]}`}
            className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md hover:shadow-lg transition"
          >
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1F3A5F]">
                  {currentParkGuide.lands.length} lands ·{" "}
                  {currentParkGuide.lands.reduce((sum, l) => sum + l.rides.length, 0)} attractions
                </h4>
                <p className="mt-1 text-xs text-stone-600">
                  Tier 1 must-rides:{" "}
                  {currentParkGuide.lands
                    .flatMap((l) => l.rides)
                    .filter((r) => r.tier === 1)
                    .map((r) => r.name)
                    .join(" · ")}
                </p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#1F3A5F] px-4 py-2 text-xs font-bold text-white shadow-sm group-hover:bg-[#132540] transition">
                Full Ride Guide <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

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

      {/* 3. DISNEY DINING GUIDE — the Priority Seating tip is quick and
          decision-relevant so it stays; full restaurant photos and menus
          live once, on the matching park day at /itinerary. */}
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

          <Link
            href={`/itinerary#day-${
              diningPark === "disneysea" ? parkDayNumber.disneysea : parkDayNumber.disneyland
            }`}
            className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md hover:shadow-lg transition"
          >
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1F3A5F]">
                  {filteredRestaurants.length} restaurant{filteredRestaurants.length === 1 ? "" : "s"}
                </h4>
                <p className="mt-1 text-xs text-stone-600">
                  {filteredRestaurants.map((r) => r.name).join(" · ")}
                </p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#1F3A5F] px-4 py-2 text-xs font-bold text-white shadow-sm group-hover:bg-[#132540] transition">
                Photos & Menus <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
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
