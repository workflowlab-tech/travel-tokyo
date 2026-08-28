"use client";

import React, { useState } from "react";
import { tripMeta, itineraryDays } from "../data/trip-config";
import { useWeather } from "../hooks/useWeather";
import { useFXRate } from "../hooks/useFXRate";
import { CloudSun, ArrowRightLeft, MapPin, ExternalLink, Sparkles } from "lucide-react";

interface TodaySignalCardsProps {
  currentDayIndex: number;
  onOpenItinerary: () => void;
}

export const TodaySignalCards: React.FC<TodaySignalCardsProps> = ({ currentDayIndex, onOpenItinerary }) => {
  const currentDay = itineraryDays[currentDayIndex] || itineraryDays[0];
  const firstEvent = currentDay.sunPlan[0] || { time: "08:00", title: "Trip Day Start", desc: "Check timeline" };

  const { weather, isLoading: weatherLoading } = useWeather(
    tripMeta.homeBase.coordinates.lat,
    tripMeta.homeBase.coordinates.lng
  );

  const { rate: fxRate, isLoading: fxLoading } = useFXRate(
    tripMeta.defaultCurrencies.homeCurrency,
    tripMeta.defaultCurrencies.destCurrency
  );

  const [convertAmount, setConvertAmount] = useState<string>("1000");

  const numericAmount = parseFloat(convertAmount) || 0;
  const convertedJPY = fxRate ? Math.round(numericAmount * fxRate) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. UP NEXT / TODAY'S FEATURE CARD */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F3A5F] to-[#132540] p-6 text-white shadow-lg border border-white/10">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF86A8]">
            <Sparkles className="h-3.5 w-3.5" /> Up Next · {currentDay.shortDate}
          </span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs text-[#FFD66B] border border-white/15">
            {firstEvent.time}
          </span>
        </div>

        <div className="my-4">
          <h3 className="font-serif text-xl font-bold leading-snug sm:text-2xl text-white">
            {firstEvent.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-300 line-clamp-3">
            {firstEvent.desc}
          </p>
        </div>

        <button
          onClick={onOpenItinerary}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#FF86A8] transition hover:text-white pt-2 border-t border-white/10"
        >
          <span>View Day {currentDay.dayNumber} Timeline</span>
          <span>→</span>
        </button>
      </div>

      {/* 2. TOKYO NOW (LIVE WEATHER VIA OPEN-METEO) */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F3A5F]">
            Tokyo Weather
          </span>
          <CloudSun className="h-4 w-4 text-amber-500" />
        </div>

        <div className="my-3">
          {weatherLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 w-16 rounded bg-stone-200" />
              <div className="h-4 w-28 rounded bg-stone-200" />
            </div>
          ) : weather ? (
            <>
              <div className="flex items-baseline gap-2">
                <strong className="font-serif text-3xl font-extrabold text-stone-900 sm:text-4xl">
                  {weather.currentTemp ?? weather.high}°C
                </strong>
                <span className="text-xs text-stone-500 font-medium">
                  {weather.high}° / {weather.low}°
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-stone-700">
                {weather.condition} · {weather.rainProbability}% rain chance
              </p>
            </>
          ) : (
            <div>
              <strong className="font-serif text-3xl font-bold text-stone-900">31°C</strong>
              <p className="text-xs text-stone-500">Early Sept typical: 30° / 24°</p>
            </div>
          )}
        </div>

        <p className="mt-auto text-[11px] text-stone-500 border-t border-stone-100 pt-2">
          Toggle Sun/Rain plan in itinerary as skies change.
        </p>
      </div>

      {/* 3. CURRENCY CONVERTER (PHP ⇄ JPY / LIVE FX) */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F3A5F]">
            {tripMeta.defaultCurrencies.homeCurrency} ⇄ {tripMeta.defaultCurrencies.destCurrency}
          </span>
          <ArrowRightLeft className="h-4 w-4 text-[#C1802E]" />
        </div>

        <div className="my-2">
          <div className="text-xs text-stone-500 font-medium">
            {fxLoading ? "Loading rate..." : `1 ₱ ≈ ${fxRate ? fxRate.toFixed(2) : "2.70"} ¥`}
          </div>
          <div className="mt-1 font-serif text-2xl font-extrabold text-stone-900 sm:text-3xl">
            ¥ {convertedJPY.toLocaleString()}
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-stone-100">
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 focus-within:border-[#1F3A5F] focus-within:ring-1 focus-within:ring-[#1F3A5F]">
            <span className="text-xs font-bold text-stone-500">₱</span>
            <input
              type="text"
              inputMode="decimal"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="1000"
              className="ml-2 w-full bg-transparent text-sm font-bold text-stone-900 outline-none"
              aria-label="Convert currency amount"
            />
          </div>
        </div>
      </div>

      {/* 4. HOME BASE / HOTEL CARD */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-amber-200 bg-[#FBF0DC]/80 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#C1802E]">
            Home Base · Asakusa
          </span>
          <MapPin className="h-4 w-4 text-[#C1502E]" />
        </div>

        <div className="my-3">
          <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
            {tripMeta.homeBase.name}
          </h3>
          <p className="mt-1 text-xs text-stone-600 font-mono">
            {tripMeta.homeBase.japaneseAddress}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {tripMeta.homeBase.amenities.slice(0, 2).map((amenity, i) => (
              <span key={i} className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-[#8B5E14] border border-amber-200/60">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${tripMeta.homeBase.mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-[#C1502E] hover:underline pt-2 border-t border-amber-200/60"
        >
          <span>Open Google Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
