"use client";

import React, { useState } from "react";
import Link from "next/link";
import { tripMeta } from "../../data/trip-config";
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
  TrendingUp,
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
} from "lucide-react";

export default function BudgetPage() {
  const { rate: liveFxRate, isLoading: fxLoading } = useFXRate(
    tripMeta.defaultCurrencies.homeCurrency,
    tripMeta.defaultCurrencies.destCurrency
  );
  const fxRate = liveFxRate || 2.70;

  // 1. Overall Planned Budget (in PHP & JPY)
  const [plannedBudgetPHP, setPlannedBudgetPHP] = useLocalStorage<number>(
    "travel_tokyo_budget_php",
    tripMeta.defaultCurrencies.plannedBudgetPHP || 150000
  );
  const [initialCashJPY, setInitialCashJPY] = useLocalStorage<number>(
    "travel_tokyo_initial_cash_jpy",
    tripMeta.defaultCurrencies.initialCashJPY || 100000
  );

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInputPHP, setTempBudgetInputPHP] = useState(String(plannedBudgetPHP));
  const [tempCashInputJPY, setTempCashInputJPY] = useState(String(initialCashJPY));

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
      amount: 168750,
      currency: "JPY",
      category: "flights",
      paymentMethod: "RCBC Visa",
      date: "2026-09-01",
      status: "paid",
      notes: "PNRs: WETQNY, WC2HXE, MH1ZRC, NLNDWD (≈ ₱62,500 PHP)",
    },
    {
      id: "paid-hp-studio-tickets",
      title: "Warner Bros. Studio Tour Tokyo Timed Entry (5 Tickets)",
      amount: 32500,
      currency: "JPY",
      category: "tickets",
      paymentMethod: "BDO JCB",
      date: "2026-09-03",
      status: "paid",
      notes: "Sep 3 · 1:00 PM Entry · Toshimaen",
    },
    {
      id: "paid-disney-passports",
      title: "Tokyo Disney Resort Park Tickets (Disneyland & DisneySea 5 Pax)",
      amount: 84000,
      currency: "JPY",
      category: "tickets",
      paymentMethod: "BDO Mastercard",
      date: "2026-09-02",
      status: "paid",
      notes: "Disneyland Sep 2 & DisneySea Sep 4 (Official App)",
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

  const [paidExpenses, setPaidExpenses] = useLocalStorage<ExpenseRecord[]>(
    "travel_tokyo_paid_expenses_v2",
    defaultPaidExpenses
  );

  // 3. Planned / Expected Budget (Section 2)
  const defaultPlannedExpenses: ExpenseRecord[] = [
    {
      id: "plan-food-7days",
      title: "Food & Snacks Daily Allowance (7 Days x 5 Pax)",
      amount: 120000,
      currency: "JPY",
      category: "food",
      paymentMethod: "Cash",
      date: "2026-09-01",
      status: "planned",
      notes: "Ramen, Asakusa Menchi, conveyer sushi, melon pan, convenience stores",
    },
    {
      id: "plan-train-suica",
      title: "Tokyo Metro, Ginza Line & Keisei Train Fares",
      amount: 25000,
      currency: "JPY",
      category: "transport",
      paymentMethod: "BDO Mastercard",
      date: "2026-09-01",
      status: "planned",
      notes: "Digital Suica / PASMO top-ups for 5 travelers",
    },
    {
      id: "plan-shopping-donki",
      title: "Don Quijote, Skytree & Souvenirs Shopping",
      amount: 40000,
      currency: "JPY",
      category: "shopping",
      paymentMethod: "BDO JCB",
      date: "2026-09-05",
      status: "planned",
      notes: "Tax-free snacks, skincare, character merch, Tokyo Banana",
    },
    {
      id: "plan-disney-snacks",
      title: "Disney Park Snacks, Popcorn Buckets & Drinks",
      amount: 15000,
      currency: "JPY",
      category: "food",
      paymentMethod: "Cash",
      date: "2026-09-02",
      status: "planned",
      notes: "Mickey ice cream, churros, flavored popcorn across 2 park days",
    },
    {
      id: "plan-emergency-taxi",
      title: "Emergency Buffer / Taxi Reserve",
      amount: 10000,
      currency: "JPY",
      category: "other",
      paymentMethod: "MariBank",
      date: "2026-09-07",
      status: "planned",
      notes: "Late night transfers or weather contingency fund",
    },
  ];

  const [plannedExpenses, setPlannedExpenses] = useLocalStorage<ExpenseRecord[]>(
    "travel_tokyo_planned_expenses_v2",
    defaultPlannedExpenses
  );

  // Form State
  const [modalType, setModalType] = useState<"addPaid" | "addPlanned" | "edit" | "markPaid" | null>(null);
  const [activeEditingItem, setActiveEditingItem] = useState<ExpenseRecord | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formAmountJPY, setFormAmountJPY] = useState("");
  const [formCategory, setFormCategory] = useState<ExpenseCategory>("food");
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>("Cash");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNotes, setFormNotes] = useState("");

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
  const actualSpentPHP = Math.round(actualSpentJPY / fxRate);

  const remainingBalanceJPY = plannedBudgetJPY - actualSpentJPY;
  const remainingBalancePHP = Math.round(remainingBalanceJPY / fxRate);

  const expectedFutureSpendJPY = plannedExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const expectedFutureSpendPHP = Math.round(expectedFutureSpendJPY / fxRate);

  const projectedRemainingJPY = remainingBalanceJPY - expectedFutureSpendJPY;
  const projectedRemainingPHP = Math.round(projectedRemainingJPY / fxRate);

  // Cash-specific Calculations
  const cashSpentJPY = paidExpenses
    .filter((e) => e.paymentMethod === "Cash")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingCashOnHandJPY = initialCashJPY - cashSpentJPY;

  // Handlers
  const handleSaveBudgetConfig = () => {
    const pPHP = parseFloat(tempBudgetInputPHP.replace(/[^0-9.]/g, "")) || 150000;
    const cJPY = parseFloat(tempCashInputJPY.replace(/[^0-9.]/g, "")) || 100000;
    setPlannedBudgetPHP(pPHP);
    setInitialCashJPY(cJPY);
    setIsEditingBudget(false);
  };

  const openAddModal = (type: "addPaid" | "addPlanned") => {
    setModalType(type);
    setFormTitle("");
    setFormAmountJPY("");
    setFormCategory("food");
    setFormPaymentMethod("Cash");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes("");
  };

  const openEditModal = (item: ExpenseRecord) => {
    setActiveEditingItem(item);
    setModalType("edit");
    setFormTitle(item.title);
    setFormAmountJPY(String(item.amount));
    setFormCategory(item.category);
    setFormPaymentMethod(item.paymentMethod);
    setFormDate(item.date);
    setFormNotes(item.notes || "");
  };

  const openMarkAsPaidModal = (item: ExpenseRecord) => {
    setActiveEditingItem(item);
    setModalType("markPaid");
    setFormTitle(item.title);
    setFormAmountJPY(String(item.amount));
    setFormCategory(item.category);
    setFormPaymentMethod(item.paymentMethod);
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes(item.notes || "");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAmountJPY) return;

    const amountNum = parseFloat(formAmountJPY.replace(/[^0-9.]/g, "")) || 0;

    if (modalType === "addPaid") {
      const newPaid: ExpenseRecord = {
        id: "paid-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        currency: "JPY",
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "paid",
        notes: formNotes.trim() || undefined,
      };
      setPaidExpenses([newPaid, ...paidExpenses]);
    } else if (modalType === "addPlanned") {
      const newPlanned: ExpenseRecord = {
        id: "plan-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        currency: "JPY",
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "planned",
        notes: formNotes.trim() || undefined,
      };
      setPlannedExpenses([newPlanned, ...plannedExpenses]);
    } else if (modalType === "edit" && activeEditingItem) {
      if (activeEditingItem.status === "paid") {
        setPaidExpenses(
          paidExpenses.map((item) =>
            item.id === activeEditingItem.id
              ? {
                  ...item,
                  title: formTitle.trim(),
                  amount: amountNum,
                  category: formCategory,
                  paymentMethod: formPaymentMethod,
                  date: formDate,
                  notes: formNotes.trim() || undefined,
                }
              : item
          )
        );
      } else {
        setPlannedExpenses(
          plannedExpenses.map((item) =>
            item.id === activeEditingItem.id
              ? {
                  ...item,
                  title: formTitle.trim(),
                  amount: amountNum,
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
      setPlannedExpenses(plannedExpenses.filter((item) => item.id !== activeEditingItem.id));
      // 2. Add to paid with confirmed details
      const movedPaid: ExpenseRecord = {
        id: "paid-" + Date.now(),
        title: formTitle.trim(),
        amount: amountNum,
        currency: "JPY",
        category: formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        status: "paid",
        notes: formNotes.trim() || undefined,
      };
      setPaidExpenses([movedPaid, ...paidExpenses]);
    }

    setModalType(null);
    setActiveEditingItem(null);
  };

  const handleDeletePaid = (id: string) => {
    setPaidExpenses(paidExpenses.filter((item) => item.id !== id));
  };

  const handleDeletePlanned = (id: string) => {
    setPlannedExpenses(plannedExpenses.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#2A2620] pb-24 selection:bg-[#FF5F93] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#1F3A5F]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-stone-200 hover:bg-white/20 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Trip</span>
            </Link>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wider">
              Budget & Expenses Planner
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-[#FFD66B] border border-white/20">
              1 ₱ ≈ {fxRate.toFixed(2)} ¥
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-10">
        {/* ========================================================================= */}
        {/* TOP SUMMARY CARDS (Structure: Planned PHP/JPY | Actual Spent | Remaining) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
                Trip Financial Overview
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
                Track every Yen & Peso with calm clarity.
              </h2>
            </div>

            <button
              onClick={() => {
                setIsEditingBudget(!isEditingBudget);
                setTempBudgetInputPHP(String(plannedBudgetPHP));
                setTempCashInputJPY(String(initialCashJPY));
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#1F3A5F] shadow-sm border border-stone-200 hover:bg-stone-50 self-start sm:self-auto transition"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{isEditingBudget ? "Close Editor" : "Edit Planned Target"}</span>
            </button>
          </div>

          {/* Budget Edit Drawer */}
          {isEditingBudget && (
            <div className="rounded-3xl border border-[#1F3A5F]/20 bg-white p-6 shadow-lg space-y-4">
              <h3 className="font-serif text-base font-bold text-[#1F3A5F]">
                Configure Target Budgets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Total Planned Trip Budget (PHP ₱)
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
                    Converts automatically to ≈ ¥{Math.round((parseFloat(tempBudgetInputPHP) || 0) * fxRate).toLocaleString()} JPY
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Initial Physical Cash on Hand (JPY ¥)
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
                    Physical bills & coins exchanged before departure
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

          {/* 3 Main Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Planned Budget */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                  Planned Budget
                </span>
                <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700">
                  Target
                </span>
              </div>

              <div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ₱ {plannedBudgetPHP.toLocaleString()}
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-[#1F3A5F]">
                  ≈ ¥ {plannedBudgetJPY.toLocaleString()} JPY
                </div>
              </div>

              <p className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                Total overall trip fund set for all 5 travelers.
              </p>
            </div>

            {/* 2. Actual Spent (Fixed / Paid) */}
            <div className="rounded-3xl border border-amber-200 bg-[#FBF0DC]/80 p-6 shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C1802E]">
                  Actual Spent (Paid)
                </span>
                <span className="rounded-full bg-amber-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#8B5E14]">
                  {paidExpenses.length} Fixed Paid
                </span>
              </div>

              <div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
                  ¥ {actualSpentJPY.toLocaleString()}
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-[#8B5E14]">
                  ≈ ₱ {actualSpentPHP.toLocaleString()} PHP
                </div>
              </div>

              <p className="text-xs text-stone-600 font-medium pt-2 border-t border-amber-200/60">
                Total confirmed expenses already paid or booked.
              </p>
            </div>

            {/* 3. Remaining Balance */}
            <div
              className={`rounded-3xl border p-6 shadow-md flex flex-col justify-between space-y-3 ${
                remainingBalanceJPY >= 0
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-red-200 bg-red-50/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider ${
                    remainingBalanceJPY >= 0 ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  Remaining Balance
                </span>
                <TrendingUp
                  className={`h-4 w-4 ${remainingBalanceJPY >= 0 ? "text-emerald-600" : "text-red-600"}`}
                />
              </div>

              <div>
                <div
                  className={`font-serif text-3xl sm:text-4xl font-extrabold ${
                    remainingBalanceJPY >= 0 ? "text-emerald-950" : "text-red-950"
                  }`}
                >
                  ¥ {remainingBalanceJPY.toLocaleString()}
                </div>
                <div
                  className={`mt-1 font-mono text-sm font-bold ${
                    remainingBalanceJPY >= 0 ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  ≈ ₱ {remainingBalancePHP.toLocaleString()} PHP
                </div>
              </div>

              <p
                className={`text-xs font-medium pt-2 border-t ${
                  remainingBalanceJPY >= 0
                    ? "text-emerald-800 border-emerald-200"
                    : "text-red-800 border-red-200"
                }`}
              >
                Planned Budget minus Actual Paid.
              </p>
            </div>
          </div>

          {/* Secondary Stats Row: Cash on Hand & Projected Future Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Cash on Hand Card */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Banknote className="h-4 w-4 text-[#C1802E]" /> Physical Cash on Hand (JPY)
                </span>
                <div className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  ¥ {remainingCashOnHandJPY.toLocaleString()} JPY
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Initial ¥{initialCashJPY.toLocaleString()} − Cash spent ¥{cashSpentJPY.toLocaleString()}
                </p>
              </div>
              <span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-[#8B5E14] border border-amber-200">
                Cash Reserve
              </span>
            </div>

            {/* Projected Remaining After Planned Unpaid Spend */}
            <div className="rounded-3xl border border-sky-200 bg-sky-50/70 p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-sky-600" /> Projected Final Balance (After Planned Spend)
                </span>
                <div className="font-serif text-2xl font-bold text-sky-950 mt-1">
                  ¥ {projectedRemainingJPY.toLocaleString()} JPY
                </div>
                <p className="text-[11px] text-sky-800 font-medium mt-0.5">
                  ≈ ₱ {projectedRemainingPHP.toLocaleString()} PHP (after ¥{expectedFutureSpendJPY.toLocaleString()} planned)
                </p>
              </div>
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-sky-900 border border-sky-200 shadow-sm">
                Projected
              </span>
            </div>
          </div>
        </section>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-stone-500">
              Quick Actions
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
              <Plus className="h-4 w-4 text-white" />
              <span>+ Add Planned Expense</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1 — FIXED / ACTUAL BUDGET (CONFIRMED & PAID) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Section 1 — Fixed / Actual Budget ({paidExpenses.length} Paid Items)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-stone-700">
              Total Paid: ¥{actualSpentJPY.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-stone-500">
            Confirmed costs that are already paid or booked (Hotel, flights, attraction passes, visas).
          </p>

          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md divide-y divide-stone-100">
            {paidExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No paid expenses recorded. Click &quot;+ Add Paid Expense&quot; above to log one.
              </div>
            ) : (
              paidExpenses.map((item) => {
                const phpValue = Math.round(item.amount / fxRate);
                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50 transition"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Paid
                        </span>
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                          {item.category.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                          <CreditCard className="h-3 w-3" /> {item.paymentMethod}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {item.date}
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

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        <div className="font-serif text-xl font-bold text-stone-900">
                          ¥ {item.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-stone-500 font-mono">
                          ≈ ₱ {phpValue.toLocaleString()} PHP
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg text-stone-400 hover:text-[#1F3A5F] hover:bg-stone-100 transition"
                          aria-label="Edit paid item"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePaid(item.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 transition"
                          aria-label="Delete paid item"
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
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 — PLANNED / EXPECTED BUDGET (UNPAID / ESTIMATED) */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Section 2 — Planned / Expected Budget ({plannedExpenses.length} Planned Items)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-amber-900">
              Total Planned: ¥{expectedFutureSpendJPY.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-stone-500">
            Estimated on-the-ground spending (Meals, Suica trains, Disney popcorn, shopping, Grab/taxi). Tap <b>&quot;Mark as Paid&quot;</b> when purchased to move directly into Section 1.
          </p>

          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md divide-y divide-stone-100">
            {plannedExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No planned items remaining! All expenses are marked as paid.
              </div>
            ) : (
              plannedExpenses.map((item) => {
                const phpValue = Math.round(item.amount / fxRate);
                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-stone-50 transition"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Planned / Unpaid
                        </span>
                        <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                          {item.category.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-700 border border-stone-200">
                          Intended: {item.paymentMethod}
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
                        <div className="font-serif text-xl font-bold text-stone-900">
                          ¥ {item.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-stone-500 font-mono">
                          ≈ ₱ {phpValue.toLocaleString()} PHP
                        </div>
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
        </section>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT / MARK AS PAID */}
      {/* ========================================================================= */}
      {modalType && (
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
                  placeholder="e.g. Asakusa Menchi snacks, Keisei train tickets, Disney popcorn"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    Amount in ¥ JPY
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formAmountJPY}
                    onChange={(e) => setFormAmountJPY(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="5000"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm font-bold outline-none focus:border-[#1F3A5F]"
                    required
                  />
                  <p className="mt-1 text-[10px] text-stone-500 font-mono">
                    ≈ ₱ {Math.round((parseFloat(formAmountJPY) || 0) / fxRate).toLocaleString()} PHP
                  </p>
                </div>

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
                  placeholder="e.g. Paid at counter, includes 5 pax, bought at Donki"
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
    </div>
  );
}
