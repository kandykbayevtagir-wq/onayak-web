"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2 } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

const DIRECTOR_ID = 5720865346;
const ADMIN_ID = 5623597772;
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

// --- СЛОВАРЬ ЛОКАЛИЗАЦИИ ---
const DICT = {
  ru: {
    subtitle: "Центр Подологии",
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
    modalTitle: "Запись на прием",
    nameLabel: "Ваше имя",
    phoneLabel: "Номер телефона (WhatsApp)",
    problemLabel: "Кратко опишите проблему",
    submitBtn: "Отправить заявку",
    submitting: "Отправка...",
    successMsg: "Заявка успешно отправлена! Специалист свяжется с вами."
  },
  kz: {
    subtitle: "Подология орталығы",
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
    modalTitle: "Қабылдауға жазылу",
    nameLabel: "Атыңыз",
    phoneLabel: "Телефон нөмірі (WhatsApp)",
    problemLabel: "Мәселені қысқаша сипаттаңыз",
    submitBtn: "Өтінімді жіберу",
    submitting: "Жіберілуде...",
    successMsg: "Өтінім сәтті жіберілді! Маман сізбен хабарласады."
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "dashboard" | "admin_panel">("main");
  const [lang, setLang] = useState<"ru" | "kz" | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", problem: "" });
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

        if (user?.id === DIRECTOR_ID) setUserRole("director");
        else if (user?.id === ADMIN_ID) setUserRole("admin");
      }
    } catch (e) {
      console.warn("Вне Telegram");
    }
  }, []);

  const t = lang ? DICT[lang] : DICT.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ client_name: formData.name, client_phone: formData.phone, problem: formData.problem }]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        setFormData({ name: "", phone: "", problem: "" });
      }, 3000);
    } catch (err: any) {
      alert("Ошибка отправки: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lang) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <Globe size={48} className="text-blue-500 mx-auto mb-6 opacity-80" />
          <h1 className="text-2xl font-black mb-2 text-white">Тілді таңдаңыз</h1>
          <p className="text-sm text-gray-400 mb-8">Выберите язык навигации</p>
          
          <div className="flex flex-col gap-3">
            <button onClick={() => setLang("kz")} className="w-full py-4 bg-[#1a1a1a] hover:bg-white/10 border border-white/5 rounded-xl text-white font-bold transition-all active:scale-95">
              Қазақ тілі
            </button>
            <button onClick={() => setLang("ru")} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95">
              Русский язык
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Боковое меню */}
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-[#111] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <h2 className="text-xl font-black text-blue-500 tracking-tighter">OnAyak</h2>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-6 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">{t.netTitle}</p>
            <div className="flex flex-col gap-2">
              {CITIES_KZ.map(city => (
                <div key={city} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className={`text-sm ${city === "Актобе" ? "text-white font-bold" : "text-gray-400"}`}>
                    {city === "Актобе" ? (lang === "kz" ? "Ақтөбе" : "Актобе") : city}
                  </span>
                  {city === "Актобе" 
                    ? <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">{t.active}</span>
                    : <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded-md">{t.noCenters}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">{t.aboutTitle}</p>
            <button className="w-full flex items-center gap-3 text-sm text-gray-300 py-2 hover:text-white transition-colors">
              <Info size={16} className="text-blue-500" /> {t.aboutApp}
            </button>
            <a href="mailto:kandykbayevtagir@gmail.com" className="w-full flex items-center gap-3 text-sm text-gray-300 py-2 hover:text-white transition-colors">
              <Mail size={16} className="text-blue-500" /> {t.support}
            </a>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Модальное окно записи */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{t.successMsg}</h3>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-white mb-6">{t.modalTitle}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">{t.nameLabel}</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                      placeholder={lang === "kz" ? "Атыңыз" : "Иван Иванов"}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">{t.phoneLabel}</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                      placeholder="+7 777 000 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">{t.problemLabel}</label>
                    <textarea 
                      rows={3}
                      value={formData.problem}
                      onChange={(e) => setFormData({...formData, problem: e.target.value})}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-xl transition-all mt-2"
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
      <header className="bg-[#111] p-4 flex justify-between items-center sticky top-0 z-30 border-b border-white/5 shadow-md">
        <button onClick={() => setIsMenuOpen(true)} className="text-gray-300 hover:text-white p-1 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-black tracking-tighter text-blue-500">OnAyak</h1>
        <div className="w-8"></div>
      </header>

      {/* Админские вкладки */}
      {(userRole === "director" || userRole === "admin") && (
        <div className="bg-[#111] border-b border-white/10 p-3 flex gap-2 overflow-x-auto custom-scrollbar shadow-sm">
          <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "bg-[#1a1a1a] text-gray-400"}`}>
            Витрина клиента
          </button>
          {userRole === "director" && (
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]" : "bg-[#1a1a1a] text-gray-400"}`}>
              <UserCog size={14} /> Кабинет Руководителя
            </button>
          )}
          {userRole === "admin" && (
            <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]" : "bg-[#1a1a1a] text-gray-400"}`}>
              <Database size={14} /> Console (Admin)
            </button>
          )}
        </div>
      )}

      {/* ВИТРИНА */}
      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className="bg-[#111] border border-white/10 p-6 rounded-3xl relative overflow-hidden mt-2 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-black text-xl text-white leading-tight mb-1">Podology MK</h2>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 px-2.5 py-1.5 rounded-lg">
                <Star size={12} className="text-blue-500 fill-blue-500" />
                <span className="text-xs font-bold text-white">5.0</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <MapPin size={14} className="text-gray-500 shrink-0" /> {t.address}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
                <p className="text-sm text-gray-300">{t.appointment}</p>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/podology.mk?igsh=ZXhkZDJ4eWc3MzR0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a1a1a] border border-white/10 hover:bg-white/5 text-white text-sm font-bold rounded-xl transition-all mb-3"
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
            <h2 className="text-xl font-bold text-white">Входящие заявки</h2>
            <div className="bg-purple-500/20 px-2 py-1 rounded text-xs font-bold text-purple-400">Руководитель</div>
          </div>
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl text-center shadow-lg">
            <CalendarPlus size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">Здесь будут появляться заявки.</p>
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
          <div className="bg-[#111] border border-red-500/20 p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
              <span className="text-xs text-gray-400">Supabase Status</span>
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