"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play, Calendar, Trash2, Edit3, Save, ShoppingBag, Package } from "lucide-react";
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
    aboutApp: "Что такое OnAyak?", support: "Поддержка / Фидбек", langTitle: "Язык / Тіл", themeTitle: "Тема оформления", dark: "Темная", light: "Светлая",
    modalTitle: "Запись на прием", nameLabel: "Ваше имя", problemLabel: "Выберите проблему:", submitBtn: "Отправить заявку",
    submitting: "Отправка...", successMsg: "Успешно! Мы свяжемся с вами.", 
    problems: ["Вросший ноготь", "Грибок ногтей/стопы", "Мозоли и натоптыши", "Трещины", "Диабетическая стопа", "Просто консультация"],
    aboutHeadline: "Цифровой Сервис", aboutText: "OnAyak — это инновационная платформа для автоматизации центров подологии.",
    leadsTitle: "Входящие заявки", noLeads: "Пока заявок нет", detectedTg: "Ваш Telegram:",
    termsTitle: "Пользовательское соглашение", acceptTermsBtn: "Принять и продолжить",
    termsText: "Используя сервис OnAyak, вы даете согласие на сбор и обработку ваших данных исключительно в целях оказания профессиональных услуг центром Podology MK. Сервис не оказывает медицинских услуг.",
    status_new: "Новая", status_progress: "В работе", status_completed: "Завершено",
    dateLabel: "Желаемая дата и время:", commentLabel: "Комментарий (необязательно):",
    myLeads: "Мои записи", deleteBtn: "Отменить", saveBtn: "Сохранить",
    shopTab: "МАГАЗИН", shopTitle: "Профессиональный уход", orderBtn: "Оставить запрос",
    products: [
      { id: 1, name: "Увлажняющие мази и крема", desc: "Для сухой кожи и глубоких трещин на пятках" },
      { id: 2, name: "Пудры и спреи", desc: "Контроль потливости и неприятного запаха" },
      { id: 3, name: "Противогрибковые средства", desc: "Капли и сыворотки для профилактики и защиты" }
    ],
    deliveryModalTitle: "Запрос на средство", productLabel: "Что вас интересует?",
  },
  kz: {
    subtitle: "Подология орталығы", verified: "OnAyak растаған", address: "Ақтөбе, Әлия Молдағұлова көшесі, 54а",
    appointment: "Алдын ала жазылу бойынша қабылдау", insta: "Біздің Instagram", applyBtn: "Қабылдауға өтінім қалдыру",
    netTitle: "Ұлттық желі", active: "Белсенді", noCenters: "Әзірге орталықтар жоқ", aboutTitle: "Қосымша туралы",
    aboutApp: "OnAyak деген не?", support: "Қолдау / Кері байланыс", langTitle: "Тіл / Язык", themeTitle: "Тақырып", dark: "Қараңғы", light: "Жарық",
    modalTitle: "Қабылдауға жазылу", nameLabel: "Атыңыз", problemLabel: "Мәселені таңдаңыз:", submitBtn: "Өтінімді жіберу",
    submitting: "Жіберілуде...", successMsg: "Жіберілді! Біз сізбен хабарласамыз.",
    problems: ["Тырнақтың етке өсуі", "Саңырауқұлақ", "Сүйел және мүйізгек", "Жарықтар", "Диабеттік табан", "Жай консультация"],
    aboutHeadline: "Цифрлық Сервис", aboutText: "OnAyak — бұл кәсіби подология орталықтарын автоматтандыруға арналған инновациялық платформа.",
    leadsTitle: "Кіріс өтінімдер", noLeads: "Өтінімдер жоқ", detectedTg: "Сіздің Telegram:",
    termsTitle: "Қолдану ережелері", acceptTermsBtn: "Қабылдау және жалғастыру",
    termsText: "OnAyak сервисін пайдалана отырып, сіз Podology MK орталығының қызметтерін көрсету мақсатында деректеріңізді жинауға келісім бересіз. Сервис медициналық қызметтер көрсетпейді.",
    status_new: "Жаңа", status_progress: "Өңделуде", status_completed: "Аяқталды",
    dateLabel: "Қалаған күн мен уақыт:", commentLabel: "Қосымша пікір (міндетті емес):",
    myLeads: "Менің жазбаларым", deleteBtn: "Болдырмау", saveBtn: "Сақтау",
    shopTab: "ДҮКЕН", shopTitle: "Кәсіби күтім", orderBtn: "Сұраныс қалдыру",
    products: [
      { id: 1, name: "Ылғалдандыратын жақпа майлар", desc: "Құрғақ теріге және өкшедегі жарықтарға арналған" },
      { id: 2, name: "Опалар мен спрейлер", desc: "Терлеуді және жағымсыз иісті бақылау" },
      { id: 3, name: "Саңырауқұлаққа қарсы құралдар", desc: "Профилактика мен қорғанысқа арналған тамшылар" }
    ],
    deliveryModalTitle: "Құралға сұраныс", productLabel: "Сізді не қызықтырады?",
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "shop" | "dashboard" | "admin_panel" | "my_leads">("main");
  const [lang, setLang] = useState<"ru" | "kz" | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
          } catch (e) { console.error("Sync error", e); }
        }
      }
    };
    initApp();
  }, []);

  const fetchLeads = async () => {
    setIsLeadsLoading(true);
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (activeTab === "my_leads" && tgUser?.id) query = query.eq('client_tg_id', tgUser.id);
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
    if(!confirm("Удалить?")) return;
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
    try {
      const { error } = await supabase.from('leads').update({ appointment_time: rescheduleData.time }).eq('id', id);
      if (error) throw new Error(error.message);
      setLeads(leads.map(lead => lead.id === id ? { ...lead, appointment_time: rescheduleData.time } : lead));
      setRescheduleData(null);
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reschedule', newDate: rescheduleData.time, client_tg_id: clientTgId }),
      });
      alert("Время успешно перенесено. Клиент уведомлен!");
    } catch (err: any) { alert("Ошибка: " + err.message); }
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

  const handleSubmit = async (e: React.FormEvent, type: 'appointment' | 'delivery') => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dbPayload: any = {
        client_name: formData.name, client_phone: tgContact, client_comment: formData.comment,
        client_tg_id: tgUser?.id, lead_type: type
      };
      if (type === 'appointment') { dbPayload.problem = formData.problem; dbPayload.appointment_time = formData.date; }
      else { dbPayload.problem = selectedProduct; }

      const { error } = await supabase.from('leads').insert([dbPayload]);
      if (error) throw error;
      
      const apiPayload = type === 'appointment' 
        ? { action: 'new_lead', name: formData.name, problem: formData.problem, contact: tgContact, date: formData.date, comment: formData.comment }
        : { action: 'new_delivery', name: formData.name, product: selectedProduct, contact: tgContact, comment: formData.comment };

      await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
      setIsSuccess(true);
      setTimeout(() => { setIsModalOpen(false); setIsDeliveryModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "", date: "", comment: "" }); setSelectedProduct(""); }, 3000);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!lang) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <Globe size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-8">Тілді таңдаңыз</h1>
          <div className="flex flex-col gap-3">
            <button onClick={() => handleLangSelect("kz")} className={`w-full py-4 rounded-xl font-bold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}>Қазақ тілі</button>
            <button onClick={() => handleLangSelect("ru")} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold">Русский язык</button>
          </div>
        </div>
      </main>
    );
  }

  if (lang && !hasAcceptedTerms) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <ScrollText size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-xl font-black mb-4">{t.termsTitle}</h1>
          <div className={`p-4 rounded-xl mb-6 text-xs text-left border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>{t.termsText}</div>
          <button onClick={handleAcceptTerms} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold"><CheckCircle2 size={18} className="inline" /> {t.acceptTermsBtn}</button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`p-4 flex justify-between items-center sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setIsMenuOpen(true)} className="p-1"><Menu size={24} /></button>
        <h1 className="text-lg font-black text-blue-500">OnAyak</h1>
        <div className="w-8"></div>
      </header>

      <div className={`p-3 flex gap-2 border-b overflow-x-auto custom-scrollbar ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setActiveTab("main")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white" : "opacity-40"}`}>ВИТРИНА</button>
        <button onClick={() => setActiveTab("shop")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "shop" ? "bg-pink-600 text-white" : "opacity-40"}`}><ShoppingBag size={14}/> {t.shopTab}</button>
        <button onClick={() => setActiveTab("my_leads")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "my_leads" ? "bg-green-600 text-white" : "opacity-40"}`}><Calendar size={14}/> {t.myLeads.toUpperCase()}</button>
        {(userRole === "director" || userRole === "admin") && <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white" : "opacity-40"}`}><UserCog size={14}/> CRM (DIRECTOR)</button>}
        {userRole === "admin" && <button onClick={() => setActiveTab("admin_panel")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "admin_panel" ? "bg-red-600 text-white" : "opacity-40"}`}><Database size={14}/> ANALYTICS</button>}
      </div>

      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className={`border p-6 rounded-3xl relative overflow-hidden mt-2 shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div><h2 className="font-black text-xl mb-1">Podology MK</h2><p className="text-xs text-blue-500 font-bold uppercase">{t.subtitle}</p></div>
            <div className="flex items-center gap-1.5 mb-4 mt-2 text-blue-500 font-bold text-[10px]"><BadgeCheck size={14} /> {t.verified}</div>
            <div className="space-y-2 mb-6 opacity-70 text-sm"><p className="flex items-center gap-2"><MapPin size={14} /> {t.address}</p></div>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-xl active:scale-95 transition-transform">{t.applyBtn}</button>
          </div>
        </div>
      )}

      {activeTab === "shop" && (
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4"><ShoppingBag className="text-pink-500" size={24}/><h2 className="text-xl font-black">{t.shopTitle}</h2></div>
          <div className="flex flex-col gap-4">
            {t.products.map(prod => (
              <div key={prod.id} className={`p-5 rounded-3xl border flex flex-col gap-3 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div><h3 className="font-bold text-sm mb-1">{prod.name}</h3><p className="text-[10px] opacity-60 leading-relaxed">{prod.desc}</p></div>
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-50'} text-pink-500`}><Package size={20}/></div>
                </div>
                <button onClick={() => { setSelectedProduct(prod.name); setIsDeliveryModalOpen(true); }} className={`w-full py-3 mt-2 rounded-xl text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>{t.orderBtn}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my_leads" && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.myLeads}</h2><button onClick={fetchLeads} className={`p-2 rounded-full ${isLeadsLoading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button></div>
          {leads.length === 0 ? (<div className="flex-1 flex flex-col items-center justify-center opacity-30"><Calendar size={48} className="mb-4"/><p className="text-sm font-bold">{t.noLeads}</p></div>) : (
            <div className="flex flex-col gap-3">
              {leads.map(lead => (
                <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}>
                  <div className="absolute top-4 right-4 opacity-20">{lead.lead_type === 'delivery' ? <Package size={40}/> : <Calendar size={40}/>}</div>
                  <div className={`inline-block text-[8px] font-bold px-2 py-1 rounded-md mb-2 uppercase ${(!lead.status || lead.status === 'new') ? 'bg-yellow-500/20 text-yellow-500' : lead.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>{(!lead.status || lead.status === 'new') ? t.status_new : lead.status === 'in_progress' ? t.status_progress : t.status_completed}</div>
                  <h4 className="font-bold text-sm mb-1 pr-10">{lead.problem}</h4>
                  {lead.lead_type !== 'delivery' && (<p className="text-xs font-mono text-blue-500 mb-3">{lead.appointment_time ? new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Время не указано'}</p>)}
                  <div className={`p-3 rounded-xl border mb-4 mt-2 ${theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    {editingCommentId === lead.id ? (
                      <div className="flex gap-2 items-start"><textarea value={tempComment} onChange={(e)=>setTempComment(e.target.value)} className={`flex-1 text-xs p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`} rows={2}/><button onClick={() => saveComment(lead.id)} className="p-2 bg-green-600 text-white rounded-lg"><Save size={14}/></button></div>
                    ) : (
                      <div className="flex justify-between items-start"><div><p className="text-[8px] uppercase opacity-40 mb-1">Ваш комментарий:</p><p className="text-xs">{lead.client_comment || 'Нет комментария'}</p></div><button onClick={() => {setEditingCommentId(lead.id); setTempComment(lead.client_comment || '');}} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button></div>
                    )}
                  </div>
                  <button onClick={() => deleteLead(lead.id)} className="w-full flex justify-center items-center gap-2 py-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl active:scale-95 transition-transform"><Trash2 size={14}/> {t.deleteBtn}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.leadsTitle}</h2><button onClick={fetchLeads} className={`p-2 rounded-full ${isLeadsLoading ? 'animate-spin' : ''}`}><RefreshCw size={18}/></button></div>
          {leads.length === 0 ? (<div className="flex-1 flex flex-col items-center justify-center opacity-30"><Users size={48} className="mb-4"/><p className="text-sm font-bold">{t.noLeads}</p></div>) : (
            <div className="flex flex-col gap-3">
              {leads.map(lead => {
                const isCompleted = lead.status === 'completed';
                const isNew = !lead.status || lead.status === 'new';
                const isProgress = lead.status === 'in_progress';
                const isDelivery = lead.lead_type === 'delivery';
                return (
                  <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'} ${isCompleted ? 'opacity-50' : ''}`}>
                    <div className={`absolute top-0 right-0 text-[8px] font-bold px-3 py-1 rounded-bl-lg uppercase ${isNew ? 'bg-yellow-500/20 text-yellow-500' : isProgress ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>{isNew ? t.status_new : isProgress ? t.status_progress : t.status_completed}</div>
                    <div className="flex justify-between items-start mb-2 mt-1">
                      <div className="flex items-center gap-2">{isDelivery ? <Package size={16} className="text-pink-500"/> : <Calendar size={16} className="text-blue-500"/>}<h4 className="font-bold text-sm">{lead.client_name}</h4></div>
                      {!isDelivery && (<span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md mt-6">{lead.appointment_time ? new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Нет времени'}</span>)}
                    </div>
                    <div className="text-[10px] font-bold opacity-60 mb-2">{lead.problem}</div>
                    {lead.client_comment && <div className={`text-xs p-2 rounded-lg mb-3 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>💬 {lead.client_comment}</div>}
                    {!isCompleted && !isDelivery && (
                      <div className="mb-4">
                        {rescheduleData?.id === lead.id ? (
                          <div className="flex gap-2"><input type="datetime-local" value={rescheduleData.time} onChange={(e)=>setRescheduleData({...rescheduleData, time: e.target.value})} className={`flex-1 text-[10px] p-2 rounded-lg border outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`} style={{colorScheme: theme === 'dark' ? 'dark' : 'light'}}/><button onClick={() => handleReschedule(lead.id, lead.client_tg_id)} className="px-3 bg-blue-600 text-white rounded-lg text-xs font-bold">ОК</button><button onClick={() => setRescheduleData(null)} className="px-3 border border-red-500/50 text-red-500 rounded-lg text-xs font-bold">X</button></div>
                        ) : (<button onClick={() => setRescheduleData({id: lead.id, time: lead.appointment_time ? lead.appointment_time.substring(0, 16) : ''})} className="text-[10px] font-bold text-blue-500 hover:underline">Изменить время (уведомит клиента)</button>)}
                      </div>
                    )}
                    <div className="flex justify-between items-end border-t border-inherit pt-3 mb-4 mt-2">
                      <div><span className="block text-[8px] uppercase opacity-40 mb-1">Telegram</span><span className="text-xs font-bold">{lead.client_phone}</span></div>
                      {lead.client_phone.startsWith('@') && <a href={`https://t.me/${lead.client_phone.substring(1)}`} target="_blank" className="bg-blue-600 p-2 rounded-xl text-white active:scale-95 transition-transform"><ExternalLink size={16}/></a>}
                    </div>
                    <div className="flex gap-2">
                      {isNew && <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"><Play size={12}/> В работу</button>}
                      {isProgress && <button onClick={() => updateLeadStatus(lead.id, 'completed')} className="flex-1 py-2 bg-green-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"><Check size={12}/> Завершить</button>}
                      <button onClick={() => deleteLead(lead.id)} className="p-2 border border-red-500/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "admin_panel" && userRole === "admin" && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-black text-red-500">FOUNDER ANALYTICS</h2>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}><BarChart3 size={20} className="text-blue-500 mb-2"/><p className="text-[10px] opacity-50 uppercase font-bold mb-1">Просмотры</p><p className="text-xl font-black">---</p></div>
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}><Users size={20} className="text-green-500 mb-2"/><p className="text-[10px] opacity-50 uppercase font-bold mb-1">Конверсия</p><p className="text-xl font-black">---</p></div>
          </div>
          <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#111] border-red-500/20' : 'bg-white border-red-200'}`}>
            <p className="text-[10px] uppercase font-bold opacity-50 mb-3">Системный статус</p>
            <div className="flex justify-between mb-3 text-xs border-b border-inherit pb-2"><span className="opacity-60">Supabase DB</span><span className="text-green-500 font-bold">ONLINE</span></div>
            <div className="flex justify-between text-xs border-b border-inherit pb-2 mb-2"><span className="opacity-60">Active Role</span><span className="font-bold text-red-500">ADMIN</span></div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (<div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>) : (
              <><h3 className="text-xl font-black mb-6">{t.modalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'appointment')} className="flex flex-col gap-4">
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.dateLabel}</label><input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} style={{colorScheme: theme === 'dark' ? 'dark' : 'light'}}/></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.problemLabel}</label><div className="flex flex-wrap gap-2">{t.problems.map((prob, idx) => (<button key={idx} type="button" onClick={() => setFormData({...formData, problem: prob})} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-40"}`}>{prob}</button>))}</div></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.commentLabel}</label><textarea rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="..." /></div>
                  <button type="submit" disabled={isSubmitting || !formData.problem || !formData.date} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg transition-all">{isSubmitting ? t.submitting : t.submitBtn}</button>
                </form></>)}
          </div>
        </div>
      )}

      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-pink-500/20' : 'bg-white border-pink-200'}`}>
            <button onClick={() => setIsDeliveryModalOpen(false)} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (<div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>) : (
              <><div className="w-12 h-12 bg-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center mb-4"><Package size={24}/></div><h3 className="text-xl font-black mb-1">{t.deliveryModalTitle}</h3><p className="text-xs opacity-60 mb-6">Администратор уточнит наличие и свяжется с вами.</p>
                <form onSubmit={(e) => handleSubmit(e, 'delivery')} className="flex flex-col gap-4">
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.productLabel}</label><div className="flex flex-wrap gap-2">{t.products.map((prob) => (<button key={prob.id} type="button" onClick={() => setSelectedProduct(prob.name)} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${selectedProduct === prob.name ? "bg-pink-600 border-pink-600 text-white shadow-md" : "opacity-40"}`}>{prob.name}</button>))}</div></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">Уточнения:</label><textarea rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="..." /></div>
                  <button type="submit" disabled={isSubmitting || !selectedProduct} className="w-full py-4 mt-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg shadow-pink-500/20 transition-all">{isSubmitting ? t.submitting : "Отправить запрос"}</button>
                </form></>)}
          </div>
        </div>
      )}

      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className={`border rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4"><X size={24} /></button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Activity size={32} className="text-white" /></div>
              <h2 className="text-3xl font-black mb-1">OnAyak</h2>
              <p className="text-sm opacity-70 mb-8">{t.aboutText}</p>
              <div className={`border rounded-xl p-3 flex justify-between items-center ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-left"><p className="text-[10px] opacity-40 uppercase">Version</p><p className="text-sm font-bold">1.2.2 Pro</p></div>
                <ShieldCheck size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* БОКОВОЕ МЕНЮ (ТЕПЕРЬ ВНУТРИ SCOPE) */}
      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] border-r z-50 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="p-5 flex justify-between items-center border-b border-inherit"><h2 className="text-xl font-black text-blue-500">OnAyak</h2><button onClick={() => setIsMenuOpen(false)}><X size={24} /></button></div>
        <div className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.themeTitle}</p><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-full flex items-center justify-between p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}><span className="text-sm font-bold flex items-center gap-2">{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}{theme === 'dark' ? t.dark : t.light}</span><div className={`w-8 h-4 rounded-full relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div></div></button></div>
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.langTitle}</p><div className="flex bg-inherit rounded-lg p-1 border border-inherit"><button onClick={() => handleLangSelect("ru")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "ru" ? "bg-blue-600 text-white" : "opacity-40"}`}>RU</button><button onClick={() => handleLangSelect("kz")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "kz" ? "bg-blue-600 text-white" : "opacity-40"}`}>KZ</button></div></div>
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.netTitle}</p><div className="flex flex-col gap-2">{CITIES_KZ.map(city => (<div key={city} className={`flex justify-between items-center py-2 border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}><span className={`text-sm ${city === "Актобе" ? "font-bold" : "opacity-40"}`}>{city === "Актобе" && lang === "kz" ? "Ақтөбе" : city}</span>{city === "Актобе" ? <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">{t.active}</span> : <span className="text-[10px] opacity-20">{t.noCenters}</span>}</div>))}</div></div>
          <button onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }} className="flex items-center gap-3 text-sm font-bold"><Info size={16} className="text-blue-500" /> {t.aboutApp}</button>
          <a href="mailto:kandykbayevtagir@gmail.com" className="flex items-center gap-3 text-sm font-bold"><Mail size={16} className="text-blue-500" /> {t.support}</a>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
    </main>
  );
}