import {
  TripMeta,
  ItineraryDay,
  PlaceGuide,
  DisneyParkGuide,
  RestaurantItem,
  TransportRoute,
  PackingItemPreset,
  EtiquetteRule,
  SouvenirDistrict,
} from "../types/trip";

export const tripMeta: TripMeta = {
  tripName: "TravelTokyo",
  japaneseTitle: "東京旅",
  destination: "Tokyo, Japan",
  tagline: "Tokyo, ready when you are.",
  description:
    "One calm, mobile-first companion for the itinerary, live weather signals, bookings, expenses and every important travel detail.",
  heroImage:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=80",
  startDate: "2026-09-01",
  endDate: "2026-09-07",
  dateDisplay: "Sep 1–7, 2026",
  travelerCount: 5,
  travelersLabel: "5 travelers",
  marqueeHighlights: [
    "ASAKUSA",
    "DISNEYLAND",
    "HARRY POTTER",
    "DISNEYSEA",
    "SHIBUYA",
    "AKIHABARA",
  ],
  stats: {
    days: 7,
    travelers: 5,
    highlights: "2 Disney parks",
  },
  homeBase: {
    name: "Hotel Plus Hostel TOKYO ASAKUSA 2",
    japaneseName: "ホテルプラスホステル東京浅草2",
    address: "1-7-10 Hanakawado, Taito-ku, Tokyo 111-0033",
    japaneseAddress: "〒111-0033 東京都台東区花川戸1丁目7-10",
    nearestStation: "Asakusa Station (Ginza Line, Asakusa Line, Tobu)",
    bookingId: "1759447607",
    bookingPlatform: "Agoda",
    totalCostJPY: 89525,
    totalCostPHP: 33157,
    paymentStatus: "Pay Later (Card ending in 0006)",
    roomDetails: "2 Double Rooms - Non-Smoking · 6 Nights (Sep 1–7)",
    amenities: [
      "Public Bath (Sento) & Sauna",
      "Free High-Speed Wi-Fi",
      "Luggage Storage",
      "Short walk to Senso-ji & Hanakawado park",
    ],
    mapQuery: "Hotel+Plus+Hostel+TOKYO+ASAKUSA+2",
    coordinates: {
      lat: 35.7135,
      lng: 139.7995,
    },
  },
  flights: {
    outbound: {
      code: "Flight MNL → NRT",
      route: "Manila (MNL) to Tokyo Narita (NRT)",
      departureTime: "06:10 AM",
      arrivalTime: "11:35 AM",
      airfareEstimate: "Booked & Confirmed",
      passengerPNRs: [
        { name: "Mary Joyce Ablanque", pnr: "WETQNY" },
        { name: "Anita Ablanque", pnr: "WC2HXE" },
        { name: "Marlon Catanduanes", pnr: "MH1ZRC" },
        { name: "Mary Jane Ablanque", pnr: "NLNDWD" },
        { name: "Arabella Catanduanes", pnr: "NLNDWD" },
      ],
      lounge: {
        airport: "Manila NAIA",
        terminal: "Terminal 3",
        loungeName: "NAIA T3 VIP Lounge",
        primaryCard: "UnionBank Miles+ Platinum Visa",
        backupCard: "Security Bank Mastercard Travel Pass (ablanquemj / idolfairiesph2 / idolfairiespreorders)",
        notes: "Present boarding pass + UnionBank card before gate boarding",
      },
      notes: "Arrive at NAIA T3 by 03:00 AM · Have Visit Japan Web QR ready",
    },
    inbound: {
      code: "Flight NRT → MNL",
      route: "Tokyo Narita (NRT) to Manila (MNL)",
      departureTime: "13:45 PM",
      arrivalTime: "17:40 PM",
      airfareEstimate: "Booked & Confirmed",
      passengerPNRs: [
        { name: "Mary Joyce Ablanque", pnr: "WETQNY" },
        { name: "Anita Ablanque", pnr: "WC2HXE" },
        { name: "Marlon Catanduanes", pnr: "MH1ZRC" },
        { name: "Mary Jane Ablanque", pnr: "NLNDWD" },
        { name: "Arabella Catanduanes", pnr: "NLNDWD" },
      ],
      lounge: {
        airport: "Tokyo Narita",
        terminal: "Terminal 2",
        loungeName: "EXECUTIVE LOUNGE 2",
        primaryCard: "BDO JCB Platinum",
        backupCard: "Security Bank Mastercard Travel Pass",
        notes: "Located past security in Narita T2 · Free refreshments & Wi-Fi",
      },
      notes: "Check out hotel by 8:15 AM · Depart Asakusa by 8:30 AM direct to Narita T2",
    },
  },
  travelers: [
    {
      id: "trav-1",
      travelerName: "Mary Joyce Ablanque",
      pnr: "WETQNY",
      passportImage: "/documents/passports/mary_joyce_passport.jpg",
      visaNumber: "FB1098454",
      visaImage: "/documents/visas/mary_joyce_visa.jpg",
      visaExpiry: "2026-10-06",
    },
    {
      id: "trav-2",
      travelerName: "Anita Ablanque",
      pnr: "WC2HXE",
      passportImage: "/documents/passports/anita_passport.jpg",
      visaNumber: "FB1098455",
      visaImage: "/documents/visas/anita_visa.jpg",
      visaExpiry: "2026-10-06",
    },
    {
      id: "trav-3",
      travelerName: "Marlon Catanduanes",
      pnr: "MH1ZRC",
      passportImage: "/documents/passports/marlon_passport.jpg",
      visaNumber: "FB1098457",
      visaImage: "/documents/visas/marlon_visa.jpg",
      visaExpiry: "2026-10-06",
    },
    {
      id: "trav-4",
      travelerName: "Mary Jane Ablanque",
      pnr: "NLNDWD",
      passportImage: "/documents/passports/mary_jane_passport.jpg",
      visaNumber: "FB1098456",
      visaImage: "/documents/visas/mary_jane_visa.jpg",
      visaExpiry: "2026-10-06",
    },
    {
      id: "trav-5",
      travelerName: "Arabella Catanduanes",
      pnr: "NLNDWD",
      passportImage: "/documents/passports/arabella_passport.jpg",
      visaNumber: "FB1098458",
      visaImage: "/documents/visas/arabella_visa.jpg",
      visaExpiry: "2026-10-06",
    },
  ],
  emergencyContacts: [
    {
      label: "Police",
      japaneseLabel: "警察 (Keisatsu)",
      number: "110",
      desc: "English interpretation service available nationwide 24/7",
      isDialable: true,
    },
    {
      label: "Ambulance / Fire",
      japaneseLabel: "救急・消防 (Kyūkyū / Shōbō)",
      number: "119",
      desc: "Emergency medical rescue or fire department",
      isDialable: true,
    },
    {
      label: "Japan Helpline",
      japaneseLabel: "ジャパン・ヘルプライン",
      number: "0570-000-911",
      desc: "24-hour English toll-free emergency consultation",
      isDialable: true,
    },
  ],
  defaultCurrencies: {
    homeCurrency: "PHP",
    destCurrency: "JPY",
    homeSymbol: "₱",
    destSymbol: "¥",
    defaultConvertAmount: 1000,
    plannedBudgetPHP: 150000,
    plannedBudgetJPY: 405000,
    initialCashJPY: 100000,
  },
};

