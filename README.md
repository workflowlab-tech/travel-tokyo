# 🌸 TravelTokyo (東京旅) — Personal Travel Companion Template

A fast, mobile-first, data-driven personal travel companion web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Designed specifically for on-the-ground travel: weather-adaptive itineraries, live Open-Meteo forecasts, live FX currency conversions, private booking document vaults, smart packing checklists, and emergency SOS cards.

---

## ✨ Features

- **📱 Mobile-First Thumb Navigation**: Floating bottom dock designed for one-handed operation on trains and Tokyo streets.
- **☀️/☔ Weather-Adaptive 7-Day Itinerary**: Instant toggle between Sun and Rain plans with full timeline events, transit notes, and food quests.
- **⚡ Live Signals (Zero Backend Required)**:
  - **Live Tokyo Weather**: Real-time temperature, high/low, and rain probability powered by [Open-Meteo](https://open-meteo.com/).
  - **Live Currency Converter**: Real-time PHP ⇄ JPY (or USD/EUR) rate calculation powered by [Frankfurter API](https://frankfurter.dev/).
  - **Home Base**: Hotel card with Japanese address, amenities, and 1-tap Google Maps directions.
- **🎢 Comprehensive Guides (No Duplicate Code)**:
  - **Disney Ride Guide**: Tokyo Disneyland & DisneySea attraction tiers (Tier 1 Must-Ride, Tier 2 Worth It, Tier 3), height requirements, high-fall alerts, and parade lineups.
  - **Disney Dining Guide**: Table vs counter service, signature dishes, and Priority Seating (PS) advice.
  - **Transit Directions**: Airport transfers, Narita Access Express, Maihama Disney, Warner Bros Studio Tour, Shibuya, and Akihabara with IC card fares and station exit details.
  - **Manners & Etiquette**: Japanese cultural etiquette for trains, restaurants, Shinto shrines, and public baths (sento).
  - **Souvenirs & Shopping**: District-by-district recommendations and tax-free shopping rules.
- **🧰 Private Travel Tools (Browser LocalStorage Sync)**:
  - **Budget & Expenses**: Multi-currency expense ledger with category tags and running total.
  - **Document & Booking Vault**: Upload and store tickets, flight confirmations, hotel vouchers, passport copies, and QR codes directly on your device.
  - **Smart Packing Checklist**: Categorized essentials with progress indicator and ability to add custom items.
  - **Trip Memories Gallery**: Snap or upload trip photos with captions and location tags.
- **🚨 Emergency SOS Hub**: Direct 1-tap dialers for Police (110), Ambulance/Fire (119), Japanese Hotel Taxi Card with 1-tap address copy, and emergency phrases.

---

## 🚀 How to Customize for Any Destination (Seoul, Paris, Osaka, etc.)

This repository is built as a **zero-fuss template**. All trip details are strictly decoupled from the UI and live in a single centralized file:

👉 `src/data/trip-config.ts`

To customize this template for your own trip:
1. Open `src/data/trip-config.ts`.
2. Update `tripMeta` (Destination name, dates, traveler count, hotel name/address, flights, emergency numbers).
3. Update `itineraryDays` with your daily timeline, transit notes, and food quests.
4. Update `disneyGuides` / `transportRoutes` / `packingPresets` as desired.
5. Deploy to Vercel in 1 click!

---

## 🛠️ Local Development & Deployment

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

### 4. Deploy to Vercel (GitHub → Vercel)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Click **"Deploy"** (Zero configuration needed!).

---

## 🔒 Privacy & Offline Note

- All private travel records (budget items, uploaded document screenshots, packing checkmarks, memories) are saved directly in your browser's `localStorage` and memory.
- No third-party server databases, trackers, or authentication barriers are required.
