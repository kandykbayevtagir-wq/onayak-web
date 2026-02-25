"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Star, ShieldCheck, AlertCircle, Search, ChevronDown, Check } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

// Все 89 официальных городов РК (включая Қонаев, Алатау, Тобыл, Қосшы)
const CITIES_KZ = [
  "Абай", "Акколь", "Аксай", "Аксу", "Актау", "Актобе", "Алатау", "Алга", "Алматы", "Алтай", "Арал", "Аркалык", "Арыс", "Астана", "Атбасар", "Атырау", "Аягоз", 
  "Байконур", "Балхаш", "Булаево", "Державинск", "Ерейментау", "Есик", "Есиль", "Жанаозен", "Жанатас", "Жаркент", "Жезказган", "Жем", "Жетысай", "Житикара", 
  "Зайсан", "Казалинск", "Кандыагаш", "Караганда", "Каратау", "Каркаралинск", "Каскелен", "Кентау", "Кокшетау", "Қонаев", "Костанай", "Қосшы", "Кулсары", "Курчатов", "Кызылорда", 
  "Ленгер", "Лисаковск", "Макинск", "Мамлютка", "Павлодар", "Петропавловск", "Приозерск", "Риддер", "Рудный", "Сарань", "Сарканд", "Сарыагаш", "Сатпаев", "Семей", "Сергеевка", "Серебрянск", "Степногорск", "Степняк", 
  "Тайынша", "Талгар", "Талдыкорган", "Тараз", "Текели", "Темир", "Темиртау", "Тобыл", "Туркестан", "Уральск", "Усть-Каменогорск", "Ушарал", "Уштобе", 
  "Форт-Шевченко", "Хромтау", "Шалкар", "Шар", "Шардара", "Шахтинск", "Шемонаиха", "Шу", "Шымкент", "Щучинск", "Экибастуз", "Эмба"
];

export default function Home() {
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tgUser, setTgUser] = useState<any>(null);

  const [selectedCity, setSelectedCity] = useState("Актобе");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();
        setTgUser(tg.initDataUnsafe?.user || null);
      }
    } catch (e) {
      console.warn("Вне Telegram");
    }

    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowCityPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchCenters() {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error: sbError } = await supabase
          .from('podology_centers')
          .select('*')
          .eq('city', selectedCity)
          .order('rating', { ascending: false });

        if (sbError) throw sbError;
        setCenters(data || []);
      } catch (err: any) {
        setError("Ошибка загрузки базы.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCenters();
  }, [selectedCity]);

  const filteredCities = CITIES_KZ.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative">
      
      {/* Вшитые стили для Premium-анимаций (без настройки конфигов) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .glass-panel {
          animation: slideDown 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .bg-overlay {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 4px; }
      `}} />

      {/* Шапка */}
      <div className="bg-[#111] border-b border-white/5 p-5 pb-4 sticky top-0 z-40 shadow-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500">OnAyak</h1>
          {tgUser && (
            <div className="bg-[#1a1a1a] px-2 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold text-gray-400">
              ID: {tgUser.id}
            </div>
          )}
        </div>

        {/* Селектор города */}
        <div className="relative" ref={pickerRef}>
          <p className="text-gray-500 uppercase text-[9px] font-bold tracking-[0.2em] mb-2 ml-1">
            Национальная сеть
          </p>
          <div 
            className={`flex items-center justify-between bg-[#1a1a1a] border rounded-xl p-3.5 cursor-pointer transition-all duration-300 ${showCityPicker ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => {
              setShowCityPicker(!showCityPicker);
              setSearchQuery("");
            }}
          >
            <div className="flex items-center gap-2.5">
              <MapPin size={18} className={`transition-colors duration-300 ${showCityPicker ? "text-blue-400" : "text-blue-500"}`} />
              <span className="text-sm font-bold text-gray-100">{selectedCity}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${showCityPicker ? "rotate-180 text-blue-400" : ""}`} />
          </div>

          {/* Выпадающий список с анимацией и Glassmorphism */}
          {showCityPicker && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 glass-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col">
              <div className="p-4 border-b border-white/5 flex gap-3 items-center bg-[#111]/40">
                <Search size={16} className="text-blue-500" />
                <input 
                  type="text" 
                  placeholder="Поиск города..."
                  className="bg-transparent w-full text-sm font-medium outline-none placeholder:text-gray-600 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              <ul className="max-h-[250px] overflow-y-auto custom-scrollbar py-2">
                {filteredCities.map(city => {
                  const isSelected = city === selectedCity;
                  return (
                    <li 
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`px-5 py-3.5 text-sm font-medium cursor-pointer transition-all duration-200 flex justify-between items-center ${isSelected ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' : 'text-gray-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
                    >
                      {city}
                      {isSelected && <Check size={16} className="text-blue-500" />}
                    </li>
                  )
                })}
                {filteredCities.length === 0 && (
                  <li className="px-5 py-8 text-sm text-gray-600 text-center font-medium">Ничего не найдено</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Затемнение фона */}
      {showCityPicker && (
        <div className="fixed inset-0 bg-black/60 z-30 bg-overlay backdrop-blur-sm" />
      )}

      {/* Список центров */}
      <div className="p-5 flex-1 relative z-10">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-5 rounded-2xl animate-pulse h-32 w-full"></div>
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="bg-[#111] p-10 rounded-3xl text-center border border-dashed border-white/10 mt-6">
            <MapPin size={28} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 text-sm font-bold mb-2">В г. {selectedCity} пока нет центров</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.1em] font-medium leading-relaxed max-w-[200px] mx-auto">
              Станьте первым партнером OnAyak в этом регионе
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            {centers.map((center) => (
              <div key={center.id} className="bg-[#111] border border-white/5 p-5 rounded-2xl flex flex-col active:scale-[0.98] transition-transform shadow-lg shadow-black/50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-gray-100 leading-tight pr-4">
                    {center.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg shrink-0">
                    <Star size={10} className="text-blue-500 fill-blue-500" />
                    <span className="text-[10px] font-bold text-blue-500">{center.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mb-5 font-medium">
                  <MapPin size={12} className="text-gray-600 shrink-0" /> {center.address}
                </p>
                <button className="w-full py-3 bg-[#1a1a1a] hover:bg-blue-600 border border-white/5 hover:border-transparent text-gray-300 hover:text-white text-[11px] font-bold rounded-xl transition-all">
                  Открыть карточку предприятия
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}