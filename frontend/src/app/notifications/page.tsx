'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Tag
} from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "SOUNDBOX",
      title: "Soundbox Voice Confirmation",
      body: "₹120 received on Paytm QR for Afternoon Tea & Snack combo.",
      timestamp: "10 mins ago",
      icon: Volume2,
      color: "text-[#00BAF2] bg-[#00BAF2]/10"
    },
    {
      id: 2,
      type: "OPPORTUNITY",
      title: "Opportunity Alert: Dormant Shopper Scanned QR",
      body: "Customer #8812 (inactive for 24 days) just transacted ₹340!",
      timestamp: "1 hour ago",
      icon: Sparkles,
      color: "text-[#00A37A] bg-[#00A37A]/10"
    },
    {
      id: 3,
      type: "SYSTEM",
      title: "Weekly Telemetry Sync Complete",
      body: "Analyzed 9,399 transactions across 12 historical weeks. Growth space updated to ₹7,400.",
      timestamp: "Yesterday",
      icon: CheckCircle2,
      color: "text-[#002970] bg-[#002970]/10"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Bell className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>REAL-TIME NOTIFICATIONS</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            Store Alerts & Soundbox Feed
          </h1>
          <p className="text-xs text-slate-500">
            Real-time feed of Soundbox payments, customer arrivals, and AI opportunities.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-4 sm:p-5 flex items-start gap-4 hover:border-[#00BAF2] transition"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
