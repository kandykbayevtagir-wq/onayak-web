"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Star, ShieldCheck, AlertCircle, LocateFixed, Search, ChevronDown } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

// База городов РК для автодополнения (чтобы избежать опечаток в БД)
const CITIES_KZ = [
  "Актау", "Актобе", "Алматы", "Астана", "Атырау", "Караганда", 
  "Кокшетау", "Костанай", "Кызылорда", "Павлодар", "Петропавловск", 
  "Семей", "Талдыкорган", "Тараз", "Туркестан", "Уральск", 
  "Усть-Каменогорск", "Шымкент"
];

export default function Home() {
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tgUser, setTgUser] = useState<any>(null);

  // Состояния для локации
  const [selectedCity, setSelectedCity] = useState("Актобе"); // Дефолтный город
  const [isLocating, setIsLocating] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pickerRef = useRef<HTMLDivElement>(null);

  // 1. Инициализация Telegram
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

    // Закрытие выпадающего списка при клике вне него
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowCityPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Загрузка данных (Срабатывает каждый раз, когда меняется selectedCity)
  useEffect(() => {
    async function fetchCenters() {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error: sbError } = await supabase
          .from('podology_centers')
          .select('*')
          .eq('city', selectedCity) // <--- Фильтр теперь динамический
          .order('rating', { ascending: false });

        if (sbError) throw sbError;
        setCenters(data || []);
      } catch (err: any) {
        setError("Ошибка загрузки базы. Проверьте интернет.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCenters();
  }, [selectedCity]);

  // 3. Функция GPS (Определение по координатам)
  const locateUser = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим устройством");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Бесплатный API OpenStreetMap для конвертации координат в город
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await res.json();
          
          let userCity = data.address?.city || data.address?.town || data.address?.village;
          
          if (userCity) {
            // Проверяем, есть ли найденный город в нашей базе
            const matchedCity = CITIES_KZ.find(c => userCity.includes(c) || c.includes(userCity));
            setSelectedCity(matchedCity || "Актобе");
            setShowCityPicker(false);
          }
        } catch (error) {
          alert("Не удалось определить город. Выберите вручную.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Доступ к геолокации запрещен. Выберите город из списка.");
        setIsLocating(false);
      }
    );
  };

  // Фильтрация списка городов по вводу (Те самые 3 буквы)
  const filteredCities = CITIES_KZ.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      
      {/* Шапка с локацией */}
      <div className="bg-[#111] border-b border-white/5 p-5 pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black tracking-tight text-blue-500">OnAyak</h1>
          {tgUser && (
            <div className="bg-[#1a1a1a] px-2 py-1 rounded-md text-[10px] font-medium text-gray-400">
              ID: {tgUser.id}
            </div>
          )}
        </div>

        {/* Умный селектор города */}
        <div className="relative" ref={pickerRef}>
          <p className="text-gray-500 uppercase text-[9px] font-bold tracking-[0.2em] mb-1.5 ml-1">
            Ваш регион
          </p>
          <div 
            className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl p-3 cursor-pointer"
            onClick={() => setShowCityPicker(!showCityPicker)}
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-sm font-bold">{selectedCity}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${showCityPicker ? "rotate-180" : ""}`} />
          </div>

          {/* Выпадающее меню поиска */}
          {showCityPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 flex flex-col">
              <div className="p-3 border-b border-white/5 flex gap-2 items-center">
                <Search size={14} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Введите город (например: Акт...)"
                  className="bg-transparent w-full text-sm outline-none placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              
              {/* Кнопка GPS */}
              <button 
                onClick={locateUser}
                disabled={isLocating}
                className="flex items-center gap-2 p-3 text-sm text-blue-400 font-medium hover:bg-white/5 border-b border-white/5 transition-colors"
              >
                <LocateFixed size={16} className={isLocating ? "animate-spin" : ""} />
                {isLocating ? "Определяем..." : "Определить по GPS"}
              </button>

              {/* Список результатов */}
              <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                {filteredCities.map(city => (
                  <li 
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityPicker(false);
                      setSearchQuery("");
                    }}
                    className="p-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
                  >
                    {city}
                  </li>
                ))}
                {filteredCities.length === 0 && (
                  <li className="p-3 text-xs text-gray-500 text-center">Город не найден</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Основной контент */}
      <div className="p-5 flex-1">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-5 rounded-2xl animate-pulse h-28 w-full"></div>
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="bg-[#111] p-8 rounded-2xl text-center border border-dashed border-white/10 mt-4">
            <MapPin size={24} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium mb-1">В городе {selectedCity} пока нет центров</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">Станьте первыми</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {centers.map((center) => (
              <div key={center.id} className="bg-[#111] border border-white/5 p-5 rounded-2xl flex flex-col active:scale-[0.98] transition-transform">
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
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                  Открыть карточку предприятия
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="opacity-30 flex flex-col items-center gap-1.5 pb-6">
        <ShieldCheck size={14} className="text-blue-500" />
        <p className="text-[8px] uppercase tracking-[0.2em] font-medium">OnAyak B2B Network</p>
      </div>
    </main>
  );
}