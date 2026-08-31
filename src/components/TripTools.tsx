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
  Camera,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export const TripTools: React.FC = () => {
  const [toolTab, setToolTab] = useState<
    "bookings" | "documents" | "memories"
  >("bookings");

  // Packing lives in its own Trip Prep card, not the on-trip tab switcher —
  // it's a before-you-leave checklist, not something you reach for mid-day
  // alongside tickets and documents. Collapsed by default so it doesn't
  // compete with bookings/documents for attention once the trip is underway.
  const [isPrepOpen, setIsPrepOpen] = useState(false);

  const { rate: liveFxRate } = useFXRate(
    tripMeta.defaultCurrencies.homeCurrency,
    tripMeta.defaultCurrencies.destCurrency
  );
  const fxRate = liveFxRate || 2.70;

  // Load summary stats for Budget banner. Also keep the setters: adding or
  // deleting a booking with a cost attached needs to append/remove from the
  // exact same localStorage-backed arrays the Budget page reads, so a
  // booking's amount shows up there without the user re-entering it.
  const [paidExpenses, setPaidExpenses] = useLocalStorage<ExpenseRecord[]>("travel_tokyo_paid_expenses_v3", []);
  const [, setPlannedExpenses] = useLocalStorage<ExpenseRecord[]>("travel_tokyo_planned_expenses_v2", []);
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

  // Fixed id for the single Family Travel Insurance policy attachment, shown
  // in its own card in the Documents tab (not the generic Bookings grid).
  const INSURANCE_DOC_ID = "doc-family-travel-insurance";
  const insuranceDoc = documents.find((d) => d.id === INSURANCE_DOC_ID);
  const [isInsuranceUploading, setIsInsuranceUploading] = useState(false);
  const [insuranceError, setInsuranceError] = useState<string | null>(null);

  const handleInsuranceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInsuranceError(null);
    setIsInsuranceUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result as string;
      const doc: BookingDocument = {
        id: INSURANCE_DOC_ID,
        title: "Family Travel Insurance Policy",
        type: "other",
        fileData,
        fileName: file.name,
        fileType: file.type,
        notes: "Coverage for 5 travelers for trip duration (Sep 1–7, 2026).",
        dateAdded: new Date().toISOString().split("T")[0],
      };
      try {
        await saveDocToIDB(doc);
        setDocuments((prev) => [doc, ...prev.filter((d) => d.id !== INSURANCE_DOC_ID)]);
      } catch (err) {
        console.error("Error saving insurance document:", err);
        setInsuranceError("Couldn't save the policy file — please try again.");
      } finally {
        setIsInsuranceUploading(false);
      }
    };
    reader.onerror = () => {
      setIsInsuranceUploading(false);
      setInsuranceError("Couldn't read that file — please try again.");
    };
    reader.readAsDataURL(file);
  };

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
      notes: "Outbound Sep 1 · 5J 5054 (6:50 AM–12:25 PM) · Inbound Sep 7 · 5J 5055 (1:45 PM–5:40 PM) · 5 Passengers",
      amount: "Booked & Paid",
      dateAdded: "2026-09-01",
    },
    {
      id: "booking-hp-studio",
      title: "Warner Bros. Studio Tour Tokyo (The Making of Harry Potter)",
      type: "ticket",
      notes: "Not booked yet. Target: Sep 3 afternoon · Toshimaen Station.",
      amount: "Not Booked Yet · Planned",
      dateAdded: "2026-09-03",
    },
    {
      id: "booking-disney-parks",
      title: "Tokyo Disney Resort Park Tickets (Disneyland & DisneySea)",
      type: "ticket",
      notes: "Not booked yet. Plan: DisneySea (Sep 2) & Disneyland (Sep 4) · Buy via Official Disney App.",
      amount: "Not Booked Yet · Planned",
      dateAdded: "2026-09-02",
    },
  ];

  // One-time correction: the HP Studio and Disney entries were originally seeded
  // into IndexedDB showing "Booked & Paid" with fabricated confirmation codes,
  // before either was actually booked. This patches any already-seeded copy of
  // those two records (by id) back to an honest "not booked yet" status, once,
  // without touching anything the user has since edited or deleted themselves.
  const correctStaleBookingStatus = async (docs: BookingDocument[]): Promise<BookingDocument[]> => {
    const staleIds = new Set(["booking-hp-studio", "booking-disney-parks"]);
    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_booking_status_corrected_v1") === "true";
    if (alreadyCorrected) return docs;

    let changed = false;
    const patched = await Promise.all(
      docs.map(async (doc) => {
        if (staleIds.has(doc.id) && doc.amount === "Booked & Paid") {
          const fresh = defaultBookings.find((d) => d.id === doc.id)!;
          const correctedDoc: BookingDocument = {
            ...doc,
            confirmationCode: undefined,
            notes: fresh.notes,
            amount: fresh.amount,
          };
          await saveDocToIDB(correctedDoc);
          changed = true;
          return correctedDoc;
        }
        return doc;
      })
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_booking_status_corrected_v1", "true");
    }
    return changed ? patched : docs;
  };

  // One-time correction: the flight booking's notes originally held placeholder
  // times (06:10-11:35 / 13:45-17:40) before the real Cebu Pacific confirmation
  // (5J 5054 / 5J 5055, actual departure 6:50 AM / arrival 12:25 PM outbound)
  // came in. This patches any already-seeded copy of that one record to the
  // real flight numbers and times, once, without touching anything the user
  // has since edited themselves — same idiom as correctStaleBookingStatus above.
  const correctStaleFlightInfo = async (docs: BookingDocument[]): Promise<BookingDocument[]> => {
    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_flight_info_corrected_v1") === "true";
    if (alreadyCorrected) return docs;

    let changed = false;
    const patched = await Promise.all(
      docs.map(async (doc) => {
        if (doc.id === "booking-flight-mnl-nrt" && doc.notes?.includes("06:10")) {
          const fresh = defaultBookings.find((d) => d.id === doc.id)!;
          const correctedDoc: BookingDocument = { ...doc, notes: fresh.notes };
          await saveDocToIDB(correctedDoc);
          changed = true;
          return correctedDoc;
        }
        return doc;
      })
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_flight_info_corrected_v1", "true");
    }
    return changed ? patched : docs;
  };

  // One-time correction: the two Disney park days were swapped (DisneySea is
  // now Day 2, Disneyland is now Day 4). Patches an already-seeded copy of
  // the Disney tickets booking note to match, once, without touching
  // anything the user has since edited themselves.
  const correctStaleDisneyDayNotes = async (docs: BookingDocument[]): Promise<BookingDocument[]> => {
    const alreadyCorrected =
      typeof window !== "undefined" &&
      window.localStorage.getItem("travel_tokyo_disney_days_corrected_v1") === "true";
    if (alreadyCorrected) return docs;

    let changed = false;
    const patched = await Promise.all(
      docs.map(async (doc) => {
        if (doc.id === "booking-disney-parks" && doc.notes?.includes("Disneyland (Sep 2)")) {
          const fresh = defaultBookings.find((d) => d.id === doc.id)!;
          const correctedDoc: BookingDocument = { ...doc, notes: fresh.notes };
          await saveDocToIDB(correctedDoc);
          changed = true;
          return correctedDoc;
        }
        return doc;
      })
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("travel_tokyo_disney_days_corrected_v1", "true");
    }
    return changed ? patched : docs;
  };

  useEffect(() => {
    async function loadDocs() {
      try {
        const stored = await getAllDocuments();
        const alreadySeeded =
          typeof window !== "undefined" &&
          window.localStorage.getItem("travel_tokyo_bookings_seeded") === "true";

        if (stored.length === 0 && !alreadySeeded) {
          // First-ever visit: write the starter bookings into IndexedDB for real
          // (previously they only ever lived in memory, so "deleting" one just
          // hid it until the next reload silently brought it back).
          await Promise.all(defaultBookings.map((doc) => saveDocToIDB(doc)));
          window.localStorage.setItem("travel_tokyo_bookings_seeded", "true");
          setDocuments(defaultBookings);
        } else {
          const statusCorrected = await correctStaleBookingStatus(stored);
          const flightCorrected = await correctStaleFlightInfo(statusCorrected);
          setDocuments(await correctStaleDisneyDayNotes(flightCorrected));
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
  const [docStatus, setDocStatus] = useState<"paid" | "planned">("planned");
  const [docFileData, setDocFileData] = useState<string | undefined>();
  const [docFileName, setDocFileName] = useState<string | undefined>();
  // FileReader.readAsDataURL is async; on the previous version the Save
  // button had no guard for it, so tapping Save right after picking a file
  // (very easy to do with a large scanned PDF) could submit before the file
  // finished reading — the booking would save with no attachment at all,
  // which is exactly the "I attached a PDF but it won't load" symptom.
  const [isDocFileReading, setIsDocFileReading] = useState(false);
  const [docSaveError, setDocSaveError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocSaveError(null);
    setIsDocFileReading(true);
    setDocFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setDocFileData(event.target?.result as string);
      setIsDocFileReading(false);
    };
    reader.onerror = () => {
      setIsDocFileReading(false);
      setDocFileName(undefined);
      setDocFileData(undefined);
      setDocSaveError("Couldn't read that file — please attach it again.");
    };
    reader.readAsDataURL(file);
  };

  const BOOKING_CATEGORY_MAP: Record<BookingDocument["type"], ExpenseRecord["category"]> = {
    ticket: "tickets",
    hotel: "hotel",
    flight: "flights",
    qr: "tickets",
    other: "other",
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    if (isDocFileReading) {
      setDocSaveError("Still attaching your file — wait a second, then press Save again.");
      return;
    }

    const amountJPY = Math.max(0, Math.round(Number(docAmount) || 0));
    const hasAmount = amountJPY > 0;
    const amountPHP = hasAmount ? Math.round(amountJPY / fxRate) : 0;
    const linkedExpenseId = hasAmount ? `booking-expense-${Date.now()}` : undefined;

    const newDoc: BookingDocument = {
      id: "doc-" + Date.now(),
      title: docTitle.trim(),
      type: docType,
      confirmationCode: docCode.trim() || undefined,
      notes: docNotes.trim() || undefined,
      amount: hasAmount
        ? `¥${amountJPY.toLocaleString()} JPY (≈ ₱${amountPHP.toLocaleString()} PHP) · ${
            docStatus === "paid" ? "Paid" : "Planned"
          }`
        : undefined,
      amountJPY: hasAmount ? amountJPY : undefined,
      amountPHP: hasAmount ? amountPHP : undefined,
      expenseStatus: hasAmount ? docStatus : undefined,
      linkedExpenseId,
      fileData: docFileData,
      fileName: docFileName,
      dateAdded: new Date().toISOString().split("T")[0],
    };

    try {
      await saveDocToIDB(newDoc);
    } catch (err) {
      console.error("Error saving document to IndexedDB:", err);
      // Keep everything the user typed/attached so they can just hit Save
      // again — silently clearing the form here would look like it saved
      // and then discard the attachment for good.
      setDocSaveError("Couldn't save this booking — please try Save again.");
      return;
    }

    setDocuments((prev) => [newDoc, ...prev]);

    if (hasAmount && linkedExpenseId) {
      const newExpense: ExpenseRecord = {
        id: linkedExpenseId,
        title: docTitle.trim(),
        amount: amountJPY,
        currency: "JPY",
        category: BOOKING_CATEGORY_MAP[docType],
        paymentMethod: "Primary Visa / Mastercard",
        date: newDoc.dateAdded,
        status: docStatus,
        notes: `Auto-linked from Bookings & Tickets: ${docTitle.trim()}`,
        convertedAmountPHP: amountPHP,
      };
      if (docStatus === "paid") {
        setPaidExpenses((prev) => [newExpense, ...prev]);
      } else {
        setPlannedExpenses((prev) => [newExpense, ...prev]);
      }
    }

    setDocTitle("");
    setDocCode("");
    setDocNotes("");
    setDocAmount("");
    setDocStatus("planned");
    setDocFileData(undefined);
    setDocFileName(undefined);
    setDocSaveError(null);
  };

  const handleDeleteDocument = async (id: string) => {
    const target = documents.find((d) => d.id === id);
    try {
      await deleteDocFromIDB(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting document from IndexedDB:", err);
      return;
    }

    // Remove the linked expense this booking created, if any — but only
    // that one record, never anything the user entered manually in Budget.
    if (target?.linkedExpenseId) {
      const expenseId = target.linkedExpenseId;
      setPaidExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      setPlannedExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    }
  };

  // =========================================================================
  // 2. Travel Documents (Passports & Visas) Privacy State
  // =========================================================================
  const DOCUMENTS_PIN = "0408";
  const [documentsUnlocked, setDocumentsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleUnlockDocuments = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DOCUMENTS_PIN) {
      setDocumentsUnlocked(true);
      setPinError(false);
      setPinInput("");
    } else {
      setPinError(true);
    }
  };

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
    setCustomItems((prev) => [...prev, newCustomItem.trim()]);
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

      {/* TRIP PREP: packing lives here, separate from the on-trip tabs below */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md">
        <button
          onClick={() => setIsPrepOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#FBF0DC] flex items-center justify-center flex-shrink-0">
              <CheckSquare className="h-5 w-5 text-[#C1802E]" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#C1802E]">
                Trip Prep
              </span>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Smart Packing ({packedCount}/{totalPackingCount})
              </h3>
            </div>
          </div>
          {isPrepOpen ? (
            <ChevronUp className="h-5 w-5 text-stone-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-stone-400 flex-shrink-0" />
          )}
        </button>

        {isPrepOpen && (
          <div className="p-5 sm:p-6 pt-0 space-y-6 border-t border-stone-100">
            {/* Packing Progress Bar */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Packing Progress</span>
                <span className="text-[#FF5F93]">
                  {packedCount} of {totalPackingCount} packed ({packedPercentage}%)
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white">
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
                type="number"
                inputMode="numeric"
                min="0"
                value={docAmount}
                onChange={(e) => setDocAmount(e.target.value)}
                placeholder="Amount ¥ JPY (optional)"
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-2"
              />

              <select
                value={docStatus}
                onChange={(e) => setDocStatus(e.target.value as "paid" | "planned")}
                className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm font-medium outline-none focus:border-[#1F3A5F] sm:col-span-2"
              >
                <option value="planned">🗓️ Planned</option>
                <option value="paid">✅ Paid</option>
              </select>

              <div className="sm:col-span-4 flex items-center gap-2">
                <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-xs font-semibold text-stone-700 hover:bg-stone-100 transition">
                  <span>
                    {isDocFileReading
                      ? "Reading file…"
                      : docFileName
                      ? docFileName
                      : "📎 Attach Voucher PDF / Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {docAmount && Number(docAmount) > 0 && (
              <p className="text-[11px] text-stone-500 -mt-1">
                Automatically added to your Budget page as {docStatus === "paid" ? "Paid" : "Planned"} spend — no need to add it there too.
              </p>
            )}

            {docSaveError && (
              <p className="text-xs font-semibold text-red-600">{docSaveError}</p>
            )}

            <button
              type="submit"
              disabled={isDocFileReading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus className="h-4 w-4" /> {isDocFileReading ? "Reading File…" : "Save Booking"}
            </button>
          </form>

          {/* Bookings & Tickets Cards Grid — the Family Travel Insurance policy
              lives in its own dedicated card in the Documents tab instead,
              so it isn't filtered out here to avoid showing it twice. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.filter((doc) => doc.id !== INSURANCE_DOC_ID).map((doc) => (
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
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1F3A5F] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TRAVEL DOCUMENTS FOLDER (PASSPORTS, VISAS & INSURANCE, PIN + BLUR PROTECTED) */}
      {toolTab === "documents" && !documentsUnlocked && (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/80 p-8 text-center space-y-4 max-w-sm mx-auto">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-[#1F3A5F] text-white flex items-center justify-center">
            <Lock className="h-6 w-6 text-[#FFD66B]" />
          </div>
          <div>
            <p className="font-serif text-lg font-bold text-stone-900">Enter PIN to Open Vault</p>
            <p className="mt-1 text-xs text-indigo-900">
              Passports, visas, and travel documents are PIN-protected. Enter the 4-digit PIN to continue.
            </p>
          </div>
          <form onSubmit={handleUnlockDocuments} className="space-y-2">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/[^0-9]/g, ""));
                setPinError(false);
              }}
              placeholder="••••"
              autoFocus
              className={`w-full rounded-xl border p-3 text-center text-lg font-bold tracking-[0.5em] outline-none ${
                pinError
                  ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500"
                  : "border-stone-300 bg-white text-stone-900 focus:border-[#1F3A5F]"
              }`}
            />
            {pinError && (
              <p className="text-xs font-bold text-red-600">Incorrect PIN. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
            >
              Unlock Documents Vault
            </button>
          </form>
        </div>
      )}

      {toolTab === "documents" && documentsUnlocked && (
        <div className="space-y-6">
          {/* Privacy Notice Banner */}
          <div className="rounded-3xl border border-indigo-200 bg-indigo-50/80 p-5 text-xs text-indigo-950 leading-relaxed flex items-start gap-3">
            <Lock className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm">Protected Travel Documents Vault</p>
              <p className="mt-0.5 text-indigo-800">
                Passports and Japan Visas are PIN-protected and blurred by default on screen so you can safely use your phone in public. Tap <b>&quot;Reveal Document&quot;</b> on any traveler to display their passport and visa image at airport check-in, immigration, or hotel reception.
              </p>
            </div>
            <button
              onClick={() => setDocumentsUnlocked(false)}
              className="flex-shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition"
            >
              Lock Vault
            </button>
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

                {insuranceDoc?.fileData ? (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5">
                    <span className="truncate text-[11px] text-stone-500">
                      {insuranceDoc.fileName || "Policy file"}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={insuranceDoc.fileData}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F3A5F] hover:underline"
                      >
                        <Eye className="h-3 w-3" /> View
                      </a>
                      <label className="cursor-pointer text-[11px] font-bold text-stone-500 hover:text-stone-700">
                        {isInsuranceUploading ? "Uploading…" : "Replace"}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleInsuranceUpload}
                          className="hidden"
                          disabled={isInsuranceUploading}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-stone-300 bg-white px-2.5 py-2 text-[11px] font-semibold text-stone-600 hover:bg-stone-100 transition">
                    {isInsuranceUploading ? "Uploading…" : "📎 Attach Policy PDF / Photo"}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleInsuranceUpload}
                      className="hidden"
                      disabled={isInsuranceUploading}
                    />
                  </label>
                )}
                {insuranceError && (
                  <p className="text-[11px] font-semibold text-red-600">{insuranceError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRIP MEMORIES GALLERY (STORED IN INDEXEDDB) */}
      {toolTab === "memories" && (
        <div className="space-y-6">
          {/* Upload Photo Form */}
          <form
            onSubmit={handleAddMemory}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md space-y-4"
          >
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
