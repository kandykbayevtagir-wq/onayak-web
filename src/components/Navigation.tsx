"use client";

import { Calendar, UserCog, ShoppingBag, Banknote, Users } from "lucide-react";

export default function Navigation({ theme, t, activeTab, switchTab, userRole }: any) {
  return (
    <div className={`p-3 flex gap-2 border-b overflow-x-auto custom-scrollbar ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
      <button onClick={() => switchTab("main")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>ВИТРИНА</button>
      <button onClick={() => switchTab("prices")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "prices" ? "bg-indigo-500 text-white shadow-md" : "opacity-50"}`}><Banknote size={16}/> {t.priceTab}</button>
      <button onClick={() => switchTab("shop")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "shop" ? "bg-pink-600 text-white shadow-md" : "opacity-50"}`}><ShoppingBag size={16}/> {t.shopTab}</button>
      <button onClick={() => switchTab("my_leads")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "my_leads" ? "bg-green-600 text-white shadow-md" : "opacity-50"}`}><Calendar size={16}/> {t.myLeads.toUpperCase()}</button>
      
      {/* КНОПКИ ДЛЯ РУКОВОДИТЕЛЯ */}
      {(userRole === "director" || userRole === "admin") && (
        <>
          <button onClick={() => switchTab("dashboard")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-md" : "opacity-50"}`}><UserCog size={16}/> {t.leadsTitle.toUpperCase()}</button>
          <button onClick={() => switchTab("tasks")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "tasks" ? "bg-purple-600 text-white shadow-md" : "opacity-50"}`}><Users size={16}/> ЗАДАЧИ</button>
        </>
      )}
    </div>
  );
}