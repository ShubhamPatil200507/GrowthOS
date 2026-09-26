'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

export default function SimulatorPage() {
  const { language, t } = useLanguage();
  const [discountPct, setDiscountPct] = useState(15);
  const [windowHours, setWindowHours] = useState(3);
  const [minCart, setMinCart] = useState(100);
  const [durationDays, setDurationDays] = useState(7);

  // Dynamic calculations
  const baselineTxnsPerDay = 30;
  const avgBasket = 187;
  const currentMargin = 0.22;

  const liftMultiplier = 1 + (discountPct / 100) * 1.15;
  const projectedTxnsPerDay = Math.round(baselineTxnsPerDay * liftMultiplier);
  const incrementalTxnsPerDay = projectedTxnsPerDay - baselineTxnsPerDay;
  const totalIncrementalTxns = incrementalTxnsPerDay * durationDays;

  const effectiveCart = Math.max(avgBasket, minCart);
  const projectedGrossRevenue = totalIncrementalTxns * effectiveCart;

  const effectiveDiscountRate = discountPct / 100;
  const netMargin = currentMargin - (effectiveDiscountRate * 0.4);
  const projectedNetProfit = projectedGrossRevenue * netMargin;

  const riskLevel = discountPct > 20 ? 'HIGH' : discountPct > 15 ? 'MODERATE' : 'LOW';

  const chartData = [
    { day: "Day 1", baseline: 30, simulated: Math.round(30 * (1 + discountPct*0.008)) },
    { day: "Day 2", baseline: 30, simulated: Math.round(30 * (1 + discountPct*0.010)) },
    { day: "Day 3", baseline: 32, simulated: Math.round(32 * (1 + discountPct*0.011)) },
    { day: "Day 4", baseline: 30, simulated: Math.round(30 * (1 + discountPct*0.012)) },
    { day: "Day 5", baseline: 31, simulated: Math.round(31 * (1 + discountPct*0.011)) },
    { day: "Day 6", baseline: 35, simulated: Math.round(35 * (1 + discountPct*0.013)) },
    { day: "Day 7", baseline: 38, simulated: Math.round(38 * (1 + discountPct*0.014)) },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Sliders className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("nav_simulator", "What-If Simulator")}</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            {t("simulator_title", "Growth Scenario Simulator")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("simulator_sub", "Model the elasticity of discounts, time windows, and basket thresholds before deploying.")}
          </p>
        </div>

        <Link
          href="/growth-plan"
          className="px-4 py-2.5 rounded-xl bg-[#002970] text-white text-xs font-bold hover:bg-[#001D4F] transition flex items-center gap-1.5 shadow-sm"
        >
          <span>{t("apply_plan_btn", "Apply to Growth Plan")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-[#002970] flex items-center justify-between border-b border-slate-100 pb-3">
            <span>{language === 'hi' ? 'सिमुलेशन पैरामीटर' : language === 'mr' ? 'सिम्युलेशन घटक' : 'Simulation Parameters'}</span>
            <span className="text-[10px] text-slate-400 font-mono">PUNE_RETAIL_ELASTICITY</span>
          </h2>

          {/* Discount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">{t("param_discount", "Promotional Discount")}</span>
              <span className="font-black text-[#00BAF2] text-sm">{discountPct}% OFF</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="w-full accent-[#00BAF2] cursor-pointer"
            />
          </div>

          {/* Window Hours */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">{t("param_hours", "Target Time Window")}</span>
              <span className="font-black text-[#002970] text-sm">{windowHours} {language === 'hi' ? 'घंटे (2-5 PM)' : language === 'mr' ? 'तास (2-5 PM)' : 'Hours (2-5 PM)'}</span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={windowHours}
              onChange={(e) => setWindowHours(Number(e.target.value))}
              className="w-full accent-[#002970] cursor-pointer"
            />
          </div>

          {/* Min Cart Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">{t("param_min_cart", "Minimum Basket Threshold")}</span>
              <span className="font-black text-[#002970] text-sm">₹{minCart}</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="25"
              value={minCart}
              onChange={(e) => setMinCart(Number(e.target.value))}
              className="w-full accent-[#002970] cursor-pointer"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">{t("param_duration", "Pilot Duration")}</span>
              <span className="font-black text-[#002970] text-sm">{durationDays} {language === 'hi' ? 'दिन' : language === 'mr' ? 'दिवस' : 'Days'}</span>
            </div>
            <input
              type="range"
              min="3"
              max="14"
              step="1"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-[#002970] cursor-pointer"
            />
          </div>

          {/* Risk Level Badge */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-200">
            <span className="text-xs font-bold text-slate-600">{language === 'hi' ? 'मार्जिन जोखिम:' : language === 'mr' ? 'मार्जिन जोखीम:' : 'Margin Risk:'}</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {t("risk_low", "LOW RISK")}
            </span>
          </div>
        </div>

        {/* Live Projections & Chart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t("proj_volume", "Projected Volume")}</span>
              <div className="text-xl font-black text-[#002970]">+{totalIncrementalTxns} {language === 'hi' ? 'ग्राहक' : language === 'mr' ? 'ग्राहक' : 'txns'}</div>
              <span className="text-[10px] font-medium text-slate-500">{durationDays} {language === 'hi' ? 'दिनों में' : language === 'mr' ? 'दिवसांत' : 'days window'}</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t("proj_revenue", "Est. Gross Revenue")}</span>
              <div className="text-xl font-black text-[#00BAF2]">₹{projectedGrossRevenue.toLocaleString()}</div>
              <span className="text-[10px] font-medium text-emerald-600">at ₹{effectiveCart} basket</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">{t("proj_net_profit", "Est. Net Profit")}</span>
              <div className="text-xl font-black text-[#00A37A]">₹{Math.round(projectedNetProfit).toLocaleString()}</div>
              <span className="text-[10px] font-medium text-slate-500">at {Math.round(netMargin * 100)}% margin</span>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#002970]">
              {language === 'hi' ? 'दैनिक ग्राहक आवागमन अनुमान' : language === 'mr' ? 'दैनिक ग्राहक अंदाज' : 'Daily Transaction Trajectory'}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} txns`, 'Simulated']}
                  />
                  <Area type="monotone" dataKey="simulated" stroke="#00BAF2" fill="#00BAF2" fillOpacity={0.15} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
