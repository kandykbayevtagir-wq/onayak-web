"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

// --- КОНФИГУРАЦИЯ РОЛЕЙ ---
const DIRECTOR_ID = 5720865346; // ID Мамы (Руководитель)
const ADMIN_ID = 5623597772;    // Твой ID (Создатель / Админ)

// Города для бокового меню
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "dashboard" | "admin_panel">("main");

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();
        const user = tg.initDataUnsafe?.user;
        setTgUser(user || null);

        // Определение роли
        if (user?.id === DIRECTOR_ID) setUserRole("director");
        else if (user?.id === ADMIN_ID) setUserRole("admin");
      }
    } catch (e) {
      console.warn("Вне Telegram");
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Боковое меню (Drawer) */}
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-[#111] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <h2 className="text-xl font-black text-blue-500 tracking-tighter">OnAyak</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-6 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
          {/* Секция городов */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Национальная сеть</p>
            <div className="flex flex-col gap-2">
              {CITIES_KZ.map(city => (
                <div key={city} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className={`text-sm ${city === "Актобе" ? "text-white font-bold" : "text-gray-400"}`}>{city}</span>
                  {city === "Актобе" 
                    ? <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">Активно</span>
                    : <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded-md">Пока нет центров</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Секция инфо */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">О приложении</p>
            <button className="w-full flex items-center gap-3 text-sm text-gray-300 py-2 hover:text-white transition-colors">
              <Info size={16} className="text-blue-500" /> Что такое OnAyak?
            </button>
            <a href="mailto:kandykbayevtagir@gmail.com" className="w-full flex items-center gap-3 text-sm text-gray-300 py-2 hover:text-white transition-colors">
              <Mail size={16} className="text-blue-500" /> Поддержка / Фидбек
            </a>
          </div>
        </div>
      </div>

      {/* Затемнение фона при открытом меню */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Верхняя панель (Header) */}
      <header className="bg-[#111] p-4 flex justify-between items-center sticky top-0 z-30 border-b border-white/5 shadow-md">
        <button onClick={() => setIsMenuOpen(true)} className="text-gray-300 hover:text-white p-1 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-black tracking-tighter text-blue-500">OnAyak</h1>
        <div className="w-8"></div> {/* Пустой блок для центровки логотипа */}
      </header>

      {/* Панели управления (Видны только определенным ролям) */}
      {(userRole === "director" || userRole === "admin") && (
        <div className="bg-[#111] border-b border-white/10 p-3 flex gap-2 overflow-x-auto custom-scrollbar shadow-sm">
          <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "bg-[#1a1a1a] text-gray-400 hover:text-gray-200"}`}>
            Витрина клиента
          </button>
          
          {userRole === "director" && (
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]" : "bg-[#1a1a1a] text-gray-400 hover:text-gray-200"}`}>
              <UserCog size={14} /> Кабинет Руководителя
            </button>
          )}

          {userRole === "admin" && (
            <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]" : "bg-[#1a1a1a] text-gray-400 hover:text-gray-200"}`}>
              <Database size={14} /> Console (Admin)
            </button>
          )}
        </div>
      )}

      {/* ОСНОВНОЙ КОНТЕНТ (Витрина для клиентов) */}
      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          {/* Карточка вашего центра */}
          <div className="bg-[#111] border border-white/10 p-6 rounded-3xl relative overflow-hidden mt-2 shadow-2xl">
            {/* Декоративная линия */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-black text-xl text-white leading-tight mb-1">Podology MK</h2>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Центр Подологии</p>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 px-2.5 py-1.5 rounded-lg">
                <Star size={12} className="text-blue-500 fill-blue-500" />
                <span className="text-xs font-bold text-white">5.0</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <MapPin size={14} className="text-gray-500" /> Актобе, ул. Алии Молдагуловой 54а
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-sm text-gray-300">Прием по предварительной записи</p>
              </div>
            </div>

            {/* Кнопка Instagram */}
            <a 
              href="https://www.instagram.com/podology.mk?igsh=ZXhkZDJ4eWc3MzR0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all mb-3 shadow-lg"
            >
              <Instagram size={18} /> Портфолио (До / После)
            </a>

            {/* Главная кнопка заявки */}
            <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]">
              <CalendarPlus size={18} /> Оставить заявку на прием
            </button>
            <p className="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-widest">
              Стоимость процедур обсуждается индивидуально
            </p>
          </div>
        </div>
      )}

      {/* КАБИНЕТ РУКОВОДИТЕЛЯ (Видит только Мама) */}
      {activeTab === "dashboard" && userRole === "director" && (
        <div className="p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Входящие заявки</h2>
            <div className="bg-purple-500/20 px-2 py-1 rounded text-xs font-bold text-purple-400">
              Руководитель
            </div>
          </div>
          
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl text-center shadow-lg">
            <CalendarPlus size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">Здесь будут появляться заявки от клиентов.</p>
            <p className="text-[10px] text-gray-600 mt-3 uppercase tracking-widest">Ожидание подключения базы данных...</p>
          </div>
        </div>
      )}

      {/* ПАНЕЛЬ АДМИНА (Видишь только ты) */}
      {activeTab === "admin_panel" && userRole === "admin" && (
        <div className="p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-red-500">Системная консоль</h2>
            <div className="bg-red-500/20 px-2 py-1 rounded text-xs font-bold text-red-400">
              Dev
            </div>
          </div>

          <div className="bg-[#111] border border-red-500/20 p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
              <span className="text-xs text-gray-400">Supabase Status</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Active Telegram ID</span>
              <span className="text-xs font-mono text-gray-300">{tgUser?.id || "Local Mode"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Подвал */}
      <div className="opacity-30 flex flex-col items-center gap-1.5 pb-6 mt-auto">
        <ShieldCheck size={14} className="text-blue-500" />
        <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-gray-400">OnAyak • Tagir K.</p>
      </div>
    </main>
  );
}