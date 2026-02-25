"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

const DIRECTOR_ID = 5720865346;
const ADMIN_ID = 5623597772;
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

// --- СЛОВАРЬ ЛОКАЛИЗАЦИИ ---
const DICT = {
  ru: {
    subtitle: "Центр Подологии",
    verified: "Verified by OnAyak",
    address: "Актобе, ул. Алии Молдагуловой 54а",
    appointment: "Прием по предварительной записи",
    insta: "Наш Instagram",
    applyBtn: "Оставить заявку на прием",
    netTitle: "Национальная сеть",
    active: "Активно",
    noCenters: "Пока нет центров",
    aboutTitle: "О приложении",
    aboutApp: "Что такое OnAyak?",
    support: "Поддержка / Фидбек",
    langTitle: "Язык / Тіл",
    themeTitle: "Тема оформления",
    modalTitle: "Запись на прием",
    nameLabel: "Ваше имя",
    problemLabel: "Выберите проблему:",
    submitBtn: "Отправить заявку",
    submitting: "Отправка...",
    successMsg: "Заявка отправлена! Мы свяжемся с вами в Telegram.",
    problems: ["Вросший ноготь", "Грибок ногтей/стопы", "Мозоли и натоптыши", "Трещины", "Диабетическая стопа", "Просто консультация"],
    aboutHeadline: "Цифровой Сервис",
    aboutText: "OnAyak — это инновационная платформа для автоматизации и масштабирования центров профессиональной подологии по всему Казахстану."
  },
  kz: {
    subtitle: "Подология орталығы",
    verified: "OnAyak растаған",
    address: "Ақтөбе, Әлия Молдағұлова көшесі, 54а",
    appointment: "Алдын ала жазылу бойынша қабылдау",
    insta: "Біздің Instagram",
    applyBtn: "Қабылдауға өтінім қалдыру",
    netTitle: "Ұлттық желі",
    active: "Белсенді",
    noCenters: "Әзірге орталықтар жоқ",
    aboutTitle: "Қосымша туралы",
    aboutApp: "OnAyak деген не?",
    support: "Қолдау / Кері байланыс",
    langTitle: "Тіл / Язык",
    themeTitle: "Тақырып",
    modalTitle: "Қабылдауға жазылу",
    nameLabel: "Атыңыз",
    problemLabel: "Мәселені таңдаңыз:",
    submitBtn: "Өтінімді жіберу",
    submitting: "Жіберілуде...",
    successMsg: "Өтінім жіберілді! Біз сізбен Telegram арқылы байланысамыз.",
    problems: ["Тырнақтың етке өсуі", "Саңырауқұлақ", "Сүйел және мүйізгек", "Жарықтар", "Диабеттік табан", "Жай консультация"],
    aboutHeadline: "Цифрлық Сервис",
    aboutText: "OnAyak — бұл Қазақстан бойынша кәсіби подология орталықтарын автоматтандыруға және дамытуға арналған инновациялық платформа."
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "dashboard" | "admin_panel">("main");
  const [lang, setLang] = useState<"ru" | "kz" | null>(null);
  // Состояние темы (по умолчанию темная)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", problem: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();
        const user = tg.initDataUnsafe?.user;
        setTgUser(user || null);
        
        // Автоопределение темы Telegram
        if (tg.colorScheme === 'light') setTheme('light');

        if (user?.id === DIRECTOR_ID) setUserRole("director");
        else if (user?.id === ADMIN_ID) setUserRole("admin");
      }
    } catch (e) {
      console.warn("Вне Telegram");
    }
  }, []);

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const t = lang ? DICT[lang] : DICT.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.problem) return;
    
    setIsSubmitting(true);
    try {
      const tgContact = tgUser?.username ? `@${tgUser.username}` : `TG ID: ${tgUser?.id || "Неизвестно"}`;
      const { error } = await supabase
        .from('leads')
        .insert([{ client_name: formData.name, client_phone: tgContact, problem: formData.problem }]);
      if (error) throw error;
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setFormData({ name: "", problem: "" });
      }, 3000);
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lang) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <Globe size={48} className="text-blue-500 mx-auto mb-6 opacity-80" />
          <h1 className="text-2xl font-black mb-2">Тілді таңдаңыз</h1>
          <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Выберите язык навигации</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setLang("kz")} className={`w-full py-4 border rounded-xl font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-[#1a1a1a] hover:bg-white/10 border-white/5 text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'}`}>Қазақ тілі</button>
            <button onClick={() => setLang("ru")} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95">Русский язык</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Боковое меню */}
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] border-r z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className={`p-5 flex justify-between items-center border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <h2 className="text-xl font-black text-blue-500 tracking-tighter">OnAyak</h2>
          <button onClick={() => setIsMenuOpen(false)} className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
           {/* Смена темы */}
           <div>
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.themeTitle}</p>
            <button 
              onClick={toggleTheme} 
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5 text-white hover:bg-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'}`}
            >
              <span className="text-sm font-bold flex items-center gap-2">
                {theme === 'dark' ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-orange-400" />}
                {theme === 'dark' ? "Темная тема" : "Светлая тема"}
              </span>
              <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${theme === 'dark' ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </button>
          </div>

          {/* Смена языка */}
          <div>
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.langTitle}</p>
            <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
              <button onClick={() => setLang("ru")} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${lang === "ru" ? "bg-blue-600 text-white shadow-md" : (theme === 'dark' ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>Русский</button>
              <button onClick={() => setLang("kz")} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${lang === "kz" ? "bg-blue-600 text-white shadow-md" : (theme === 'dark' ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>Қазақша</button>
            </div>
          </div>

          {/* Города */}
          <div>
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.netTitle}</p>
            <div className="flex flex-col gap-2">
              {CITIES_KZ.map(city => (
                <div key={city} className={`flex justify-between items-center py-2 border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={`text-sm ${city === "Актобе" ? (theme === 'dark' ? "text-white font-bold" : "text-gray-900 font-bold") : (theme === 'dark' ? "text-gray-400" : "text-gray-500")}`}>
                    {city === "Актобе" ? (lang === "kz" ? "Ақтөбе" : "Актобе") : city}
                  </span>
                  {city === "Актобе" 
                    ? <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">{t.active}</span>
                    : <span className={`text-[10px] px-2 py-1 rounded-md ${theme === 'dark' ? 'text-gray-600 bg-white/5' : 'text-gray-400 bg-gray-100'}`}>{t.noCenters}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Инфо */}
          <div>
            <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.aboutTitle}</p>
            <button onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }} className={`w-full flex items-center gap-3 text-sm py-2 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              <Info size={16} className="text-blue-500" /> {t.aboutApp}
            </button>
            <a href="mailto:kandykbayevtagir@gmail.com" className={`w-full flex items-center gap-3 text-sm py-2 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              <Mail size={16} className="text-blue-500" /> {t.support}
            </a>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* АНИМИРОВАННОЕ ОКНО "О ПРИЛОЖЕНИИ" (С кислотными цветами) */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className={`border rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'bg-white border-gray-200'}`}>
            {/* Кислотные фоновые градиенты */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/30 blur-[60px] rounded-full mix-blend-screen"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-lime-400/30 blur-[60px] rounded-full mix-blend-screen"></div>

            <button onClick={() => setIsAboutOpen(false)} className={`absolute top-4 right-4 z-10 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              <X size={24} />
            </button>

            <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 border border-white/20">
                <Activity size={36} className="text-white" />
              </div>
              <h2 className={`text-3xl font-black mb-2 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>OnAyak</h2>
              <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-6">{t.aboutHeadline}</h3>
              <p className={`text-sm leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.aboutText}
              </p>
              
              <div className={`border rounded-xl p-4 w-full flex items-center justify-between ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-left">
                  <p className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Версия / Version</p>
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>v 1.2.0 (Stable)</p>
                </div>
                <ShieldCheck size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно записи (Умная форма) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsModalOpen(false)} className={`absolute top-5 right-5 rounded-full p-1 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white bg-white/5' : 'text-gray-500 hover:text-gray-900 bg-gray-100'}`}>
              <X size={20} />
            </button>
            
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" />
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.successMsg}</h3>
              </div>
            ) : (
              <>
                <h3 className={`text-xl font-black mb-6 pr-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.modalTitle}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className={`block text-xs mb-2 uppercase tracking-wider font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.nameLabel}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                      placeholder={lang === "kz" ? "Атыңыз" : "Иван Иванов"}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs mb-2 uppercase tracking-wider font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t.problemLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.problems.map((prob, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({...formData, problem: prob})}
                          className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all ${
                            formData.problem === prob 
                            ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                            : (theme === 'dark' ? "bg-[#1a1a1a] border-white/5 text-gray-400 hover:border-white/20 hover:text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900")
                          }`}
                        >
                          {prob}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !formData.problem}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all mt-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  >
                    {isSubmitting ? t.submitting : t.submitBtn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Шапка */}
      <header className={`p-4 flex justify-between items-center sticky top-0 z-30 border-b shadow-md ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setIsMenuOpen(true)} className={`p-1 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-black tracking-tighter text-blue-500">OnAyak</h1>
        <div className="w-8"></div>
      </header>

      {/* Админские вкладки */}
      {(userRole === "director" || userRole === "admin") && (
        <div className={`border-b p-3 flex gap-2 overflow-x-auto custom-scrollbar shadow-sm ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
          <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]" : (theme === 'dark' ? "bg-[#1a1a1a] text-gray-400" : "bg-gray-100 text-gray-600")}`}>
            Витрина клиента
          </button>
          {userRole === "director" && (
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]" : (theme === 'dark' ? "bg-[#1a1a1a] text-gray-400" : "bg-gray-100 text-gray-600")}`}>
              <UserCog size={14} /> Кабинет Руководителя
            </button>
          )}
          {userRole === "admin" && (
            <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]" : (theme === 'dark' ? "bg-[#1a1a1a] text-gray-400" : "bg-gray-100 text-gray-600")}`}>
              <Database size={14} /> Console (Admin)
            </button>
          )}
        </div>
      )}

      {/* ВИТРИНА */}
      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className={`border p-6 rounded-3xl relative overflow-hidden mt-2 shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className={`font-black text-xl leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Podology MK</h2>
                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 px-2.5 py-1.5 rounded-lg">
                <Star size={12} className="text-blue-500 fill-blue-500" />
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5.0</span>
              </div>
            </div>

            {/* Верификация */}
            <div className="flex items-center gap-1.5 mb-4">
              <BadgeCheck size={16} className="text-blue-500 fill-blue-500/20" />
              <span className="text-xs font-bold text-blue-500">{t.verified}</span>
            </div>

            <div className="space-y-2 mb-6">
              <p className={`text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} shrink-0 /> {t.address}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.appointment}</p>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/podology.mk?igsh=ZXhkZDJ4eWc3MzR0" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-3 border hover:bg-opacity-90 text-sm font-bold rounded-xl transition-all mb-3 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            >
              <Instagram size={18} className="text-pink-500" /> {t.insta}
            </a>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
            >
              <CalendarPlus size={18} /> {t.applyBtn}
            </button>
          </div>
        </div>
      )}

      {/* КАБИНЕТ РУКОВОДИТЕЛЯ */}
      {activeTab === "dashboard" && userRole === "director" && (
        <div className="p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Входящие заявки</h2>
            <div className="bg-purple-500/20 px-2 py-1 rounded text-xs font-bold text-purple-400">Руководитель</div>
          </div>
          <div className={`border p-8 rounded-2xl text-center shadow-lg ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}>
            <CalendarPlus size={32} className={`mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Здесь будут появляться заявки.</p>
          </div>
        </div>
      )}

      {/* ПАНЕЛЬ АДМИНА */}
      {activeTab === "admin_panel" && userRole === "admin" && (
        <div className="p-5 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-red-500">Системная консоль</h2>
            <div className="bg-red-500/20 px-2 py-1 rounded text-xs font-bold text-red-400">Dev</div>
          </div>
          <div className={`border p-5 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-[#111] border-red-500/20' : 'bg-white border-red-200'}`}>
            <div className={`flex justify-between items-center border-b pb-3 mb-3 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Supabase Status</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connected
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}