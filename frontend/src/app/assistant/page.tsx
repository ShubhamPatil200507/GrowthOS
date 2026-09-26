'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Mic, 
  Send, 
  Volume2, 
  ArrowRight,
  TrendingUp,
  Store,
  Layers,
  Award
} from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioAvailable?: boolean;
  cards?: {
    type: 'growth_plan';
    data?: any;
  };
  timestamp: string;
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams ? searchParams.get('prompt') : null;
  const { language, setLanguage, t, speakText, isSpeaking } = useLanguage();

  const getGreeting = () => {
    if (language === 'mr') {
      return 'नमस्कार राजेश जी! मी तुमचा GrowthOS AI व्यवसाय भागीदार आहे. आज तुमच्या दुकानाच्या वाढीबद्दल काय जाणून घ्यायचे आहे?';
    }
    if (language === 'en') {
      return 'Namaste Rajesh ji! I am your GrowthOS AI business partner. How can I help grow your business today?';
    }
    return 'नमस्ते राजेश जी! मैं आपका GrowthOS AI बिजनेस पार्टनर हूँ। आज आपके व्यापार को बढ़ाने के लिए क्या जानना चाहते हैं?';
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: getGreeting(),
      audioAvailable: true,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting when language changes if only 1 message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [{
          ...prev[0],
          text: getGreeting()
        }];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const isPrimaryGoal = queryText.includes('5,000') || queryText.includes('5000') || queryText.toLowerCase().includes('extra') || queryText.includes('जास्त');

    try {
      const res = await api.askAssistant(queryText, language);
      
      let explanation = res.explanation;
      if (language === 'mr' && !explanation.includes('दुपारी')) {
        explanation = `मी तुमच्या दुकानाचा मागील 12 आठवड्यांचा डेटा तपासला आहे. दुपारी 2 ते 5 PM दरम्यान विक्रीत 32% घट आहे आणि 47 नियमित ग्राहक निष्क्रिय आहेत. मी ₹7,400 ची संभाव्य संधी ओळखली आहे, ज्यामुळे तुमचे ₹5,000 चे अतिरिक्त उद्दिष्ट सहज गाठता येईल.`;
      } else if (language === 'en') {
        explanation = `I have analyzed 12 weeks of historical sales patterns for Rajesh General Store. There is a noticeable 32% drop between 2:00 PM and 5:00 PM and 47 regular shoppers have become dormant. I identified a ₹7,400 opportunity space that covers your ₹5,000 target.`;
      }

      const assistantMsg: Message = {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: explanation,
        audioAvailable: true,
        cards: isPrimaryGoal ? {
          type: 'growth_plan',
          data: res.growth_plan
        } : undefined,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: language === 'mr' 
            ? 'मी दुकानाचा डेटा तपासला आहे. दुपारी 2-5 PM दरम्यान मंदी आहे जिथे आपण 3 दिवसांचा पायलट प्रयोग करू शकतो.'
            : language === 'en'
            ? 'I checked the store telemetry. Afternoon 2-5 PM shows an operational lull where we can launch a 3-day combo offer.'
            : 'मैंने आपके स्टोर का डेटा चेक किया है। दोपहर 2–5 PM में मंदी है जहां हम 3-दिन का पायलट टेस्ट कर सकते हैं।',
          audioAvailable: true,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    setIsRecording(true);
    const spokenQuery = language === 'mr'
      ? 'मला या आठवड्यात ₹5,000 जास्त कमवायचे आहेत'
      : language === 'en'
      ? 'I want to earn an extra ₹5,000 this week'
      : 'मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है';

    speakText(spokenQuery);

    setTimeout(() => {
      setIsRecording(false);
      handleSend(spokenQuery);
    }, 1300);
  };

  const suggestedQueries = language === 'mr' ? [
    'मला या आठवड्यात ₹5,000 जास्त कमवायचे आहेत',
    'दुपारी 2 ते 5 PM दरम्यान विक्री का कमी होत आहे?',
    '47 जुन्या नियमित ग्राहकांना पुन्हा कसे आणायचे?',
    'चहा आणि समोसा कॉम्बो ऑफर सुरू करा',
  ] : language === 'en' ? [
    'I want to earn an extra ₹5,000 this week',
    'Why are afternoon sales dropping from 2-5 PM?',
    'How to win back 47 dormant regular customers?',
    'Create an afternoon tea & snack bundle',
  ] : [
    'मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है',
    'दोपहर 2 से 5 PM के बीच बिक्री क्यों गिर रही है?',
    '47 पुराने नियमित ग्राहकों को वापस कैसे लाएं?',
    'चाय और समोसा कॉम्बो ऑफर शुरू करें',
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#002970] text-white flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-none">
              {t("copilot_title", "GrowthOS Business Copilot")}
            </h1>
            <p className="text-[10px] text-slate-500 mt-1">
              {t("store_name", "Rajesh General Store")} • {language === 'hi' ? 'सरवम हिन्दी/हिंग्लिश वॉयस' : language === 'mr' ? 'मराठी वॉयस सिमुलेशन' : 'Sarvam Indic Voice Engine'}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs border border-slate-200">
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              language === 'hi' ? 'bg-white text-[#002970] shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              language === 'mr' ? 'bg-white text-[#002970] shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            मराठी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-md font-bold transition ${
              language === 'en' ? 'bg-white text-[#002970] shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-4 text-xs sm:text-sm space-y-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#002970] text-white rounded-tr-none shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] font-bold ${m.sender === 'user' ? 'text-sky-200' : 'text-[#002970]'}`}>
                  {m.sender === 'user' ? t("store_name", "Rajesh Kumar") : t("copilot_title", "GrowthOS AI Partner")}
                </span>
                {m.audioAvailable && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="text-[#002970] hover:text-[#00BAF2] transition p-1 bg-white/70 hover:bg-white rounded-md border border-slate-200 flex items-center gap-1 text-[10px] font-bold"
                    title="Click to hear voice aloud on Soundbox"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'बोल रहे हैं...' : 'सुनें'}</span>
                  </button>
                )}
              </div>

              <p>{m.text}</p>

              {/* Embedded Structured Cards */}
              {m.cards?.type === 'growth_plan' && m.cards.data && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-[#00BAF2]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#002970]">
                        {language === 'hi' ? '₹7,400 अतिरिक्त आय संभावना पहचानी गई' : language === 'mr' ? '₹7,400 अतिरिक्त संधी ओळखली' : '₹7,400 Opportunity Space Identified'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {language === 'hi' ? 'लक्ष्य: ₹5,000' : language === 'mr' ? 'उद्दिष्ट: ₹5,000' : 'Goal: ₹5,000'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span>1. {t("opp_afternoon_title", "Afternoon Demand Offer (2-5 PM)")}</span>
                        <span className="font-bold text-[#002970]">₹2,400</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span>2. {t("opp_dormant_title", "Dormant Customer Win-back (47 cust)")}</span>
                        <span className="font-bold text-[#002970]">₹2,100</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-md border border-slate-100">
                        <span>3. {t("opp_basket_title", "Basket-Size Combo Bundle")}</span>
                        <span className="font-bold text-[#002970]">₹1,700</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {language === 'hi' ? '3 में से 3 योजनाएं स्वीकृत करने के लिए तैयार' : language === 'mr' ? '3 पैकी 3 योजना मंजुरीसाठी तयार' : '3 of 3 steps ready for review'}
                      </span>
                      <Link
                        href="/growth-plan"
                        className="px-3 py-1.5 bg-[#002970] hover:bg-[#001D4F] text-white text-xs font-bold rounded-md transition flex items-center gap-1"
                      >
                        <span>{language === 'hi' ? 'ग्रोथ प्लान खोलें' : language === 'mr' ? 'प्लॅन उघडा' : 'Open Growth Plan'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
            <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce delay-200" />
            <span>{language === 'hi' ? 'स्टोर डेटा का विश्लेषण हो रहा है...' : language === 'mr' ? 'दुकानाच्या डेटाचे विश्लेषण सुरू आहे...' : 'Analyzing 12-week store telemetry...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0">
        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
          {t("quick_queries", "Suggested:")}
        </span>
        {suggestedQueries.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#002970] px-2.5 py-1 rounded-lg border border-slate-200 text-xs shrink-0 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Voice & Text Input */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex items-center gap-2 shrink-0">
        <button
          onClick={handleMicClick}
          className={`p-2.5 rounded-lg transition ${
            isRecording 
              ? 'bg-rose-500 text-white animate-pulse' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Click to speak in Hindi/Marathi/English"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={isRecording ? (language === 'hi' ? 'सुन रहे हैं (हिन्दी / हिंग्लिश)...' : language === 'mr' ? 'ऐकत आहे (मराठी)...' : 'Listening in English / Hindi...') : t("copilot_placeholder", "Ask GrowthOS anything...")}
          className="flex-1 bg-transparent text-xs sm:text-sm px-2 focus:outline-none"
        />

        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || loading}
          className="p-2.5 bg-[#002970] hover:bg-[#001D4F] disabled:opacity-40 text-white rounded-lg transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AssistantContent />
    </React.Suspense>
  );
}
