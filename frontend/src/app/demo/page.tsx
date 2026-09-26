'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  const stepsHi = [
    {
      step: 1,
      title: "1. मर्चेंट स्टोर संदर्भ (Observation)",
      badge: "निरीक्षण",
      narration: "राजेश कुमार पुणे के कोथरूड में राजेश जनरल स्टोर चलाते हैं। 12 हफ्तों के 9,399 लेन-देन से पता चलता है कि दोपहर 2:00 से 5:00 PM के बीच भारी मंदी रहती है।",
      highlight: "मर्चेंट: राजेश जनरल स्टोर • कोथरूड, पुणे • किराना खुदरा • ₹142.8k/सप्ताह",
      link: "/dashboard",
      linkText: "लाइव डैशबोर्ड देखें"
    },
    {
      step: 2,
      title: "2. मर्चेंट ने आय लक्ष्य बताया (Input)",
      badge: "इनपुट",
      narration: "राजेश माइक पर बोलते हैं: 'मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है'। सरवम एआई वॉयस इंजन बोली गई भाषा को समझता है।",
      highlight: "प्रश्न: 'मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है' • भाषा: हिन्दी/हिंग्लिश",
      link: "/assistant?prompt=%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%87%E0%A4%B8%20%E0%A4%B9%E0%A4%AB%E0%A5%8D%E0%A4%A4%E0%A5%87%20%E2%82%B95%2C000%20%E0%A4%8F%E0%A4%95%E0%A5%8D%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A4%BE%20%E0%A4%95%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%BE%20%E0%A4%B9%E0%A5%88",
      linkText: "एआई सलाहकार वॉयस चैट खोलें"
    },
    {
      step: 3,
      title: "3. बहु-एजेंट अवसर खोज (Opportunity Mining)",
      badge: "पहचान",
      narration: "ग्रोथओएस ने 12 हफ्तों के स्टोर डेटा को स्कैन किया और 4 ठोस क्षेत्रों में कुल ₹7,400 की ग्रोथ संभावना खोजी।",
      highlight: "कुल अवसर: ₹7,400 (दोपहर मंदी ₹2,400 + निष्क्रिय ग्राहक ₹2,100 + कॉम्बो ₹1,700 + वीकेंड ₹1,200)",
      link: "/opportunities",
      linkText: "₹7,400 अवसर क्षेत्र देखें"
    },
    {
      step: 4,
      title: "4. ₹5,000 ग्रोथ प्लान निर्माण",
      badge: "सिफारिश",
      narration: "राजेश के ₹5,000 लक्ष्य को प्राप्त करने के लिए ग्रोथओएस 3 प्राथमिकता वाले कार्य सुझाता है।",
      highlight: "ग्रोथ प्लान: ₹5,000 लक्ष्य पूर्ण • कुल ₹6,200 क्षमता वाली 3 योजनाएं",
      link: "/growth-plan",
      linkText: "ग्रोथ प्लान देखें"
    },
    {
      step: 5,
      title: "5. व्हाट-इफ परिदृश्य सिमुलेशन",
      badge: "तर्क",
      narration: "पैसे लगाने से पहले, राजेश छूट प्रतिशत (15% बनाम 20%) और न्यूनतम बिल सीमा का लाभ सिमुलेटर में जांचते हैं।",
      highlight: "सिमुलेशन: 15% छूट 18.4% शुद्ध मार्जिन बनाए रखते हुए +17% ग्राहक बढ़ाती है",
      link: "/simulator",
      linkText: "सिमुलेटर खोलें"
    },
    {
      step: 6,
      title: "6. मर्चेंट का प्रत्यक्ष अनुमोदन (Human-in-the-Loop)",
      badge: "मंजूरी",
      narration: "एआई कभी भी बिना अनुमति के कार्यवाही नहीं करता। राजेश योजना के सभी विवरण जांचते हैं और स्वीकृति देते हैं।",
      highlight: "सुरक्षा: शून्य गैर-वाजिब वादे • मर्चेंट स्वीकृति ऑडिट लॉग में दर्ज",
      link: "/actions",
      linkText: "एक्शन सेंटर देखें"
    },
    {
      step: 7,
      title: "7. स्वचालित 6-चरणीय कार्यान्वयन (Execution)",
      badge: "अमल",
      narration: "मंजूरी मिलते ही n8n एडॉप्टर पेटीएम साउंडबॉक्स ऑडियो, व्हाट्सएप वाउचर और काउंटर क्यूआर स्टैंडी तैयार करता है।",
      highlight: "6 चरण: पेटीएम वाउचर AFTERNOON15 निर्मित • साउंडबॉक्स वॉइस शेड्यूल्ड",
      link: "/execution",
      linkText: "कार्यवाही पाइपलाइन देखें"
    },
    {
      step: 8,
      title: "8. लाइव प्रयोग ट्रैकिंग (Measure)",
      badge: "ट्रैकिंग",
      narration: "यह कार्य 7-दिवसीय प्रयोग (#EXP-772) के रूप में आधार (212 दोपहर लेन-देन) के मुकाबले लाइव ट्रैक होता है।",
      highlight: "प्रयोग #EXP-772 • 7 में से 4 दिन सक्रिय • लक्ष्य: 248 लेन-देन",
      link: "/experiments",
      linkText: "प्रयोग ट्रैकर देखें"
    },
    {
      step: 9,
      title: "9. सत्यापित परिणाम व लाभ मापन",
      badge: "परिणाम",
      narration: "पायलट मूल्यांकन ने +17% लेन-देन, +₹5,100 सकल बिक्री, +9% शुद्ध लाभ और 29 पुनः सक्रिय ग्राहक सिद्ध किए।",
      highlight: "परिणाम: +17% लेन-देन • +₹5,100 बिक्री • +9% शुद्ध लाभ • 96% विश्वसनीयता",
      link: "/results",
      linkText: "परिणाम व लाभ देखें"
    },
    {
      step: 10,
      title: "10. मर्चेंट मेमोरी व सतत सीख (Learn)",
      badge: "सीख",
      narration: "प्रयोग के परिणाम कॉग्नी नॉलेज ग्राफ में सुरक्षित होते हैं ताकि भविष्य की सिफारिशें और अधिक सटीक हों।",
      highlight: "मेमोरी सुरक्षित: 'दोपहर 15% कॉम्बो ऑफर शाम की बिक्री को नुकसान पहुंचाए बिना +17% बढ़ाता है'",
      link: "/memory",
      linkText: "व्यापारिक मेमोरी ग्राफ देखें"
    }
  ];

  const stepsEn = [
    {
      step: 1,
      title: "1. Merchant Context (Observation)",
      badge: "OBSERVE",
      narration: "Rajesh Kumar operates Rajesh General Store in Pune. Weekly volume is ₹142,800 with 9,399 real transactions showing a severe lull between 2:00 PM and 5:00 PM.",
      highlight: "Merchant: Rajesh General Store • Kothrud, Pune • Retail / Grocery • ₹142.8k/wk",
      link: "/dashboard",
      linkText: "View Live Dashboard"
    },
    {
      step: 2,
      title: "2. Merchant Expresses Revenue Goal",
      badge: "INPUT",
      narration: "Rajesh speaks on the mic: 'Mujhe iss week ₹5,000 extra kamaana hai'. The Sarvam AI multimodal audio layer captures speech and converts intent.",
      highlight: "Query: 'Mujhe iss week ₹5,000 extra kamaana hai' • Language: Hindi/Hinglish",
      link: "/assistant?prompt=Mujhe%20iss%20week%20%E2%82%B95%2C000%20extra%20kamaana%20hai",
      linkText: "Open AI Partner Voice Assistant"
    },
    {
      step: 3,
      title: "3. Multi-Agent Opportunity Discovery",
      badge: "DETECT",
      narration: "GrowthOS scans 12 weeks of store telemetry and uncovers ₹7,400 in viable headroom across 4 concrete vectors.",
      highlight: "Discovered Space: ₹7,400 (Afternoon Lull ₹2,400 + Dormant Shoppers ₹2,100 + Basket ₹1,700 + Weekend ₹1,200)",
      link: "/opportunities",
      linkText: "Explore ₹7,400 Opportunity Space"
    },
    {
      step: 4,
      title: "4. Formulate 3-Action Growth Plan",
      badge: "RECOMMEND",
      narration: "To fulfill the requested ₹5,000 target, GrowthOS creates a prioritized 3-action plan balancing margin safety and operational ease.",
      highlight: "Growth Plan: ₹5,000 Goal Reached • 3 Prioritized Actions totaling ₹6,200",
      link: "/growth-plan",
      linkText: "Review Formulated Growth Plan"
    },
    {
      step: 5,
      title: "5. What-If Scenario Simulation",
      badge: "REASON",
      narration: "Before risking store capital, Rajesh tests different discount percentages (15% vs 20%) and basket thresholds using the simulator.",
      highlight: "Elasticity Model: 15% discount yields +17% transactions while preserving 18.4% gross margin",
      link: "/simulator",
      linkText: "Launch Growth Simulator"
    },
    {
      step: 6,
      title: "6. Human-in-the-Loop Merchant Approval",
      badge: "APPROVE",
      narration: "Crucial governance check: AI NEVER acts unilaterally. Rajesh reviews the exact parameters and provides explicit merchant approval.",
      highlight: "Guardrail: Safe Language verified • Zero guaranteed revenue claims • Merchant approval logged",
      link: "/actions",
      linkText: "Open Action Center"
    },
    {
      step: 7,
      title: "7. Automated Multi-Channel Execution",
      badge: "EXECUTE",
      narration: "Upon approval, the n8n adapter orchestrates execution across Paytm Soundbox audio, WhatsApp coupons, and printable QR standees.",
      highlight: "6-Stage Pipeline: Paytm Voucher AFTERNOON15 created • Soundbox voice queued • QR generated",
      link: "/execution",
      linkText: "Watch Pipeline Stepper"
    },
    {
      step: 8,
      title: "8. Live Experiment Tracking",
      badge: "MEASURE",
      narration: "The action registers as an active 7-day experiment with a statistical baseline (212 transactions) and live telemetry tracking.",
      highlight: "Experiment #EXP-772 • Tracking Day 4 of 7 • Target: 248 transactions",
      link: "/experiments",
      linkText: "View Experiment Tracker"
    },
    {
      step: 9,
      title: "9. Verified Outcome Measurement",
      badge: "MEASURE",
      narration: "Post-pilot evaluation confirms +17% incremental transactions, +₹5,100 gross revenue, +9% net profit, and 29 reactivated shoppers at 96% confidence.",
      highlight: "Result: +17% Txns • +₹5,100 Revenue • +9% Net Profit • 96% Stat Sig",
      link: "/results",
      linkText: "Inspect Validated Impact"
    },
    {
      step: 10,
      title: "10. Merchant Memory & Closed-Loop Learning",
      badge: "LEARN",
      narration: "The experiment results are synthesized into episodic memory in the Cognee knowledge graph so future recommendations are sharper.",
      highlight: "Memory Saved: '15% afternoon combo lifts lull by +17% without cannibalizing evening peak'",
      link: "/memory",
      linkText: "View Merchant Memory Graph"
    }
  ];

  const steps = language === 'en' ? stepsEn : stepsHi;
  const current = steps[currentStep];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Play className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{language === 'hi' ? '10-चरण निर्देशित ज्यूरी वॉकथ्रू' : language === 'mr' ? '10-टप्पे निर्देशित ज्युरी वॉकथ्रू' : 'INTERACTIVE JURY DEMO WALKTHROUGH'}</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            {language === 'hi' ? 'ग्रोथओएस संपूर्ण यात्रा (10 चरण)' : language === 'mr' ? 'ग्रोथओएस संपूर्ण प्रवास (10 टप्पे)' : 'GrowthOS 10-Step Journey'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'स्वायत्त क्लोज्ड-लूप व्यापार प्रणाली का चरण-दर-चरण प्रदर्शन' : language === 'mr' ? 'स्वायत्त क्लोज्ड-लूप व्यवसाय प्रणालीचे टप्प्याटप्प्याने प्रात्यक्षिक' : 'Step-by-step end-to-end guided walkthrough showcasing the complete autonomous closed-loop.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {language === 'hi' ? 'पिछला' : language === 'mr' ? 'मागे' : 'Prev'}
          </button>
          <span className="text-xs font-bold text-slate-700 px-1 font-mono">
            {currentStep + 1} / 10
          </span>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-3.5 py-2 rounded-xl bg-[#00BAF2] text-[#002970] text-xs font-bold hover:bg-[#009ED0] transition disabled:opacity-40 flex items-center gap-1 shadow-sm"
          >
            {language === 'hi' ? 'अगला' : language === 'mr' ? 'पुढे' : 'Next'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Step Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#002970] bg-[#00BAF2]/15 px-3 py-1 rounded-full">
            {language === 'hi' ? 'चरण:' : language === 'mr' ? 'टप्पा:' : 'STAGE:'} {current.badge}
          </span>
          <span className="text-xs font-mono text-slate-400">Step {current.step} of 10</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {current.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {current.narration}
          </p>
        </div>

        {/* Highlight box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#00BAF2] shrink-0" />
          <span className="text-xs font-bold text-[#002970] leading-snug">
            {current.highlight}
          </span>
        </div>

        {/* Live link to screen */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            href={current.link}
            className="px-5 py-3 rounded-xl bg-[#002970] hover:bg-[#001D4F] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <span>{current.linkText}</span>
            <ExternalLink className="w-4 h-4 text-[#00BAF2]" />
          </Link>

          <div className="flex gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "bg-[#00BAF2] w-6"
                    : idx < currentStep
                    ? "bg-[#002970]"
                    : "bg-slate-200"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
