"use client";

import React, { useState } from "react";
import { tripMeta, packingPresets } from "../data/trip-config";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useFXRate } from "../hooks/useFXRate";
import { ExpenseRecord, BookingDocument, MemoryPhoto } from "../types/trip";
import {
  Wallet,
  FileText,
  CheckSquare,
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  Download,
  AlertCircle,
  Camera,
  CheckCircle2,
} from "lucide-react";

export const TripTools: React.FC = () => {
  const [toolTab, setToolTab] = useState<"budget" | "vault" | "packing" | "memories">("budget");

  // 1. Budget State
  const [expenses, setExpenses, expensesLoaded] = useLocalStorage<ExpenseRecord[]>("travel_tokyo_expenses", [
    {
      id: "exp-1",
      title: "Keisei Access Express train tickets (5 pax)",
      amount: 6750,
      currency: "JPY",
      category: "transport",
      date: "2026-09-01",
    },
    {
      id: "exp-2",
      title: "Asakusa Menchi snacks & drinks",
      amount: 1800,
      currency: "JPY",
      category: "food",
      date: "2026-09-01",
    },
  ]);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord["category"]>("food");

  const { rate: fxRate } = useFXRate("PHP", "JPY");

  const totalSpentJPY = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalSpentPHP = fxRate ? Math.round(totalSpentJPY / fxRate) : Math.round(totalSpentJPY / 2.7);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    const newExpense: ExpenseRecord = {
      id: "exp-" + Date.now(),
      title: expenseTitle.trim(),
      amount: parseFloat(expenseAmount.replace(/[^0-9.]/g, "")) || 0,
      currency: "JPY",
      category: expenseCategory,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses([newExpense, ...expenses]);
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // 2. Booking Vault State
  const [documents, setDocuments, docsLoaded] = useLocalStorage<BookingDocument[]>("travel_tokyo_vault", [
    {
      id: "doc-sample-1",
      title: "Hotel Plus Hostel Asakusa Confirmation Voucher",
      type: "hotel",
      confirmationCode: "HTL-TOK-2026-901",
      notes: "2-13-1 Kaminarimon · 5 guests · Check-in 3:00 PM",
      dateAdded: "2026-08-28",
    },
    {
      id: "doc-sample-2",
      title: "Warner Bros. Studio Tour Tokyo Timed Entry",
      type: "ticket",
      confirmationCode: "WBST-SEP03-1300",
      notes: "5 Tickets · Sept 3 at 1:00 PM · Toshimaen Station",
      dateAdded: "2026-08-28",
    },
  ]);

  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<BookingDocument["type"]>("ticket");
  const [docCode, setDocCode] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [docFileData, setDocFileData] = useState<string | undefined>();
  const [docFileName, setDocFileName] = useState<string | undefined>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setDocFileData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: BookingDocument = {
      id: "doc-" + Date.now(),
      title: docTitle.trim(),
      type: docType,
      confirmationCode: docCode.trim() || undefined,
      notes: docNotes.trim() || undefined,
      fileData: docFileData,
      fileName: docFileName,
      dateAdded: new Date().toISOString().split("T")[0],
    };

    setDocuments([newDoc, ...documents]);
    setDocTitle("");
    setDocCode("");
    setDocNotes("");
    setDocFileData(undefined);
    setDocFileName(undefined);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  // 3. Smart Packing State
  const [packedMap, setPackedMap, packingLoaded] = useLocalStorage<Record<string, boolean>>(
    "travel_tokyo_packing_checks",
    {}
  );
  const [customItems, setCustomItems] = useLocalStorage<string[]>("travel_tokyo_custom_packing", []);
  const [newCustomItem, setNewCustomItem] = useState("");

  const togglePacked = (id: string) => {
    setPackedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomPacking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomItem.trim()) return;
    setCustomItems([...customItems, newCustomItem.trim()]);
    setNewCustomItem("");
  };

  const totalPackingCount = packingPresets.length + customItems.length;
  const packedCount =
    Object.values(packedMap).filter(Boolean).length;
  const packedPercentage = totalPackingCount > 0 ? Math.round((packedCount / totalPackingCount) * 100) : 0;

  // 4. Memories State
  const [memories, setMemories, memoriesLoaded] = useLocalStorage<MemoryPhoto[]>("travel_tokyo_memories", []);
  const [memoryCaption, setMemoryCaption] = useState("");
  const [memoryLocation, setMemoryLocation] = useState("");
  const [memoryPhotoData, setMemoryPhotoData] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setMemoryPhotoData(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryPhotoData) return;

    const newMemory: MemoryPhoto = {
      id: "mem-" + Date.now(),
      caption: memoryCaption.trim() || "Tokyo Moment",
      location: memoryLocation.trim() || "Tokyo",
      photoData: memoryPhotoData,
      dateTaken: new Date().toLocaleDateString(),
    };

    setMemories([newMemory, ...memories]);
    setMemoryCaption("");
    setMemoryLocation("");
    setMemoryPhotoData(null);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tools Section Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
          Personal Travel Control Room
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Budget, Vault, Packing & Memories.
        </h2>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setToolTab("budget")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "budget"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <Wallet className="h-4 w-4 text-[#FFD66B]" />
          <span>Budget & Expenses</span>
        </button>

        <button
          onClick={() => setToolTab("vault")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "vault"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <FileText className="h-4 w-4 text-[#FFD66B]" />
          <span>Bookings & Documents</span>
        </button>

        <button
          onClick={() => setToolTab("packing")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "packing"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <CheckSquare className="h-4 w-4 text-[#FFD66B]" />
          <span>Smart Packing ({packedCount}/{totalPackingCount})</span>
        </button>

        <button
          onClick={() => setToolTab("memories")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "memories"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <ImageIcon className="h-4 w-4 text-[#FFD66B]" />
          <span>Trip Memories ({memories.length})</span>
        </button>
      </div>

      {/* 1. BUDGET & EXPENSE TRACKER */}
      {toolTab === "budget" && (
        <div className="space-y-6">
          {/* Total Spent Summary Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1F3A5F] to-[#132540] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF86A8]">
                Total Spent on Trip
              </span>
              <div className="mt-1 font-serif text-3xl sm:text-5xl font-bold">
                ¥ {totalSpentJPY.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-stone-300">
                ≈ ₱ {totalSpentPHP.toLocaleString()} PHP (at 1 ₱ ≈ {fxRate?.toFixed(2) || "2.70"} ¥)
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-[#FFD66B] self-start sm:self-auto">
              {expenses.length} Recorded Expenses
            </span>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md space-y-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Record New Expense
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="What did you buy? (e.g. Ramen in Asakusa, Disney Popcorn)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] sm:col-span-6"
                required
              />
              <input
                type="text"
                inputMode="numeric"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="Amount in ¥ JPY"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] sm:col-span-3"
                required
              />
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as ExpenseRecord["category"])}
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-3"
              >
                <option value="food">🍱 Food & Snacks</option>
                <option value="transport">🚆 Transport & IC</option>
                <option value="shopping">🛍️ Shopping & Souvenirs</option>
                <option value="tickets">🎟️ Tickets & Tours</option>
                <option value="stay">🏨 Hotel & Amenities</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5F93] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#e84e80] transition"
            >
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </form>

          {/* Expense History List */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md divide-y divide-stone-100">
            {expenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No expenses logged yet. Add your first snack or transit fare above!
              </div>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-stone-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {exp.category === "food"
                        ? "🍱"
                        : exp.category === "transport"
                        ? "🚆"
                        : exp.category === "shopping"
                        ? "🛍️"
                        : exp.category === "tickets"
                        ? "🎟️"
                        : "💵"}
                    </span>
                    <div>
                      <h5 className="font-serif text-sm font-bold text-stone-900">{exp.title}</h5>
                      <span className="text-[10px] font-mono text-stone-500">{exp.date} · {exp.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-stone-900">
                      ¥ {Number(exp.amount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1 text-stone-400 hover:text-red-600 transition"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. BOOKINGS & TRAVEL DOCUMENTS VAULT */}
      {toolTab === "vault" && (
        <div className="space-y-6">
          {/* Privacy & Storage Notice */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 leading-relaxed flex items-start gap-3">
            <Lock className="h-4 w-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Offline & Private Device Storage</p>
              <p className="mt-0.5 text-emerald-800">
                Documents and confirmation tickets added here are kept in your browser storage so they remain accessible offline during transit and flights.
              </p>
            </div>
          </div>

          {/* Add Document Form */}
          <form onSubmit={handleAddDocument} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md space-y-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Add Booking / Ticket / Passport Copy
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Document Title (e.g. DisneySea QR Tickets, Hotel Booking, Insurance)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-6"
                required
              />

              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as BookingDocument["type"])}
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-3"
              >
                <option value="ticket">🎟️ Ticket / QR Pass</option>
                <option value="hotel">🏨 Hotel Voucher</option>
                <option value="flight">✈️ Flight Confirmation</option>
                <option value="passport">🛂 Passport / Visa</option>
                <option value="insurance">🛡️ Travel Insurance</option>
                <option value="other">📄 Other Document</option>
              </select>

              <input
                type="text"
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                placeholder="Confirmation # (optional)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <input
                type="text"
                value={docNotes}
                onChange={(e) => setDocNotes(e.target.value)}
                placeholder="Notes (e.g. 5 tickets, Gate South, Sep 4 rope drop)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-7"
              />

              <div className="sm:col-span-5 flex items-center gap-2">
                <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                  <span>{docFileName ? docFileName : "📎 Attach File / Screenshot"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3A5F] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
            >
              <Plus className="h-4 w-4" /> Save to Vault
            </button>
          </form>

          {/* Document Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-black tracking-wider text-[#FF5F93]">
                        {doc.type}
                      </span>
                      <h5 className="font-serif text-base font-bold text-stone-900 mt-0.5">
                        {doc.title}
                      </h5>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-stone-400 hover:text-red-600 transition"
                      aria-label="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {doc.confirmationCode && (
                    <div className="mt-2 rounded bg-stone-100 px-2 py-1 font-mono text-xs font-bold text-[#1F3A5F] w-fit">
                      REF: {doc.confirmationCode}
                    </div>
                  )}

                  {doc.notes && (
                    <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                      {doc.notes}
                    </p>
                  )}
                </div>

                {doc.fileData && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500 truncate max-w-[200px]">
                      {doc.fileName || "Attached file"}
                    </span>
                    <a
                      href={doc.fileData}
                      download={doc.fileName || "travel-doc"}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1F3A5F] hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> View / Download
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SMART PACKING CHECKLIST */}
      {toolTab === "packing" && (
        <div className="space-y-6">
          {/* Packing Progress Bar */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700">Packing Progress</span>
              <span className="text-[#FF5F93]">{packedCount} of {totalPackingCount} packed ({packedPercentage}%)</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full bg-[#FF5F93] transition-all duration-300"
                style={{ width: `${packedPercentage}%` }}
              />
            </div>
          </div>

          {/* Add Custom Item */}
          <form onSubmit={handleAddCustomPacking} className="flex gap-2">
            <input
              type="text"
              value={newCustomItem}
              onChange={(e) => setNewCustomItem(e.target.value)}
              placeholder="Add personal item (e.g. Camera lenses, kids snacks)..."
              className="flex-1 rounded-xl border border-stone-200 bg-white p-3 text-xs font-medium outline-none focus:border-[#1F3A5F]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#1F3A5F] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#132540]"
            >
              Add Item
            </button>
          </form>

          {/* Categorized Checklist */}
          <div className="space-y-6">
            {["documents", "clothing", "weather", "electronics", "park"].map((cat) => {
              const items = packingPresets.filter((p) => p.category === cat);
              return (
                <div key={cat} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                  <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 font-serif text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">
                    {cat === "documents"
                      ? "📄 Essential Documents & Money"
                      : cat === "clothing"
                      ? "👕 Clothing & Footwear"
                      : cat === "weather"
                      ? "☀️ Rain & Heat Protection"
                      : cat === "electronics"
                      ? "🔌 Electronics & Medications"
                      : "🎒 Disney & Daypack Gear"}
                  </div>

                  <div className="divide-y divide-stone-100">
                    {items.map((item) => {
                      const isChecked = !!packedMap[item.id];
                      return (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 p-4 cursor-pointer hover:bg-stone-50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePacked(item.id)}
                            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#FF5F93] focus:ring-[#FF5F93]"
                          />
                          <div className="flex-1">
                            <span
                              className={`text-xs font-semibold ${
                                isChecked ? "text-stone-400 line-through" : "text-stone-900"
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.note && (
                              <p className="text-[11px] text-stone-500 mt-0.5">{item.note}</p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Custom Added Items */}
            {customItems.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 font-serif text-sm font-bold text-[#1F3A5F]">
                  ⭐ Custom Personal Items
                </div>
                <div className="divide-y divide-stone-100">
                  {customItems.map((cItem, i) => {
                    const cId = `custom-${i}`;
                    const isChecked = !!packedMap[cId];
                    return (
                      <label
                        key={cId}
                        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-stone-50 transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePacked(cId)}
                          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#FF5F93]"
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isChecked ? "text-stone-400 line-through" : "text-stone-900"
                          }`}
                        >
                          {cItem}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TRIP MEMORIES GALLERY */}
      {toolTab === "memories" && (
        <div className="space-y-6">
          {/* Upload Photo Form */}
          <form onSubmit={handleAddMemory} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md space-y-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Save a Tokyo Memory
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={memoryCaption}
                onChange={(e) => setMemoryCaption(e.target.value)}
                placeholder="Caption (e.g. Sunset at Sensō-ji, Fantasy Springs with family)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-medium outline-none focus:border-[#1F3A5F]"
              />
              <input
                type="text"
                value={memoryLocation}
                onChange={(e) => setMemoryLocation(e.target.value)}
                placeholder="Location (e.g. Asakusa, Maihama, Shibuya)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs font-medium outline-none focus:border-[#1F3A5F]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto flex-1 cursor-pointer rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                <span className="flex items-center justify-center gap-1.5">
                  <Camera className="h-4 w-4 text-[#FF5F93]" />
                  {memoryPhotoData ? "Photo Selected ✓" : "Snap / Upload Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={!memoryPhotoData}
                className="w-full sm:w-auto rounded-xl bg-[#FF5F93] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#e84e80] disabled:opacity-50 transition"
              >
                Save Photo
              </button>
            </div>
          </form>

          {/* Photo Grid */}
          {memories.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-xs text-stone-500">
              No photos saved yet. Capture your favorite moments in Tokyo and store them here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memories.map((mem) => (
                <div key={mem.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md flex flex-col">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mem.photoData}
                    alt={mem.caption}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-sm font-bold text-stone-900">{mem.caption}</h5>
                      <span className="text-[10px] text-stone-500">{mem.location} · {mem.dateTaken}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1 text-stone-400 hover:text-red-600 transition"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
