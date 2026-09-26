'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Store, CheckCircle2, Lock, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState('MERCH_PUNE_001');
  const [pin, setPin] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Prototype Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-[11px] font-bold text-amber-800 tracking-wide uppercase">
            Prototype • Uses synthetic merchant data
          </p>
          <p className="text-[10px] text-amber-700">
            For evaluation & hackathon demonstration purposes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E0EFF7] shadow-xl p-8 space-y-6">
          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#002970] to-[#00BAF2] text-white shadow-lg shadow-[#00BAF2]/30 mb-2">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#002970] tracking-tight">
              GrowthOS
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              AI Business Partner for Paytm Merchants
            </p>
          </div>

          {/* Persona selector preset */}
          <div className="bg-[#F5FAFD] border border-[#00BAF2]/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#002970] uppercase tracking-wider bg-[#00BAF2]/20 px-2 py-0.5 rounded-full">
                Active Demo Persona
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#00A37A]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm">Rajesh General Store</div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span>Grocery / Retail</span>
              <span>•</span>
              <span>Kothrud, Pune</span>
              <span>•</span>
              <span className="font-mono text-[#002970]">₹1.42L/wk</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Merchant ID / Phone</label>
              <div className="relative">
                <input
                  type="text"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#00BAF2] focus:ring-2 focus:ring-[#00BAF2]/20"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Paytm Business PIN</label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#00BAF2] focus:ring-2 focus:ring-[#00BAF2]/20 tracking-widest"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00BAF2] hover:bg-[#009ed0] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as Rajesh Kumar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Jury Demo jump */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Evaluating for jury?</span>
            <Link
              href="/demo"
              className="font-bold text-[#002970] hover:text-[#00BAF2] transition flex items-center gap-1"
            >
              <span>Launch 10-Step Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#00A37A]" />
          <span>Paytm for Business Partner Integration • Zero PII Exposure</span>
        </div>
      </div>
    </div>
  );
}
