"use client";

import React, { useState } from "react";
import Link from "next/link";
import { itineraryDays, tripMeta } from "../../data/trip-config";
import { Navigation } from "../../components/Navigation";
import { ReceiptUpload } from "../../components/ReceiptUpload";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFXRate } from "../../hooks/useFXRate";
import { ExpenseRecord, ExpenseCategory, PaymentMethod } from "../../types/trip";
import {
  Wallet,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Banknote,
  CreditCard,
  Building,
  Plane,
  Ticket,
  Utensils,
  Train,
  ShoppingBag,
  ShieldAlert,
  HelpCircle,
  Check,
  X,
  Sparkles,
  ArrowRightLeft,
  Minus,
  Equal,
  Landmark,
  ShieldCheck,
} from "lucide-react";

interface CashWithdrawalRecord {
  id: string;
  date: string;
  amountJPY: number;
  location: string;
  cardUsed: string;
  // The real PHP amount your card/bank actually charged for this withdrawal
  // (their FX rate + fees, known once the statement posts) — overrides the
  // live-rate estimate for this record once set. Undefined until then.
  actualPHPCharged?: number;
}

export default function BudgetPage() {
  const homeCurrency = tripMeta.defaultCurrencies.homeCurrency || "PHP";
  const destCurrency = tripMeta.defaultCurrencies.destCurrency || "JPY";
  const homeSymbol = tripMeta.defaultCurrencies.homeSymbol || "₱";
  const destSymbol = tripMeta.defaultCurrencies.destSymbol || "¥";

  const { rate: liveFxRate, isLoading: fxLoading } = useFXRate(
    homeCurrency,
    destCurrency
  );
  const fxRate = liveFxRate || 2.70;

  // 1. Overall Planned Budget
  const [plannedBudgetPHP, setPlannedBudgetPHP] = useLocalStorage<number>(
    "travel_tokyo_budget_php",
    tripMeta.defaultCurrencies.plannedBudgetPHP || 150000
  );
  const [initialCashJPY, setInitialCashJPY] = useLocalStorage<number>(
    "travel_tokyo_initial_cash_jpy",
    tripMeta.defaultCurrencies.initialCashJPY || 100000
  );
  // Real PHP amount your card/bank actually charged for the initial cash
  // exchange, once known — same "actual overrides the live estimate" pattern
  // as expenses and ATM withdrawals. undefined until set.
  const [initialCashActualPHP, setInitialCashActualPHP] = useLocalStorage<number | undefined>(
    "travel_tokyo_initial_cash_actual_php_v1",
    undefined
  );

  // ATM Cash Withdrawals Log
  const [cashWithdrawals, setCashWithdrawals] = useLocalStorage<CashWithdrawalRecord[]>(
    "travel_tokyo_cash_withdrawals_v1",
    []
  );

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInputPHP, setTempBudgetInputPHP] = useState(String(plannedBudgetPHP));
  const [tempCashInputJPY, setTempCashInputJPY] = useState(String(initialCashJPY));
  const [tempInitialCashActualPHP, setTempInitialCashActualPHP] = useState(
    initialCashActualPHP !== undefined ? String(initialCashActualPHP) : ""
  );

  const plannedBudgetJPY = Math.round(plannedBudgetPHP * fxRate);

  // 2. Fixed / Actual Paid Expenses (Section 1)
  const defaultPaidExpenses: ExpenseRecord[] = [
    {
      id: "paid-hotel-1759447607",
      title: "Hotel Plus Hostel TOKYO ASAKUSA 2 (Agoda Booking #1759447607)",
      amount: 89525,
      currency: "JPY",
      category: "hotel",
      paymentMethod: "RCBC Visa",
      date: "2026-09-01",
      status: "paid",
      notes: "1-7-10 Hanakawado · 2 Double Rooms · 6 Nights (Sep 1–7)",
    },
    {
      id: "paid-flights-mnl-nrt",
      title: "Airfare: Manila (MNL) ⇄ Tokyo Narita (NRT) for 5 Pax",
      amount: 66190,
      currency: "JPY",
      category: "flights",
      paymentMethod: "RCBC Visa",
      date: "2025-10-07",
      status: "paid",
      notes: "Cebu Pacific 5 Pax: ₱4,902.99 x 3 + ₱9,805.98 = Total ₱24,514.95 PHP · PNRs: WETQNY, WC2HXE, MH1ZRC, NLNDWD",
    },
    {
      id: "paid-vfs-visa-fees",
      title: "VFS Global Japan Visa Application Fees (5 Applicants)",
      amount: 10800,
      currency: "JPY",
      category: "documents",
      paymentMethod: "GCash",
      date: "2026-07-04",
      status: "paid",
      notes: "₱800 x 5 pax = ₱4,000 PHP · Reference #1151572948",
    },
  ];

  const [paidExpenses, setPaidExpenses, paidExpensesLoaded] = useLocalStorage<ExpenseRecord[]>(
    "travel_tokyo_paid_expenses_v3",
    defaultPaidExpenses
  );

  // 3. Planned / Expected Budget (Section 2)
  const defaultPlannedExpenses: ExpenseRecord[] = [
    {
      id: "plan-hp-studio-tickets",
      title: "Warner Bros. Studio Tour Tokyo Timed Entry (5 Tickets)",
      amount: 32500,
      currency: "JPY",
      category: "tickets",
      paymentMethod: "BDO JCB",
      date: "2026-09-03",
      status: "planned",
      notes: "Not booked yet. Target: Sep 3 afternoon · Toshimaen.",
    },
    {
      id: "plan-disney-passports",
      title: "Tokyo Disney Resort Park Tickets (Disneyland & DisneySea 5 Pax)",
      amount: 84000,
      currency: "JPY",
      category: "tickets",
      paymentMethod: "BDO Mastercard",
      date: "2026-09-02",
      status: "planned",
      notes: "Not booked yet. Plan: DisneySea Sep 2 & Disneyland Sep 4 (Official App).",
    },
    {
      id: "plan-food-7days",
      title: "Food & Dining Daily Allowance (7 Days x 5 Pax)",
      amount: 120000,
      currency: "JPY",
      category: "food",
      paymentMethod: "Cash",
      date: "2026-09-01",
      status: "planned",
      notes: "Ramen, Asakusa Menchi, sushi, melon pan, street snacks",
    },
    {
      id: "plan-train-suica",
      title: "Subway, Metro & Regional Train Fares",
      amount: 25000,
      currency: "JPY",
      category: "transport",
      paymentMethod: "BDO Mastercard",
      date: "2026-09-01",
      status: "planned",
      notes: "Physical Suica / PASMO IC card purchase & top-ups for 5 travelers (bought at Narita on arrival, no deposit for tourist cards)",
    },
    {
      id: "plan-shopping-donki",
      title: "Shopping, Souvenirs & Tax-Free Gifts",
      amount: 40000,
      currency: "JPY",
      category: "shopping",
      paymentMethod: "BDO JCB",
      date: "2026-09-05",
      status: "planned",
      notes: "Tax-free snacks, skincare, character merch, souvenirs",
    },
    {
      id: "plan-disney-snacks",
      title: "Park Treats, Snacks & Popcorn Buckets",
      amount: 15000,
      currency: "JPY",
      category: "food",
      paymentMethod: "Cash",
      date: "2026-09-02",
      status: "planned",
      notes: "Theme park snacks & refreshments across 2 park days",
    },
    {
      id: "plan-emergency-taxi",
      title: "Emergency Contingency & Taxi Buffer",
      amount: 10000,
      currency: "JPY",
      category: "other",
      paymentMethod: "MariBank",
      date: "2026-09-07",
      status: "planned",
      notes: "Late night transfers or weather contingency fund",
    },
  ];

  const [plannedExpenses, setPlannedExpenses, plannedExpensesLoaded] = useLocalStorage<ExpenseRecord[]>(
    "travel_tokyo_planned_expenses_v2",
    defaultPlannedExpenses
  );

  // One-time correction: HP Studio and Disney tickets were originally seeded as
  // "paid" before either was actually booked. If an earlier visit to this browser
  // already saved that stale "paid" data, move both back to planned/not-yet-paid
  // once, without touching anything since edited or deleted by hand.
  React.useEffect(() => {
    // Wait for the real localStorage read to finish — otherwise this would
    // evaluate against the pre-load default value instead of what's actually
    // stored in this browser.
    if (!paidExpensesLoaded) return;

    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_expense_status_corrected_v1") === "true";
    if (alreadyCorrected) return;

    const staleIds = ["paid-hp-studio-tickets", "paid-disney-passports"];
    const stalePaid = paidExpenses.filter((e) => staleIds.includes(e.id));
    if (stalePaid.length > 0) {
      setPaidExpenses((prev) => prev.filter((e) => !staleIds.includes(e.id)));
      setPlannedExpenses((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const toAdd = stalePaid
          .map((e) => {
            const replacement = defaultPlannedExpenses.find(
              (p) => p.id === e.id.replace("paid-", "plan-")
            );
            return replacement;
          })
          .filter((e): e is ExpenseRecord => !!e && !existingIds.has(e.id));
        return [...toAdd, ...prev];
      });
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_expense_status_corrected_v1", "true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidExpensesLoaded, paidExpenses]);

  // One-time correction: the train fares planned expense assumed Digital
  // Suica/PASMO (mobile wallet, no purchase fee) — the traveler decided to
  // buy physical IC cards at Narita instead, so patch the note on an
  // already-saved copy of that one record, once, without touching anything
  // edited by hand since. Same idiom as the correction above.
  React.useEffect(() => {
    if (!plannedExpensesLoaded) return;

    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_suica_note_corrected_v1") === "true";
    if (alreadyCorrected) return;

    const staleNote = "Digital Suica / PASMO top-ups for 5 travelers";
    setPlannedExpenses((prev) =>
      prev.map((e) =>
        e.id === "plan-train-suica" && e.notes === staleNote
          ? {
              ...e,
              notes:
                "Physical Suica / PASMO IC card purchase & top-ups for 5 travelers (bought at Narita on arrival, no deposit for tourist cards)",
            }
          : e
      )
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_suica_note_corrected_v1", "true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedExpensesLoaded]);

  // One-time correction: the two Disney park days were swapped (DisneySea is
  // now Day 2, Disneyland is now Day 4). Patches an already-saved copy of the
  // Disney tickets planned expense note to match, once, without touching
  // anything edited by hand since.
  React.useEffect(() => {
    if (!plannedExpensesLoaded) return;

    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_disney_days_note_corrected_v1") === "true";
    if (alreadyCorrected) return;

    const staleNote = "Not booked yet. Plan: Disneyland Sep 2 & DisneySea Sep 4 (Official App).";
    setPlannedExpenses((prev) =>
      prev.map((e) =>
        e.id === "plan-disney-passports" && e.notes === staleNote
          ? { ...e, notes: "Not booked yet. Plan: DisneySea Sep 2 & Disneyland Sep 4 (Official App)." }
          : e
      )
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_disney_days_note_corrected_v1", "true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedExpensesLoaded]);

  // Form State
  const [modalType, setModalType] = useState<"addPaid" | "addPlanned" | "edit" | "markPaid" | "addWithdrawal" | "editWithdrawal" | null>(null);
  const [activeEditingItem, setActiveEditingItem] = useState<ExpenseRecord | null>(null);
  const [activeEditingWithdrawal, setActiveEditingWithdrawal] = useState<CashWithdrawalRecord | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formAmountJPY, setFormAmountJPY] = useState("");
  // Which currency the amount above is actually being typed in. Some things
  // (VFS, Klook, most bookings) are genuinely charged in PHP before the trip —
  // forcing those into JPY-primary entry meant the PHP figure shown was never
  // what was actually paid, just today's exchange rate applied to a converted
  // number. Whichever currency is selected here is stored as the real, locked
  // figure; the other side is still shown but is a converted estimate.
  const [formCurrency, setFormCurrency] = useState<"JPY" | "PHP">("JPY");
  // Optional: the real PHP amount your card statement showed for this JPY
  // expense, once you know it — locks in `convertedAmountPHP` for this record
  // instead of the live FX-rate estimate. Blank keeps the live estimate.
  const [formActualPHP, setFormActualPHP] = useState("");
  const [formCategory, setFormCategory] = useState<ExpenseCategory>("food");
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>("Cash");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNotes, setFormNotes] = useState("");
  const [paidCategoryFilter, setPaidCategoryFilter] = useState<"all" | ExpenseCategory>("all");
  const [paidPaymentFilter, setPaidPaymentFilter] = useState("all");

  // ATM Withdrawal Form State
  const [withdrawalAmountJPY, setWithdrawalAmountJPY] = useState("");
  const [withdrawalActualPHP, setWithdrawalActualPHP] = useState("");
  const [withdrawalLocation, setWithdrawalLocation] = useState("7-Eleven Bank ATM (Asakusa)");
  const [withdrawalCard, setWithdrawalCard] = useState("BDO Mastercard");
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split("T")[0]);

  // Payment Method Options
  const paymentMethods: PaymentMethod[] = [
    "Cash",
    "BDO JCB",
    "BDO Mastercard",
    "RCBC Visa",
    "GCash",
    "MariBank",
    "UnionBank Visa",
    "Other Card / Wallet",
  ];

  const categories: { label: string; value: ExpenseCategory; icon: string }[] = [
    { label: "Hotel & Stay", value: "hotel", icon: "🏨" },
    { label: "Flights & Airfare", value: "flights", icon: "✈️" },
    { label: "Food & Dining", value: "food", icon: "🍱" },
    { label: "Train & Transit", value: "transport", icon: "🚆" },
    { label: "Shopping & Tax-Free", value: "shopping", icon: "🛍️" },
    { label: "Tickets & Attractions", value: "tickets", icon: "🎟️" },
    { label: "Documents & Visas", value: "documents", icon: "📄" },
    { label: "Other / Buffer", value: "other", icon: "📦" },
  ];

  // Mathematical Calculations
  const actualSpentJPY = paidExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  // Sums each item's real card-charge PHP figure where one has been entered,
  // falling back to the live FX-rate estimate for items that don't have one yet.
  const expensePHPValue = (item: ExpenseRecord) =>
    item.convertedAmountPHP !== undefined
      ? item.convertedAmountPHP
      : Math.round(item.amount / fxRate);

  const actualSpentPHP = paidExpenses.reduce(
    (sum, item) => sum + expensePHPValue(item),
    0
  );

  const expectedFutureSpendJPY = plannedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const expectedFutureSpendPHP = Math.round(expectedFutureSpendJPY / fxRate);

  // Credit Card Balance = Actual Spent minus these specific known costs
  // (matched by title keyword, case-insensitive) — not trip card spending
  // in the ongoing sense, regardless of date or category.
  const CARD_BALANCE_EXCLUDED_KEYWORDS = ["travel tax", "esim", "sim card", "simcard", "vfs", "airfare"];
  const excludedFromCardBalance = paidExpenses.filter((item) => {
    const title = item.title.toLowerCase();
    return CARD_BALANCE_EXCLUDED_KEYWORDS.some((keyword) => title.includes(keyword));
  });
  const excludedFromCardBalancePHP = excludedFromCardBalance.reduce(
    (sum, item) => sum + expensePHPValue(item),
    0
  );
  const excludedFromCardBalanceJPY = excludedFromCardBalance.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const creditCardBalancePHP = actualSpentPHP - excludedFromCardBalancePHP;
  const creditCardBalanceJPY = actualSpentJPY - excludedFromCardBalanceJPY;
  const creditCardBalanceItemCount = paidExpenses.length - excludedFromCardBalance.length;

  // =========================================================================
  // PHYSICAL CASH FORMULA: Total Amount Withdrawn − Actual Spent Cash = Balance On-Hand
  // =========================================================================
  const additionalWithdrawalsJPY = cashWithdrawals.reduce((sum, w) => sum + (Number(w.amountJPY) || 0), 0);
  const totalCashWithdrawnJPY = initialCashJPY + additionalWithdrawalsJPY;
  // Same real-charge-first logic as actualSpentPHP: use each withdrawal's actual
  // card-charged PHP once known, live-rate estimate otherwise. The initial cash
  // brought (not tied to a logged withdrawal) always uses the live estimate.
  const additionalWithdrawalsPHP = cashWithdrawals.reduce(
    (sum, w) => sum + (w.actualPHPCharged !== undefined ? w.actualPHPCharged : Math.round(w.amountJPY / fxRate)),
    0
  );
  const initialCashPHP =
    initialCashActualPHP !== undefined ? initialCashActualPHP : Math.round(initialCashJPY / fxRate);
  const totalCashWithdrawnPHP = initialCashPHP + additionalWithdrawalsPHP;

  // The physical wallet tracks yen notes only. PHP cash purchases remain Cash
  // records, but must never be converted into or deducted from the JPY wallet.
  const cashPaidExpenses = paidExpenses.filter(
    (e) => e.paymentMethod === "Cash" && e.currency !== "PHP"
  );
  const actualSpentCashJPY = cashPaidExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const actualSpentCashPHP = Math.round(actualSpentCashJPY / fxRate);

  const balanceCashOnHandJPY = totalCashWithdrawnJPY - actualSpentCashJPY;
  const balanceCashOnHandPHP = Math.round(balanceCashOnHandJPY / fxRate);

  // Sorted arrays by date descending (latest/newest on top)
  const sortedPaidExpenses = [...paidExpenses].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });

  const sortedPlannedExpenses = [...plannedExpenses].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });

  const sortedCashWithdrawals = [...cashWithdrawals].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });

  const nonCashPaymentMethods = Array.from(
    new Set(sortedPaidExpenses.filter((item) => item.paymentMethod !== "Cash").map((item) => item.paymentMethod))
  ).sort();

  const filteredPaidExpenses = sortedPaidExpenses.filter((item) => {
    const matchesCategory = paidCategoryFilter === "all" || item.category === paidCategoryFilter;
    const matchesPayment =
      paidPaymentFilter === "all" ||
      (paidPaymentFilter === "cash-jpy" && item.paymentMethod === "Cash" && item.currency !== "PHP") ||
      (paidPaymentFilter === "cash-php" && item.paymentMethod === "Cash" && item.currency === "PHP") ||
      item.paymentMethod === paidPaymentFilter;
    return matchesCategory && matchesPayment;
  });
  const filteredPaidExpensesPHP = filteredPaidExpenses.reduce(
    (sum, item) => sum + expensePHPValue(item),
    0
  );

  const paidExpenseDayGroups = [
    {
      key: "pre-travel",
      label: "Pre-travel expenses",
      subtitle: `Before ${itineraryDays[0]?.shortDate || tripMeta.startDate}`,
      expenses: filteredPaidExpenses.filter((item) => item.date < tripMeta.startDate),
    },
    ...itineraryDays.map((day, index) => ({
      key: day.fullDateString,
      label: `Day ${index + 1}`,
      subtitle: `${day.shortDate} · ${day.title}`,
      expenses: filteredPaidExpenses.filter((item) => item.date === day.fullDateString),
    })),
  ];

  const postTripExpenses = filteredPaidExpenses.filter((item) => item.date > tripMeta.endDate);
  if (postTripExpenses.length > 0) {
    paidExpenseDayGroups.push({
      key: "post-travel",
      label: "Post-travel expenses",
      subtitle: `After ${itineraryDays.at(-1)?.shortDate || tripMeta.endDate}`,
      expenses: postTripExpenses,
    });
  }

  // Live Sync with /api/expenses (Telegram / n8n)
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const syncExpensesFromAPI = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/expenses");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.expenses) && data.expenses.length > 0) {
        setPaidExpenses((prev) => {
          const prevIds = new Set(prev.map((e) => e.id));
          const newItems = data.expenses.filter((e: ExpenseRecord) => !prevIds.has(e.id));
          if (newItems.length > 0) {
            setSyncStatus(`Synced ${newItems.length} new expense(s) from Telegram`);
            return [...newItems, ...prev];
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Failed to sync expenses from API:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  React.useEffect(() => {
    syncExpensesFromAPI();
    const interval = setInterval(syncExpensesFromAPI, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSaveBudgetConfig = () => {
    // `|| default` would silently discard a deliberate 0 (0 is falsy in JS) —
    // only fall back to the default when the input didn't parse at all.
    const parsedPHP = parseFloat(tempBudgetInputPHP.replace(/[^0-9.]/g, ""));
    const pPHP = Number.isNaN(parsedPHP) ? 150000 : parsedPHP;
    const parsedJPY = parseFloat(tempCashInputJPY.replace(/[^0-9.]/g, ""));
    const cJPY = Number.isNaN(parsedJPY) ? 100000 : parsedJPY;
    const actualPHP = tempInitialCashActualPHP.trim()
      ? parseFloat(tempInitialCashActualPHP.replace(/[^0-9.]/g, "")) || undefined
      : undefined;
    setPlannedBudgetPHP(pPHP);
    setInitialCashJPY(cJPY);
    setInitialCashActualPHP(actualPHP);
    setIsEditingBudget(false);
  };

  const openAddModal = (type: "addPaid" | "addPlanned") => {
    setModalType(type);
    setFormTitle("");
    setFormAmountJPY("");
    setFormCurrency("JPY");
    setFormActualPHP("");
    setFormCategory("food");
    setFormPaymentMethod(type === "addPaid" ? "Cash" : "Cash");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes("");
  };

  const openQuickCashModal = () => {
    setModalType("addPaid");
    setFormTitle("");
    setFormAmountJPY("");
    setFormCurrency("JPY");
    setFormActualPHP("");
    setFormCategory("food");
    setFormPaymentMethod("Cash");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes("Paid via physical cash");
  };

  const openAddWithdrawalModal = () => {
    setModalType("addWithdrawal");
    setActiveEditingWithdrawal(null);
    setWithdrawalAmountJPY("20000");
    setWithdrawalActualPHP("");
    setWithdrawalLocation("7-Eleven Bank ATM (Asakusa)");
    setWithdrawalCard("BDO Mastercard");
    setWithdrawalDate(new Date().toISOString().split("T")[0]);
  };

  const openEditWithdrawalModal = (w: CashWithdrawalRecord) => {
    setModalType("editWithdrawal");
    setActiveEditingWithdrawal(w);
    setWithdrawalAmountJPY(String(w.amountJPY));
    setWithdrawalActualPHP(w.actualPHPCharged !== undefined ? String(w.actualPHPCharged) : "");
    setWithdrawalLocation(w.location);
    setWithdrawalCard(w.cardUsed);
    setWithdrawalDate(w.date);
  };

  const openEditModal = (item: ExpenseRecord) => {
    setActiveEditingItem(item);
    setModalType("edit");
    setFormTitle(item.title);
    if (item.currency === "PHP" && item.convertedAmountPHP) {
      setFormCurrency("PHP");
      setFormAmountJPY(String(item.convertedAmountPHP));
      setFormActualPHP("");
    } else {
      setFormCurrency("JPY");
      setFormAmountJPY(String(item.amount));
      setFormActualPHP(item.convertedAmountPHP !== undefined ? String(item.convertedAmountPHP) : "");
    }
    setFormCategory(item.category);
    setFormPaymentMethod(item.paymentMethod);
    setFormDate(item.date);
    setFormNotes(item.notes || "");
  };

  const openMarkAsPaidModal = (item: ExpenseRecord) => {
    setActiveEditingItem(item);
    setModalType("markPaid");
    setFormTitle(item.title);
    if (item.currency === "PHP" && item.convertedAmountPHP) {
      setFormCurrency("PHP");
      setFormAmountJPY(String(item.convertedAmountPHP));
      setFormActualPHP("");
    } else {
      setFormCurrency("JPY");
      setFormAmountJPY(String(item.amount));
      setFormActualPHP(item.convertedAmountPHP !== undefined ? String(item.convertedAmountPHP) : "");
    }
    setFormCategory(item.category);
    setFormPaymentMethod(item.paymentMethod);
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes(item.notes || "");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAmountJPY) return;

    const enteredNum = parseFloat(formAmountJPY.replace(/[^0-9.]/g, "")) || 0;
    // `amount` stays the canonical JPY figure everywhere (every total on this
    // page sums it as JPY) — but when the entry was actually made in PHP, we
    // also lock the real PHP figure in convertedAmountPHP so the display for
    // that record never has to re-derive PHP from a since-moved exchange rate.
    const amountNum = formCurrency === "PHP" ? Math.round(enteredNum * fxRate) : enteredNum;
    const actualPHPNum = formActualPHP.trim()
      ? parseFloat(formActualPHP.replace(/[^0-9.]/g, "")) || undefined
      : undefined;
    const currencyMeta =
      formCurrency === "PHP"
        ? { currency: "PHP", convertedAmountPHP: enteredNum }
        : { currency: "JPY", convertedAmountPHP: actualPHPNum };

    if (modalType === "addPaid") {
      const newPaid: ExpenseRecord = {
        id: "paid-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        ...currencyMeta,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "paid",
        notes: formNotes.trim() || undefined,
      };
      setPaidExpenses((prev) => [newPaid, ...prev]);
    } else if (modalType === "addPlanned") {
      const newPlanned: ExpenseRecord = {
        id: "plan-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        ...currencyMeta,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "planned",
        notes: formNotes.trim() || undefined,
      };
      setPlannedExpenses((prev) => [newPlanned, ...prev]);
    } else if (modalType === "edit" && activeEditingItem) {
      if (activeEditingItem.status === "paid") {
        setPaidExpenses((prev) =>
          prev.map((item) =>
            item.id === activeEditingItem.id
              ? {
                  ...item,
                  title: formTitle.trim(),
                  amount: amountNum,
                  ...currencyMeta,
                  category: formCategory,
                  paymentMethod: formPaymentMethod,
                  date: formDate,
                  notes: formNotes.trim() || undefined,
                }
              : item
          )
        );
      } else {
        setPlannedExpenses((prev) =>
          prev.map((item) =>
            item.id === activeEditingItem.id
              ? {
                  ...item,
                  title: formTitle.trim(),
                  amount: amountNum,
                  ...currencyMeta,
                  category: formCategory,
                  paymentMethod: formPaymentMethod,
                  date: formDate,
                  notes: formNotes.trim() || undefined,
                }
              : item
          )
        );
      }
    } else if (modalType === "markPaid" && activeEditingItem) {
      // 1. Remove from planned
      setPlannedExpenses((prev) => prev.filter((item) => item.id !== activeEditingItem.id));
      // 2. Add to paid with confirmed details
      const movedPaid: ExpenseRecord = {
        id: "paid-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        ...currencyMeta,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "paid",
        notes: formNotes.trim() || undefined,
      };
      setPaidExpenses((prev) => [movedPaid, ...prev]);
    }

    setModalType(null);
    setActiveEditingItem(null);
  };

  const handleSaveWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawalAmountJPY.replace(/[^0-9.]/g, "")) || 0;
    if (amountNum <= 0) return;
    const actualPHPNum = withdrawalActualPHP.trim()
      ? parseFloat(withdrawalActualPHP.replace(/[^0-9.]/g, "")) || undefined
      : undefined;

    if (modalType === "editWithdrawal" && activeEditingWithdrawal) {
      setCashWithdrawals((prev) =>
        prev.map((w) =>
          w.id === activeEditingWithdrawal.id
            ? {
                ...w,
                date: withdrawalDate,
                amountJPY: amountNum,
                actualPHPCharged: actualPHPNum,
                location: withdrawalLocation.trim(),
                cardUsed: withdrawalCard,
              }
            : w
        )
      );
    } else {
      const newWithdrawal: CashWithdrawalRecord = {
        id: "atm-" + Date.now(),
        date: withdrawalDate,
        amountJPY: amountNum,
        actualPHPCharged: actualPHPNum,
        location: withdrawalLocation.trim(),
        cardUsed: withdrawalCard,
      };
      setCashWithdrawals((prev) => [newWithdrawal, ...prev]);
    }

    setModalType(null);
    setActiveEditingWithdrawal(null);
  };

  const handleDeleteWithdrawal = (id: string) => {
    setCashWithdrawals((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDeletePaid = (id: string) => {
    setPaidExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeletePlanned = (id: string) => {
    setPlannedExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const renderPaidExpenseRow = (item: ExpenseRecord) => {
    const isPHPNative = item.currency === "PHP" && item.convertedAmountPHP !== undefined;
    const phpValue = expensePHPValue(item);

    return (
      <div
        key={item.id}
        className="flex flex-col gap-2 border-t border-stone-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-stone-600">
              {item.category}
            </span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-[#8B5E14]">
              {item.paymentMethod}{item.paymentMethod === "Cash" ? ` · ${item.currency}` : ""}
            </span>
          </div>
          <h4 className="mt-1 truncate text-sm font-bold text-stone-900" title={item.title}>
            {item.title}
          </h4>
          {item.notes && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-500" title={item.notes}>
              {item.notes}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="text-right">
            <div className="font-serif text-base font-bold text-stone-900">
              {isPHPNative
                ? `${homeSymbol} ${phpValue.toLocaleString()}`
                : `${destSymbol} ${item.amount.toLocaleString()}`}
            </div>
            <div className="font-mono text-[10px] text-stone-500">
              {isPHPNative
                ? `≈ ${destSymbol} ${item.amount.toLocaleString()}`
                : `${item.convertedAmountPHP !== undefined ? "=" : "≈"} ${homeSymbol} ${phpValue.toLocaleString()}`}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEditModal(item)}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-[#1F3A5F]"
              aria-label={`Edit ${item.title}`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeletePaid(item.id)}
              className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-red-600"
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#2A2620] pb-28 selection:bg-[#FF5F93] selection:text-white">
      {/* Universal Navigation Header & Persistent Mobile Thumb Dock */}
      <Navigation currentRoute="budget" />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-10">
        {/* ========================================================================= */}
        {/* TOP SUMMARY CARDS (Structure: Target | Paid | Committed | Projected Available) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
                Budget
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                Your Tokyo Trip Budget
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={syncExpensesFromAPI}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-stone-200 px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-sm transition disabled:opacity-50"
                title="Sync latest expenses from webhook"
              >
                <Sparkles className={`h-3.5 w-3.5 text-[#FF86A8] ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Webhook"}</span>
              </button>

              <button
                onClick={() => {
                  setIsEditingBudget(!isEditingBudget);
                  setTempBudgetInputPHP(String(plannedBudgetPHP));
                  setTempCashInputJPY(String(initialCashJPY));
                  setTempInitialCashActualPHP(
                    initialCashActualPHP !== undefined ? String(initialCashActualPHP) : ""
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3A5F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#132540] transition"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isEditingBudget ? "Close Editor" : "Edit Targets"}</span>
              </button>
            </div>
          </div>

          {/* Budget Edit Drawer */}
          {isEditingBudget && (
            <div className="rounded-3xl border border-[#1F3A5F]/20 bg-white p-6 shadow-lg space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1F3A5F]">
                Configure Target Budgets & Initial Cash
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Total Planned Trip Budget ({homeCurrency} {homeSymbol})
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tempBudgetInputPHP}
                    onChange={(e) => setTempBudgetInputPHP(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="150000"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">
                    Converts automatically to ≈ {destSymbol}{Math.round((parseFloat(tempBudgetInputPHP) || 0) * fxRate).toLocaleString()} {destCurrency}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Initial Physical Cash Brought ({destCurrency} {destSymbol})
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tempCashInputJPY}
                    onChange={(e) => setTempCashInputJPY(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="100000"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">
                    Physical cash bills exchanged before departure (e.g. {destSymbol}100,000)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Actual {homeSymbol} {homeCurrency} charged for that exchange (optional)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tempInitialCashActualPHP}
                    onChange={(e) => setTempInitialCashActualPHP(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder={`Leave blank to use ≈ ${homeSymbol}${Math.round((parseFloat(tempCashInputJPY) || 0) / fxRate).toLocaleString()}`}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">
                    Fill this in once you know the real amount your card/bank charged for exchanging this cash, to lock it in instead of today&apos;s live rate.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudgetConfig}
                  className="rounded-xl bg-[#1F3A5F] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#132540]"
                >
                  Save Targets
                </button>
              </div>
            </div>
          )}

          {/* 4 Main Highlight Cards: Planned | Paid | Committed | Projected Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Planned Target Budget */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-md flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                  Target Budget
                </span>
                <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700">
                  Planned
                </span>
              </div>

              <div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {homeSymbol} {plannedBudgetPHP.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-[#1F3A5F]">
                  ≈ {destSymbol} {plannedBudgetJPY.toLocaleString()} {destCurrency}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 font-medium">
                Overall trip target for all travelers.
              </p>
            </div>

            {/* 2. Actual Spent (Fixed / Paid) */}
            <div className="rounded-3xl border border-amber-200 bg-[#FBF0DC]/80 p-5 shadow-md flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C1802E]">
                  Actual Spent (Paid)
                </span>
                <span className="rounded-full bg-amber-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#8B5E14]">
                  {paidExpenses.length} Paid
                </span>
              </div>

              <div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {homeSymbol} {actualSpentPHP.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-[#8B5E14]">
                  ≈ {destSymbol} {actualSpentJPY.toLocaleString()} {destCurrency}
                </div>
              </div>

              <p className="text-[11px] text-stone-600 font-medium pt-2 border-t border-amber-200/60">
                Confirmed transactions already settled.
              </p>
            </div>

            {/* 3. Committed Future Spend */}
            <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-5 shadow-md flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-900">
                  Committed Spend
                </span>
                <span className="rounded-full bg-blue-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-900">
                  {plannedExpenses.length} Planned
                </span>
              </div>

              <div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-blue-950">
                  {homeSymbol} {expectedFutureSpendPHP.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-blue-800">
                  ≈ {destSymbol} {expectedFutureSpendJPY.toLocaleString()} {destCurrency}
                </div>
              </div>

              <p className="text-[11px] text-blue-800 font-medium pt-2 border-t border-blue-200">
                Planned future allowances & buffer.
              </p>
            </div>

            {/* 4. Credit Card Balance (trip-period card charges only) */}
            <div className="rounded-3xl border border-violet-200 bg-violet-50/80 p-5 shadow-md flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-violet-900">
                  Credit Card Balance
                </span>
                <span className="rounded-full bg-violet-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-violet-900">
                  {creditCardBalanceItemCount} Included
                </span>
              </div>

              <div>
                <div className="font-serif text-2xl sm:text-3xl font-extrabold text-violet-950">
                  {homeSymbol} {creditCardBalancePHP.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-xs font-bold text-violet-800">
                  ≈ {destSymbol} {creditCardBalanceJPY.toLocaleString()} {destCurrency}
                </div>
              </div>

              <p className="text-[11px] font-medium pt-2 border-t border-violet-200 text-violet-800">
                Actual Spent less travel tax, eSIM/SIM card, VFS, and airfare.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DEDICATED PHYSICAL CASH FLOW SECTION: Withdrawn - Spent = Balance On-Hand */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#C1802E] flex items-center gap-1.5">
                <Banknote className="h-4 w-4 text-[#C1802E]" /> Cash Wallet
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Your cash on hand
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openAddWithdrawalModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200 transition"
              >
                <Landmark className="h-3.5 w-3.5 text-[#1F3A5F]" />
                <span>+ Log ATM Withdrawal</span>
              </button>
              <button
                onClick={openQuickCashModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C1802E] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#a66c23] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Quick Cash Spend</span>
              </button>
            </div>
          </div>

          {/* The 3-Step Cash Flow Equation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            {/* 1. Total Cash Withdrawn */}
            <div className="md:col-span-3 rounded-2xl border border-amber-200 bg-[#FBF0DC]/70 p-5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B5E14]">
                Withdrawn
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
                {destSymbol} {totalCashWithdrawnJPY.toLocaleString()}
              </div>
              <div className="font-mono text-xs font-bold text-stone-600">
                ≈ {homeSymbol} {totalCashWithdrawnPHP.toLocaleString()} {homeCurrency}
              </div>
              <p className="text-[11px] text-stone-500 pt-2 border-t border-amber-200/50">
                Initial: {destSymbol}{initialCashJPY.toLocaleString()} {cashWithdrawals.length > 0 ? `+ ${cashWithdrawals.length} ATM withdrawals` : ""}
              </p>
            </div>

            {/* Minus Sign */}
            <div className="hidden md:flex md:col-span-1 justify-center text-stone-400">
              <Minus className="h-6 w-6" />
            </div>

            {/* 2. Less: Actual Spent Cash */}
            <div className="md:col-span-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">
                Spent in Cash
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-950">
                {destSymbol} {actualSpentCashJPY.toLocaleString()}
              </div>
              <div className="font-mono text-xs font-bold text-rose-800">
                ≈ {homeSymbol} {actualSpentCashPHP.toLocaleString()} {homeCurrency}
              </div>
              <p className="text-[11px] text-rose-700 pt-2 border-t border-rose-200/50">
                {cashPaidExpenses.length} cash expenses recorded
              </p>
            </div>

            {/* Equals Sign */}
            <div className="hidden md:flex md:col-span-1 justify-center text-stone-400">
              <Equal className="h-6 w-6" />
            </div>

            {/* 3. Equals: Balance Cash On-Hand */}
            <div
              className={`md:col-span-3 rounded-2xl border p-5 space-y-1 shadow-sm ${
                balanceCashOnHandJPY >= 10000
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : "border-amber-300 bg-amber-50 text-amber-950"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                <span>Cash On Hand</span>
                <span className="rounded bg-emerald-200/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900">
                  Wallet
                </span>
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-950">
                {destSymbol} {balanceCashOnHandJPY.toLocaleString()}
              </div>
              <div className="font-mono text-xs font-bold text-emerald-800">
                ≈ {homeSymbol} {balanceCashOnHandPHP.toLocaleString()} {homeCurrency}
              </div>
              <p className="text-[11px] text-emerald-700 pt-2 border-t border-emerald-200/60 font-medium">
                {balanceCashOnHandJPY < 10000
                  ? "⚠️ Low Cash Warning: Consider visiting an ATM"
                  : "✓ Safe Cash Cushion on hand"}
              </p>
            </div>
          </div>

          {/* ATM Withdrawal History (if any) */}
          {cashWithdrawals.length > 0 && (
            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 space-y-2">
              <span className="text-xs font-bold text-stone-900">Recent ATM Cash Inflows</span>
              <div className="divide-y divide-stone-200">
                {sortedCashWithdrawals.map((w) => (
                  <div key={w.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{destSymbol}{w.amountJPY.toLocaleString()} {destCurrency}</span>
                      <span className="text-stone-500 ml-2 font-mono">({w.date})</span>
                      <p className="text-[11px] text-stone-600">
                        {w.location} · {w.cardUsed}
                        {w.actualPHPCharged !== undefined && (
                          <span className="ml-1 text-emerald-700 font-bold">
                            · = {homeSymbol}{w.actualPHPCharged.toLocaleString()} actual
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditWithdrawalModal(w)}
                        className="text-stone-400 hover:text-[#1F3A5F] p-1"
                        aria-label="Edit withdrawal"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWithdrawal(w.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                        aria-label="Delete withdrawal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-stone-500">
              Add an Expense
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openAddModal("addPaid")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3A5F] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition active:scale-95"
            >
              <Plus className="h-4 w-4 text-[#FFD66B]" />
              <span>+ Add Paid Expense</span>
            </button>

            <button
              onClick={() => openAddModal("addPlanned")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5F93] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#e84e80] transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Planned Expense</span>
            </button>
          </div>
        </div>

        {/* SECTION 1 — PAID EXPENSES, FILTERED AND GROUPED BY TRIP DAY */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-stone-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Paid expenses</h3>
              <p className="text-xs font-medium text-stone-500">
                {filteredPaidExpenses.length} of {paidExpenses.length} records shown · Filtered total: {homeSymbol}{filteredPaidExpensesPHP.toLocaleString()}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <label className="sr-only" htmlFor="category-filter">Filter by category</label>
              <select
                id="category-filter"
                value={paidCategoryFilter}
                onChange={(event) => setPaidCategoryFilter(event.target.value as "all" | ExpenseCategory)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 outline-none focus:border-[#1F3A5F]"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>{category.icon} {category.label}</option>
                ))}
              </select>

              <label className="sr-only" htmlFor="payment-filter">Filter by payment</label>
              <select
                id="payment-filter"
                value={paidPaymentFilter}
                onChange={(event) => setPaidPaymentFilter(event.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 outline-none focus:border-[#1F3A5F]"
              >
                <option value="all">All payments</option>
                <option value="cash-jpy">Cash (JPY)</option>
                <option value="cash-php">Cash (PHP)</option>
                {nonCashPaymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          <ReceiptUpload
            paidExpenses={paidExpenses}
            setPaidExpenses={setPaidExpenses}
            fxRate={fxRate}
            openEditModal={openEditModal}
          />

          <div className="space-y-2">
            {paidExpenseDayGroups.map((group) => {
              const groupPHP = group.expenses.reduce(
                (sum, item) => sum + expensePHPValue(item),
                0
              );
              return (
                <details key={group.key} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-stone-50">
                    <div className="min-w-0">
                      <div className="font-serif text-base font-bold text-stone-900">{group.label}</div>
                      <div className="truncate text-[11px] font-medium text-stone-500">{group.subtitle}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-black text-[#1F3A5F]">{homeSymbol}{groupPHP.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-500">{group.expenses.length} expense{group.expenses.length === 1 ? "" : "s"}</div>
                      </div>
                      <span className="text-stone-400 transition group-open:rotate-180">⌄</span>
                    </div>
                  </summary>
                  {group.expenses.length > 0 ? (
                    <div>{group.expenses.map(renderPaidExpenseRow)}</div>
                  ) : (
                    <div className="border-t border-stone-100 px-4 py-3 text-xs text-stone-400">No matching expenses.</div>
                  )}
                </details>
              );
            })}
          </div>
        </section>

        {/* SECTION 2 — PLANNED EXPENSES */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Planned expenses</h3>
              <p className="text-xs font-medium text-stone-500">Items that have not been paid yet.</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[11px] font-black uppercase text-stone-500">
                Planned Future Total
              </div>
              <div className="font-serif text-lg font-extrabold text-[#FF5F93]">
                {destSymbol} {expectedFutureSpendJPY.toLocaleString()} <span className="text-xs font-normal text-stone-500 font-mono">≈ {homeSymbol} {expectedFutureSpendPHP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <details className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50">
              <span>{plannedExpenses.length === 0 ? "No planned expenses" : `Show ${plannedExpenses.length} planned expense${plannedExpenses.length === 1 ? "" : "s"}`}</span>
              <span className="text-stone-400 transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="divide-y divide-stone-200 border-t border-stone-100">
            {sortedPlannedExpenses.length === 0 ? (
              <div className="p-4 text-xs text-stone-500">
                Everything is paid. Add a planned expense only if a new cost is expected.
              </div>
            ) : (
              sortedPlannedExpenses.map((item) => {
                const isPHPNative = item.currency === "PHP" && item.convertedAmountPHP !== undefined;
                // Use the locked real figure (PHP-native entry, or a JPY entry with
                // an actual card charge filled in) whenever one exists; otherwise
                // fall back to the live-rate estimate.
                const phpValue = item.convertedAmountPHP !== undefined ? item.convertedAmountPHP : Math.round(item.amount / fxRate);
                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50/80 transition"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700 border border-stone-200">
                          #{item.category.toUpperCase()}
                        </span>

                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 border border-stone-200 flex items-center gap-1">
                          {item.paymentMethod === "Cash" ? (
                            <Banknote className="h-3 w-3" />
                          ) : (
                            <CreditCard className="h-3 w-3" />
                          )}
                          <span>Intended: {item.paymentMethod}</span>
                        </span>

                        <span className="text-[11px] font-mono text-stone-400">
                          Estimated for {item.date}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-stone-900 leading-snug">
                        {item.title}
                      </h4>

                      {item.notes && (
                        <p className="text-xs text-stone-500 leading-relaxed font-medium">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        {isPHPNative ? (
                          <>
                            <div className="font-serif text-xl font-bold text-stone-900">
                              {homeSymbol} {phpValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-stone-500 font-mono">
                              ≈ {destSymbol} {item.amount.toLocaleString()} {destCurrency}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-serif text-xl font-bold text-stone-900">
                              {destSymbol} {item.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-stone-500 font-mono">
                              {item.convertedAmountPHP !== undefined ? "=" : "≈"} {homeSymbol} {phpValue.toLocaleString()} {homeCurrency}
                              {item.convertedAmountPHP !== undefined && (
                                <span className="ml-1 text-[9px] text-emerald-700 font-bold">ACTUAL</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => openMarkAsPaidModal(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2E6E8E] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#235872] transition active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Mark as Paid</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg text-stone-400 hover:text-[#1F3A5F] hover:bg-stone-100 transition"
                          aria-label="Edit planned item"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlanned(item.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 transition"
                          aria-label="Delete planned item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </details>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT / MARK AS PAID */}
      {/* ========================================================================= */}
      {modalType && modalType !== "addWithdrawal" && modalType !== "editWithdrawal" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {modalType === "addPaid"
                  ? "Add Fixed / Paid Expense"
                  : modalType === "addPlanned"
                  ? "Add Planned / Estimated Expense"
                  : modalType === "markPaid"
                  ? "Confirm & Move to Paid"
                  : "Edit Expense Item"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700">
                  Item Description
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Asakusa Menchi snacks, train tickets, souvenirs"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Amount paid in {formCurrency === "PHP" ? `${homeSymbol} ${homeCurrency}` : `${destSymbol} ${destCurrency}`}
                    </label>
                    <div className="flex rounded-lg border border-stone-300 overflow-hidden text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setFormCurrency("JPY")}
                        className={`px-2 py-1 transition ${
                          formCurrency === "JPY" ? "bg-[#1F3A5F] text-white" : "bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        ¥ JPY
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormCurrency("PHP")}
                        className={`px-2 py-1 transition ${
                          formCurrency === "PHP" ? "bg-[#1F3A5F] text-white" : "bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        ₱ PHP
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formAmountJPY}
                    onChange={(e) => setFormAmountJPY(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder={formCurrency === "PHP" ? "1000" : "5000"}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                    required
                  />
                  <p className="mt-1 text-[10px] text-stone-500 font-mono">
                    {formCurrency === "PHP"
                      ? `≈ ${destSymbol} ${Math.round((parseFloat(formAmountJPY) || 0) * fxRate).toLocaleString()} ${destCurrency}`
                      : `≈ ${homeSymbol} ${Math.round((parseFloat(formAmountJPY) || 0) / fxRate).toLocaleString()} ${homeCurrency}`}
                  </p>
                  <p className="mt-0.5 text-[10px] text-stone-400">
                    Pick whichever currency you were actually charged in — that figure is saved exactly; the other side is a converted estimate.
                  </p>
                </div>

                {formCurrency === "JPY" && modalType !== "addPlanned" && (
                  <div>
                    <label className="text-xs font-bold text-stone-700">
                      Actual {homeSymbol} {homeCurrency} charged on your card (optional)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formActualPHP}
                      onChange={(e) => setFormActualPHP(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder={`Leave blank to use ≈ ${homeSymbol}${Math.round((parseFloat(formAmountJPY) || 0) / fxRate).toLocaleString()} above`}
                      className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-bold outline-none focus:border-[#1F3A5F]"
                    />
                    <p className="mt-1 text-[10px] text-stone-400">
                      Fill this in once your card statement posts, to lock in the real amount (your bank&apos;s FX rate + fees) instead of today&apos;s live rate.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                    required
                  />
                </div>
              </div>

              {/* Category Chips */}
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1.5 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setFormCategory(cat.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                        formCategory === cat.value
                          ? "bg-[#1F3A5F] text-white shadow-sm"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Chips / Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1.5 block">
                  {modalType === "addPlanned" ? "Intended Payment Method" : "Payment Method Used"}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {paymentMethods.map((pm) => (
                    <button
                      type="button"
                      key={pm}
                      onClick={() => setFormPaymentMethod(pm)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                        formPaymentMethod === pm
                          ? "bg-[#FF5F93] text-white shadow-sm"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {pm === "Cash" ? <Banknote className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                      <span>{pm}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Paid at counter, includes 5 pax"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-medium outline-none focus:border-[#1F3A5F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
                >
                  {modalType === "markPaid" ? "Confirm & Mark Paid" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOG ATM CASH WITHDRAWAL */}
      {/* ========================================================================= */}
      {(modalType === "addWithdrawal" || modalType === "editWithdrawal") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[#1F3A5F]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {modalType === "editWithdrawal" ? "Edit ATM Withdrawal" : "Log ATM Cash Withdrawal"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setModalType(null);
                  setActiveEditingWithdrawal(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWithdrawal} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Record physical cash withdrawn from ATMs. This increases your <b>Total Amount Withdrawn</b> and recalculates your <b>Balance On-Hand</b>.
              </p>

              <div>
                <label className="text-xs font-bold text-stone-700">
                  Withdrawal Amount ({destSymbol} {destCurrency})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={withdrawalAmountJPY}
                  onChange={(e) => setWithdrawalAmountJPY(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="20000"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                  required
                />
                <p className="mt-1 text-[10px] text-stone-500 font-mono">
                  ≈ {homeSymbol} {Math.round((parseFloat(withdrawalAmountJPY) || 0) / fxRate).toLocaleString()} {homeCurrency}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">
                  Actual {homeSymbol} {homeCurrency} charged on your card (optional)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={withdrawalActualPHP}
                  onChange={(e) => setWithdrawalActualPHP(e.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder={`Leave blank to use ≈ ${homeSymbol}${Math.round((parseFloat(withdrawalAmountJPY) || 0) / fxRate).toLocaleString()} above`}
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-bold outline-none focus:border-[#1F3A5F]"
                />
                <p className="mt-1 text-[10px] text-stone-400">
                  Fill this in once your card statement posts, to lock in the real amount instead of today&apos;s live rate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    ATM Location
                  </label>
                  <input
                    type="text"
                    value={withdrawalLocation}
                    onChange={(e) => setWithdrawalLocation(e.target.value)}
                    placeholder="e.g. 7-Eleven ATM"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-medium outline-none focus:border-[#1F3A5F]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Debit / ATM Card Used
                  </label>
                  <select
                    value={withdrawalCard}
                    onChange={(e) => setWithdrawalCard(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-medium outline-none focus:border-[#1F3A5F] bg-white"
                  >
                    <option value="BDO Mastercard">BDO Mastercard</option>
                    <option value="GCash Card">GCash Card</option>
                    <option value="MariBank Debit">MariBank Debit</option>
                    <option value="RCBC Visa">RCBC Visa</option>
                    <option value="Other Bank Card">Other Bank Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">
                  Withdrawal Date
                </label>
                <input
                  type="date"
                  value={withdrawalDate}
                  onChange={(e) => setWithdrawalDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setActiveEditingWithdrawal(null);
                  }}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
                >
                  {modalType === "editWithdrawal" ? "Save Changes" : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
