'use client';

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  ShoppingBag, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

export default function InsightsPage() {
  const { t } = useLanguage();

  const hourlyData = [
    { hour: "8 AM", sales: 420 },
    { hour: "10 AM", sales: 1250 },
    { hour: "12 PM", sales: 980 },
    { hour: "2 PM", sales: 480 },
    { hour: "3 PM", sales: 420 },
    { hour: "4 PM", sales: 510 },
    { hour: "6 PM", sales: 2650 },
    { hour: "8 PM", sales: 3100 },
    { hour: "10 PM", sales: 1100 },
  ];

  const basketAffinities = [
    { pair: "Tea & Samosa", affinityPct: 74, liftScore: "3.4x", volume: "High" },
    { pair: "Dairy Milk & Bread", affinityPct: 68, liftScore: "2.8x", volume: "High" },
    { pair: "Biscuits & Filter Coffee", affinityPct: 56, liftScore: "2.1x", volume: "Medium" },
    { pair: "Cooking Oil & Masala Spices", affinityPct: 52, liftScore: "1.9x", volume: "Medium" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#002970] text-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("ins_badge", "BUSINESS INTELLIGENCE & PATTERNS")}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t("ins_title", "Store Insights & Patterns")}
          </h1>
          <p className="text-xs text-sky-100">
            {t("ins_sub", "Deep-dive hourly traffic patterns, basket affinities, and payment mode breakdowns.")}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-sky-100 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#00BAF2]" />
          <span>Paytm Telemetry Sync</span>
        </div>
      </div>

      {/* Hourly Sales Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t("ins_hourly_traffic", "Hourly Sales & Footfall")}</h2>
            <p className="text-xs text-slate-500">Notice the distinct dip between 2:00 PM and 5:00 PM</p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            2-5 PM Lull: -68% vs Peak
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                formatter={(val) => [`₹${val}`, 'Sales']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              />
              <Bar dataKey="sales" fill="#00BAF2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Basket Affinities */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">{t("ins_basket_affinity", "Top Basket Item Affinities")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {basketAffinities.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{item.pair}</p>
                <span className="text-xs text-slate-500">Lift Factor: <strong className="text-emerald-700">{item.liftScore}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#002970]">{item.affinityPct}%</span>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Affinity</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