export const itineraryDays: ItineraryDay[] = [
  {
    dayNumber: "01",
    date: "TUE · SEP 1",
    shortDate: "Sep 1",
    fullDateString: "2026-09-01",
    title: "Arrival & Historic Asakusa",
    area: "Narita Airport → Hanakawado Asakusa",
    icon: "⛩️",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "NAIA T3 Lounge (UnionBank Miles+ Visa) → Flight to Narita (arr 11:35 AM) → Keisei Access Express to Asakusa Station (~60–80 min direct, ¥1,300–1,350) → Hotel Plus Hostel Asakusa 2",
    transitSummary: {
      from: "Narita Airport T2·3",
      to: "Hotel Plus Hostel Asakusa 2 (Hanakawado)",
      time: "55–80 min",
      fare: "≈ ¥1,300–1,350",
      routeTitle: "Keisei Access Express (Direct to Asakusa)",
    },
    sunPlan: [
      {
        time: "03:30",
        title: "NAIA Terminal 3 & Airport Lounge",
        desc: "Check-in at NAIA T3. Relax at airport lounge using UnionBank Miles+ Platinum Visa card (Backup: Security Bank Travel Pass).",
        icon: "☕",
        badges: ["Lounge Access", "UnionBank Visa"],
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "06:10",
        title: "Flight MNL → NRT (06:10–11:35)",
        desc: "Morning flight to Tokyo Narita. PNRs: Mary Joyce (WETQNY), Anita (WC2HXE), Marlon (MH1ZRC), Jane & Bella (NLNDWD).",
        icon: "✈️",
        badges: ["Flight", "Booked & Confirmed"],
        transit: {
          routeId: "narita-arrival",
          title: "Keisei Access Express to Asakusa",
          travelTime: "55–80 min",
          fare: "¥1,300–1,350",
          stepSummary: "Board Keisei Access Express (orange signs) bound for Haneda/Nishi-Magome. Direct ride to Asakusa.",
          mapQuery: "Narita+Airport+to+Asakusa+Station",
        },
      },
      {
        time: "15:00",
        title: "Hotel Check-in & Bag Drop",
        desc: "Hotel Plus Hostel TOKYO ASAKUSA 2 (1-7-10 Hanakawado). Agoda Booking #1759447607 (¥89,525 / ~₱33,157). Freshen up.",
        icon: "🏨",
        badges: ["Agoda #1759447607", "2 Double Rooms"],
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "16:30",
        title: "Kaminarimon Gate & Sensō-ji Temple",
        desc: "Gentle afternoon walk through Nakamise shopping street to Sensō-ji. Incense burner and omikuji fortunes.",
        icon: "⛩️",
        badges: ["Free", "Outdoor"],
        image:
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "asakusa-local",
          title: "Walk to Sensō-ji & Kaminarimon",
          travelTime: "3–5 min walk",
          fare: "Free (Walking)",
          stepSummary: "Walk south from Hanakawado along Nakamise arcade to temple gates.",
          mapQuery: "Senso-ji+Temple+Asakusa",
        },
      },
      {
        time: "18:00",
        title: "Sumida River & Skytree Golden Hour",
        desc: "Stroll between Azumabashi and Sumida Park with breeze and sunset views of Tokyo Skytree.",
        icon: "🌇",
        badges: ["Free", "Outdoor"],
        image:
          "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "03:30",
        title: "NAIA T3 Lounge Access",
        desc: "Use UnionBank Miles+ Platinum Visa card at NAIA T3 lounge before flight.",
        icon: "☕",
        badges: ["Lounge", "UnionBank"],
      },
      {
        time: "06:10",
        title: "Flight MNL → NRT",
        desc: "Monitor flight arrival at Narita (11:35 AM).",
        icon: "✈️",
        badges: ["Booked & Paid", "Transit"],
      },
      {
        time: "15:00",
        title: "Hotel Check-in & Unpack",
        desc: "Check into Hotel Plus Hostel Asakusa 2 (1-7-10 Hanakawado). Dry off and relax.",
        icon: "🏨",
        badges: ["Home Base", "Indoor"],
      },
      {
        time: "16:30",
        title: "Nakamise Covered Arcade & Sensō-ji",
        desc: "Walk under the fully roofed Nakamise shopping arcade to the temple main hall.",
        icon: "⛩️",
        badges: ["Free", "Covered"],
      },
      {
        time: "18:00",
        title: "Tokyo Solamachi Mall (Rain Swap)",
        desc: "Short covered transit hop to the base of Skytree for 300+ indoor shops, restaurants, and souvenirs.",
        icon: "🛍️",
        badges: ["Free entry", "Indoor"],
      },
    ],
    foodQuest:
      "Asakusa Menchi (crispy minced pork cutlet, ~¥300), Kagetsudo jumbo melon pan, or Sometaro DIY okonomiyaki.",
    weatherAdvice: {
      sun: "Front-load outdoor temple walking before dark. Hydrate with cold mugicha (barley tea) from vending machines.",
      rain: "Nakamise arcade is covered; if heavy rain hits, Solamachi mall at Skytree base offers complete indoor dining.",
    },
  },
  {
    dayNumber: "02",
    date: "WED · SEP 2",
    shortDate: "Sep 2",
    fullDateString: "2026-09-02",
    title: "Tokyo Disneyland Full Day",
    area: "Disney Resort (Maihama)",
    icon: "🏰",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Asakusa → Maihama: Ginza Line to Kanda → JR to Tokyo → JR Keiyo Line (~50–55 min total, allow 10 min inside Tokyo Station)",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Tokyo Disneyland (Maihama Station)",
      time: "50–55 min",
      fare: "≈ ¥410–470",
      routeTitle: "Ginza Line → JR Line → JR Keiyo Line to Maihama",
    },
    sunPlan: [
      {
        time: "08:00",
        title: "Rope Drop — Beauty and the Beast",
        desc: "Head straight to Fantasyland for Enchanted Tale of Beauty and the Beast, followed by Pooh's Hunny Hunt.",
        icon: "🎡",
        badges: ["Booked & paid", "Tier 1"],
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "hotel-disney",
          title: "Asakusa to Maihama (Disneyland)",
          travelTime: "50–55 min",
          fare: "¥410–470",
          stepSummary: "Ginza Line (Asakusa → Kanda) → JR Yamanote (Kanda → Tokyo) → JR Keiyo Line (Tokyo → Maihama).",
          mapQuery: "Asakusa+to+Maihama+Station",
        },
      },
      {
        time: "09:40",
        title: "Tomorrowland & Westernland Thrills",
        desc: "Monsters, Inc. Ride & Go Seek! followed by Big Thunder Mountain and Splash Mountain.",
        icon: "🚀",
        badges: ["Tier 1 Must-Ride"],
        image:
          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "13:00",
        title: "Midday Heat & A/C Recovery",
        desc: "Indoor rides (Haunted Mansion, Pirates of the Caribbean) or seated lunch at Hungry Bear / Plaza Pavilion.",
        icon: "🧊",
        badges: ["Indoor Break"],
        image:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "17:00",
        title: "Parade & Evening Spectaculars",
        desc: "Catch Disney Harmony in Color parade, followed by Reach for the Stars castle show & Dreamlights electrical parade.",
        icon: "🎆",
        badges: ["Parade / Shows"],
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "08:00",
        title: "Disneyland Rain-Ready Rope Drop",
        desc: "Wear light ponchos. Disneyland operates rain or shine; outdoor wait times drop substantially in light rain.",
        icon: "🎡",
        badges: ["Booked & paid", "Ponchos on"],
      },
      {
        time: "10:30",
        title: "Indoor Dark Ride Marathon",
        desc: "Beauty and the Beast, Pooh's Hunny Hunt, Monsters Inc., Haunted Mansion, and Star Tours are all 100% indoors.",
        icon: "🏰",
        badges: ["100% Indoor"],
      },
      {
        time: "14:00",
        title: "Ikspiari Mall (Severe Weather Backup)",
        desc: "If heavy downpours hit, step across to Ikspiari next to Maihama Station for covered food court & shops.",
        icon: "🛍️",
        badges: ["Backup Option"],
      },
      {
        time: "18:00",
        title: "Covered Night Entertainment",
        desc: "World Bazaar and covered arcades keep shopping and character moments completely dry.",
        icon: "✨",
        badges: ["Dry Route"],
      },
    ],
    foodQuest:
      "Character popcorn buckets, Mickey churros, Hungry Bear pork cutlet curry, or sit-down meals at Ikspiari (~¥900+).",
    weatherAdvice: {
      sun: "Midday sun is intense in Westernland. Take seated breaks inside Country Bear Theater or Western River Railroad.",
      rain: "Most headliners are indoors. Keep your poncho accessible and confirm show modifications on the Tokyo Disney app.",
    },
  },
  {
    dayNumber: "03",
    date: "THU · SEP 3",
    shortDate: "Sep 3",
    fullDateString: "2026-09-03",
    title: "Warner Bros. Harry Potter Studio Tour",
    area: "Asakusa → Toshimaen",
    icon: "🪄",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Eat lunch before leaving · Asakusa/Kuramae to Toshimaen on Toei Oedo Line direct (~55 min) · allow 60–75 min door-to-door",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Warner Bros. Studio Tour (Toshimaen Station)",
      time: "55–60 min",
      fare: "≈ ¥325–330",
      routeTitle: "Toei Oedo Line Direct from Kuramae to Toshimaen",
    },
    sunPlan: [
      {
        time: "Morning",
        title: "Slow, Restful Morning",
        desc: "No rush after the long Disneyland day. Sleep in, pack day bag, and take a calm coffee walk in Asakusa.",
        icon: "☕",
        badges: ["Rest & Recovery"],
      },
      {
        time: "11:15",
        title: "Early Lunch in Asakusa",
        desc: "Hearty sit-down lunch near the hotel before crossing Tokyo so the tour is your first fixed event.",
        icon: "🍜",
        badges: ["Local Dining"],
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "13:00",
        title: "Warner Bros. Studio Tour Tokyo",
        desc: "The Making of Harry Potter: Great Hall, Diagon Alley, Hogwarts Express, Butterbeer, and Ministry of Magic.",
        icon: "🪄",
        badges: ["Booked & paid", "100% Indoor"],
        image:
          "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "hotel-studio-tour",
          title: "Toei Oedo Line to Toshimaen",
          travelTime: "55–60 min (Direct)",
          fare: "¥325–330",
          stepSummary: "Board Toei Oedo Line at Kuramae bound for Hikarigaoka. 0 transfers. 2-min walk from Toshimaen Station.",
          mapQuery: "Warner+Bros+Studio+Tour+Tokyo+Toshimaen",
        },
      },
      {
        time: "17:30",
        title: "Optional Ikebukuro Stop / Return",
        desc: "Only stop if the family still has energy; otherwise take the direct train straight back to Asakusa.",
        icon: "🛍️",
        badges: ["Optional"],
      },
      {
        time: "20:00",
        title: "Hotel Public Bath & Sauna",
        desc: "Unwind in the hotel's on-site sento bath and sauna. Perfect recharge before DisneySea tomorrow.",
        icon: "♨️",
        badges: ["Included at Hotel"],
        image:
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "Morning",
        title: "Calm Hotel Morning",
        desc: "Relax in the lounge or your room. Pack umbrellas for the short 2-minute station walk at Toshimaen.",
        icon: "☕",
        badges: ["Rest & Dry"],
      },
      {
        time: "11:15",
        title: "Lunch near Asakusa Station",
        desc: "Warm ramen or tonkatsu near the station entrance.",
        icon: "🍜",
        badges: ["Covered dining"],
      },
      {
        time: "13:00",
        title: "Warner Bros. Studio Tour",
        desc: "Completely weatherproof indoor attraction. Allow 3.5 to 4.5 hours of self-paced exploration.",
        icon: "🪄",
        badges: ["Booked & paid", "Fully Indoor"],
      },
      {
        time: "18:00",
        title: "Direct Return to Asakusa",
        desc: "Skip optional walking detours and ride direct Oedo Line back to Kuramae/Asakusa.",
        icon: "🚆",
        badges: ["Direct Transit"],
      },
      {
        time: "20:00",
        title: "Hotel Sento & Sauna",
        desc: "Soak in the warm hotel bath to end the day relaxed.",
        icon: "♨️",
        badges: ["Included at Hotel"],
      },
    ],
    foodQuest:
      "Butterbeer & themed British pub fare at the Studio Tour cafe; traditional tempura at Daikokuya back in Asakusa.",
    weatherAdvice: {
      sun: "The Studio Tour is fully air-conditioned indoors. Toshimaen station exit is just a 2-minute tree-lined walk.",
      rain: "An ideal wet-day itinerary—nearly 100% covered from station to studio to hotel bath.",
    },
  },
  {
    dayNumber: "04",
    date: "FRI · SEP 4",
    shortDate: "Sep 4",
    fullDateString: "2026-09-04",
    title: "Tokyo DisneySea & Fantasy Springs",
    area: "Disney Resort (Maihama)",
    icon: "🌊",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Hotel → Maihama → Disney Resort Line monorail to Tokyo DisneySea Station · dedicate full day to the park",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Tokyo DisneySea Station",
      time: "55–60 min",
      fare: "≈ ¥470 rail + ¥260 monorail",
      routeTitle: "Rail to Maihama + Disney Resort Line Monorail",
    },
    sunPlan: [
      {
        time: "08:00",
        title: "Rope Drop & Fantasy Springs",
        desc: "Open Tokyo Disney app immediately upon entry. Grab Premier Access for Anna and Elsa's Frozen Journey, then Peter Pan.",
        icon: "❄️",
        badges: ["Booked & paid", "#1 Priority"],
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "hotel-disney",
          title: "Asakusa to Tokyo DisneySea",
          travelTime: "55–60 min",
          fare: "¥470 + ¥260 monorail",
          stepSummary: "Ginza Line → JR Keiyo Line to Maihama → Disney Resort Line Monorail to DisneySea Station.",
          mapQuery: "Tokyo+DisneySea+Maihama",
        },
      },
      {
        time: "10:15",
        title: "Mysterious Island & Lost River Delta",
        desc: "Journey to the Center of the Earth, followed by Indiana Jones Adventure (use Single Rider if useful).",
        icon: "🌋",
        badges: ["Flagship Thrills"],
        image:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "13:00",
        title: "Seated Harbor Lunch & Soaring",
        desc: "Sit-down lunch at Casbah Food Court or Zambini Brothers, followed by Soaring: Fantastic Flight.",
        icon: "🧭",
        badges: ["Rest & Ride"],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "18:30",
        title: "Venetian Gondolas at Sunset",
        desc: "Serene gondola ride through Palazzo Canals during golden hour lighting.",
        icon: "🛶",
        badges: ["Atmosphere"],
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "19:30",
        title: "Believe! Sea of Dreams Harbor Show",
        desc: "Spectacular nighttime harbor show with projection mapping, water fountains, lasers, and fireworks.",
        icon: "🌟",
        badges: ["Night Anchor"],
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "08:00",
        title: "DisneySea Covered-Port Strategy",
        desc: "Head into Fantasy Springs and Mermaid Lagoon. Triton's Kingdom in Mermaid Lagoon is 100% covered indoor bliss.",
        icon: "🌊",
        badges: ["Booked & paid", "Covered Ports"],
      },
      {
        time: "11:00",
        title: "Indoor Headliners",
        desc: "Tower of Terror, Sindbad's Storybook Voyage, 20,000 Leagues Under the Sea, and Indiana Jones are all sheltered queues.",
        icon: "🏰",
        badges: ["Sheltered Rides"],
      },
      {
        time: "14:00",
        title: "Long Covered Meal & Shows",
        desc: "S.S. Columbia Dining Room or Casbah Food Court, plus Dreams Take Flight indoor stage show.",
        icon: "🍽️",
        badges: ["Indoor Rest"],
      },
      {
        time: "18:00",
        title: "Flexible Harbor Viewing",
        desc: "View harbor events from covered verandas around Mediterranean Harbor shops.",
        icon: "✨",
        badges: ["Covered View"],
      },
    ],
    foodQuest:
      "Gyoza sausage bun in Mysterious Island, Sea Salt ice cream in Mermaid Lagoon, authentic curry at Casbah Food Court.",
    weatherAdvice: {
      sun: "Mediterranean Harbor has limited shade at noon. Use Mermaid Lagoon or indoor restaurants for cooling breaks.",
      rain: "Mermaid Lagoon is Tokyo Disney's best all-indoor area. Bring ponchos for walking between themed ports.",
    },
  },
  {
    dayNumber: "05",
    date: "SAT · SEP 5",
    shortDate: "Sep 5",
    fullDateString: "2026-09-05",
    title: "Shibuya, Harajuku & Meiji Shrine",
    area: "West Tokyo (Shibuya City)",
    icon: "🚦",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Asakusa → Shibuya: Direct Tokyo Metro Ginza Line (~35–40 min, 0 transfers, ¥320) · exit at Hachiko Exit",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Shibuya Station (Hachiko Exit)",
      time: "35–40 min",
      fare: "¥320 (¥317 IC Card)",
      routeTitle: "Tokyo Metro Ginza Line Direct (0 Transfers)",
    },
    sunPlan: [
      {
        time: "09:00",
        title: "Meiji Jingu Shinto Shrine",
        desc: "Early shaded walk through the towering evergreen forest before midday heat. Main shrine hall and torii gate.",
        icon: "⛩️",
        badges: ["Free", "Outdoor, Shaded"],
        image:
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "hotel-shibuya",
          title: "Ginza Line to Shibuya / Harajuku",
          travelTime: "35–40 min",
          fare: "¥320",
          stepSummary: "Ride Ginza Line from Asakusa direct to Shibuya Station. Walk north toward Meiji Jingu.",
          mapQuery: "Meiji+Jingu+Shibuya",
        },
      },
      {
        time: "11:30",
        title: "Takeshita Street & Harajuku",
        desc: "Window shopping, iconic Harajuku crepes, and Kiddy Land character goods (Hello Kitty, Snoopy, Ghibli).",
        icon: "🍡",
        badges: ["Free to browse"],
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "13:00",
        title: "Shibuya Scramble & Hachiko Statue",
        desc: "Cross the world's busiest intersection, take photos at Hachiko, and view the crossing from Starbucks 2F.",
        icon: "🚦",
        badges: ["Iconic Landmark"],
        image:
          "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "14:30",
        title: "Don Quijote & Pokémon Center Shibuya",
        desc: "Air-conditioned shopping at Mega Donki (tax-free snacks/cosmetics) and Shibuya PARCO Pokémon Center.",
        icon: "⚡",
        badges: ["Indoor Shopping"],
        image:
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "10:00",
        title: "Shibuya Scramble Wet Dash",
        desc: "Quick photo moment on the famous crossing, then step immediately into connected indoor complexes.",
        icon: "🚦",
        badges: ["Quick Outdoor"],
      },
      {
        time: "10:30",
        title: "Shibuya Mark City & Hikarie (Connected Malls)",
        desc: "Extensive connected indoor shopping directly linked to Shibuya Station without stepping into the rain.",
        icon: "🛍️",
        badges: ["Connected Indoor"],
      },
      {
        time: "13:30",
        title: "Tokyu Plaza / With Harajuku",
        desc: "Indoor fashion browsing and the famous mirrored kaleidoscopic entrance at Tokyu Plaza.",
        icon: "🏢",
        badges: ["Indoor / Photo spot"],
      },
      {
        time: "16:00",
        title: "Shibuya PARCO (Nintendo / Pokémon)",
        desc: "Multi-floor indoor pop-culture hub with CAPCOM Store, Jump Shop, and basement food alley.",
        icon: "🎮",
        badges: ["100% Indoor"],
      },
    ],
    foodQuest:
      "Marion Crepes Harajuku (~¥600), Ichiran Ramen Shibuya (solo booths, ~¥1,000), or standing sushi at Uogashi Nihon-Ichi.",
    weatherAdvice: {
      sun: "Meiji Jingu is your longest outdoor walk of the trip (~20 min through gravel trees); do it early before 11:00 AM.",
      rain: "Shibuya is heavily interlinked with underground walkways and department store tunnels (ShinQs, Hikarie, Mark City).",
    },
  },
  {
    dayNumber: "06",
    date: "SUN · SEP 6",
    shortDate: "Sep 6",
    fullDateString: "2026-09-06",
    title: "Akihabara Electric Town & Hobby Hub",
    area: "Electric Town (Chiyoda City)",
    icon: "🕹️",
    image:
      "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Asakusa → Akihabara: Tsukuba Express direct (~15 min, ¥150) · exit at Electric Town Exit",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Akihabara Station (Electric Town Exit)",
      time: "15 min",
      fare: "¥150 (IC Card)",
      routeTitle: "Tsukuba Express Direct (2 Stops)",
    },
    sunPlan: [
      {
        time: "10:00",
        title: "Kanda Myojin Shrine",
        desc: "Calm Shinto shrine with IT & tech amulets, just a 5-min walk from Akihabara Station before crowds peak.",
        icon: "⛩️",
        badges: ["Free", "Calm Start"],
        image:
          "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
        transit: {
          routeId: "hotel-akihabara",
          title: "Tsukuba Express to Akihabara",
          travelTime: "15 min",
          fare: "¥150",
          stepSummary: "Walk to Tsukuba Express Asakusa Station. Ride 2 stops direct to Akihabara Electric Town Exit.",
          mapQuery: "Akihabara+Electric+Town",
        },
      },
      {
        time: "11:30",
        title: "Animate & Radio Kaikan",
        desc: "Multi-floor flagship anime, manga, and collectible hobby stores along the main boulevard.",
        icon: "🛍️",
        badges: ["Indoor Shopping"],
        image:
          "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "14:00",
        title: "GiGO Arcade & Claw Machines",
        desc: "Rhythm games, crane games, and retro arcade floors in the heart of Electric Town.",
        icon: "🕹️",
        badges: ["Entertainment"],
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "16:00",
        title: "Yodobashi Camera Multimedia Akiba",
        desc: "9 floors of tax-free tech, gadgets, cameras, toys, and souvenirs with English-speaking staff.",
        icon: "📷",
        badges: ["Tax-Free Shopping"],
        image:
          "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
      },
    ],
    rainPlan: [
      {
        time: "11:00",
        title: "Radio Kaikan Indoor Hobby Tower",
        desc: "10 floors of figures, cards, souvenirs, and hobby goods directly connected to station exit.",
        icon: "🎴",
        badges: ["Station Direct"],
      },
      {
        time: "13:30",
        title: "GiGO Arcade Wet-Afternoon Fun",
        desc: "Multi-story covered entertainment and rhythm games.",
        icon: "🕹️",
        badges: ["Indoor"],
      },
      {
        time: "15:30",
        title: "Yodobashi Akiba Shopping & Dining",
        desc: "Browse electronics and eat dinner on the 8th-floor indoor restaurant level without heading outside.",
        icon: "📷",
        badges: ["Indoor complex"],
      },
    ],
    foodQuest:
      "Uobei Akihabara high-speed conveyor sushi, Radio Kaikan basement gyoza, or Yodobashi 8F restaurant world.",
    weatherAdvice: {
      sun: "Pedestrian Paradise (Hokosha Tengoku) opens on Sunday afternoons on Chuo-dori street for open walking.",
      rain: "Radio Kaikan and Yodobashi are huge multi-floor megastores right next to the station, making rain negligible.",
    },
  },
  {
    dayNumber: "07",
    date: "MON · SEP 7",
    shortDate: "Sep 7",
    fullDateString: "2026-09-07",
    title: "Departure & Narita Airport Lounges",
    area: "Asakusa → Narita Airport T2",
    icon: "🛫",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    transitNote:
      "Asakusa Station → Narita Airport (NRT T2): Keisei Access Express direct (~55–80 min, ¥1,300–1,350) → Executive Lounge 2 (BDO JCB Platinum)",
    transitSummary: {
      from: "Hotel Plus Hostel Asakusa 2",
      to: "Narita Airport Terminal 2",
      time: "55–80 min",
      fare: "≈ ¥1,300–1,350",
      routeTitle: "Keisei Access Express Direct to Narita T2",
    },
    sunPlan: [
      {
        time: "08:15",
        title: "Hotel Check-out & Bag Check",
        desc: "Final room check for passports, chargers, and Suica cards. Quick checkout at Hotel Plus Hostel 2 (Hanakawado).",
        icon: "🏨",
        badges: ["Check-out"],
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "08:30",
        title: "Keisei Access Express to Narita",
        desc: "Walk to Asakusa Station and board Access Express bound for Narita Airport T2·3. Direct ride.",
        icon: "🚆",
        badges: ["Direct Airport Train"],
        transit: {
          routeId: "hotel-departure",
          title: "Access Express to Narita Airport T2",
          travelTime: "55–80 min",
          fare: "¥1,300–1,350",
          stepSummary: "Board Keisei Access Express direct from Asakusa Station to Narita Airport Terminal 2.",
          mapQuery: "Asakusa+to+Narita+Airport+Terminal+2",
        },
      },
      {
        time: "10:30",
        title: "Narita T2 Executive Lounge 2 Access",
        desc: "Check in bags, clear security, and enter Narita T2 EXECUTIVE LOUNGE 2 using BDO JCB Platinum card (Backup: Security Bank Travel Pass).",
        icon: "🛋️",
        badges: ["Lounge Access", "BDO JCB Platinum"],
        image:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "12:30",
        title: "Duty-Free Souvenir Shopping",
        desc: "Last-minute tax-free sweets shopping at Fa-So-La (Tokyo Banana, Royce' Nama Chocolate, KitKats).",
        icon: "🛍️",
        badges: ["Duty Free"],
        image:
          "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
      },
      {
        time: "13:45",
        title: "Flight NRT → MNL Departure (13:45–17:40)",
        desc: "Flight back home to Manila. PNRs: Mary Joyce (WETQNY), Anita (WC2HXE), Marlon (MH1ZRC), Jane & Bella (NLNDWD). Safe travels!",
        icon: "✈️",
        badges: ["Flight", "Booked & Confirmed"],
      },
    ],
    rainPlan: [
      {
        time: "08:00",
        title: "Early Check-out with Weather Buffer",
        desc: "Add 20–30 min travel buffer in case of reduced train speeds in heavy rain.",
        icon: "🏨",
        badges: ["Buffer Time"],
      },
      {
        time: "08:15",
        title: "Access Express to Narita T2",
        desc: "Check live train status on Keisei / Navitime app before stepping onto the platform.",
        icon: "🚆",
        badges: ["Direct Airport Train"],
      },
      {
        time: "10:15",
        title: "Narita T2 Executive Lounge 2",
        desc: "Relax in Narita T2 Executive Lounge 2 with BDO JCB Platinum card.",
        icon: "☕",
        badges: ["Lounge Access", "BDO JCB Platinum"],
      },
      {
        time: "13:45",
        title: "Flight NRT → MNL Departure",
        desc: "Safe flight back home to Manila!",
        icon: "✈️",
        badges: ["Booked & Paid"],
      },
    ],
    foodQuest:
      "Narita Airport terminal dining: fresh udon, katsu don, or boxed Tokyo Banana & Royce' Nama chocolates.",
    weatherAdvice: {
      sun: "Departure timing gives a generous 3+ hour airport buffer for effortless baggage drop and lounge access.",
      rain: "Keisei Access Express is reliable, but check morning rail service status just in case of regional wind limits.",
    },
  },
];

