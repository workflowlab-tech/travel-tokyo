"use client";

import { useState, useEffect } from "react";

export interface WeatherData {
  high: number;
  low: number;
  currentTemp?: number;
  rainProbability: number;
  condition: string;
  isTyphoonWarning?: boolean;
}

export function useWeather(lat = 35.6762, lng = 139.6503) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTokyoWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia%2FTokyo&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather from Open-Meteo");
        const data = await res.json();

        if (data.daily && data.daily.temperature_2m_max && isMounted) {
          const high = Math.round(data.daily.temperature_2m_max[0]);
          const low = Math.round(data.daily.temperature_2m_min[0]);
          const rain = data.daily.precipitation_probability_max[0] ?? 20;
          const current = data.current?.temperature_2m ? Math.round(data.current.temperature_2m) : high;

          let condition = "Sunny & Warm";
          if (rain > 60) condition = "Rain Expected";
          else if (rain > 30) condition = "Scattered Showers";

          setWeather({
            high,
            low,
            currentTemp: current,
            rainProbability: rain,
            condition,
            isTyphoonWarning: rain >= 80,
          });
        }
      } catch (err) {
        console.warn("Weather fetch fallback:", err);
        if (isMounted) {
          setIsError(true);
          // Sensible seasonal fallback for Tokyo in early September
          setWeather({
            high: 31,
            low: 24,
            currentTemp: 29,
            rainProbability: 25,
            condition: "Typical Sep Weather (Hot & Humid)",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTokyoWeather();

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  return { weather, isLoading, isError };
}
