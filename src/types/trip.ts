export interface AirportLoungeInfo {
  airport: string;
  terminal: string;
  loungeName: string;
  primaryCard: string;
  backupCard?: string;
  notes?: string;
}

export interface FlightInfo {
  code: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  airfareEstimate?: string;
  passengerPNRs: {
    name: string;
    pnr: string;
  }[];
  lounge: AirportLoungeInfo;
  notes: string;
}

export interface HomeBase {
  name: string;
  japaneseName: string;
  address: string;
  japaneseAddress: string;
  nearestStation: string;
  bookingId: string;
  bookingPlatform: string;
  totalCostJPY: number;
  totalCostPHP: number;
  paymentStatus: string;
  roomDetails: string;
  amenities: string[];
  mapQuery: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TravelerDocument {
  id: string;
  travelerName: string;
  relationship?: string;
  pnr: string;
  passportNumber?: string;
  passportImage: string;
  visaNumber: string;
  visaImage: string;
  visaExpiry?: string;
}

export interface EmergencyPhrase {
  jp: string;
  en: string;
  romaji?: string;
  category?: "police" | "medical" | "directions" | "general";
}

export interface EmergencyPlaybook {
  id: string;
  title: string;
  icon: string;
  priority: "high" | "medium";
  description: string;
  steps: string[];
  helplines?: { label: string; number: string }[];
}

export interface EmergencyContact {
  label: string;
  number: string;
  japaneseLabel: string;
  desc: string;
  isDialable: boolean;
  hours?: string;
}

export interface TripMeta {
  tripName: string;
  japaneseTitle: string;
  destination: string;
  tagline: string;
  description: string;
  heroImage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dateDisplay: string;
  travelerCount: number;
  travelersLabel: string;
  marqueeHighlights: string[];
  stats: {
    days: number;
    travelers: number;
    highlights: string;
  };
  homeBase: HomeBase;
  flights: {
    outbound: FlightInfo;
    inbound: FlightInfo;
  };
  travelers: TravelerDocument[];
  emergencyContacts: EmergencyContact[];
  emergencyPhrases?: EmergencyPhrase[];
  emergencyPlaybooks?: EmergencyPlaybook[];
  defaultCurrencies: {
    homeCurrency: string; // e.g. "USD", "PHP", "EUR", "GBP"
    destCurrency: string; // e.g. "JPY"
    homeSymbol: string; // e.g. "$", "₱", "€", "£"
    destSymbol: string; // e.g. "¥"
    defaultConvertAmount: number;
    plannedBudgetHome: number;
    plannedBudgetDest?: number;
    initialCashDest: number;
    // Legacy compatibility fields
    plannedBudgetPHP?: number;
    plannedBudgetJPY?: number;
    initialCashJPY?: number;
  };
}

export interface TransitClickRef {
  routeId: string;
  title: string;
  travelTime: string;
  fare: string;
  stepSummary: string;
  mapQuery?: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  desc: string;
  icon?: string;
  badges?: string[];
  image?: string;
  transit?: TransitClickRef;
  ticketRefId?: string;
}

export interface ItineraryDay {
  dayNumber: string; // "01", "02", etc.
  date: string; // "TUE · SEP 1"
  shortDate: string; // "Sep 1"
  fullDateString: string; // "2026-09-01"
  title: string;
  area: string;
  icon: string;
  image: string;
  transitNote: string;
  transitSummary?: {
    from: string;
    to: string;
    time: string;
    fare: string;
    routeTitle: string;
  };
  sunPlan: TimelineEvent[];
  rainPlan: TimelineEvent[];
  foodQuest: string;
  weatherAdvice?: {
    sun: string;
    rain: string;
  };
}

export interface PlaceGuide {
  id: string;
  name: string;
  japaneseName: string;
  district: string;
  tagline: string;
  image: string;
  gallery?: string[];
  recommendedDuration: string;
  whatYoullSee: string[];
  suggestedSequence: string[];
  mustDo: string[];
  optionalOrSkippable: string[];
  expectedCost: string;
  foodNearby: string;
  facilities: {
    toilets: string;
    lockers: string;
    accessibility?: string;
  };
  weatherSuitability: {
    sunAdvice: string;
    rainAdvice: string;
  };
  transitFromBase: {
    route: string;
    time: string;
    fare: string;
    exit: string;
  };
  nextDestinationHint?: string;
}

export interface RideAttraction {
  name: string;
  tier: 1 | 2 | 3;
  desc: string;
  land: string;
  image: string;
  heightRequirement?: string;
  isHighFall?: boolean;
  isClosed?: boolean;
  closedNotice?: string;
}

export interface ShowPerformance {
  name: string;
  desc: string;
  schedule: string;
  icon: string;
  image?: string;
}

export interface DisneyParkGuide {
  parkId: "disneyland" | "disneysea";
  parkName: string;
  icon: string;
  dateStr: string;
  image: string;
  ropeDropStrategy: string;
  lands: {
    name: string;
    icon: string;
    sub: string;
    rides: RideAttraction[];
  }[];
  shows: ShowPerformance[];
  hourlyPlan: {
    time: string;
    activity: string;
  }[];
}

export interface RestaurantItem {
  name: string;
  land: string;
  serviceType: "Table service" | "Counter service" | "Snack / cart" | "Show restaurant" | "Hotel lounge";
  cuisine: string;
  desc: string;
  signatureMenu: string;
  isPrioritySeating: boolean;
  isRestricted?: boolean;
  restrictedNote?: string;
  icon: string;
  image: string;
  menuImage: string;
}

export interface TransportRoute {
  id: string;
  title: string;
  dateOrFrequency: string;
  estimatedTime: string;
  totalFare: string;
  transfers: number;
  icon: string;
  image?: string;
  legs: {
    step: number | string;
    title: string;
    detail: string;
    badges: string[];
  }[];
  tips?: string;
}

export interface PackingItemPreset {
  id: string;
  title: string;
  category: "documents" | "clothing" | "weather" | "electronics" | "park" | "custom";
  note?: string;
  isRequired?: boolean;
}

export interface EtiquetteRule {
  category: "trains" | "dining" | "temples" | "bath" | "disney" | "general";
  type: "do" | "dont";
  title: string;
  desc: string;
}

export interface SouvenirDistrict {
  district: string;
  dayRef: string;
  icon: string;
  image?: string;
  shops: {
    name: string;
    desc: string;
    whatToBuy: string;
  }[];
}

export type PaymentMethod =
  | "Cash"
  | "Primary Visa / Mastercard"
  | "Backup Travel Card"
  | "Apple Pay / Digital IC"
  | "Digital Wallet"
  | string;

export type ExpenseCategory =
  | "hotel"
  | "flights"
  | "food"
  | "transport"
  | "shopping"
  | "tickets"
  | "documents"
  | "other";

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number; // Destination Currency (e.g. JPY)
  currency: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  status: "paid" | "planned";
  notes?: string;
  convertedAmountHome?: number;
  convertedAmountPHP?: number;
}

export interface BookingDocument {
  id: string;
  title: string;
  type: "ticket" | "hotel" | "flight" | "qr" | "other";
  confirmationCode?: string;
  fileData?: string; // base64 / data URL / asset path
  fileName?: string;
  fileType?: string;
  notes?: string;
  amount?: string;
  dateAdded: string;
  // Structured cost, set only when the amount was entered via the numeric
  // Amount field (new bookings). Lets a booking auto-create/clean up a
  // linked ExpenseRecord in the Budget page instead of double entry.
  amountJPY?: number;
  amountPHP?: number;
  expenseStatus?: "paid" | "planned";
  linkedExpenseId?: string;
}

export interface MemoryPhoto {
  id: string;
  caption: string;
  location?: string;
  photoData: string; // base64
  dateTaken: string;
}
