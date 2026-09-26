'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  TrendingUp, 
  Target, 
  FlaskConical, 
  Sliders, 
  Users, 
  BarChart3, 
  BrainCircuit, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  Activity, 
  Award,
  Bell,
  Store,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      await api.resetDemo();
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const navSections = [
    {
      title: language === 'hi' ? "स्टोर डेटा" : language === 'mr' ? "स्टोअर डेटा" : "Store Telemetry",
      items: [
        { label: t("nav_growth_home", "Growth Home"), href: "/dashboard", icon: Store },
        { label: t("nav_insights", "Store Insights"), href: "/insights", icon: BarChart3 },
        { label: t("nav_customers", "Customer Cohorts"), href: "/customers", icon: Users, badge: "47 Dormant" },
        { label: t("nav_notifications", "Soundbox Alerts"), href: "/notifications", icon: Bell },
      ]
    },
    {
      title: language === 'hi' ? "ग्रोथ व कार्य" : language === 'mr' ? "वाढ व कृती" : "Growth & Actions",
      items: [
        { label: t("nav_copilot", "AI Business Copilot"), href: "/assistant", icon: MessageSquare, badge: language === 'hi' ? "हिन्दी" : language === 'mr' ? "मराठी" : "Indic" },
        { label: t("nav_opportunities", "Opportunities"), href: "/opportunities", icon: Target, badge: "₹6,128" },
        { label: t("nav_growth_plan", "Growth Plan"), href: "/growth-plan", icon: TrendingUp },
        { label: t("nav_simulator", "Scenario Simulator"), href: "/simulator", icon: Sliders },
        { label: t("nav_experiments", "Active Experiments"), href: "/experiments", icon: FlaskConical },
        { label: t("nav_results", "Measured Results"), href: "/results", icon: CheckCircle2, badge: "+17%" },
      ]
    },
    {
      title: language === 'hi' ? "सिस्टम व सुरक्षा" : language === 'mr' ? "प्रणाली व सुरक्षा" : "System & Governance",
      items: [
        { label: t("nav_actions", "Action Audit Trail"), href: "/actions", icon: CheckCircle2 },
        { label: t("growth_memory_title", "Growth Memory"), href: "/memory", icon: BrainCircuit },
        { label: t("nav_consent", "Privacy & Consent"), href: "/consent", icon: ShieldCheck },
        { label: t("nav_integration", "Paytm Connectors"), href: "/integration", icon: Layers },
        { label: t("nav_architecture", "Architecture"), href: "/architecture", icon: Layers },
        { label: "Production Readiness", href: "/admin/observability", icon: Activity },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans selection:bg-[#00BAF2] selection:text-white">
      {/* Top Banner: Real Fintech Notice */}
      <header className="bg-[#002970] text-white px-4 py-2 text-xs flex items-center justify-between font-medium shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className="bg-[#00BAF2] text-[#002970] font-black px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
              PAYTM
            </span>
            <span className="font-extrabold text-sm tracking-tight">GrowthOS</span>
          </div>
          <span className="hidden md:inline text-slate-300 text-[11px] border-l border-white/20 pl-3">
            {t("demo_disclaimer", "AI Business Partner for Paytm Merchants • Prototype evaluation environment")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Reactive Language Selector */}
          <div className="flex items-center bg-[#001D4F] rounded-md p-0.5 text-[11px] border border-white/10 shadow-inner">
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${language === 'hi' ? 'bg-[#00BAF2] text-[#002970] shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button 
              onClick={() => setLanguage('mr')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${language === 'mr' ? 'bg-[#00BAF2] text-[#002970] shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              मराठी
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${language === 'en' ? 'bg-[#00BAF2] text-[#002970] shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <Link
            href="/demo"
            className="bg-[#00BAF2] hover:bg-[#009ED0] text-[#002970] font-bold px-2.5 py-1 rounded text-xs transition flex items-center gap-1 shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="font-bold">{t("jury_walkthrough", "Jury Walkthrough")}</span>
          </Link>

          <button 
            onClick={handleResetDemo}
            disabled={resetting}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded text-xs transition"
            title="Reset to deterministic demo dataset"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline text-[11px]">{resetting ? 'Resetting...' : t("reset_demo", "Reset")}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (1280px+) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm select-none shrink-0">
          {/* Merchant Profile Box */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#002970] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                RG
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-xs text-slate-900 truncate leading-tight">
                  {t("store_name", "Rajesh General Store")}
                </h2>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {t("store_location", "Kothrud, Pune • Retail / Grocery")}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{t("soundbox_online", "Soundbox Online")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sectioned Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                  {sec.title}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                        isActive 
                          ? 'bg-[#002970] text-white font-semibold shadow-sm' 
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00BAF2]' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Version 1.0.0</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {language === 'hi' ? 'स्वायत्त क्लोज्ड-लूप पार्टनर' : language === 'mr' ? 'स्वायत्त क्लोज्ड-लूप भागीदार' : 'Autonomous Closed-Loop Partner'}
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-6">
          {/* Mobile Top Header */}
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#002970] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                RG
              </div>
              <div>
                <h1 className="font-bold text-xs text-slate-900 leading-none">{t("store_name", "Rajesh General Store")}</h1>
                <p className="text-[10px] text-slate-500 mt-0.5">Paytm GrowthOS</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/demo" className="text-[11px] font-bold bg-[#002970] text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Award className="w-3.5 h-3.5 text-[#00BAF2]" />
                <span>Demo</span>
              </Link>
            </div>
          </div>

          {/* Child Page Content */}
          <div className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            {children}
          </div>

          {/* Prototype Footer */}
          <footer className="mt-auto px-4 py-3 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
            <p>{t("demo_disclaimer", "GrowthOS Prototype • Designed for Paytm Merchant Ecosystem • Synthetic merchant data")}</p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed for 390-430px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-50 shadow-lg">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            pathname === '/dashboard' ? 'text-[#002970] font-bold' : 'text-slate-500'
          }`}
        >
          <Store className="w-4 h-4 mb-0.5" />
          <span>{t("nav_overview", "Home")}</span>
        </Link>

        <Link
          href="/opportunities"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold relative ${
            pathname === '/opportunities' ? 'text-[#002970] font-bold' : 'text-slate-500'
          }`}
        >
          <Target className="w-4 h-4 mb-0.5" />
          <span>₹7,400</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] absolute top-1 right-2" />
        </Link>

        <Link
          href="/assistant"
          className="flex flex-col items-center -mt-4 bg-[#002970] text-white p-2.5 rounded-full shadow-lg border-2 border-white"
        >
          <MessageSquare className="w-5 h-5 text-[#00BAF2]" />
        </Link>

        <Link
          href="/growth-plan"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            pathname === '/growth-plan' ? 'text-[#002970] font-bold' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>{t("nav_growth_plan", "Plan")}</span>
        </Link>

        <Link
          href="/demo"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            pathname === '/demo' ? 'text-[#002970] font-bold' : 'text-slate-500'
          }`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Demo</span>
        </Link>
      </nav>
    </div>
  );
}
