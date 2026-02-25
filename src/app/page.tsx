"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

const DIRECTOR_ID = 5720865346;
const ADMIN_ID = 5623597772;
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

const DICT = {
  ru: {
    subtitle: "Центр Подологии", verified: "Verified by OnAyak", address: "Актобе, ул. Алии Молдагуловой 54а",
    appointment: "Прием по предварительной записи", insta: "Наш Instagram", applyBtn: "Оставить заявку на прием",
    netTitle: "Национальная сеть", active: "Активно", noCenters: "Пока нет центров", aboutTitle: "О приложении",
    aboutApp: "Что такое OnAyak?", support: "Поддержка / Фидбек", langTitle: "Язык / Тіл", themeTitle: "Тема оформления",
    dark: "Темная", light: "Светлая",
    modalTitle: "Запись на прием", nameLabel: "Ваше имя", problemLabel: "Выберите проблему:", submitBtn: "Отправить заявку",
    submitting: "Отправка...", successMsg: "Заявка отправлена! Мы свяжемся с вами.", 
    problems: ["Вросший ноготь", "Грибок ногтей/стопы", "Мозоли и натоптыши", "Трещины", "Диабетическая стопа", "Просто консультация"],
    aboutHeadline: "Цифровой Сервис", aboutText: "OnAyak — это инновационная платформа для автоматизации и масштабирования центров подологии.",
    leadsTitle: "Входящие заявки", noLeads: "Пока заявок нет", detectedTg: "Ваш Telegram:",
    termsTitle: "Пользовательское соглашение",
    termsText: "Используя сервис OnAyak, вы даете согласие на сбор и обработку ваших данных (имя, Telegram-контакт, описание проблемы) исключительно в целях оказания профессиональных подологических и эстетических услуг по уходу за стопой центром Podology MK. Сервис не оказывает медицинских услуг. Ваши данные надежно защищены.",
    acceptTermsBtn: "Принять и продолжить",
    status_new: "Новая", status_progress: "В работе", status_completed: "Завершено"
  },
  kz: {
    subtitle: "Подология орталығы", verified: "OnAyak растаған", address: "Ақтөбе, Әлия Молдағұлова көшесі, 54а",
    appointment: "Алдын ала жазылу бойынша қабылдау", insta: "Біздің Instagram", applyBtn: "Қабылдауға өтінім қалдыру",
    netTitle: "Ұлттық желі", active: "Белсенді", noCenters: "Әзірге орталықтар жоқ", aboutTitle: "Қосымша туралы",
    aboutApp: "OnAyak деген не?", support: "Қолдау / Кері байланыс", langTitle: "Тіл / Язык", themeTitle: "Тақырып",
    dark: "Қараңғы", light: "Жарық",
    modalTitle: "Қабылдауға жазылу", nameLabel: "Атыңыз", problemLabel: "Мәселені таңдаңыз:", submitBtn: "Өтінімді жіберу",
    submitting: "Жіберілуде...", successMsg: "Өтінім жіберілді! Біз сізбен хабарласамыз.",
    problems: ["Тырнақтың етке өсуі", "Саңырауқұлақ", "Сүйел және мүйізгек", "Жарықтар", "Диабеттік табан", "Жай консультация"],
    aboutHeadline: "Цифрлық Сервис", aboutText: "OnAyak — бұл кәсіби подология орталықтарын автоматтандыруға арналған инновациялық платформа.",
    leadsTitle: "Кіріс өтінімдер", noLeads: "Өтінімдер жоқ", detectedTg: "Сіздің Telegram:",
    termsTitle: "Қолдану ережелері",
    termsText: "OnAyak сервисін пайдалана отырып, сіз Podology MK орталығының кәсіби подологиялық және эстетикалық табан күтімі қызметтерін көрсету мақсатында деректеріңізді жинауға және өңдеуге келісім бересіз. Сервис медициналық қызметтер көрсетпейді. Деректеріңіз қорғалған.",
    acceptTermsBtn: "Қабылдау және жалғастыру",
    status_new: "Жаңа", status_progress: "Өңделуде", status_completed: "Аяқталды"
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "dashboard" | "admin_panel">("main");
  const [lang, setLang] = useState<"ru" | "kz" | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", problem: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const savedLang = localStorage.getItem('onayak_lang');
      const savedTerms = localStorage.getItem('onayak_terms');
      if (savedLang) setLang(savedLang as any);
      if (savedTerms === 'true') setHasAcceptedTerms(true);

      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();
        const user = tg.initDataUnsafe?.user;
        setTgUser(user || null);
        
        if (tg.colorScheme === 'light') setTheme('light');
        if (user?.id === DIRECTOR_ID) setUserRole("director");
        else if (user?.id === ADMIN_ID) setUserRole("admin");

        if (user?.id) {
          try {
            await supabase.from('profiles').upsert({
              tg_id: user.id, username: user.username || '', first_name: user.first_name || '',
              lang: savedLang || 'ru', terms_accepted: savedTerms === 'true', last_active: new Date().toISOString()
            }, { onConflict: 'tg_id' });
          } catch (e) { console.error("DB Sync error", e); }
        }
      }
    };
    initApp();
  }, []);

  const fetchLeads = async () => {
    setIsLeadsLoading(true);
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error && data) setLeads(data);
    setIsLeadsLoading(false);
  };

  // АДМИН ТЕПЕРЬ ТОЖЕ МОЖЕТ ЗАГРУЖАТЬ ЗАЯВКИ
  useEffect(() => {
    if (activeTab === "dashboard" && (userRole === "director" || userRole === "admin")) fetchLeads();
  }, [activeTab, userRole]);

  const updateLeadStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } else {
      alert("Ошибка обновления статуса");
    }
  };

  const handleLangSelect = (selectedLang: "ru" | "kz") => {
    setLang(selectedLang);
    localStorage.setItem('onayak_lang', selectedLang);
  };

  const handleAcceptTerms = async () => {
    setHasAcceptedTerms(true);
    localStorage.setItem('onayak_terms', 'true');
    if (tgUser?.id) await supabase.from('profiles').update({ terms_accepted: true, lang: lang }).eq('tg_id', tgUser.id);
  };

  const t = lang ? DICT[lang] : DICT.ru;
  const tgContact = tgUser?.username ? `@${tgUser.username}` : (tgUser?.id ? `ID: ${tgUser.id}` : "Unknown");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.problem) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{ client_name: formData.name, client_phone: tgContact, problem: formData.problem }]);
      if (error) throw error;
      
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, problem: formData.problem, contact: tgContact }),
      });

      setIsSuccess(true);
      setTimeout(() => { setIsModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "" }); }, 3000);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!lang) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transition-colors animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <Globe size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-2">Тілді таңдаңыз</h1>
          <p className="text-sm mb-8 opacity-60">Выберите язык навигации</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => handleLangSelect("kz")} className={`w-full py-4 rounded-xl font-bold border transition-all ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}>Қазақ тілі</button>
            <button onClick={() => handleLangSelect("ru")} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30">Русский язык</button>
          </div>
        </div>
      </main>
    );
  }

  if (lang && !hasAcceptedTerms) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transition-colors animate-in slide-in-from-bottom-4 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <ScrollText size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-xl font-black mb-4">{t.termsTitle}</h1>
          <div className={`p-4 rounded-xl mb-6 text-xs text-left leading-relaxed border overflow-y-auto max-h-48 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>{t.termsText}</div>
          <button onClick={handleAcceptTerms} className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"><CheckCircle2 size={18} /> {t.acceptTermsBtn}</button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] border-r z-50 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="p-5 flex justify-between items-center border-b border-inherit"><h2 className="text-xl font-black text-blue-500">OnAyak</h2><button onClick={() => setIsMenuOpen(false)}><X size={24} /></button></div>
        <div className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.themeTitle}</p>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-full flex items-center justify-between p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
              <span className="text-sm font-bold flex items-center gap-2">{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}{theme === 'dark' ? t.dark : t.light}</span>
              <div className={`w-8 h-4 rounded-full relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div></div>
            </button>
          </div>

          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.langTitle}</p>
            <div className="flex bg-inherit rounded-lg p-1 border border-inherit">
              <button onClick={() => handleLangSelect("ru")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "ru" ? "bg-blue-600 text-white" : "opacity-40"}`}>RU</button>
              <button onClick={() => handleLangSelect("kz")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "kz" ? "bg-blue-600 text-white" : "opacity-40"}`}>KZ</button>
            </div>
          </div>

          {/* ГОРОДА ВЕРНУЛИСЬ */}
          <div>
            <p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.netTitle}</p>
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

          <div>
            <button onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }} className="flex items-center gap-3 text-sm font-bold mb-4"><Info size={16} className="text-blue-500" /> {t.aboutApp}</button>
            <a href="mailto:kandykbayevtagir@gmail.com" className="flex items-center gap-3 text-sm font-bold"><Mail size={16} className="text-blue-500" /> {t.support}</a>
          </div>

        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}

      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className={`border rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 blur-[60px] rounded-full"></div>
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4"><X size={24} /></button>
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Activity size={32} className="text-white" /></div>
              <h2 className="text-3xl font-black mb-1">OnAyak</h2>
              <h3 className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-6">{t.aboutHeadline}</h3>
              <p className="text-sm opacity-70 mb-8">{t.aboutText}</p>
              <div className={`border rounded-xl p-3 flex justify-between items-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-left"><p className="text-[10px] opacity-40 uppercase">Version</p><p className="text-sm font-bold">1.2.1 CRM</p></div>
                <ShieldCheck size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (
              <div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>
            ) : (
              <>
                <h3 className="text-xl font-black mb-6">{t.modalTitle}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-2">{t.nameLabel}</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-2">{t.problemLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.problems.map((prob, idx) => (
                        <button key={idx} type="button" onClick={() => setFormData({...formData, problem: prob})} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-40"}`}>{prob}</button>
                      ))}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                    <span className="text-[10px] font-bold opacity-60">{t.detectedTg}</span>
                    <span className="text-[10px] font-black text-blue-500">{tgContact}</span>
                  </div>
                  <button type="submit" disabled={isSubmitting || !formData.problem} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 transition-all">{isSubmitting ? t.submitting : t.submitBtn}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <header className={`p-4 flex justify-between items-center sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setIsMenuOpen(true)} className="p-1"><Menu size={24} /></button>
        <h1 className="text-lg font-black text-blue-500">OnAyak</h1>
        <div className="w-8"></div>
      </header>

      {(userRole === "director" || userRole === "admin") && (
        <div className={`p-3 flex gap-2 border-b overflow-x-auto ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
          <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-md" : "opacity-40"}`}>CLIENT UI</button>
          
          {/* АДМИН ТЕПЕРЬ ВИДИТ ВКЛАДКУ ДИРЕКТОРА */}
          {(userRole === "director" || userRole === "admin") && <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-md" : "opacity-40"}`}><UserCog size={14}/> CRM (DIRECTOR)</button>}
          
          {userRole === "admin" && <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white shadow-md" : "opacity-40"}`}><Database size={14}/> ANALYTICS</button>}
        </div>
      )}

      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className={`border p-6 rounded-3xl relative overflow-hidden mt-2 shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div><h2 className="font-black text-xl mb-1">Podology MK</h2><p className="text-xs text-blue-500 font-bold uppercase">{t.subtitle}</p></div>
              <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-lg"><Star size={10} className="text-blue-500 fill-blue-500" /><span className="text-xs font-bold text-blue-500">5.0</span></div>
            </div>
            <div className="flex items-center gap-1.5 mb-4 text-blue-500 font-bold text-[10px]"><BadgeCheck size={14} fill="currentColor" fillOpacity="0.2" /> {t.verified}</div>
            <div className="space-y-2 mb-6 opacity-70 text-sm"><p className="flex items-center gap-2"><MapPin size={14} /> {t.address}</p><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t.appointment}</div></div>
            <a href="https://www.instagram.com/podology.mk" target="_blank" className={`w-full flex justify-center gap-2 py-3 border rounded-xl text-sm font-bold mb-3 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'}`}><Instagram size={18} className="text-pink-500" /> {t.insta}</a>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">{t.applyBtn}</button>
          </div>
        </div>
      )}

      {/* КАБИНЕТ МАМЫ (CRM) - АДМИН ТОЖЕ ВИДИТ */}
      {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.leadsTitle}</h2><button onClick={fetchLeads} className={`p-2 rounded-full ${isLeadsLoading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button></div>
          {leads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30"><Users size={48} className="mb-4"/><p className="text-sm font-bold">{t.noLeads}</p></div>
          ) : (
            <div className="flex flex-col gap-3">
              {leads.map(lead => {
                const isNew = !lead.status || lead.status === 'new';
                const isProgress = lead.status === 'in_progress';
                const isCompleted = lead.status === 'completed';

                return (
                  <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200 shadow-sm'} ${isCompleted ? 'opacity-60' : ''}`}>
                    
                    <div className={`absolute top-0 right-0 text-[8px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider
                      ${isNew ? 'bg-yellow-500/20 text-yellow-500' : 
                        isProgress ? 'bg-blue-500/20 text-blue-500' : 
                        'bg-green-500/20 text-green-500'}`}>
                      {isNew ? t.status_new : isProgress ? t.status_progress : t.status_completed}
                    </div>

                    <div className="flex justify-between items-start mb-2 mt-1"><h4 className="font-bold text-sm">{lead.client_name}</h4></div>
                    <div className="bg-blue-500/10 px-3 py-1.5 rounded-lg inline-block text-[10px] font-bold text-blue-500 mb-4">{lead.problem}</div>
                    
                    <div className="flex justify-between items-end border-t border-inherit pt-3 mb-4">
                      <div>
                        <span className="block text-[8px] uppercase opacity-40 mb-1">Telegram</span>
                        <span className="text-xs font-bold">{lead.client_phone}</span>
                      </div>
                      {lead.client_phone.startsWith('@') && (
                        <a href={`https://t.me/${lead.client_phone.substring(1)}`} target="_blank" className="bg-blue-600 p-2 rounded-xl text-white shadow-md active:scale-95 transition-transform"><ExternalLink size={16}/></a>
                      )}
                    </div>

                    {!isCompleted && (
                      <div className="flex gap-2">
                        {isNew && (
                          <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform">
                            <Play size={12} /> В работу
                          </button>
                        )}
                        {isProgress && (
                          <button onClick={() => updateLeadStatus(lead.id, 'completed')} className="flex-1 py-2 bg-green-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform">
                            <Check size={12} /> Завершить
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* АДМИН ПАНЕЛЬ */}
      {activeTab === "admin_panel" && userRole === "admin" && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-black text-red-500">FOUNDER ANALYTICS</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
              <BarChart3 size={20} className="text-blue-500 mb-2" />
              <p className="text-[10px] opacity-50 uppercase font-bold mb-1">Просмотры</p>
              <p className="text-xl font-black">---</p>
            </div>
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
              <Users size={20} className="text-green-500 mb-2" />
              <p className="text-[10px] opacity-50 uppercase font-bold mb-1">Конверсия</p>
              <p className="text-xl font-black">---</p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-red-500/20' : 'bg-white border-red-200'}`}>
            <p className="text-[10px] uppercase font-bold opacity-50 mb-3">Системный статус</p>
            <div className="flex justify-between mb-3 text-xs border-b border-inherit pb-2"><span className="opacity-60">Supabase DB</span><span className="text-green-500 font-bold">ONLINE</span></div>
            <div className="flex justify-between text-xs border-b border-inherit pb-2 mb-2"><span className="opacity-60">Active Role</span><span className="font-bold text-red-500">ADMIN</span></div>
            <div className="flex justify-between text-xs"><span className="opacity-60">Session ID</span><span className="font-mono opacity-60">{tgUser?.id}</span></div>
          </div>
        </div>
      )}
    </main>
  );
}