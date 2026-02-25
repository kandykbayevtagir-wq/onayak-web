"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, AlertCircle } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

export default function Home() {
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tgUser, setTgUser] = useState<any>(null);

  useEffect(() => {
    // 1. Подключение к API Telegram
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand(); // Разворачиваем на весь экран
        setTgUser(tg.initDataUnsafe?.user || null); // Забираем ID и Имя для будущих подписок
      }
    } catch (e) {
      console.warn("Запущено вне Telegram");
    }

    // 2. Безопасная загрузка базы
    async function fetchCenters() {
      try {
        setIsLoading(true);
        const { data, error: sbError } = await supabase
          .from('podology_centers')
          .select('*')
          .eq('city', 'Актобе')
          .order('rating', { ascending: false });

        if (sbError) throw sbError;
        if (data) setCenters(data);
      } catch (err: any) {
        setError(err.message || "Ошибка соединения с сервером базы данных");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCenters();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-5 flex flex-col font-sans">
      
      {/* Шапка с персонализацией */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-black tracking-tight text-blue-500">OnAyak</h1>
        {tgUser && (
          <div className="bg-[#1a1a1a] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 border border-white/5 shadow-sm">
            ID: {tgUser.id || tgUser.first_name}
          </div>
        )}
      </div>

      <div className="w-full mb-6">
        <h2 className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em] mb-4">
          Актобе • Сеть центров
        </h2>

        {/* Логика отображения (Ошибки -> Загрузка -> Данные) */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        ) : isLoading ? (
          // Скелетон: Плавная серая анимация вместо пустого экрана
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-5 rounded-2xl animate-pulse h-32 w-full"></div>
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="bg-[#111] p-6 rounded-2xl text-center border border-white/5">
            <p className="text-gray-500 text-xs">Нет центров с подтвержденной лицензией.</p>
          </div>
        ) : (
          // Готовые данные
          <div className="flex flex-col gap-3">
            {centers.map((center) => (
              <div key={center.id} className="bg-[#111] border border-white/5 p-5 rounded-2xl flex flex-col transition-all active:scale-[0.98]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-gray-100 leading-tight pr-4">
                    {center.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg shrink-0">
                    <Star size={10} className="text-blue-500 fill-blue-500" />
                    <span className="text-[10px] font-bold text-blue-500">{center.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-4">
                  <MapPin size={12} className="text-gray-600" /> {center.address}
                </p>
                <button className="w-full py-2.5 bg-[#1a1a1a] hover:bg-blue-600 border border-white/5 hover:border-transparent text-gray-300 hover:text-white text-[11px] font-bold rounded-xl transition-all">
                  Открыть карточку предприятия
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Подвал */}
      <div className="mt-auto opacity-30 flex flex-col items-center gap-1.5 pb-2">
        <ShieldCheck size={14} className="text-blue-500" />
        <p className="text-[8px] uppercase tracking-[0.2em] font-medium">B2B Network • Telegram API</p>
      </div>
    </main>
  );
}