export const placeGuides: PlaceGuide[] = [
  {
    id: "asakusa-sensoji",
    name: "Sensō-ji Temple & Asakusa",
    japaneseName: "浅草寺・雷門",
    district: "Asakusa, Taito City",
    tagline: "Tokyo's oldest temple, giant red lanterns, and historic market stalls.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "2 to 3 hours",
    whatYoullSee: [
      "Kaminarimon (Thunder Gate) with iconic 700kg red chochin lantern",
      "Nakamise-dori: 250-meter bustling historic craft and snack shopping street",
      "Sensō-ji Main Hall (Kannondo) and 5-Story Pagoda",
      "Sumida River promenade with direct views of Tokyo Skytree & Asahi Flame",
    ],
    suggestedSequence: [
      "1. Enter through Kaminarimon Gate and take photos under the giant red lantern",
      "2. Stroll along Nakamise-dori sampling fresh ningyo-yaki and melon pan",
      "3. Purify at the dragon water chozuya pavilion and wave incense smoke for good fortune",
      "4. Draw an omikuji fortune (¥100 coin) inside the Main Hall",
      "5. Walk 5 min to Azumabashi bridge for golden hour Skytree views",
    ],
    mustDo: [
      "Draw an Omikuji fortune at the temple hall",
      "Eat freshly fried Asakusa Menchi croquettes on the side alley",
      "See the temple illuminated in the evening (free of daytime crowds)",
    ],
    optionalOrSkippable: [
      "Asakusa Hanayashiki amusement park (skippable unless with very small toddlers)",
      "Rickshaw rides (fun but pricey: ~¥4,000–9,000)",
    ],
    expectedCost: "Free entry to temple grounds · ¥100 for Omikuji · ¥300–800 for street snacks",
    foodNearby: "Asakusa Menchi, Kagetsudo Melon Pan, Daikokuya Tempura, Sometaro Okonomiyaki",
    facilities: {
      toilets: "Clean public restrooms at Asakusa Culture Tourist Center (opposite Kaminarimon) and behind temple hall.",
      lockers: "Coin lockers inside Asakusa Station (Toei & Metro lines) and Tourist Center.",
      accessibility: "Flat stone walkways throughout Nakamise; ramp access to Main Hall elevator.",
    },
    weatherSuitability: {
      sunAdvice: "Visit in late afternoon (after 4:00 PM) when pagoda lighting turns golden and direct sun softens.",
      rainAdvice: "Nakamise arcade is completely roofed. If downpours hit, cross river to Tokyo Solamachi indoor mall.",
    },
    transitFromBase: {
      route: "Direct 3 to 5 minute neighborhood walk from Hotel Plus Hostel Asakusa 2 (Hanakawado).",
      time: "3–5 min walk",
      fare: "Free (Walking)",
      exit: "Hanakawado / Kaminarimon Exit",
    },
    nextDestinationHint: "Tokyo Disneyland on Day 2 or Tokyo Skytree via short walk.",
  },
  {
    id: "tokyo-disneyland",
    name: "Tokyo Disneyland",
    japaneseName: "東京ディズニーランド",
    district: "Maihama, Urayasu",
    tagline: "The world's most charming Disney park, featuring exclusive trackless marvels.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "Full day (10 to 12 hours)",
    whatYoullSee: [
      "Enchanted Tale of Beauty and the Beast inside the colossal pink Beast's Castle",
      "Pooh's Hunny Hunt — Tokyo's world-first trackless masterpiece",
      "Cinderella Castle & World Bazaar Victorian covered glass canopy",
      "Disney Harmony in Color daytime parade & Dreamlights illuminated night parade",
    ],
    suggestedSequence: [
      "1. Arrive at gates by 7:15–7:30 AM for rope drop",
      "2. Head straight to Beauty and the Beast in Fantasyland, then Pooh's Hunny Hunt",
      "3. Knock out Monsters, Inc. Ride & Go Seek! in Tomorrowland before 10:00 AM",
      "4. Big Thunder Mountain & Splash Mountain in Westernland/Critter Country",
      "5. Air-conditioned dark rides (Haunted Mansion, Pirates) during midday heat",
      "6. Secure parade spot for Harmony in Color and evening castle fireworks",
    ],
    mustDo: [
      "Beauty and the Beast (Tier 1)",
      "Pooh's Hunny Hunt (Tier 1 Tokyo Exclusive)",
      "Monsters, Inc. Ride & Go Seek! (Tier 1)",
      "Electrical Parade Dreamlights (World's best Disney night parade)",
    ],
    optionalOrSkippable: [
      "Snow White / Pinocchio (older dark rides with quick turns)",
      "Peter Pan's Flight (skip if line exceeds 60 min; ride in DisneySea instead)",
    ],
    expectedCost: "Park tickets booked & paid · ¥2,000 for optional Premier Access per headliner",
    foodNearby: "Hungry Bear Restaurant (curry), Queen of Hearts Banquet Hall, Sweetheart Cafe",
    facilities: {
      toilets: "Restrooms in every land; largest near Tomorrowland Terrace and Fantasyland.",
      lockers: "Large baggage coin lockers outside Maihama Station and near front park gates.",
    },
    weatherSuitability: {
      sunAdvice: "Westernland and Critter Country have limited shade. Duck into Country Bear Theater for A/C rest.",
      rainAdvice: "Most headliner queues (Beauty, Pooh, Monsters, Mansion) are 100% indoors. Wear a light poncho.",
    },
    transitFromBase: {
      route: "Asakusa (Ginza Line) → Kanda (JR Line) → Tokyo Station → JR Keiyo Line → Maihama Station.",
      time: "50–55 min",
      fare: "≈ ¥410–470",
      exit: "Maihama Station South Exit (5-min walk to gate)",
    },
    nextDestinationHint: "Rest Day / Harry Potter Warner Bros Studio Tour on Day 3.",
  },
  {
    id: "warner-bros-studio",
    name: "Warner Bros. Studio Tour Tokyo – The Making of Harry Potter",
    japaneseName: "ワーナー ブラザース スタジオツアー東京",
    district: "Toshimaen, Nerima City",
    tagline: "The largest indoor Harry Potter attraction in the world.",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "3.5 to 4.5 hours",
    whatYoullSee: [
      "Authentic Great Hall set with house tables and floating candles",
      "Platform 9 ¾ and full-scale Hogwarts Express steam train",
      "Tokyo-Exclusive Ministry of Magic set (over 30 feet tall)",
      "Diagon Alley with Ollivanders, Weasleys' Wizard Wheezes, and Gringotts",
      "World's largest Butterbeer Bar and Backlot Studio sets",
    ],
    suggestedSequence: [
      "1. Enjoy a slow, restful morning in Asakusa and eat lunch before departure",
      "2. Arrive at Toshimaen Station around 12:30 PM for 1:00 PM ticket entry",
      "3. Walk through Great Hall, Gryffindor Common Room, and Dumbledore's Office",
      "4. Mid-tour Butterbeer & themed snack break at Backlot Cafe",
      "5. Step through Diagon Alley and Tokyo Ministry of Magic Floo Network",
      "6. Return directly to Asakusa for hotel public bath & sauna wind-down",
    ],
    mustDo: [
      "Step onto the interactive Ministry of Magic Floo Network photo op",
      "Drink draft Butterbeer (you get to keep the commemorative souvenir tankard)",
      "Walk the cobblestones of Diagon Alley under changing twilight lighting",
    ],
    optionalOrSkippable: [
      "Digital broomstick green-screen experience (long queues, paid photo packages)",
      "Optional Ikebukuro detour afterward (skip to prioritize hotel sauna rest)",
    ],
    expectedCost: "Timed tickets booked & paid · ¥1,100 for Butterbeer with souvenir tankard",
    foodNearby: "Studio Tour Food Hall & Backlot Cafe; traditional dinner back in Asakusa",
    facilities: {
      toilets: "Spacious modern restrooms at entrance lobby and mid-tour Backlot area.",
      lockers: "Free digital coat and bag cloakroom inside entrance lobby.",
    },
    weatherSuitability: {
      sunAdvice: "100% air-conditioned indoor experience with only a brief 10-minute outdoor Backlot section.",
      rainAdvice: "Completely weatherproof. 2-minute covered walk from Toshimaen Station exit.",
    },
    transitFromBase: {
      route: "Kuramae Station → Toei Oedo Line direct (bound for Hikarigaoka) → Toshimaen Station.",
      time: "55–60 min (0 transfers)",
      fare: "≈ ¥325–330 (IC Card)",
      exit: "Toshimaen Station Main Exit (2-min walk)",
    },
    nextDestinationHint: "Hotel Plus Hostel Sento Bath tonight; DisneySea full day tomorrow.",
  },
  {
    id: "tokyo-disneysea",
    name: "Tokyo DisneySea & Fantasy Springs",
    japaneseName: "東京ディズニーシー・ファンタジースプリングス",
    district: "Maihama, Urayasu",
    tagline: "Widely acclaimed as the most magnificent theme park ever built.",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "Full day (11 to 13 hours)",
    whatYoullSee: [
      "Fantasy Springs: Anna & Elsa's Frozen Journey, Peter Pan's Never Land, Rapunzel's Lantern Festival",
      "Mount Prometheus active volcano erupting over Mediterranean Harbor",
      "Journey to the Center of the Earth & Indiana Jones Adventure",
      "Tower of Terror in American Waterfront & Sindbad's Storybook Voyage",
      "Believe! Sea of Dreams nighttime harbor spectacular",
    ],
    suggestedSequence: [
      "1. Arrive at gates early; open app immediately to secure Frozen Journey Premier Access",
      "2. Rope drop straight to Fantasy Springs (Peter Pan / Frozen)",
      "3. Cross to Mysterious Island for Journey to the Center of the Earth",
      "4. Lost River Delta for Indiana Jones Adventure (use Single Rider)",
      "5. Relaxing afternoon at Arabian Coast & Triton's Kingdom in Mermaid Lagoon",
      "6. Sunset Venetian Gondola ride through the canals",
      "7. Mediterranean Harbor viewing for Believe! Sea of Dreams",
    ],
    mustDo: [
      "Anna and Elsa's Frozen Journey (Top park headliner)",
      "Journey to the Center of the Earth (Flagship thrill dark ride)",
      "Soaring: Fantastic Flight (Scenic hang-glider simulator)",
      "Believe! Sea of Dreams (Harbor night show)",
    ],
    optionalOrSkippable: [
      "Raging Spirits 360° coaster (short, rough ride with long waits)",
      "Mermaid Lagoon kiddie spinners (skip if no toddlers in group)",
    ],
    expectedCost: "Park tickets booked & paid · ¥2,000 Premier Access for Frozen / Soaring",
    foodNearby: "Casbah Food Court (curry), Magellan's, Zambini Brothers, The Snuggly Duckling",
    facilities: {
      toilets: "Restrooms in every port; large facilities in American Waterfront and Mermaid Lagoon.",
      lockers: "Coin lockers at park entrance and Tokyo DisneySea Monorail station.",
    },
    weatherSuitability: {
      sunAdvice: "Midday sun reflects off harbor waters. Use Mermaid Lagoon's indoor caves for cooling down.",
      rainAdvice: "Mermaid Lagoon is Tokyo Disney's finest all-indoor realm with rides, shops, and restaurants.",
    },
    transitFromBase: {
      route: "Hotel → Asakusa (Ginza Line) → Kanda (JR) → Tokyo → JR Keiyo Line to Maihama → Disney Resort Line monorail.",
      time: "55–60 min",
      fare: "≈ ¥470 rail + ¥260 monorail",
      exit: "Tokyo DisneySea Station (Monorail)",
    },
    nextDestinationHint: "Shibuya & Harajuku on Day 5.",
  },
  {
    id: "shibuya-harajuku",
    name: "Shibuya, Harajuku & Meiji Jingu",
    japaneseName: "渋谷・原宿・明治神宮",
    district: "Shibuya City",
    tagline: "From serene ancient shrine forests to the world's most energetic intersection.",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "5 to 6 hours",
    whatYoullSee: [
      "Meiji Jingu: Towering cypress torii gate and 170-acre forested sacred path",
      "Takeshita Street: Colorful Harajuku fashion, crepe shops, and kawaii boutiques",
      "Shibuya Scramble Crossing & bronze Hachiko memorial statue",
      "Shibuya PARCO: Official Pokémon Center, Nintendo Tokyo, and CAPCOM stores",
      "Mega Don Quijote Shibuya: 8 floors of tax-free cosmetics, snacks, and gadgets",
    ],
    suggestedSequence: [
      "1. Take direct Ginza Line from Asakusa to Shibuya, then short walk to Meiji Jingu (start early by 9:00 AM)",
      "2. Walk through shaded forest approach to Meiji Jingu Shrine main courtyard",
      "3. Window shop down Takeshita Street and grab a fresh Harajuku crepe",
      "4. Walk down Cat Street / Meiji-dori to Shibuya Scramble Crossing",
      "5. Cross the Scramble and view the intersection from Starbucks 2F window",
      "6. Air-conditioned afternoon shopping at PARCO and Mega Donki",
    ],
    mustDo: [
      "Experience Meiji Jingu forest in the calm morning hours",
      "Cross Shibuya Scramble during a green light rush",
      "Explore Pokémon Center Shibuya with life-sized animatronic Mewtwo",
    ],
    optionalOrSkippable: [
      "Takeshita Street crowded midday (walk through briskly or use parallel Meiji-dori)",
      "Paid Shibuya Sky observation deck (free view from Starbucks / Mag's Park works well)",
    ],
    expectedCost: "Free shrine entrance · ¥600 for crepes · ¥1,000–1,500 for ramen lunch",
    foodNearby: "Marion Crepes Harajuku, Ichiran Ramen Shibuya, Uogashi Nihon-Ichi standing sushi",
    facilities: {
      toilets: "Restrooms at Meiji Jingu entrance, Harajuku Station, and Shibuya PARCO/Hikarie.",
      lockers: "Coin lockers inside Shibuya Station and JR Harajuku Station.",
    },
    weatherSuitability: {
      sunAdvice: "Front-load Meiji Jingu before 11:00 AM for tree shade. Spend midday inside PARCO & Hikarie malls.",
      rainAdvice: "Shibuya Station is connected underground to Mark City, Hikarie, and ShinQs food halls without stepping outside.",
    },
    transitFromBase: {
      route: "Asakusa Station → Tokyo Metro Ginza Line direct to Shibuya terminal station.",
      time: "35–40 min (0 transfers)",
      fare: "¥320 (¥317 IC Card)",
      exit: "Hachiko Exit (ハチ公口)",
    },
    nextDestinationHint: "Akihabara Electric Town on Day 6.",
  },
  {
    id: "akihabara-electric-town",
    name: "Akihabara Electric Town",
    japaneseName: "秋葉原電気街",
    district: "Chiyoda City",
    tagline: "The world's capital of anime, gaming, electronics, and retro arcades.",
    image:
      "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=1200&q=80",
    recommendedDuration: "4 to 5 hours",
    whatYoullSee: [
      "Radio Kaikan: 10 vertical floors of figures, cards, and hobby collectibles",
      "Animate Akihabara: Japan's premier multi-story anime and manga department store",
      "Yodobashi Camera Multimedia Akiba: 9 floors of tech, cameras, and duty-free electronics",
      "GiGO & Taito Station multi-floor claw machine and music rhythm arcades",
      "Kanda Myojin: 1,300-year-old shrine offering IT and tech blessing talismans",
    ],
    suggestedSequence: [
      "1. Tsukuba Express direct from Asakusa to Akihabara (15 min ride)",
      "2. Start with calm morning visit to Kanda Myojin Shrine (5 min walk from station)",
      "3. Explore Radio Kaikan right outside the Electric Town Exit",
      "4. Walk down Chuo-dori main strip (pedestrian-only on Sunday afternoons)",
      "5. Play claw machines and Taiko Drum arcade games at GiGO",
      "6. Complete tax-free electronics and souvenir shopping inside Yodobashi Akiba",
    ],
    mustDo: [
      "Browse the vertical figure showcases inside Radio Kaikan",
      "Experience Sunday pedestrian paradise (Hokoten) on Chuo-dori",
      "Try high-speed train conveyor sushi at Uobei Akihabara",
    ],
    optionalOrSkippable: [
      "Maid cafes (novelty experience, but pricier cover charges: ~¥1,500–3,000/person)",
      "Deep retro component alleys (unless specifically looking for soldering parts)",
    ],
    expectedCost: "Free to browse · ¥100–300 per arcade play · ¥1,000–1,500 for conveyor sushi",
    foodNearby: "Uobei Conveyor Sushi, Radio Kaikan Gyoza, Yodobashi 8F Restaurant Floor",
    facilities: {
      toilets: "Clean restrooms on every floor of Yodobashi Camera and inside Radio Kaikan.",
      lockers: "Hundreds of coin lockers on JR Akihabara Station concourse.",
    },
    weatherSuitability: {
      sunAdvice: "Sunday pedestrian zone has open sun; use air-conditioned megastores for cooling intervals.",
      rainAdvice: "Radio Kaikan is directly attached to the station exit; Yodobashi is 1 minute covered walk.",
    },
    transitFromBase: {
      route: "Asakusa (Tsukuba Express) → Akihabara Station direct (2 stops).",
      time: "15 min (0 transfers)",
      fare: "¥150 (IC Card)",
      exit: "Electric Town Exit (電気街口)",
    },
    nextDestinationHint: "Final packing and Narita Airport departure on Day 7.",
  },
];

