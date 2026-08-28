"use client";

import React, { useState } from "react";
import { tripMeta } from "../data/trip-config";
import { PhoneCall, ShieldAlert, Copy, Check, MapPin, ExternalLink, HelpCircle, BookOpen, AlertTriangle } from "lucide-react";

export const EmergencyHub: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activePlaybookId, setActivePlaybookId] = useState<string>("lost-passport");

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        `${tripMeta.homeBase.japaneseName}\n${tripMeta.homeBase.japaneseAddress}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const emergencyPhrases = tripMeta.emergencyPhrases || [
    { jp: "助けてください", romaji: "Tasukete kudasai", en: "Please help me" },
    { jp: "英語を話せる人はいますか？", romaji: "Eigo o hanaseru hito wa imasu ka?", en: "Does anyone speak English?" },
    { jp: "救急車を呼んでください", romaji: "Kyūkyūsha o yonde kudasai", en: "Please call an ambulance" },
    { jp: "道に迷いました", romaji: "Michi ni mayoimashita", en: "I am lost" },
    { jp: "パスポートを紛失しました", romaji: "Pasupōto o funshitsu shimashita", en: "I lost my passport" },
    { jp: "ここはどこですか？", romaji: "Koko wa doko desu ka?", en: "Where is this location?" },
  ];

  const emergencyPlaybooks = tripMeta.emergencyPlaybooks || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-red-600">
          Emergency Hub · 24/7 Verified Assistance
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Calm, clear, ready when you need it.
        </h2>
      </div>

      {/* Emergency Phone Dialer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tripMeta.emergencyContacts.map((contact, idx) => (
          <a
            key={idx}
            href={`tel:${contact.number}`}
            className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-5 sm:p-6 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-200">
                  {contact.label}
                </span>
                <PhoneCall className="h-4 w-4 text-red-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="my-2 font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
                {contact.number}
              </div>
              <p className="text-xs text-red-100/90 font-medium leading-relaxed">
                {contact.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-red-500/50 flex items-center justify-between text-xs font-bold text-red-100">
              <span className="truncate max-w-[160px]">{contact.japaneseLabel}</span>
              <span className="underline flex-shrink-0">Tap to Call →</span>
            </div>
          </a>
        ))}
      </div>

      {/* EMERGENCY PLAYBOOKS (LOST PASSPORT / CARDS / ITEMS / MEDICAL) */}
      {emergencyPlaybooks.length > 0 && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#1F3A5F] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#FF5F93]" /> Emergency Recovery Playbooks
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
              Step-by-Step Incident Response
            </h3>
            <p className="text-xs text-stone-500">
              Clear procedures for lost travel documents, blocked cards, lost property, or illness.
            </p>
          </div>

          {/* Playbook Tabs */}
          <div className="flex flex-wrap gap-2">
            {emergencyPlaybooks.map((book) => (
              <button
                key={book.id}
                onClick={() => setActivePlaybookId(book.id)}
                className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 border ${
                  activePlaybookId === book.id
                    ? "bg-[#1F3A5F] text-white border-[#1F3A5F] shadow-sm"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                <span>{book.icon}</span>
                <span>{book.title}</span>
              </button>
            ))}
          </div>

          {/* Active Playbook Content */}
          {emergencyPlaybooks
            .filter((b) => b.id === activePlaybookId)
            .map((activeBook) => (
              <div
                key={activeBook.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeBook.icon}</span>
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {activeBook.title}
                    </h4>
                  </div>
                  {activeBook.priority === "high" && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800 border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Priority Action
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {activeBook.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-black uppercase text-stone-500">
                    Recommended Recovery Steps
                  </span>
                  <div className="space-y-2">
                    {activeBook.steps.map((step, si) => (
                      <div
                        key={si}
                        className="rounded-xl border border-stone-200 bg-white p-3 text-xs font-medium text-stone-800 shadow-sm leading-relaxed"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {activeBook.helplines && activeBook.helplines.length > 0 && (
                  <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Quick Numbers:</span>
                    {activeBook.helplines.map((h, hi) => (
                      <a
                        key={hi}
                        href={`tel:${h.number}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-white border border-stone-300 px-2.5 py-1 text-xs font-bold text-[#1F3A5F] hover:bg-stone-100"
                      >
                        <PhoneCall className="h-3 w-3 text-red-600" />
                        <span>{h.label}: {h.number}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Hotel Taxi Card (In Japanese for Driver) */}
      <div className="overflow-hidden rounded-3xl border border-amber-200 bg-[#FBF0DC] p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200/80 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#C1502E]" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Hotel Taxi Card (Show to Driver)
            </h3>
          </div>
          <button
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-stone-800 shadow-sm border border-stone-200 hover:bg-stone-50 transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Japanese Address</span>
              </>
            )}
          </button>
        </div>

        <div className="my-6 space-y-2">
          <div className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
            {tripMeta.homeBase.japaneseName}
          </div>
          <div className="font-mono text-base sm:text-lg font-bold text-stone-800">
            {tripMeta.homeBase.japaneseAddress}
          </div>
          <p className="text-xs text-stone-600 pt-1">
            English: {tripMeta.homeBase.name} · {tripMeta.homeBase.address}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-amber-200/80">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tripMeta.homeBase.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#C1502E] hover:underline"
          >
            <span>Open in Google Maps Navigation</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Essential Japanese Emergency Phrases */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-md">
        <h4 className="font-serif text-lg font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <span>Essential Emergency Phrases</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emergencyPhrases.map((phrase, idx) => (
            <div key={idx} className="rounded-xl border border-stone-100 bg-stone-50 p-3.5 text-xs space-y-1">
              <div className="font-bold text-stone-900 text-sm">{phrase.jp}</div>
              {phrase.romaji && (
                <div className="text-[11px] font-mono text-stone-500 font-semibold">{phrase.romaji}</div>
              )}
              <div className="text-stone-700 font-medium">{phrase.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

