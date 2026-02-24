"use client";

import { useEffect, useState } from "react";
import { MapPin, Search, Calendar, ShieldCheck } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Проверка наличия объекта Telegram WebApp
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand(); // Разворачиваем приложение на весь экран
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 pt-12 pb-8 font-sans">
      
      {/* Логотип OnAyak */}
      <div className="bg-[#3b82f6] px-8 py-3 rounded-2xl mb-2 shadow-lg shadow-blue-500/20">
        <h1 className="text-3xl font-bold tracking-tight">OnAyak</h1>
      </div>
      <p className="text-[10px] text-blue-400 font-bold tracking-[0.2em] mb-10">
        PROFESSIONAL SERVICE
      </p>

      {/* Приветствие из Telegram */}
      <div className="w-full max-w-sm mb-8">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Ваша локация</p>
        <div className="flex items-center gap-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
          <MapPin size={18} className="text-blue-500" />
          <span className="text-sm font-medium">Актобе, Казахстан</span>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Приветственный блок */}
        <div className="mb-2">
          <h2 className="text-xl font-semibold">
            Привет, {user?.first_name || "Гость"}!
          </h2>
          <p className="text-gray-500 text-sm">Выберите нужное действие</p>
        </div>

        {/* Кнопка: Найти мастера */}
        <button className="w-full bg-[#3b82f6] hover:bg-blue-600 active:scale-[0.98] transition-all p-4 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Search size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Найти мастера</p>
              <p className="text-[10px] text-blue-100">Запись напрямую за 1 минуту</p>
            </div>
          </div>
        </button>

        {/* Кнопка: Мои записи */}
        <button className="w-full bg-[#111111] border border-white/10 hover:bg-[#1a1a1a] active:scale-[0.98] transition-all p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 p-2 rounded-lg text-gray-400">
              <Calendar size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm text-gray-200">Мои записи</p>
              <p className="text-[10px] text-gray-500">История посещений</p>
            </div>
          </div>
        </button>
      </div>

      {/* Футер */}
      <div className="mt-auto flex flex-col items-center gap-2 opacity-40">
        <ShieldCheck size={20} className="text-blue-500" />
        <p className="text-[9px] font-bold tracking-widest uppercase">
          Sourced & Developed in Aktobe
        </p>
      </div>

    </main>
  );
}