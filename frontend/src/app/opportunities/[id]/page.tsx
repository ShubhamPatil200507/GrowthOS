'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, OpportunityItem } from '@/lib/api';

const mockTrendData = [
  { week: 'Wk 1', baseline: 138000 },
  { week: 'Wk 2', baseline: 139200 },
  { week: 'Wk 3', baseline: 140100 },
  { week: 'Wk 4', baseline: 141000 },
  { week: 'Wk 5', baseline: 140800 },
  { week: 'Wk 6', baseline: 142000 },
  { week: 'Wk 7', baseline: 141900 },
  { week: 'Wk 8', baseline: 143100 },
  { week: 'Wk 9', baseline: 142500 },
  { week: 'Wk 10', baseline: 143800 },
  { week: 'Wk 11', baseline: 144200 },
  { week: 'Wk 12', baseline: 145000 },
];

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || 'afternoon-demand';
  const [opp, setOpp] = useState<OpportunityItem | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    api.getOpportunities().then(data => {
      const found = data.opportunities.find(o => 
        o.opportunity_id === id || 
        o.opportunity_code.toLowerCase().includes(id.toLowerCase())
      ) || data.opportunities[0];
      setOpp(found);
    });
  }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.approveRecommendation(opp?.opportunity_id || 'rec_1');
      router.push('/execution');
    } catch (e) {
      console.error(e);
      router.push('/execution');
    }
  };

  if (!opp) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#002970] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>
      </div>

      {/* Headline Card */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-3 py-1 rounded-full">
            {opp.category}
          </span>
          <span className="text-xs font-bold text-[#00A37A] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
            {Math.round(opp.confidence * 100)}% Evidence Confidence
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002970] tracking-tight">
            {opp.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            {opp.explanation}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Estimated Opportunity</p>
            <p className="text-xl font-black text-[#002970]">{opp.estimated_opportunity.label}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Observed Gap</p>
            <p className="text-xl font-black text-amber-600">32% Below Baseline</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Target Slot</p>
            <p className="text-xl font-black text-slate-800">2:00 PM – 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* 12-Week Trend Line Chart */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#002970]">12-Week Historical Trend & Afternoon Gap</h2>
          <p className="text-xs text-slate-500">
            Consistent transaction gap of ~32% observed during 2 PM–5 PM slots over the last 84 days.
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BAF2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00BAF2" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[130000, 150000]} />
              <Tooltip 
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Weekly Revenue']}
                contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="baseline" stroke="#002970" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evidence & Why This Matters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-5 space-y-3">
          <h3 className="font-bold text-sm text-[#002970] uppercase tracking-wide">Observed Evidence</h3>
          <div className="space-y-2">
            {opp.evidence.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#00A37A] shrink-0 mt-0.5" />
                <span>{ev}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-5 space-y-3">
          <h3 className="font-bold text-sm text-[#002970] uppercase tracking-wide">Why This Matters</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Rajesh General Store sustains high store overhead (staff, power, refrigeration) uniformly throughout the day. 
            Recovering even 15% of the afternoon shortfall converts directly into gross margin contribution.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
            <strong>Identified Risk:</strong> Margin dilution if existing customers delay naturally occurring morning purchases. Controlled by ₹200 minimum cart size.
          </div>
        </div>
      </div>

      {/* NEXT BEST ACTION & Human-in-the-Loop Approval Card */}
      <div className="bg-gradient-to-br from-[#F0F9FF] to-white rounded-2xl border-2 border-[#00BAF2] shadow-elevated p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>RECOMMENDED NEXT BEST ACTION</span>
          </div>
          <span className="text-xs font-bold text-[#002970] bg-white border border-[#00BAF2] px-2.5 py-0.5 rounded">
            Controlled Experiment
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#002970]">
            Run a 3-Day Afternoon ₹20 Off Experiment
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-[#E0EFF7]">
              <span className="text-slate-400 block text-[10px] font-semibold">OFFER</span>
              <span className="font-bold text-slate-800">₹20 off &gt; ₹200</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#E0EFF7]">
              <span className="text-slate-400 block text-[10px] font-semibold">TARGET</span>
              <span className="font-bold text-slate-800">2:00 – 5:00 PM</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#E0EFF7]">
              <span className="text-slate-400 block text-[10px] font-semibold">DURATION</span>
              <span className="font-bold text-slate-800">3 Days</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-[#E0EFF7]">
              <span className="text-slate-400 block text-[10px] font-semibold">PRIMARY METRIC</span>
              <span className="font-bold text-[#00A37A]">Txn Volume (+15%)</span>
            </div>
          </div>
        </div>

        {/* Human in the loop declaration */}
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-sky-100 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-[#002970] shrink-0" />
          <span>
            <strong>Merchant Approval Required:</strong> GrowthOS will never trigger external promotions or discount rules without your explicit consent.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleApprove}
            disabled={approving}
            className="w-full sm:flex-1 py-3.5 px-6 bg-[#002970] hover:bg-[#001D4F] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            {approving ? (
              <span>Preparing Execution Engine...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#00BAF2]" />
                <span>APPROVE EXPERIMENT</span>
              </>
            )}
          </button>

          <Link
            href="/simulator"
            className="w-full sm:w-auto py-3.5 px-5 bg-white hover:bg-slate-50 text-[#002970] border border-[#002970]/30 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <Sliders className="w-4 h-4 text-[#00BAF2]" />
            <span>MODIFY (SIMULATOR)</span>
          </Link>

          <button
            onClick={() => router.push('/opportunities')}
            className="w-full sm:w-auto py-3.5 px-4 text-slate-400 hover:text-slate-600 font-semibold text-xs transition"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
