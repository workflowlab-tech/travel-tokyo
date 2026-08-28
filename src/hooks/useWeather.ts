"use client";

import { useState, useEffect } from "react";

export interface HourlyForecast {
  time: string; // "06:00", "09:00", etc.
  temp: number;
  rainProbability: number;
  humidity: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  dayIndex: number;
  dateStr: string; // "2026-09-01"
  dayName: string; // "Tue, Sep 1"
  shortDay: string; // "Day 1"
  high: number;
  low: number;
  rainProbability: number;
  condition: string;
  icon: string;
  uvIndex: number;
  windSpeed: number; // km/h
  clothingAdvice: string;
  umbrellaNeeded: boolean;
  hourly: HourlyForecast[];
}

export interface WeatherData {
  high: number;
  low: number;
  currentTemp?: number;
  rainProbability: number;
  condition: string;
  isTyphoonWarning?: boolean;
  humidity?: number;
  days: DailyForecast[];
}

function getWeatherCondition(code: number, rainProb: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear Sky", icon: "☀️" };
  if (code === 1 || code === 2) return { condition: "Mainly Clear / Partly Cloudy", icon: "🌤️" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if (code >= 51 && code <= 55) return { condition: "Light Drizzle", icon: "🌦️" };
  if (code >= 61 && code <= 65) return { condition: "Rain Showers", icon: "🌧️" };
  if (code >= 80 && code <= 82) return { condition: "Heavy Rain / Downpours", icon: "⛈️" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "⚡" };
  if (rainProb > 50) return { condition: "Rain Expected", icon: "🌧️" };
  if (rainProb > 25) return { condition: "Scattered Clouds", icon: "⛅" };
  return { condition: "Sunny & Pleasant", icon: "☀️" };
}

// September Historical Baseline Fallback for Tokyo
const fallbackDays: DailyForecast[] = [
  {
    dayIndex: 0,
    dateStr: "2026-09-01",
    dayName: "Tue · Sep 1",
    shortDay: "Day 01 (Arrival & Asakusa)",
    high: 31,
    low: 24,
    rainProbability: 20,
    condition: "Sunny & Humid",
    icon: "☀️",
    uvIndex: 8,
    windSpeed: 14,
    clothingAdvice: "Light breathable cotton, sunglasses, sunscreen. Mild evening breeze along Sumida River.",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 24, rainProbability: 10, humidity: 82, condition: "Clear", icon: "🌅" },
      { time: "09:00", temp: 28, rainProbability: 15, humidity: 74, condition: "Sunny", icon: "☀️" },
      { time: "12:00", temp: 31, rainProbability: 20, humidity: 65, condition: "Hot & Sunny", icon: "☀️" },
      { time: "15:00", temp: 30, rainProbability: 20, humidity: 68, condition: "Warm Breeze", icon: "🌤️" },
      { time: "18:00", temp: 27, rainProbability: 15, humidity: 75, condition: "Golden Hour", icon: "🌇" },
      { time: "21:00", temp: 25, rainProbability: 10, humidity: 80, condition: "Pleasant", icon: "🌙" },
    ],
  },
  {
    dayIndex: 1,
    dateStr: "2026-09-02",
    dayName: "Wed · Sep 2",
    shortDay: "Day 02 (Tokyo Disneyland)",
    high: 32,
    low: 25,
    rainProbability: 25,
    condition: "Sunny & Very Warm",
    icon: "🏰",
    uvIndex: 9,
    windSpeed: 16,
    clothingAdvice: "Sun hat, portable fan, cooling wipes, extra electrolyte drink from Maihama station.",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 25, rainProbability: 15, humidity: 80, condition: "Mild", icon: "🌅" },
      { time: "09:00", temp: 29, rainProbability: 20, humidity: 70, condition: "Sunny Rope Drop", icon: "☀️" },
      { time: "12:00", temp: 32, rainProbability: 25, humidity: 62, condition: "Peak Sun & Heat", icon: "☀️" },
      { time: "15:00", temp: 31, rainProbability: 25, humidity: 66, condition: "Warm Afternoon", icon: "🌤️" },
      { time: "18:00", temp: 28, rainProbability: 20, humidity: 72, condition: "Parade Twilight", icon: "🌇" },
      { time: "21:00", temp: 26, rainProbability: 15, humidity: 78, condition: "Castle Fireworks", icon: "✨" },
    ],
  },
  {
    dayIndex: 2,
    dateStr: "2026-09-03",
    dayName: "Thu · Sep 3",
    shortDay: "Day 03 (Harry Potter Tour)",
    high: 29,
    low: 23,
    rainProbability: 35,
    condition: "Partly Cloudy / 100% Indoor Tour",
    icon: "🪄",
    uvIndex: 6,
    windSpeed: 12,
    clothingAdvice: "Light indoor cardigan for Studio Tour air conditioning. Perfect rest day.",
    umbrellaNeeded: true,
    hourly: [
      { time: "06:00", temp: 23, rainProbability: 20, humidity: 85, condition: "Overcast", icon: "☁️" },
      { time: "09:00", temp: 26, rainProbability: 25, humidity: 78, condition: "Rest Morning", icon: "🌤️" },
      { time: "12:00", temp: 29, rainProbability: 35, humidity: 70, condition: "Warm / Lunch", icon: "⛅" },
      { time: "15:00", temp: 28, rainProbability: 35, humidity: 72, condition: "A/C Studio Tour", icon: "🪄" },
      { time: "18:00", temp: 26, rainProbability: 30, humidity: 76, condition: "Cooling Evening", icon: "🌇" },
      { time: "21:00", temp: 24, rainProbability: 20, humidity: 82, condition: "Hotel Sento Bath", icon: "♨️" },
    ],
  },
  {
    dayIndex: 3,
    dateStr: "2026-09-04",
    dayName: "Fri · Sep 4",
    shortDay: "Day 04 (Tokyo DisneySea)",
    high: 30,
    low: 24,
    rainProbability: 30,
    condition: "Bay Breeze / Fantasy Springs",
    icon: "🌊",
    uvIndex: 8,
    windSpeed: 20,
    clothingAdvice: "Comfortable water-resistant sneakers. Ocean harbor breeze in Mediterranean Harbor.",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 24, rainProbability: 20, humidity: 82, condition: "Harbor Dawn", icon: "🌅" },
      { time: "09:00", temp: 28, rainProbability: 25, humidity: 74, condition: "Fantasy Springs Entry", icon: "❄️" },
      { time: "12:00", temp: 30, rainProbability: 30, humidity: 68, condition: "Sunny Volcano View", icon: "🌋" },
      { time: "15:00", temp: 29, rainProbability: 30, humidity: 70, condition: "Mermaid Lagoon A/C", icon: "🧜‍♀️" },
      { time: "18:00", temp: 27, rainProbability: 25, humidity: 76, condition: "Golden Gondola Hour", icon: "🛶" },
      { time: "21:00", temp: 25, rainProbability: 20, humidity: 80, condition: "Believe Night Show", icon: "🌟" },
    ],
  },
  {
    dayIndex: 4,
    dateStr: "2026-09-05",
    dayName: "Sat · Sep 5",
    shortDay: "Day 05 (Shibuya & Harajuku)",
    high: 31,
    low: 24,
    rainProbability: 20,
    condition: "Bright & Sunny",
    icon: "🚦",
    uvIndex: 8,
    windSpeed: 15,
    clothingAdvice: "Stylish streetwear & walking sneakers (18,000 steps through Meiji Jingu & Shibuya).",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 24, rainProbability: 10, humidity: 80, condition: "Clear Morning", icon: "🌅" },
      { time: "09:00", temp: 27, rainProbability: 15, humidity: 72, condition: "Meiji Jingu Forest Shade", icon: "⛩️" },
      { time: "12:00", temp: 31, rainProbability: 20, humidity: 64, condition: "Takeshita Street Rush", icon: "🍡" },
      { time: "15:00", temp: 30, rainProbability: 20, humidity: 66, condition: "Shibuya Crossing", icon: "🚦" },
      { time: "18:00", temp: 28, rainProbability: 15, humidity: 72, condition: "PARCO & Donki Shopping", icon: "🛍️" },
      { time: "21:00", temp: 26, rainProbability: 10, humidity: 78, condition: "Neon Evening", icon: "✨" },
    ],
  },
  {
    dayIndex: 5,
    dateStr: "2026-09-06",
    dayName: "Sun · Sep 6",
    shortDay: "Day 06 (Akihabara)",
    high: 30,
    low: 24,
    rainProbability: 25,
    condition: "Sunny / Pedestrian Paradise",
    icon: "🕹️",
    uvIndex: 7,
    windSpeed: 14,
    clothingAdvice: "Light casual clothes, tote bag for gachapon & electronics. Air-conditioned megastores.",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 24, rainProbability: 15, humidity: 82, condition: "Calm Dawn", icon: "🌅" },
      { time: "09:00", temp: 27, rainProbability: 20, humidity: 74, condition: "Kanda Myojin Shrine", icon: "⛩️" },
      { time: "12:00", temp: 30, rainProbability: 25, humidity: 66, condition: "Radio Kaikan Tower", icon: "🏢" },
      { time: "15:00", temp: 29, rainProbability: 25, humidity: 68, condition: "Chuo-dori Pedestrian Walk", icon: "🕹️" },
      { time: "18:00", temp: 27, rainProbability: 20, humidity: 74, condition: "Yodobashi Akiba Dinner", icon: "🍣" },
      { time: "21:00", temp: 25, rainProbability: 15, humidity: 80, condition: "Asakusa Hotel Return", icon: "🌙" },
    ],
  },
  {
    dayIndex: 6,
    dateStr: "2026-09-07",
    dayName: "Mon · Sep 7",
    shortDay: "Day 07 (Departure)",
    high: 29,
    low: 23,
    rainProbability: 20,
    condition: "Clear Departure Skies",
    icon: "🛫",
    uvIndex: 7,
    windSpeed: 16,
    clothingAdvice: "Comfortable travel outfit for flight MNL ⇄ NRT. Light layer for air-conditioned planes.",
    umbrellaNeeded: false,
    hourly: [
      { time: "06:00", temp: 23, rainProbability: 15, humidity: 84, condition: "Hotel Pack Up", icon: "🧳" },
      { time: "09:00", temp: 26, rainProbability: 20, humidity: 76, condition: "Keisei Access Express", icon: "🚆" },
      { time: "12:00", temp: 29, rainProbability: 20, humidity: 68, condition: "Narita T2 Executive Lounge", icon: "🛋️" },
      { time: "15:00", temp: 28, rainProbability: 20, humidity: 70, condition: "Flight in Air", icon: "✈️" },
      { time: "18:00", temp: 27, rainProbability: 15, humidity: 75, condition: "Arrival in Manila", icon: "🇵🇭" },
      { time: "21:00", temp: 26, rainProbability: 10, humidity: 80, condition: "Home Sweet Home", icon: "🏡" },
    ],
  },
];

