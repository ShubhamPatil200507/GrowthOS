'use client';

import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  Layers
} from 'lucide-react';
import { api, MerchantMemoryItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function MemoryPage() {
  const [memories, setMemories] = useState<MerchantMemoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    api.getMemory()
      .then(setMemories)
      .catch(() => {
        setMemories([
          {
            id: "mem_01",
            category: "CAMPAIGN_LEARNING",
            content: "Afternoon 15% discount on tea+samosa combo lifted 2-5 PM lull by +17% transactions with zero evening cannibalization.",
            confidence: 0.94,
            created_at: "2026-09-24"
          },
          {
            id: "mem_02",
            category: "BASKET_AFFINITY",
            content: "Tea and Samosa have 74% co-purchase affinity during tea-time hours. Always recommend them together.",
            confidence: 0.98,
            created_at: "2026-09-21"
          },
          {
            id: "mem_03",
            category: "MERCHANT_PREFERENCE",
            content: "Rajesh Kumar prefers WhatsApp communications over SMS; maximum acceptable discount threshold is strictly 20%.",
            confidence: 1.0,
            created_at: "2026-09-18"
          },
          {
            id: "mem_04",
            category: "SEASONAL_TREND",
            content: "Weekend morning crowd buys dairy milk and bread together between 7:00 AM - 10:00 AM with 68% frequency.",
            confidence: 0.89,
            created_at: "2026-09-15"
          }
        ]);
      });
  }, []);

  const filteredMemories = memories.filter((m) =>
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#002970] text-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            <BrainCircuit className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("mem_badge", "LONG-TERM STORE INTELLIGENCE")}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t("mem_title", "Merchant Memory & Learnings")}
          </h1>
          <p className="text-xs text-sky-100">
            {t("mem_sub", "GrowthOS retains store quirks, seasonal learnings, and merchant risk preferences.")}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-sky-100 self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          <span>Episodic Memory Engine</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input 
          type="text" 
          placeholder={t("mem_search_ph", "Search store memories or learnings...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00BAF2] shadow-sm"
        />
      </div>

      {/* Memory Cards */}
      <div className="space-y-3">
        {filteredMemories.map((mem) => (
          <div 
            key={mem.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-[#00BAF2] transition"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-50 text-[#002970] px-2 py-0.5 rounded border border-sky-100">
                {mem.category.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t("mem_confidence", "Confidence")}: {Math.round(mem.confidence * 100)}%</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              "{mem.content}"
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>{mem.created_at}</span>
              <span className="font-mono">ID: {mem.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
