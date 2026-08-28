"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { tripMeta, packingPresets } from "../data/trip-config";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useFXRate } from "../hooks/useFXRate";
import {
  getAllDocuments,
  saveDocument as saveDocToIDB,
  deleteDocument as deleteDocFromIDB,
  getAllMemories,
  saveMemory as saveMemoryToIDB,
  deleteMemory as deleteMemoryFromIDB,
} from "../lib/indexedDb";
import { BookingDocument, MemoryPhoto, ExpenseRecord } from "../types/trip";
import {
  Wallet,
  Ticket,
  FolderLock,
  CheckSquare,
  Image as ImageIcon,
  Plus,
  Trash2,
  Lock,
  Download,
  Camera,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export const TripTools: React.FC = () => {
  const [toolTab, setToolTab] = useState<
    "bookings" | "documents" | "packing" | "memories"
  >("bookings");

  const { rate: liveFxRate } = useFXRate(
    tripMeta.defaultCurrencies.homeCurrency,
    tripMeta.defaultCurrencies.destCurrency
  );
  const fxRate = liveFxRate || 2.70;

  // Load summary stats for Budget banner
  const [paidExpenses] = useLocalStorage<ExpenseRecord[]>("travel_tokyo_paid_expenses_v3", []);
  const [plannedBudgetPHP] = useLocalStorage<number>(
    "travel_tokyo_budget_php",
    tripMeta.defaultCurrencies.plannedBudgetPHP || 150000
  );
  const plannedBudgetJPY = Math.round(plannedBudgetPHP * fxRate);
  const totalPaidJPY = paidExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingJPY = plannedBudgetJPY - totalPaidJPY;

  // =========================================================================
  // 1. Bookings & Tickets State (Stored in IndexedDB)
  // =========================================================================
  const [documents, setDocuments] = useState<BookingDocument[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);

  // Preloaded Verified Bookings
  const defaultBookings: BookingDocument[] = [
    {
      id: "booking-hotel-agoda-1759447607",
      title: "Hotel Plus Hostel TOKYO ASAKUSA 2 (Agoda Confirmation)",
      type: "hotel",
      confirmationCode: "1759447607",
      fileData: "/documents/hotel/agoda_hotel_confirmation_1759447607.pdf",
      fileName: "agoda_hotel_confirmation_1759447607.pdf",
      notes: "1-7-10 Hanakawado, Taito-ku · 2 Double Rooms · 6 Nights (Sep 1–7)",
      amount: "¥89,525 JPY (≈ ₱33,157 PHP) · Pay Later (Card ending 0006)",
      dateAdded: "2026-09-01",
    },
    {
      id: "booking-flight-mnl-nrt",
      title: "Flights: Manila (MNL) ⇄ Tokyo Narita (NRT)",
      type: "flight",
      confirmationCode: "WETQNY / WC2HXE / MH1ZRC / NLNDWD",
      notes: "Outbound Sep 1 (06:10–11:35) · Inbound Sep 7 (13:45–17:40) · 5 Passengers",
      amount: "Booked & Paid",
      dateAdded: "2026-09-01",
    },
    {
      id: "booking-hp-studio",
      title: "Warner Bros. Studio Tour Tokyo (The Making of Harry Potter)",
      type: "ticket",
      confirmationCode: "WBST-2026-0903-1300",
      notes: "Sep 3 · 1:00 PM Timed Entry · Toshimaen Station",
      amount: "Booked & Paid",
      dateAdded: "2026-09-03",
    },
    {
      id: "booking-disney-parks",
      title: "Tokyo Disney Resort Park Tickets (Disneyland & DisneySea)",
      type: "ticket",
      confirmationCode: "TDR-APP-PASSPORT",
      notes: "Tokyo Disneyland (Sep 2) & Tokyo DisneySea (Sep 4) · Available in Official App",
      amount: "Booked & Paid",
      dateAdded: "2026-09-02",
    },
  ];

  useEffect(() => {
    async function loadDocs() {
      try {
        const stored = await getAllDocuments();
        if (stored.length === 0) {
          setDocuments(defaultBookings);
        } else {
          setDocuments(stored);
        }
      } catch (err) {
        console.warn("Failed to load documents from IndexedDB:", err);
        setDocuments(defaultBookings);
      } finally {
        setIsDocsLoading(false);
      }
    }
    loadDocs();
  }, []);

  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState<BookingDocument["type"]>("ticket");
  const [docCode, setDocCode] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [docAmount, setDocAmount] = useState("");
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

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: BookingDocument = {
      id: "doc-" + Date.now(),
      title: docTitle.trim(),
      type: docType,
      confirmationCode: docCode.trim() || undefined,
      notes: docNotes.trim() || undefined,
      amount: docAmount.trim() || undefined,
      fileData: docFileData,
      fileName: docFileName,
      dateAdded: new Date().toISOString().split("T")[0],
    };

    try {
      await saveDocToIDB(newDoc);
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (err) {
      console.error("Error saving document to IndexedDB:", err);
    }

    setDocTitle("");
    setDocCode("");
    setDocNotes("");
    setDocAmount("");
    setDocFileData(undefined);
    setDocFileName(undefined);
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocFromIDB(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting document from IndexedDB:", err);
    }
  };

  // =========================================================================
  // 2. Travel Documents (Passports & Visas) Privacy State
  // =========================================================================
  const [revealedDocs, setRevealedDocs] = useState<Record<string, boolean>>({});

  const toggleReveal = (travelerId: string) => {
    setRevealedDocs((prev) => ({
      ...prev,
      [travelerId]: !prev[travelerId],
    }));
  };

  // =========================================================================
  // 3. Smart Packing State (Stored in LocalStorage)
  // =========================================================================
  const [packedMap, setPackedMap] = useLocalStorage<Record<string, boolean>>(
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
  const packedCount = Object.values(packedMap).filter(Boolean).length;
  const packedPercentage = totalPackingCount > 0 ? Math.round((packedCount / totalPackingCount) * 100) : 0;

  // =========================================================================
  // 4. Memories State (Stored in IndexedDB)
  // =========================================================================
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [isMemoriesLoading, setIsMemoriesLoading] = useState(true);

  useEffect(() => {
    async function loadMemories() {
      try {
        const stored = await getAllMemories();
        setMemories(stored);
      } catch (err) {
        console.warn("Failed to load memories from IndexedDB:", err);
      } finally {
        setIsMemoriesLoading(false);
      }
    }
    loadMemories();
  }, []);

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

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryPhotoData) return;

    const newMemory: MemoryPhoto = {
      id: "mem-" + Date.now(),
      caption: memoryCaption.trim() || "Tokyo Moment",
      location: memoryLocation.trim() || "Tokyo",
      photoData: memoryPhotoData,
      dateTaken: new Date().toLocaleDateString(),
    };

    try {
      await saveMemoryToIDB(newMemory);
      setMemories((prev) => [newMemory, ...prev]);
    } catch (err) {
      console.error("Error saving memory to IndexedDB:", err);
    }

    setMemoryCaption("");
    setMemoryLocation("");
    setMemoryPhotoData(null);
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemoryFromIDB(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting memory from IndexedDB:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tools Section Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5F93]">
          Personal Travel Control Room
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Bookings, Passports, Packing & Memories.
        </h2>
      </div>

      {/* DEDICATED BUDGET PLANNER LINK BANNER */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-[#1F3A5F] to-[#132540] p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF86A8]">
            <Wallet className="h-3.5 w-3.5 text-[#FFD66B]" />
            <span>Dedicated Budget & Expense Page</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Plan, track & categorize all Tokyo finances.
          </h3>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300 font-medium">
            <span>Planned: <b>₱{plannedBudgetPHP.toLocaleString()}</b> (≈ ¥{plannedBudgetJPY.toLocaleString()})</span>
            <span>·</span>
            <span>Paid: <b>¥{totalPaidJPY.toLocaleString()}</b></span>
            <span>·</span>
            <span>Remaining: <b className="text-emerald-300">¥{remainingJPY.toLocaleString()}</b></span>
          </div>
        </div>

        <Link
          href="/budget"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF5F93] px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#e84e80] transition active:scale-95 flex-shrink-0"
        >
          <span>Open Full Budget Planner</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setToolTab("bookings")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "bookings"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <Ticket className="h-4 w-4 text-[#FFD66B]" />
          <span>Bookings & Tickets ({documents.length})</span>
        </button>

        <button
          onClick={() => setToolTab("documents")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "documents"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <FolderLock className="h-4 w-4 text-[#FFD66B]" />
          <span>Travel Documents Folder (Passports & Visas)</span>
        </button>

        <button
          onClick={() => setToolTab("packing")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition flex-shrink-0 border ${
            toolTab === "packing"
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
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
              ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-md ring-2 ring-[#FF5F93]/30"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          <ImageIcon className="h-4 w-4 text-[#FFD66B]" />
          <span>Trip Memories ({memories.length})</span>
        </button>
      </div>

      {/* 1. BOOKINGS & TICKETS */}
      {toolTab === "bookings" && (
        <div className="space-y-6">
          {/* Add Booking / Ticket Form */}
          <form
            onSubmit={handleAddDocument}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md space-y-4"
          >
            <h4 className="font-serif text-base font-bold text-stone-900">
              Add Booking Confirmation / Park Ticket / QR Pass
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Booking Title (e.g. DisneySea QR Tickets, Harry Potter Studio, Hotel Voucher)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-6"
                required
              />

              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as BookingDocument["type"])}
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-3"
              >
                <option value="ticket">🎟️ Ticket / QR Pass</option>
                <option value="hotel">🏨 Hotel Booking</option>
                <option value="flight">✈️ Flight Confirmation</option>
                <option value="other">📄 Other Booking</option>
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
                placeholder="Notes (e.g. 5 tickets, South Gate, 1:00 PM slot)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-4"
              />

              <input
                type="text"
                value={docAmount}
                onChange={(e) => setDocAmount(e.target.value)}
                placeholder="Amount / Cost (e.g. ¥89,525 JPY)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-3"
              />

              <div className="sm:col-span-5 flex items-center gap-2">
                <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                  <span>{docFileName ? docFileName : "📎 Attach Voucher PDF / Image"}</span>
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
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
            >
              <Plus className="h-4 w-4" /> Save Booking
            </button>
          </form>

          {/* Bookings & Tickets Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-stone-200 bg-white p-5 shadow-md flex flex-col justify-between space-y-3"
              >
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
                      aria-label="Delete booking"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {doc.confirmationCode && (
                    <div className="mt-2 rounded-md bg-stone-100 px-2.5 py-1 font-mono text-xs font-bold text-[#1F3A5F] w-fit border border-stone-200/60">
                      REF: {doc.confirmationCode}
                    </div>
                  )}

                  {doc.notes && (
                    <p className="mt-2 text-xs text-stone-600 leading-relaxed font-medium">
                      {doc.notes}
                    </p>
                  )}

                  {doc.amount && (
                    <p className="mt-1 text-xs font-bold text-[#C1502E]">
                      Amount: {doc.amount}
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
                      target="_blank"
                      rel="noreferrer"
                      download={doc.fileName || "booking-document"}
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

      {/* 2. TRAVEL DOCUMENTS FOLDER (PASSPORTS, VISAS & INSURANCE WITH PRIVACY TOGGLE) */}
      {toolTab === "documents" && (
        <div className="space-y-6">
          {/* Privacy Notice Banner */}
          <div className="rounded-3xl border border-indigo-200 bg-indigo-50/80 p-5 text-xs text-indigo-950 leading-relaxed flex items-start gap-3">
            <Lock className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Protected Travel Documents Vault</p>
              <p className="mt-0.5 text-indigo-800">
                Passports and Japan Visas are blurred by default on screen so you can safely use your phone in public. Tap <b>&quot;Reveal Document&quot;</b> on any traveler to display their passport and visa image at airport check-in, immigration, or hotel reception. (No password required).
              </p>
            </div>
          </div>

          {/* Passenger Passports & Visas Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tripMeta.travelers.map((traveler) => {
              const isRevealed = !!revealedDocs[traveler.id];
              return (
                <div
                  key={traveler.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg flex flex-col justify-between"
                >
                  <div className="bg-stone-50 p-5 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center font-bold text-xs">
                        {traveler.travelerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-stone-900">
                          {traveler.travelerName}
                        </h4>
                        <span className="font-mono text-[10px] font-bold text-[#FF5F93]">
                          Flight PNR: {traveler.pnr}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleReveal(traveler.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                        isRevealed
                          ? "bg-stone-200 text-stone-800 hover:bg-stone-300"
                          : "bg-[#1F3A5F] text-white hover:bg-[#132540] shadow-sm"
                      }`}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Reveal</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium text-stone-600">
                      <span>Japan Visa Ref: <b className="font-mono text-stone-900">{traveler.visaNumber}</b></span>
                      <span className="text-emerald-700 font-semibold">✓ Single Entry Tourism</span>
                    </div>

                    {/* Document Images (Blurred unless revealed) */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Passport Image Card */}
                      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 aspect-[3/4] flex flex-col justify-end p-2 text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={traveler.passportImage}
                          alt={`${traveler.travelerName} Passport`}
                          className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
                            isRevealed ? "filter-none" : "filter blur-md brightness-75 scale-105"
                          }`}
                        />
                        <div className="relative z-10 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                          Passport Photo
                        </div>
                      </div>

                      {/* Visa Image Card */}
                      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 aspect-[3/4] flex flex-col justify-end p-2 text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={traveler.visaImage}
                          alt={`${traveler.travelerName} Visa`}
                          className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
                            isRevealed ? "filter-none" : "filter blur-md brightness-75 scale-105"
                          }`}
                        />
                        <div className="relative z-10 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                          Japan Visa ({traveler.visaNumber})
                        </div>
                      </div>
                    </div>

                    {isRevealed && (
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <a
                          href={traveler.passportImage}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1F3A5F] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Full Passport</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                          href={traveler.visaImage}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1F3A5F] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Full Visa</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Travel Insurance & Support Documents Section */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md space-y-4">
            <h4 className="font-serif text-base font-bold text-[#1F3A5F] flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Travel Insurance & Visa Verification Letters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-1">
                <span className="font-bold text-stone-900 text-sm">VFS Global Appointment & Visa Submission</span>
                <p className="text-stone-600">5 Applicants (Tourism Category) · Reference #1151572948 · Confirmed & Released</p>
                <span className="inline-block mt-1 font-semibold text-emerald-700">✓ All 5 Visas Approved</span>
              </div>

              <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-1">
                <span className="font-bold text-stone-900 text-sm">Travel Insurance Policy</span>
                <p className="text-stone-600">Coverage for 5 travelers for trip duration (Sep 1–7, 2026). Emergency evacuation & medical included.</p>
                <span className="inline-block mt-1 font-semibold text-sky-700">24/7 International Assistance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SMART PACKING CHECKLIST */}
      {toolTab === "packing" && (
        <div className="space-y-6">
          {/* Packing Progress Bar */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700">Packing Progress</span>
              <span className="text-[#FF5F93]">
                {packedCount} of {totalPackingCount} packed ({packedPercentage}%)
              </span>
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
              placeholder="Add personal item (e.g. Camera lenses, extra sneakers, kids snacks)..."
              className="flex-1 rounded-xl border border-stone-200 bg-white p-3 text-xs font-medium outline-none focus:border-[#1F3A5F]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#1F3A5F] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#132540]"
            >
              Add Item
            </button>
          </form>

          {/* Categorized Checklist */}
          <div className="space-y-6">
            {["documents", "clothing", "weather", "electronics", "park"].map((cat) => {
              const items = packingPresets.filter((p) => p.category === cat);
              return (
                <div
                  key={cat}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
                >
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
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
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

      {/* 4. TRIP MEMORIES GALLERY (STORED IN INDEXEDDB) */}
      {toolTab === "memories" && (
        <div className="space-y-6">
          {/* Upload Photo Form */}
          <form
            onSubmit={handleAddMemory}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md space-y-4"
          >
            <h4 className="font-serif text-base font-bold text-stone-900">
              Save a Tokyo Memory (Persisted in IndexedDB)
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
          {isMemoriesLoading ? (
            <div className="p-8 text-center text-xs text-stone-500">
              Loading photos from device storage...
            </div>
          ) : memories.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center text-xs text-stone-500 space-y-1">
              <p className="font-semibold text-stone-700">No photos saved yet.</p>
              <p>Capture your favorite moments in Tokyo and store them here for quick offline access!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md flex flex-col"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mem.photoData}
                    alt={mem.caption}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-sm font-bold text-stone-900">{mem.caption}</h5>
                      <span className="text-[10px] text-stone-500">
                        {mem.location} · {mem.dateTaken}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition rounded-lg hover:bg-stone-50"
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