export const disneyGuides: DisneyParkGuide[] = [
  {
    parkId: "disneyland",
    parkName: "Tokyo Disneyland",
    icon: "🏰",
    dateStr: "Wed, Sep 2, 2026",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    ropeDropStrategy:
      "Arrive at security gates 45–60 min before official open. Rope drop straight to Fantasyland for Enchanted Tale of Beauty and the Beast, followed immediately by Pooh's Hunny Hunt.",
    lands: [
      {
        name: "Fantasyland",
        icon: "🏰",
        sub: "Tokyo's two must-ride exclusives",
        rides: [
          {
            name: "Enchanted Tale of Beauty and the Beast",
            tier: 1,
            desc: "Trackless dark ride inside the Beast's towering pink castle. Moving dishes and emotional animatronics.",
            land: "Fantasyland",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Pooh's Hunny Hunt",
            tier: 1,
            desc: "Tokyo-exclusive trackless ride bouncing unpredictably through the Hundred Acre Wood. Pure magic.",
            land: "Fantasyland",
            image:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Haunted Mansion",
            tier: 1,
            desc: "Spooky atmospheric dark ride in an air-conditioned doom buggy. Mild scares, no big drops.",
            land: "Fantasyland",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "it's a small world",
            tier: 2,
            desc: "Classic boat cruise with added Disney and Pixar character cameos. Great seated A/C break.",
            land: "Fantasyland",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Peter Pan's Flight",
            tier: 2,
            desc: "Suspended galleon sailing over glowing nighttime London. Shorter queue in late afternoon.",
            land: "Fantasyland",
            image:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
      {
        name: "Tomorrowland",
        icon: "🚀",
        sub: "Interactive games & simulators",
        rides: [
          {
            name: "Monsters, Inc. Ride & Go Seek!",
            tier: 1,
            desc: "Exclusive to Tokyo: use interactive flashlights to illuminate hidden animatronic monsters in Monstropolis.",
            land: "Tomorrowland",
            image:
              "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "The Happy Ride with Baymax",
            tier: 2,
            desc: "Upbeat musical whip spinner ride with infectious Japanese pop music.",
            land: "Tomorrowland",
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 81cm",
          },
          {
            name: "Star Tours: The Adventures Continue",
            tier: 2,
            desc: "3D motion simulator with randomized Star Wars film sequences. Fast-moving queue line.",
            land: "Tomorrowland",
            image:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 102cm",
          },
        ],
      },
      {
        name: "Westernland & Critter Country",
        icon: "🤠",
        sub: "Thrills & river adventures",
        rides: [
          {
            name: "Big Thunder Mountain",
            tier: 1,
            desc: "Runaway mine train coaster curving through red rock canyons. Moderate thrill, no inversion.",
            land: "Westernland",
            image:
              "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 102cm",
          },
          {
            name: "Splash Mountain",
            tier: 1,
            desc: "Log flume dark ride culminating in a steep 52.5-foot drop. One of the last classic originals in the world.",
            land: "Critter Country",
            image:
              "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 90cm",
            isHighFall: true,
          },
          {
            name: "Country Bear Theater",
            tier: 3,
            desc: "Seasonal Vacation Jamboree animatronic musical show. Cool shaded rest.",
            land: "Westernland",
            image:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
      {
        name: "Adventureland",
        icon: "🏯",
        sub: "Pirates & jungle boat tours",
        rides: [
          {
            name: "Pirates of the Caribbean",
            tier: 1,
            desc: "Longest version in any Disney park with elaborate bay scenes and Jack Sparrow animatronics.",
            land: "Adventureland",
            image:
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Jungle Cruise: Wildlife Expeditions",
            tier: 2,
            desc: "Skipper-led boat journey. Extra atmospheric after sunset with nighttime lighting.",
            land: "Adventureland",
            image:
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
    ],
    shows: [
      {
        name: "Disney Harmony in Color",
        desc: "Flagship daytime parade featuring 7 vibrant floats from Zootopia, Moana, Coco, Big Hero 6, and Up.",
        schedule: "Daytime (approx 1:00 PM)",
        icon: "🎊",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Reach for the Stars: Everlasting Dreams",
        desc: "Nighttime Cinderella Castle projection mapping and pyrotechnics summer spectacular.",
        schedule: "Nighttime (approx 8:00 PM)",
        icon: "✨",
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Tokyo Disneyland Electrical Parade Dreamlights",
        desc: "Legendary illuminated night parade with 20+ million LED lights and Disney classics.",
        schedule: "Nighttime (approx 8:45 PM)",
        icon: "💡",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      },
    ],
    hourlyPlan: [
      { time: "08:00", activity: "Rope drop to Beauty and the Beast & Pooh's Hunny Hunt" },
      { time: "09:15", activity: "Monsters Inc. & Big Thunder Mountain" },
      { time: "10:30", activity: "Splash Mountain & Pirates of the Caribbean" },
      { time: "12:00", activity: "Seated lunch break (Hungry Bear Curry or Plaza Pavilion)" },
      { time: "13:00", activity: "Disney Harmony in Color parade" },
      { time: "14:15", activity: "Star Tours, Haunted Mansion, and Toontown rides" },
      { time: "17:00", activity: "Souvenir shopping, snacks, re-rides" },
      { time: "19:00", activity: "Dinner in World Bazaar or Adventureland" },
      { time: "20:00", activity: "Reach for the Stars Castle show & Dreamlights parade" },
    ],
  },
  {
    parkId: "disneysea",
    parkName: "Tokyo DisneySea",
    icon: "🌊",
    dateStr: "Fri, Sep 4, 2026",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    ropeDropStrategy:
      "Arrive early. Open the official Tokyo Disney Resort app as soon as through the turnstile and purchase Premier Access for Anna and Elsa's Frozen Journey, then head to Peter Pan or Journey to the Center of the Earth.",
    lands: [
      {
        name: "Fantasy Springs (New 2024–2026)",
        icon: "❄️",
        sub: "Frozen, Tangled & Peter Pan (Open Walk-in Access)",
        rides: [
          {
            name: "Anna and Elsa's Frozen Journey",
            tier: 1,
            desc: "#1 Priority in the entire park. Breathtaking musical boat journey with stunning audio-animatronics.",
            land: "Fantasy Springs",
            image:
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Peter Pan's Never Land Adventure",
            tier: 1,
            desc: "3D motion simulator soaring through Never Land with the Lost Boys to rescue John from Captain Hook.",
            land: "Fantasy Springs",
            image:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 102cm",
          },
          {
            name: "Rapunzel's Lantern Festival",
            tier: 2,
            desc: "Romantic boat ride drifting into the iconic floating lantern scene from Tangled.",
            land: "Fantasy Springs",
            image:
              "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Fairy Tinker Bell's Busy Buggies",
            tier: 3,
            desc: "Whimsical family buggy spinner through Pixie Hollow seasons.",
            land: "Fantasy Springs",
            image:
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
      {
        name: "Mysterious Island & Lost River Delta",
        icon: "🌋",
        sub: "Volcano & temple expedition thrillers",
        rides: [
          {
            name: "Journey to the Center of the Earth",
            tier: 1,
            desc: "DisneySea's flagship thrill dark ride descending into Mount Prometheus before a high-speed launch.",
            land: "Mysterious Island",
            image:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 117cm",
            isHighFall: true,
          },
          {
            name: "20,000 Leagues Under the Sea",
            tier: 1,
            desc: "Suspended submarine vehicle where you steer searchlights to spot deep-sea sea creatures.",
            land: "Mysterious Island",
            image:
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Indiana Jones Adventure: Temple of the Crystal Skull",
            tier: 1,
            desc: "Rough-terrain Jeep simulator through booby-trapped jungle ruins. Single Rider line recommended.",
            land: "Lost River Delta",
            image:
              "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 117cm",
          },
        ],
      },
      {
        name: "Mediterranean Harbor & American Waterfront",
        icon: "🗽",
        sub: "Flight simulators & harbor vistas",
        rides: [
          {
            name: "Soaring: Fantastic Flight",
            tier: 1,
            desc: "Gentle hang-glider theater simulator with realistic flight over world wonders with wind and scents.",
            land: "Mediterranean Harbor",
            image:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 102cm",
          },
          {
            name: "Tower of Terror",
            tier: 1,
            desc: "Story-driven freefall drop tower inside the cursed Hotel Hightower. Random drop sequence.",
            land: "American Waterfront",
            image:
              "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "Over 102cm",
            isHighFall: true,
          },
          {
            name: "Venetian Gondolas",
            tier: 2,
            desc: "Authentic gondola cruise with singing gondoliers through the canals. Unbeatable at sunset.",
            land: "Mediterranean Harbor",
            image:
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
      {
        name: "Arabian Coast & Mermaid Lagoon",
        icon: "🐫",
        sub: "Family favorites & indoor kingdom",
        rides: [
          {
            name: "Sindbad's Storybook Voyage",
            tier: 1,
            desc: "Beloved dark boat ride with 100+ animatronics and Alan Menken's 'Compass of Your Heart' anthem.",
            land: "Arabian Coast",
            image:
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
          {
            name: "Triton's Kingdom (Mermaid Lagoon)",
            tier: 3,
            desc: "Fully indoor under-the-sea playground with spinners, slides, and kids rides. Great rain hideout.",
            land: "Mermaid Lagoon",
            image:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            heightRequirement: "No height limit",
          },
        ],
      },
    ],
    shows: [
      {
        name: "Believe! Sea of Dreams",
        desc: "DisneySea's premier nighttime harbor show across Mediterranean Harbor with pyrotechnics, laser barges, and Disney heroes.",
        schedule: "Nighttime (approx 7:30 PM)",
        icon: "🌟",
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Sparkling Jubilee Celebration",
        desc: "25th-Anniversary harbor greeting with Mickey and friends in Jubilee Blue on decorated barges.",
        schedule: "Daytime (1–2 times daily)",
        icon: "💙",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      },
    ],
    hourlyPlan: [
      { time: "08:00", activity: "Rope drop to Fantasy Springs (Frozen Journey & Peter Pan)" },
      { time: "10:00", activity: "Journey to the Center of the Earth & Indiana Jones" },
      { time: "11:30", activity: "Tower of Terror & 20,000 Leagues Under the Sea" },
      { time: "12:45", activity: "Seated lunch at Casbah Food Court or Zambini Brothers" },
      { time: "13:45", activity: "Soaring: Fantastic Flight & Sindbad's Storybook Voyage" },
      { time: "15:30", activity: "Mermaid Lagoon & Rapunzel's Lantern Festival" },
      { time: "17:30", activity: "Venetian Gondolas during golden hour sunset" },
      { time: "18:30", activity: "Dinner in American Waterfront or Mediterranean Harbor" },
      { time: "19:30", activity: "Believe! Sea of Dreams nighttime harbor spectacular" },
    ],
  },
];

export const disneyRestaurants: RestaurantItem[] = [
  // Disneyland
  {
    name: "Restaurant Hokusai",
    land: "World Bazaar (Disneyland)",
    serviceType: "Table service",
    cuisine: "Japanese Tempura & Tonkatsu",
    desc: "Only full traditional Japanese table-service restaurant in Disneyland, with views of Cinderella Castle.",
    signatureMenu: "Tempura set meal, Tonkatsu pork cutlet set, Miso soup",
    isPrioritySeating: true,
    icon: "🍱",
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Blue Bayou Restaurant",
    land: "Adventureland (Disneyland)",
    serviceType: "Table service",
    cuisine: "French-Creole Course Dining",
    desc: "Dine under a twilight sky with fireflies as Pirates of the Caribbean boats drift quietly past your table.",
    signatureMenu: "Chef's course prime steak, Creole seafood gumbo, chocolate dessert",
    isPrioritySeating: true,
    icon: "🕯️",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hungry Bear Restaurant",
    land: "Westernland (Disneyland)",
    serviceType: "Counter service",
    cuisine: "Japanese Curry Rice",
    desc: "Spacious 690-seat dining hall with fast service and hearty portions. Great family value.",
    signatureMenu: "Pork cutlet curry, chicken curry rice with steamed rice (~¥900–1,200)",
    isPrioritySeating: false,
    icon: "🍛",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Queen of Hearts Banquet Hall",
    land: "Fantasyland (Disneyland)",
    serviceType: "Table service",
    cuisine: "Western / Alice in Wonderland Themed",
    desc: "Impeccably themed palace interior with stained glass, playing card guards, and heart-shaped treats.",
    signatureMenu: "Heart-shaped hamburger steak, flank steak plate, unbirthday cake",
    isPrioritySeating: false,
    icon: "♥️",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tomorrowland Terrace",
    land: "Tomorrowland (Disneyland)",
    serviceType: "Counter service",
    cuisine: "Burgers & Sandwiches",
    desc: "Huge 1,540-seat dining room with direct castle views and fast turnover.",
    signatureMenu: "Baymax burger bun with fried chicken, seasoned french fries",
    isPrioritySeating: false,
    icon: "🍔",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  // DisneySea
  {
    name: "Magellan's",
    land: "Mediterranean Harbor (DisneySea)",
    serviceType: "Table service",
    cuisine: "Fine Dining & Global Courses",
    desc: "Universally rated the finest dining experience in Tokyo Disney Resort, inside the Fortress gold dome.",
    signatureMenu: "Magellan course (hors d'oeuvres, roast beef or fresh catch, wine pairing)",
    isPrioritySeating: true,
    icon: "🧭",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ristorante di Canaletto",
    land: "Mediterranean Harbor (DisneySea)",
    serviceType: "Table service",
    cuisine: "Italian Pasta & Pizza",
    desc: "Waterfront dining along the Venetian canal as gondolas glide past.",
    signatureMenu: "Stone-oven baked margherita pizza, seafood linguine, espresso tiramisu",
    isPrioritySeating: true,
    icon: "🍝",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Casbah Food Court",
    land: "Arabian Coast (DisneySea)",
    serviceType: "Counter service",
    cuisine: "Authentic Indian Curry & Naan",
    desc: "Exotic marketplace dining room with rich curry aromas and generous family portions.",
    signatureMenu: "Beef & chicken curry combos served with fresh pillowy tandoori naan (~¥1,100)",
    isPrioritySeating: false,
    icon: "🍛",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "The Snuggly Duckling",
    land: "Fantasy Springs (DisneySea)",
    serviceType: "Counter service",
    cuisine: "Gourmet Burgers (Tangled Themed)",
    desc: "Lively pub themed after the outlaws' hideout in Tangled with rich woodwork.",
    signatureMenu: "Duckling dream cheeseburger, sweet ever-after dessert muffin",
    isPrioritySeating: false,
    icon: "🍺",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Royal Banquet of Arendelle",
    land: "Fantasy Springs (DisneySea)",
    serviceType: "Counter service",
    cuisine: "Nordic & Western Cuisine (Frozen Themed)",
    desc: "Dine inside Arendelle Castle among coronation portraits and royal tapestries.",
    signatureMenu: "Arendelle royal set (beef stew in bread bowl, Olaf marshmallow sweet)",
    isPrioritySeating: false,
    icon: "👑",
    image:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    menuImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
];

export const transportRoutes: TransportRoute[] = [
  {
    id: "narita-arrival",
    title: "Narita Airport → Hotel Plus Hostel Asakusa 2",
    dateOrFrequency: "Tue, Sep 1 — Arrival (Flight arr 11:35 AM)",
    estimatedTime: "55–80 min",
    totalFare: "≈ ¥1,300–1,350",
    transfers: 0,
    icon: "✈️",
    legs: [
      {
        step: 1,
        title: "Board at Narita Airport Terminal 2·3 (or Terminal 1)",
        detail:
          "Follow orange Keisei Line signs. Board the Keisei Access Express (アクセス特急) bound for Haneda Airport or Nishi-Magome.",
        badges: ["Board Keisei Access Express", "Orange Signs"],
      },
      {
        step: 2,
        title: "Ride direct through to Asakusa Station",
        detail:
          "Train runs through seamlessly onto the Toei Asakusa Line. No transfer needed if on the Haneda/Nishi-Magome through-train.",
        badges: ["0 Transfers", "Direct"],
      },
      {
        step: 3,
        title: "Exit toward Hanakawado / Kaminarimon",
        detail:
          "Exit Asakusa Station and walk 3–4 minutes to Hotel Plus Hostel TOKYO ASAKUSA 2 (1-7-10 Hanakawado).",
        badges: ["3-min Walk", "Hanakawado"],
      },
    ],
    tips: "Keisei trains bound for Keisei-Ueno do NOT stop at Asakusa. Confirm destination board reads Haneda Airport (羽田空港) or Nishi-Magome before boarding.",
  },
  {
    id: "hotel-disney",
    title: "Hotel Asakusa → Tokyo Disney Resort (Maihama)",
    dateOrFrequency: "Wed Sep 2 & Fri Sep 4 (Disney Days)",
    estimatedTime: "50–55 min",
    totalFare: "≈ ¥410–470 + ¥260 monorail (DisneySea)",
    transfers: 2,
    icon: "🎡",
    legs: [
      {
        step: 1,
        title: "Asakusa Station → Kanda Station",
        detail: "Board the Tokyo Metro Ginza Line toward Shibuya. Ride 5 stops to Kanda Station.",
        badges: ["Ginza Line", "¥180"],
      },
      {
        step: 2,
        title: "Transfer at Kanda to JR Line → Tokyo Station",
        detail: "Follow JR signs and take JR Yamanote or Keihin-Tohoku Line 1 stop to Tokyo Station.",
        badges: ["JR Line", "1 stop"],
      },
      {
        step: 3,
        title: "Walk to JR Keiyo Line & Ride to Maihama",
        detail:
          "Inside Tokyo Station, follow yellow Keiyo Line signs down 'Keiyo Street' (allow 8–10 min walk). Board train to Maihama Station (15 min).",
        badges: ["JR Keiyo Line", "¥230"],
      },
      {
        step: 4,
        title: "Arrive at Maihama",
        detail:
          "For Disneyland: Exit South Gate and walk 5 min directly into the park. For DisneySea: Take Disney Resort Line monorail 2 stops to DisneySea Station (¥260).",
        badges: ["Disneyland: Walk", "DisneySea: Monorail"],
      },
    ],
    tips: "On the return trip, Maihama Station gets packed immediately after nighttime fireworks. Leaving 15 min early guarantees seats.",
  },
  {
    id: "hotel-studio-tour",
    title: "Hotel Asakusa → Warner Bros. Studio Tour Tokyo",
    dateOrFrequency: "Thu, Sep 3 · 1:00 PM Ticket",
    estimatedTime: "55–65 min",
    totalFare: "≈ ¥325–330",
    transfers: 0,
    icon: "🪄",
    legs: [
      {
        step: 1,
        title: "Walk to Kuramae Station (Toei Oedo Line)",
        detail: "Walk from the Hanakawado hotel down to Kuramae Station Oedo Line entrance.",
        badges: ["Walk to Oedo Line"],
      },
      {
        step: 2,
        title: "Ride Toei Oedo Line direct to Toshimaen Station",
        detail:
          "Board Toei Oedo Line bound for Hikarigaoka (光が丘). This is a direct ride without transfers (~17 stops, 50 min).",
        badges: ["Toei Oedo Line", "Direct"],
      },
      {
        step: 3,
        title: "Exit Toshimaen Station to Studio Tour",
        detail: "Take the main Toshimaen exit. The Harry Potter Studio Tour entrance is an easy 2-minute walk.",
        badges: ["2-min Walk"],
      },
    ],
    tips: "Eat lunch in Asakusa first. Toshimaen station signage points directly to the studio gates.",
  },
  {
    id: "hotel-shibuya",
    title: "Hotel Asakusa → Shibuya Scramble & Harajuku",
    dateOrFrequency: "Sat, Sep 5",
    estimatedTime: "35–40 min",
    totalFare: "≈ ¥317–320",
    transfers: 0,
    icon: "🚦",
    legs: [
      {
        step: 1,
        title: "Board Tokyo Metro Ginza Line at Asakusa",
        detail: "Board Ginza Line toward Shibuya (terminal station). No transfers needed.",
        badges: ["Ginza Line", "Direct"],
      },
      {
        step: 2,
        title: "Exit at Shibuya Station (Hachiko Exit)",
        detail:
          "Follow yellow Hachiko Exit signs. Step out directly facing the Hachiko statue and famous Scramble Crossing.",
        badges: ["Hachiko Exit"],
      },
    ],
    tips: "For Meiji Jingu Shrine first, either walk 12 min north along the shaded avenue or ride JR Yamanote 1 stop to Harajuku.",
  },
  {
    id: "hotel-akihabara",
    title: "Hotel Asakusa → Akihabara Electric Town",
    dateOrFrequency: "Sun, Sep 6",
    estimatedTime: "15 min",
    totalFare: "≈ ¥150",
    transfers: 0,
    icon: "🕹️",
    legs: [
      {
        step: 1,
        title: "Walk to Tsukuba Express Asakusa Station",
        detail: "Walk to the Tsukuba Express underground entrance near Rox department store.",
        badges: ["Tsukuba Express"],
      },
      {
        step: 2,
        title: "Ride Tsukuba Express 2 stops to Akihabara",
        detail: "Fast direct ride (approx 4–5 min on train).",
        badges: ["Direct", "Fast"],
      },
      {
        step: 3,
        title: "Exit at Electric Town Exit (電気街口)",
        detail: "Step out right into the heart of Radio Kaikan, Animate, and GiGO arcades.",
        badges: ["Electric Town Exit"],
      },
    ],
    tips: "Akihabara main boulevard is closed to cars on Sunday afternoons for open pedestrian walking.",
  },
  {
    id: "hotel-departure",
    title: "Hotel Asakusa → Narita Airport T2 Departure",
    dateOrFrequency: "Mon, Sep 7 — 13:45 PM Flight",
    estimatedTime: "55–80 min",
    totalFare: "≈ ¥1,300–1,350",
    transfers: 0,
    icon: "🛫",
    legs: [
      {
        step: 1,
        title: "Check out by 8:15 AM & Walk to Asakusa Station",
        detail: "Take the short walk to Asakusa Station Toei Asakusa Line platform with luggage.",
        badges: ["Depart 8:30 AM"],
      },
      {
        step: 2,
        title: "Board Keisei Access Express to Narita Airport T2",
        detail:
          "Confirm destination board shows Narita Airport (成田空港). Ride direct with no transfer to Terminal 2.",
        badges: ["Direct Airport Train", "0 Transfers"],
      },
      {
        step: 3,
        title: "Narita T2 Executive Lounge 2 (BDO JCB Platinum)",
        detail: "Relax in Narita T2 Executive Lounge 2 before boarding gate opens.",
        badges: ["Lounge 2", "BDO JCB Card"],
      },
    ],
    tips: "Leaving Asakusa by 8:30 AM ensures arrival around 9:45 AM, providing a generous 4-hour cushion for check-in, lounge access, and duty-free shopping.",
  },
];

export const packingPresets: PackingItemPreset[] = [
  // Documents
  {
    id: "doc-passport",
    title: "Passports (valid 6+ months) & physical copies",
    category: "documents",
    note: "Ask for an entry stamp at airport immigration for instant tax-free shopping",
    isRequired: true,
  },
  {
    id: "doc-vjw",
    title: "Visit Japan Web registration (Immigration & Customs QR codes)",
    category: "documents",
    note: "Take offline screenshots of the QR codes on all phones before boarding",
    isRequired: true,
  },
  {
    id: "doc-disney",
    title: "Tokyo Disney park tickets in Tokyo Disney Resort app",
    category: "documents",
    note: "Sept 2 (Disneyland) & Sept 4 (DisneySea)",
    isRequired: true,
  },
  {
    id: "doc-hp",
    title: "Warner Bros. Studio Tour timed tickets (1:00 PM Sept 3)",
    category: "documents",
    note: "Save digital confirmation PDF / barcode",
    isRequired: true,
  },
  {
    id: "doc-insurance",
    title: "Travel insurance policies & emergency hotline numbers",
    category: "documents",
  },
  {
    id: "doc-cash",
    title: "Japanese Yen cash (small bills) & backup credit/debit cards",
    category: "documents",
    note: "7-Eleven ATMs are most reliable for foreign cards",
    isRequired: true,
  },
  {
    id: "doc-suica",
    title: "Digital Suica / PASMO added to Apple Wallet or Google Wallet",
    category: "documents",
    note: "Top up with Visa/Mastercard before landing to skip airport ticket machines",
  },
  // Clothing
  {
    id: "cloth-shoes",
    title: "Broken-in walking shoes / sneakers (15,000–20,000 steps/day)",
    category: "clothing",
    isRequired: true,
  },
  {
    id: "cloth-breathable",
    title: "Lightweight, quick-dry breathable shirts & shorts",
    category: "clothing",
    note: "Early Sept Tokyo is hot & humid (30–32°C)",
  },
  {
    id: "cloth-cardigan",
    title: "Light cardigan / thin overshirt for chilly air-conditioned trains",
    category: "clothing",
  },
  {
    id: "cloth-modest",
    title: "Modest outfit for Sensō-ji & Meiji Jingu Shinto shrines",
    category: "clothing",
  },
  // Rain & Heat Gear
  {
    id: "gear-umbrella",
    title: "Compact travel umbrella (or buy ¥500 clear umbrella at 7-Eleven)",
    category: "weather",
  },
  {
    id: "gear-fan",
    title: "Portable handheld fan or neck cooling fan",
    category: "weather",
    note: "Lifesaver in Tokyo summer heat",
  },
  {
    id: "gear-sunscreen",
    title: "High-SPF sunscreen, sunglasses, and sun hat",
    category: "weather",
  },
  {
    id: "gear-poncho",
    title: "Lightweight rain ponchos for Disney park days",
    category: "weather",
  },
  {
    id: "gear-bottle",
    title: "Refillable insulated water bottle",
    category: "weather",
  },
  // Electronics
  {
    id: "elec-powerbank",
    title: "High-capacity power bank (10,000–20,000mAh) & cables",
    category: "electronics",
    note: "Must be in carry-on bag, not checked luggage",
    isRequired: true,
  },
  {
    id: "elec-esim",
    title: "Japan eSIM or Pocket Wi-Fi arranged before departure",
    category: "electronics",
    isRequired: true,
  },
  {
    id: "elec-firstaid",
    title: "Personal prescription medications, motion sickness pills & band-aids",
    category: "electronics",
  },
  // Park Extras
  {
    id: "park-daypack",
    title: "Lightweight crossbody daypack & foldable shopping tote",
    category: "park",
    note: "Convenience stores charge for plastic bags; carry your own shopping tote",
  },
  {
    id: "park-trashbag",
    title: "Small plastic ziplock bags for carrying your own trash",
    category: "park",
    note: "Public trash cans are very rare on Tokyo streets",
  },
];

export const etiquetteRules: EtiquetteRule[] = [
  {
    category: "trains",
    type: "do",
    title: "Set phone to 'Manner Mode' (silent) on all trains",
    desc: "Keep phone on vibrate and avoid talking on the phone. Speak in quiet whispers with companions.",
  },
  {
    category: "trains",
    type: "do",
    title: "Queue behind platform markings and stand on the left on escalators",
    desc: "In Tokyo, people stand on the left side of escalators and leave the right side clear for walkers.",
  },
  {
    category: "trains",
    type: "dont",
    title: "Don't eat or drink meals on local subway trains",
    desc: "Water or tea sips are fine, but eating snacks or meals is reserved for bullet trains (Shinkansen).",
  },
  {
    category: "dining",
    type: "dont",
    title: "Don't tip at restaurants, taxis, or hotels",
    desc: "Tipping is not customary in Japan and will cause confusion. Exceptional service is included.",
  },
  {
    category: "dining",
    type: "dont",
    title: "Avoid eating while walking on the street",
    desc: "Eat food right in front of the vendor stall or find a bench before finishing snacks.",
  },
  {
    category: "dining",
    type: "do",
    title: "Carry a small plastic bag for your trash",
    desc: "Public trash cans are rare. Hold your wrappers until returning to convenience stores or the hotel.",
  },
  {
    category: "temples",
    type: "do",
    title: "Rinse hands at the chozuya water pavilion before praying",
    desc: "Rinse left hand, right hand, cup water to rinse mouth, then rinse handle for the next person.",
  },
  {
    category: "temples",
    type: "do",
    title: "Walk along the side of the shrine path, not the exact center",
    desc: "The center path (seichū) is traditionally reserved for the kami (spirits).",
  },
  {
    category: "bath",
    type: "do",
    title: "Wash thoroughly at shower stalls before entering the public bath",
    desc: "Communal sento water is purely for soaking clean bodies. Never put soap or shampoo in the tub.",
  },
  {
    category: "bath",
    type: "dont",
    title: "No swimsuits in the sento baths",
    desc: "Baths are gender-separated and nude. Keep small modesty towel on your head or out of the water.",
  },
  {
    category: "disney",
    type: "dont",
    title: "No selfie sticks or drones inside Disney parks",
    desc: "Selfie sticks extending beyond hand grip are prohibited in Tokyo Disney parks.",
  },
];

export const souvenirDistricts: SouvenirDistrict[] = [
  {
    district: "Asakusa (Nakamise & Solamachi)",
    dayRef: "Day 1",
    icon: "⛩️",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
    shops: [
      {
        name: "Nakamise Shopping Street",
        desc: "Historic temple street lined with traditional craft stalls.",
        whatToBuy: "Folding sensu fans, Japanese tenugui towels, yukata, ningyo-yaki sweets, daruma dolls.",
      },
      {
        name: "Tokyo Solamachi (Skytree)",
        desc: "300+ modern specialty stores at the base of Skytree.",
        whatToBuy: "Regional snack gift boxes, Skytree merchandise, Studio Ghibli Donguri Republic goods.",
      },
    ],
  },
  {
    district: "Tokyo Disney Resort",
    dayRef: "Days 2 & 4",
    icon: "🏰",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    shops: [
      {
        name: "World Bazaar & Port Shops",
        desc: "Park-exclusive souvenir merchandise not sold anywhere else in the world.",
        whatToBuy: "Tokyo Disney character plushies, limited popcorn buckets, Duffy and Friends merchandise, collectible pins.",
      },
    ],
  },
  {
    district: "Shibuya & Harajuku",
    dayRef: "Day 5",
    icon: "🛍️",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
    shops: [
      {
        name: "Mega Don Quijote Shibuya",
        desc: "Gigantic multi-floor discount superstore open late with instant tax-free counter.",
        whatToBuy: "Japanese skincare, matcha snack boxes, quirky souvenirs, KitKat regional flavors, beauty gadgets.",
      },
      {
        name: "Pokémon Center Shibuya (PARCO)",
        desc: "Official flagship store featuring a life-sized animatronic Mewtwo.",
        whatToBuy: "Exclusive Shibuya graffiti Pikachu plushies, Pokémon card accessories, Nintendo merch.",
      },
      {
        name: "Kiddy Land Harajuku",
        desc: "Iconic 5-floor character superstore.",
        whatToBuy: "Sanrio, Hello Kitty, Snoopy Town, Rilakkuma, Chiikawa, and Sailor Moon gifts.",
      },
    ],
  },
  {
    district: "Akihabara Electric Town",
    dayRef: "Day 6",
    icon: "🕹️",
    image:
      "https://images.unsplash.com/photo-1554797589-7241bb691973?auto=format&fit=crop&w=800&q=80",
    shops: [
      {
        name: "Radio Kaikan & Animate",
        desc: "Hobby central with 10 floors of collectibles, manga, and anime figures.",
        whatToBuy: "Anime figurines, trading cards, gachapon capsule toys, acrylic stands, art books.",
      },
      {
        name: "Yodobashi Camera Multimedia Akiba",
        desc: "Massive 9-floor electronics department store with dedicated tax-free checkout.",
        whatToBuy: "Cameras, headphones, Japanese kitchen knives, electronics, Tamagotchi, Gunpla models.",
      },
    ],
  },
  {
    district: "Narita Airport Duty-Free",
    dayRef: "Day 7",
    icon: "🍫",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    shops: [
      {
        name: "Fa-So-La & Airport Omiyage Shops",
        desc: "Last chance post-security shopping for boxed sweets and treats.",
        whatToBuy: "Tokyo Banana, Shiroi Koibito cookies, Royce' Nama Chocolate, Ichiran Ramen souvenir boxes.",
      },
    ],
  },
];