export function useWeather(lat = 35.7135, lng = 139.7995) {
  const [weather, setWeather] = useState<WeatherData>({
    high: 31,
    low: 24,
    currentTemp: 30,
    rainProbability: 20,
    condition: "Sunny & Warm",
    isTyphoonWarning: false,
    humidity: 70,
    days: fallbackDays,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchTokyoWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,uv_index_max,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,weather_code&timezone=Asia%2FTokyo&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather from Open-Meteo");
        const data = await res.json();

        if (data.daily && data.daily.temperature_2m_max && isMounted) {
          const high = Math.round(data.daily.temperature_2m_max[0]);
          const low = Math.round(data.daily.temperature_2m_min[0]);
          const rain = data.daily.precipitation_probability_max[0] ?? 20;
          const current = data.current?.temperature_2m ? Math.round(data.current.temperature_2m) : high;
          const currentHumidity = data.current?.relative_humidity_2m ?? 70;
          const currentCode = data.current?.weather_code ?? 0;
          const { condition, icon } = getWeatherCondition(currentCode, rain);

          // Build dynamic days from API
          const dynamicDays: DailyForecast[] = fallbackDays.map((fb, idx) => {
            const dHigh = data.daily.temperature_2m_max[idx] ? Math.round(data.daily.temperature_2m_max[idx]) : fb.high;
            const dLow = data.daily.temperature_2m_min[idx] ? Math.round(data.daily.temperature_2m_min[idx]) : fb.low;
            const dRain = data.daily.precipitation_probability_max[idx] ?? fb.rainProbability;
            const dCode = data.daily.weather_code?.[idx] ?? 0;
            const dUV = data.daily.uv_index_max?.[idx] ? Math.round(data.daily.uv_index_max[idx]) : fb.uvIndex;
            const dWind = data.daily.wind_speed_10m_max?.[idx] ? Math.round(data.daily.wind_speed_10m_max[idx]) : fb.windSpeed;
            const { condition: dCond, icon: dIcon } = getWeatherCondition(dCode, dRain);

            // Extract hourly points for this day if available
            const dayOffset = idx * 24;
            const hourSteps = [6, 9, 12, 15, 18, 21];
            const dHourly: HourlyForecast[] = hourSteps.map((h) => {
              const hIndex = dayOffset + h;
              const hTemp = data.hourly?.temperature_2m?.[hIndex] ? Math.round(data.hourly.temperature_2m[hIndex]) : fb.hourly.find((x) => x.time.startsWith(String(h).padStart(2, "0")))?.temp ?? 28;
              const hRain = data.hourly?.precipitation_probability?.[hIndex] ?? 20;
              const hHumid = data.hourly?.relative_humidity_2m?.[hIndex] ?? 70;
              const hCode = data.hourly?.weather_code?.[hIndex] ?? 0;
              const { condition: hCond, icon: hIcon } = getWeatherCondition(hCode, hRain);
              return {
                time: `${String(h).padStart(2, "0")}:00`,
                temp: hTemp,
                rainProbability: hRain,
                humidity: hHumid,
                condition: hCond,
                icon: hIcon,
              };
            });

            return {
              ...fb,
              high: dHigh,
              low: dLow,
              rainProbability: dRain,
              condition: dCond,
              icon: dIcon,
              uvIndex: dUV,
              windSpeed: dWind,
              umbrellaNeeded: dRain >= 40,
              hourly: dHourly,
            };
          });

          setWeather({
            high,
            low,
            currentTemp: current,
            rainProbability: rain,
            condition,
            isTyphoonWarning: rain >= 80,
            humidity: currentHumidity,
            days: dynamicDays,
          });
        }
      } catch (err) {
        console.warn("Weather fetch fallback:", err);
        if (isMounted) {
          setIsError(true);
          setWeather({
            high: 31,
            low: 24,
            currentTemp: 30,
            rainProbability: 20,
            condition: "Typical Early Sep Weather (Sunny & Warm)",
            isTyphoonWarning: false,
            humidity: 70,
            days: fallbackDays,
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
