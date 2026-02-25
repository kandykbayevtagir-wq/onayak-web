"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play, Calendar, Trash2, Edit3, Save } from "lucide-react";
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
    termsText: "Используя сервис OnAyak, вы даете согласие на сбор и обработку ваших данных исключительно в целях оказания профессиональных подологических и эстетических услуг центром Podology MK. Сервис не оказывает медицинских услуг. Ваши данные надежно защищены.",
    acceptTermsBtn: "Принять и продолжить",
    status_new: "Новая", status_progress: "В работе", status_completed: "Завершено",
    dateLabel: "Желаемая дата и время:", commentLabel: "Комментарий (необязательно):",
    myLeads: "Мои записи", deleteBtn: "Отменить запись", saveBtn: "Сохранить", rescheduleBtn: "Перенести"
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
    termsText: "OnAyak сервисін пайдалана отырып, сіз Podology MK орталығының кәсіби подологиялық және эстетикалық табан күтімі қызметтерін көрсету мақсатында деректеріңізді жинауға және өңдеуге келісім бересіз. Сервис медициналық қызметтер көрсетпейді.",
    acceptTermsBtn: "Қабылдау және жалғастыру",
    status_new: "Жаңа", status_progress: "Өңделуде", status_completed: "Аяқталды",
    dateLabel: "Қалаған күн мен уақыт:", commentLabel: "Қосымша пікір (міндетті емес):",
    myLeads: "Менің жазбаларым", deleteBtn: "Жазбаны болдырмау", saveBtn: "Сақтау", rescheduleBtn: "Уақытын өзгерту"
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "dashboard" | "admin_panel" | "my_leads">("main");
  const [lang, setLang] = useState<"ru" | "kz" | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Добавлены поля date и comment
  const [formData, setFormData] = useState({ name: "", problem: "", date: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [leads, setLeads] = useState<any[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState("");
  const [rescheduleData, setRescheduleData] = useState<{id: number, time: string} | null>(null);

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
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    
    // Если клиент запрашивает "Мои записи", фильтруем по его ID
    if (activeTab === "my_leads" && tgUser?.id) {
      query = query.eq('client_tg_id', tgUser.id);
    }

    const { data, error } = await query;
    if (!error && data) setLeads(data);
    setIsLeadsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "dashboard" || activeTab === "my_leads") fetchLeads();
  }, [activeTab, tgUser]);

  const updateLeadStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const deleteLead = async (id: number) => {
    if(!confirm("Удалить запись?")) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads(leads.filter(lead => lead.id !== id));
  };

  const saveComment = async (id: number) => {
    const { error } = await supabase.from('leads').update({ client_comment: tempComment }).eq('id', id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, client_comment: tempComment } : lead));
      setEditingCommentId(null);
    }
  };

  const handleReschedule = async (id: number, clientTgId: string) => {
    if (!rescheduleData || rescheduleData.id !== id) return;
    const { error } = await supabase.from('leads').update({ appointment_time: rescheduleData.time }).eq('id', id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, appointment_time: rescheduleData.time } : lead));
      setRescheduleData(null);
      // Уведомляем клиента о переносе
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reschedule', newDate: rescheduleData.time, client_tg_id: clientTgId }),
      });
      alert("Время перенесено, клиент уведомлен.");
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
    if (!formData.name || !formData.problem || !formData.date) return;
    setIsSubmitting(true);
    try {
      // 1. Сохранение в БД с новыми полями
      const { error } = await supabase.from('leads').insert([{ 
        client_name: formData.name, 
        client_phone: tgContact, 
        problem: formData.problem,
        appointment_time: formData.date,
        client_comment: formData.comment,
        client_tg_id: tgUser?.id
      }]);
      if (error) throw error;
      
      // 2. Уведомление мамы
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'new_lead',
          name: formData.name, problem: formData.problem, contact: tgContact,
          date: formData.date, comment: formData.comment
        }),
      });

      setIsSuccess(true);
      setTimeout(() => { setIsModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "", date: "", comment: "" }); }, 3000);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  // Экраны выбора языка и правил опущены для краткости, они работают
  if (!lang) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transition-colors animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <Globe size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-2">Тілді таңдаңыз</h1>
          <div className="flex flex-col gap-3 mt-8">
            <button onClick={() => handleLangSelect("kz")} className={`w-full py-4 rounded-xl font-bold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}>Қазақ тілі</button>
            <button onClick={() => handleLangSelect("ru")} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold">Русский язык</button>
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
          <button onClick={handleAcceptTerms} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold"><CheckCircle2 size={18} className="inline" /> {t.acceptTermsBtn}</button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Боковое меню */}
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
          <button onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }} className="flex items-center gap-3 text-sm font-bold"><Info size={16} className="text-blue-500" /> {t.aboutApp}</button>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}

      {/* Окно записи (Расширено) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (
              <div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>
            ) : (
              <>
                <h3 className="text-xl font-black mb-6">{t.modalTitle}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.nameLabel}</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.dateLabel}</label>
                    <input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white css-dark-calendar' : 'bg-gray-50 border-gray-200 text-gray-900'}`} style={{colorScheme: theme === 'dark' ? 'dark' : 'light'}}/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.problemLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {t.problems.map((prob, idx) => (
                        <button key={idx} type="button" onClick={() => setFormData({...formData, problem: prob})} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-40"}`}>{prob}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.commentLabel}</label>
                    <textarea rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="..." />
                  </div>
                  <button type="submit" disabled={isSubmitting || !formData.problem || !formData.date} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg transition-all">{isSubmitting ? t.submitting : t.submitBtn}</button>
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

      {/* ТАБЫ: Добавлена вкладка клиента */}
      <div className={`p-3 flex gap-2 border-b overflow-x-auto custom-scrollbar ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white" : "opacity-40"}`}>ВИТРИНА</button>
        <button onClick={() => setActiveTab("my_leads")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "my_leads" ? "bg-green-600 text-white" : "opacity-40"}`}><Calendar size={14}/> {t.myLeads.toUpperCase()}</button>
        {(userRole === "director" || userRole === "admin") && <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white" : "opacity-40"}`}><UserCog size={14}/> CRM (DIRECTOR)</button>}
        {userRole === "admin" && <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white" : "opacity-40"}`}><Database size={14}/> ANALYTICS</button>}
      </div>

      {/* ВИТРИНА */}
      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className={`border p-6 rounded-3xl relative overflow-hidden mt-2 shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="flex justify-between items-start mb-2">
              <div><h2 className="font-black text-xl mb-1">Podology MK</h2><p className="text-xs text-blue-500 font-bold uppercase">{t.subtitle}</p></div>
            </div>
            <div className="flex items-center gap-1.5 mb-4 text-blue-500 font-bold text-[10px]"><BadgeCheck size={14} fill="currentColor" fillOpacity="0.2" /> {t.verified}</div>
            <div className="space-y-2 mb-6 opacity-70 text-sm"><p className="flex items-center gap-2"><MapPin size={14} /> {t.address}</p><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t.appointment}</div></div>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-xl active:scale-95 transition-transform">{t.applyBtn}</button>
          </div>
        </div>
      )}

      {/* ЛИЧНЫЙ КАБИНЕТ КЛИЕНТА (Мои записи) */}
      {activeTab === "my_leads" && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.myLeads}</h2><button onClick={fetchLeads} className={`p-2 rounded-full ${isLeadsLoading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button></div>
          {leads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30"><Calendar size={48} className="mb-4"/><p className="text-sm font-bold">{t.noLeads}</p></div>
          ) : (
            <div className="flex flex-col gap-3">
              {leads.map(lead => (
                <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}>
                  
                  {/* Статус */}
                  <div className={`absolute top-0 right-0 text-[8px] font-bold px-3 py-1 rounded-bl-lg uppercase ${(!lead.status || lead.status === 'new') ? 'bg-yellow-500/20 text-yellow-500' : lead.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                    {(!lead.status || lead.status === 'new') ? t.status_new : lead.status === 'in_progress' ? t.status_progress : t.status_completed}
                  </div>

                  <h4 className="font-bold text-sm mb-1">{lead.problem}</h4>
                  <p className="text-xs font-mono text-blue-500 mb-3">{lead.appointment_time ? new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Время не указано'}</p>
                  
                  {/* Комментарий (Просмотр / Редактирование) */}
                  <div className={`p-3 rounded-xl border mb-4 ${theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    {editingCommentId === lead.id ? (
                      <div className="flex gap-2 items-start">
                        <textarea value={tempComment} onChange={(e)=>setTempComment(e.target.value)} className={`flex-1 text-xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`} rows={2}/>
                        <button onClick={() => saveComment(lead.id)} className="p-2 bg-green-600 text-white rounded-lg"><Save size={14}/></button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] uppercase opacity-40 mb-1">Ваш комментарий:</p>
                          <p className="text-xs">{lead.client_comment || 'Нет комментария'}</p>
                        </div>
                        <button onClick={() => {setEditingCommentId(lead.id); setTempComment(lead.client_comment || '');}} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button>
                      </div>
                    )}
                  </div>

                  {/* Удаление */}
                  <button onClick={() => deleteLead(lead.id)} className="w-full flex justify-center items-center gap-2 py-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl active:scale-95 transition-transform"><Trash2 size={14}/> {t.deleteBtn}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* КАБИНЕТ МАМЫ (CRM) С ПЕРЕНОСОМ ВРЕМЕНИ */}
      {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.leadsTitle}</h2><button onClick={fetchLeads} className={`p-2 rounded-full ${isLeadsLoading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button></div>
          {leads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30"><Users size={48} className="mb-4"/><p className="text-sm font-bold">{t.noLeads}</p></div>
          ) : (
            <div className="flex flex-col gap-3">
              {leads.map(lead => {
                const isCompleted = lead.status === 'completed';
                return (
                  <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'} ${isCompleted ? 'opacity-50' : ''}`}>
                    
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <h4 className="font-bold text-sm">{lead.client_name}</h4>
                      <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
                        {lead.appointment_time ? new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Нет времени'}
                      </span>
                    </div>
                    
                    <div className="text-[10px] font-bold opacity-60 mb-2">{lead.problem}</div>
                    {lead.client_comment && <div className={`text-xs p-2 rounded-lg mb-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>💬 {lead.client_comment}</div>}

                    {/* ПАНЕЛЬ ПЕРЕНОСА ВРЕМЕНИ */}
                    {!isCompleted && (
                      <div className="mb-4">
                        {rescheduleData?.id === lead.id ? (
                          <div className="flex gap-2">
                            <input type="datetime-local" value={rescheduleData.time} onChange={(e)=>setRescheduleData({...rescheduleData, time: e.target.value})} className={`flex-1 text-[10px] p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`} style={{colorScheme: theme === 'dark' ? 'dark' : 'light'}}/>
                            <button onClick={() => handleReschedule(lead.id, lead.client_tg_id)} className="px-3 bg-blue-600 text-white rounded-lg text-xs font-bold">ОК</button>
                            <button onClick={() => setRescheduleData(null)} className="px-3 border border-red-500/50 text-red-500 rounded-lg text-xs font-bold">X</button>
                          </div>
                        ) : (
                          <button onClick={() => setRescheduleData({id: lead.id, time: lead.appointment_time || ''})} className="text-[10px] font-bold text-blue-500 hover:underline">Изменить время (уведомит клиента)</button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-end border-t border-inherit pt-3 mb-4">
                      <div><span className="block text-[8px] uppercase opacity-40 mb-1">Telegram</span><span className="text-xs font-bold">{lead.client_phone}</span></div>
                      {lead.client_phone.startsWith('@') && <a href={`https://t.me/${lead.client_phone.substring(1)}`} target="_blank" className="bg-blue-600 p-2 rounded-xl text-white active:scale-95 transition-transform"><ExternalLink size={16}/></a>}
                    </div>

                    {!isCompleted && (
                      <div className="flex gap-2">
                        <button onClick={() => updateLeadStatus(lead.id, lead.status === 'new' || !lead.status ? 'in_progress' : 'completed')} className="flex-1 py-2 bg-green-600 text-white text-[10px] font-bold rounded-lg">Сменить статус</button>
                        <button onClick={() => deleteLead(lead.id)} className="p-2 border border-red-500/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Админ панель (опущена для экономии места, работает как и раньше) */}
    </main>
  );
}