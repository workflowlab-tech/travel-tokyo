"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tripMeta, itineraryDays } from "../data/trip-config";
import { useWeather } from "../hooks/useWeather";
import { useFXRate } from "../hooks/useFXRate";
import { CloudSun, ArrowRightLeft, MapPin, ExternalLink, Sparkles, ArrowRight, Navigation as NavIcon, PlusCircle } from "lucide-react";

interface TodaySignalCardsProps {
  currentDayIndex: number;
  onOpenItinerary: () => void;
}

export const TodaySignalCards: React.FC<TodaySignalCardsProps> = ({ currentDayIndex }) => {
  const currentDay = itineraryDays[currentDayIndex] || itineraryDays[0];

  // Time-aware event detection in Tokyo timezone
  const getUpcomingEvent = () => {
    try {
      const tokyoTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
      const tokyoNow = new Date(tokyoTimeStr);
      const currentMinutes = tokyoNow.getHours() * 60 + tokyoNow.getMinutes();

      const events = currentDay.sunPlan;
      if (!events || events.length === 0) return { event: null, label: "Day Agenda" };

      for (const ev of events) {
        const [h, m] = ev.time.split(":").map(Number);
        if (!isNaN(h)) {
          const evMinutes = h * 60 + (m || 0);
          if (evMinutes >= currentMinutes) {
            const diffMins = evMinutes - currentMinutes;
            const timeLabel = diffMins > 60 ? `in ${Math.floor(diffMins / 60)}h ${diffMins % 60}m` : `in ${diffMins}m`;
            return { event: ev, label: `Up Next · ${timeLabel}` };
          }
        }
      }
      return { event: events[events.length - 1], label: "Evening Wrap" };
    } catch {
      return { event: currentDay.sunPlan[0], label: "Today's Agenda" };
    }
  };

  const { event: activeEvent, label: eventStatusLabel } = getUpcomingEvent();
  const displayEvent = activeEvent || currentDay.sunPlan[0] || { time: "08:00", title: "Trip Day Start", desc: "Check timeline" };

  const { weather, isLoading: weatherLoading } = useWeather(
    tripMeta.homeBase.coordinates.lat,
    tripMeta.homeBase.coordinates.lng,
    tripMeta.startDate,
    tripMeta.endDate
  );

  const homeCurrency = tripMeta.defaultCurrencies.homeCurrency;
  const destCurrency = tripMeta.defaultCurrencies.destCurrency;
  const homeSymbol = tripMeta.defaultCurrencies.homeSymbol || "₱";
  const destSymbol = tripMeta.defaultCurrencies.destSymbol || "¥";

  const { rate: fxRate, isLoading: fxLoading } = useFXRate(
    homeCurrency,
    destCurrency
  );

  const [convertAmount, setConvertAmount] = useState<string>("1000");

  const numericAmount = parseFloat(convertAmount) || 0;
  const convertedDest = fxRate ? Math.round(numericAmount * fxRate) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. UP NEXT / TODAY'S FEATURE CARD (TIME-AWARE) */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F3A5F] to-[#132540] p-6 text-white shadow-lg border border-white/10">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF86A8]">
            <Sparkles className="h-3.5 w-3.5" /> {eventStatusLabel}
          </span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs text-[#FFD66B] border border-white/15">
            {displayEvent.time}
          </span>
        </div>

        <div className="my-3">
          <h3 className="font-serif text-xl font-bold leading-snug text-white">
            {displayEvent.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-300 line-clamp-2">
            {displayEvent.desc}
          </p>

          {displayEvent.transit?.mapQuery && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayEvent.transit.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-[#FFD66B] hover:bg-white/20 transition border border-white/15"
            >
              <NavIcon className="h-3 w-3" />
              <span>Route: {displayEvent.transit.title}</span>
            </a>
          )}
        </div>

        <Link
          href={`/itinerary#day-${currentDay.dayNumber}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#FF86A8] transition hover:text-white pt-2 border-t border-white/10"
        >
          <span>Open Day {currentDay.dayNumber} Timeline & Guides</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. LIVE DESTINATION WEATHER */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F3A5F]">
            {tripMeta.destination.split(",")[0]} Weather
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
                {weather.condition} · {weather.rainProbability}% rain
              </p>
            </>
          ) : (
            <div>
              <strong className="font-serif text-3xl font-bold text-stone-900">31°C</strong>
              <p className="text-xs text-stone-500">Typical: 30° / 24°</p>
            </div>
          )}
        </div>

        <Link
          href="/weather"
          className="mt-auto inline-flex items-center justify-between text-xs font-bold text-[#1F3A5F] hover:text-[#FF5F93] border-t border-stone-100 pt-2 transition"
        >
          <span>7-Day & Hourly Forecast</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3. CURRENCY CONVERTER & QUICK LOG (PARAMETERIZED) */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F3A5F]">
            {homeCurrency} ⇄ {destCurrency}
          </span>
          <ArrowRightLeft className="h-4 w-4 text-[#C1802E]" />
        </div>

        <div className="my-2">
          <div className="text-xs text-stone-500 font-medium">
            {fxLoading ? "Loading rate..." : `1 ${homeSymbol} ≈ ${fxRate ? fxRate.toFixed(2) : "2.70"} ${destSymbol}`}
          </div>
          <div className="mt-1 font-serif text-2xl font-extrabold text-stone-900 sm:text-3xl">
            {destSymbol} {convertedDest.toLocaleString()}
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-stone-100 flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 focus-within:border-[#1F3A5F] focus-within:ring-1 focus-within:ring-[#1F3A5F]">
            <span className="text-xs font-bold text-stone-500">{homeSymbol}</span>
            <input
              type="text"
              inputMode="decimal"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="1000"
              className="ml-1.5 w-full bg-transparent text-xs font-bold text-stone-900 outline-none"
              aria-label="Convert currency amount"
            />
          </div>

          <Link
            href="/budget"
            className="inline-flex items-center gap-1 rounded-xl bg-[#FF5F93] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#ff4481] transition"
            title="Record an expense"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Spend</span>
          </Link>
        </div>
      </div>

      {/* 4. HOME BASE / HOTEL CARD */}
      <div className="relative flex flex-col justify-between rounded-3xl border border-amber-200 bg-[#FBF0DC]/80 p-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#C1802E]">
            Home Base Hotel
          </span>
          <MapPin className="h-4 w-4 text-[#C1502E]" />
        </div>

        <div className="my-3">
          <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
            {tripMeta.homeBase.name}
          </h3>
          <p className="mt-1 text-xs text-stone-600 font-mono line-clamp-1">
            {tripMeta.homeBase.japaneseAddress}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded-md bg-stone-900 px-2 py-0.5 text-[10px] font-bold text-white">
              {tripMeta.homeBase.bookingPlatform} #{tripMeta.homeBase.bookingId}
            </span>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-[#8B5E14] border border-amber-200/60">
              {destSymbol}{tripMeta.homeBase.totalCostJPY.toLocaleString()}
            </span>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tripMeta.homeBase.mapQuery)}`}
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

