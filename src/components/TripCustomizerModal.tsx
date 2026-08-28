"use client";

import React, { useState } from "react";
import { tripMeta } from "../data/trip-config";
import { X, Download, Upload, Check, Settings, ShieldCheck } from "lucide-react";

interface TripCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripCustomizerModal: React.FC<TripCustomizerModalProps> = ({ isOpen, onClose }) => {
  const [tripName, setTripName] = useState(tripMeta.tripName);
  const [destination, setDestination] = useState(tripMeta.destination);
  const [startDate, setStartDate] = useState(tripMeta.startDate);
  const [endDate, setEndDate] = useState(tripMeta.endDate);
  const [homeCurrency, setHomeCurrency] = useState(tripMeta.defaultCurrencies.homeCurrency);
  const [destCurrency, setDestCurrency] = useState(tripMeta.defaultCurrencies.destCurrency);
  const [homeSymbol, setHomeSymbol] = useState(tripMeta.defaultCurrencies.homeSymbol);
  const [destSymbol, setDestSymbol] = useState(tripMeta.defaultCurrencies.destSymbol);
  const [hotelName, setHotelName] = useState(tripMeta.homeBase.name);
  const [hotelAddress, setHotelAddress] = useState(tripMeta.homeBase.japaneseAddress || tripMeta.homeBase.address);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Export Full Backup (JSON)
  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        tripConfig: {
          tripName,
          destination,
          startDate,
          endDate,
          homeCurrency,
          destCurrency,
          homeSymbol,
          destSymbol,
          hotelName,
          hotelAddress,
        },
        localStorageDump: {
          paidExpenses: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_paid_expenses_v3") : null,
          plannedExpenses: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_planned_expenses_v2") : null,
          packingChecks: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_packing_checks") : null,
          customPacking: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_custom_packing") : null,
          budgetPHP: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_budget_php") : null,
          initialCash: typeof window !== "undefined" ? localStorage.getItem("travel_tokyo_initial_cash_jpy") : null,
        },
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${tripName.toLowerCase().replace(/\s+/g, "_")}_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSavedStatus("Backup exported successfully!");
      setTimeout(() => setSavedStatus(null), 3000);
    } catch (e) {
      console.error("Failed to export backup:", e);
      setSavedStatus("Failed to export backup.");
    }
  };

  // Handle Import Backup (JSON)
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.localStorageDump) {
          Object.entries(parsed.localStorageDump).forEach(([key, val]) => {
            if (val && typeof window !== "undefined") {
              const fullKey = key === "paidExpenses" ? "travel_tokyo_paid_expenses_v3"
                : key === "plannedExpenses" ? "travel_tokyo_planned_expenses_v2"
                : key === "packingChecks" ? "travel_tokyo_packing_checks"
                : key === "customPacking" ? "travel_tokyo_custom_packing"
                : key === "budgetPHP" ? "travel_tokyo_budget_php"
                : key === "initialCash" ? "travel_tokyo_initial_cash_jpy" : key;
              localStorage.setItem(fullKey, val as string);
            }
          });
        }

        if (parsed.tripConfig) {
          if (parsed.tripConfig.tripName) setTripName(parsed.tripConfig.tripName);
          if (parsed.tripConfig.destination) setDestination(parsed.tripConfig.destination);
          if (parsed.tripConfig.startDate) setStartDate(parsed.tripConfig.startDate);
          if (parsed.tripConfig.endDate) setEndDate(parsed.tripConfig.endDate);
          if (parsed.tripConfig.homeCurrency) setHomeCurrency(parsed.tripConfig.homeCurrency);
          if (parsed.tripConfig.destCurrency) setDestCurrency(parsed.tripConfig.destCurrency);
        }

        setSavedStatus("Backup successfully imported! Reloading to apply...");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        console.error("Invalid JSON file:", err);
        setSavedStatus("Error: Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FBF8F0] border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 text-[#2A2620] animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#1F3A5F] text-white flex items-center justify-center">
              <Settings className="h-5 w-5 text-[#FFD66B]" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1F3A5F]">
                Trip Customizer & Data Backup
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Customize your travel companion & safeguard on-device data.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status notification */}
        {savedStatus && (
          <div className="rounded-xl bg-emerald-100 border border-emerald-300 p-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{savedStatus}</span>
          </div>
        )}

        {/* Privacy Note */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 text-xs text-sky-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-sky-900">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span>100% Client-Side Privacy Notice</span>
          </div>
          <p className="text-sky-900 leading-relaxed font-medium">
            All your uploaded documents, receipts, and custom packing items stay strictly on this device in your browser memory. We recommend exporting a JSON backup before departure.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Trip Name</label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                placeholder="e.g. TravelTokyo, TravelSeoul, TravelParis"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                placeholder="e.g. Tokyo, Japan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Home Currency</label>
              <input
                type="text"
                value={homeCurrency}
                onChange={(e) => setHomeCurrency(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold uppercase outline-none focus:border-[#1F3A5F]"
                placeholder="USD / PHP"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Home Symbol</label>
              <input
                type="text"
                value={homeSymbol}
                onChange={(e) => setHomeSymbol(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                placeholder="$ / ₱ / €"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Dest Currency</label>
              <input
                type="text"
                value={destCurrency}
                onChange={(e) => setDestCurrency(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold uppercase outline-none focus:border-[#1F3A5F]"
                placeholder="JPY / EUR"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Dest Symbol</label>
              <input
                type="text"
                value={destSymbol}
                onChange={(e) => setDestSymbol(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
                placeholder="¥ / € / £"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Home Base Hotel & Address</label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F] mb-2"
              placeholder="Hotel Name"
            />
            <input
              type="text"
              value={hotelAddress}
              onChange={(e) => setHotelAddress(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#1F3A5F]"
              placeholder="Japanese / Local Address for Taxi Drivers"
            />
          </div>
        </div>

        {/* Action Buttons: Export / Import / Save */}
        <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportBackup}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-100 shadow-sm transition"
            >
              <Download className="h-3.5 w-3.5 text-[#1F3A5F]" />
              <span>Export Backup (.json)</span>
            </button>

            <label className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-100 shadow-sm transition cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-[#C1802E]" />
              <span>Import (.json)</span>
              <input
                type="file"
                accept="application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => {
              setSavedStatus("Settings saved to current session!");
              setTimeout(() => {
                onClose();
              }, 600);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1F3A5F] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
          >
            <Check className="h-4 w-4" />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
