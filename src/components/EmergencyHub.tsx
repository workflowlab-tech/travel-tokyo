"use client";

import React, { useState } from "react";
import { tripMeta } from "../data/trip-config";
import { PhoneCall, ShieldAlert, Copy, Check, MapPin, ExternalLink } from "lucide-react";

export const EmergencyHub: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        `${tripMeta.homeBase.japaneseName}\n${tripMeta.homeBase.japaneseAddress}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const emergencyPhrases = [
    { jp: "助けてください (Tasukete kudasai)", en: "Please help me" },
    { jp: "英語を話せる人はいますか？ (Eigo o hanaseru hito wa imasu ka?)", en: "Does anyone speak English?" },
    { jp: "救急車を呼んでください (Kyūkyūsha o yonde kudasai)", en: "Please call an ambulance" },
    { jp: "道に迷いました (Michi ni mayoimashita)", en: "I am lost" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-red-600">
          Emergency Hub · 24/7 Assistance
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">
          Calm, clear, ready.
        </h2>
      </div>

      {/* Emergency Phone Dialer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tripMeta.emergencyContacts.map((contact, idx) => (
          <a
            key={idx}
            href={`tel:${contact.number}`}
            className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-red-600 to-red-800 p-6 text-white shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-200">
                  {contact.label}
                </span>
                <PhoneCall className="h-4 w-4 text-red-200 group-hover:scale-110 transition-transform" />
              </div>
              <div className="my-3 font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
                {contact.number}
              </div>
              <p className="text-xs text-red-100/90 font-medium leading-relaxed">
                {contact.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-red-500/50 flex items-center justify-between text-xs font-bold text-red-100">
              <span>{contact.japaneseLabel}</span>
              <span className="underline">Tap to Call →</span>
            </div>
          </a>
        ))}
      </div>

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
            href={`https://www.google.com/maps/search/?api=1&query=${tripMeta.homeBase.mapQuery}`}
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
            <div key={idx} className="rounded-xl border border-stone-100 bg-stone-50 p-3.5 text-xs">
              <div className="font-bold text-stone-900 text-sm">{phrase.jp}</div>
              <div className="text-stone-600 mt-0.5">{phrase.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
