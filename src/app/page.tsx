"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play, Calendar, Trash2, Edit3, Save, ShoppingBag, Package, Archive, Clock, Coffee, Bell, Banknote, ChevronRight } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

const DIRECTOR_ID = 5720865346;
const ADMIN_ID = 5623597772;
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

// ОЦИФРОВАННЫЙ ПРАЙС-ЛИСТ
const PRICE_LIST = [
  {
    category: "Аппаратный педикюр",
    items: [
      { name: "Гигиеническая обработка стопы", price: "12.000 ₸" },
      { name: "Обработка стоп+ногтей с онихомикозом", price: "15.000 - 20.000 ₸" },
      { name: "Зачистка онихомикоза (1 ноготь)", price: "7.000 ₸" },
    ]
  },
  {
    category: "Вросший ноготь",
    items: [
      { name: "Удаление 1 сегмента (без воспаления)", price: "7.000 ₸" },
      { name: "Удаление 1 сегмента (с воспалением)", price: "10.000 ₸" },
      { name: "Тампонирование", price: "1.000 ₸" }
    ]
  },
  {
    category: "Ортониксия (Титановая нить)",
    items: [
      { name: "Установка титановой нити", price: "12.000 ₸" },
      { name: "Двойная титановая нить", price: "18.000 ₸" },
      { name: "Коррекция титановой нити", price: "6.000 ₸" }
    ]
  },
  {
    category: "Стельки и осмотр",
    items: [
      { name: "Индивидуальные стельки (взрослые)", price: "18.000 ₸" },
      { name: "Контрольный осмотр / Перевязка", price: "3.000 - 3.200 ₸" },
      { name: "Выезд специалиста на дом", price: "от 15.000 ₸" }
    ]
  }
];

const DICT = {
  ru: {
    subtitle: "Центр Подологии", verified: "Verified by OnAyak", address: "Актобе, ул. Алии Молдагуловой 54а",
    appointment: "Прием по предварительной записи", insta: "Наш Instagram", applyBtn: "Оставить заявку",
    netTitle: "Национальная сеть", active: "Активно", noCenters: "Пока нет центров", aboutTitle: "О приложении",
    aboutApp: "Что такое OnAyak?", support: "Поддержка / Фидбек", langTitle: "Язык / Тіл", themeTitle: "Тема оформления", dark: "Темная", light: "Светлая",
    modalTitle: "Запись на прием", nameLabel: "Ваше имя", problemLabel: "Выберите проблему:", submitBtn: "Отправить заявку",
    submitting: "Отправка...", successMsg: "Успешно! Мы свяжемся с вами.", 
    problems: ["Вросший ноготь", "Грибок ногтей/стопы", "Мозоли и натоптыши", "Трещины", "Диабетическая стопа", "Просто консультация"],
    aboutHeadline: "Цифровой Сервис", aboutText: "OnAyak — это инновационная платформа для автоматизации центров подологии.",
    leadsTitle: "CRM: Управление", noLeads: "Заявок нет", detectedTg: "Ваш Telegram:",
    termsTitle: "Пользовательское соглашение", acceptTermsBtn: "Принять и продолжить",
    termsText: "Используя сервис OnAyak, вы даете согласие на обработку данных для оказания услуг.",
    status_new: "Новая", status_progress: "В работе", status_completed: "Завершено",
    dateLabel: "Желаемая дата и время:", commentLabel: "Комментарий (необязательно):",
    myLeads: "Профиль", deleteBtn: "Отменить", saveBtn: "Сохранить",
    shopTab: "МАГАЗИН", shopTitle: "Профессиональный уход", orderBtn: "Оставить запрос",
    products: [
      { id: 1, name: "Увлажняющие мази и крема", desc: "Для сухой кожи и глубоких трещин на пятках" },
      { id: 2, name: "Пудры и спреи", desc: "Контроль потливости и неприятного запаха" },
      { id: 3, name: "Противогрибковые средства", desc: "Капли и сыворотки для профилактики и защиты" }
    ],
    deliveryModalTitle: "Заказ товара", productLabel: "Выбранный товар:",
    tabActive: "Активные", tabDone: "Архив",
    tabAppointments: "Записи", tabOrders: "Заказы",
    notifications: "Уведомления", emptyNotif: "Нет новых уведомлений",
    priceTab: "ПРАЙС", priceTitle: "Услуги и цены", priceDisclaimer: "*Точная стоимость определяется специалистом после очного осмотра.",
    // НОВЫЕ СТРОКИ: ИНФО О КЛИНИКЕ
    clinicInfoTitle: "О центре Podology MK",
    clinicInfoExperience: "Более 10 лет опыта работы",
    clinicInfoMed: "Специалисты с медицинским образованием",
    clinicInfoTech: "Передовое оборудование и 100% стерилизация",
    clinicInfoNote: "Центр оказывает профессиональные подологические и эстетические услуги."
  },
  kz: {
    subtitle: "Подология орталығы", verified: "OnAyak растаған", address: "Ақтөбе, Әлия Молдағұлова көшесі, 54а",
    appointment: "Алдын ала жазылу бойынша қабылдау", insta: "Біздің Instagram", applyBtn: "Өтінім қалдыру",
    netTitle: "Ұлттық желі", active: "Белсенді", noCenters: "Әзірге орталықтар жоқ", aboutTitle: "Қосымша туралы",
    aboutApp: "OnAyak деген не?", support: "Қолдау / Кері байланыс", langTitle: "Тіл / Язык", themeTitle: "Тақырып", dark: "Қараңғы", light: "Жарық",
    modalTitle: "Қабылдауға жазылу", nameLabel: "Атыңыз", problemLabel: "Мәселені таңдаңыз:", submitBtn: "Өтінімді жіберу",
    submitting: "Жіберілуде...", successMsg: "Жіберілді! Біз сізбен хабарласамыз.",
    problems: ["Тырнақтың етке өсуі", "Саңырауқұлақ", "Сүйел және мүйізгек", "Жарықтар", "Диабеттік табан", "Жай консультация"],
    aboutHeadline: "Цифрлық Сервис", aboutText: "OnAyak — бұл кәсіби подология орталықтарын автоматтандыруға арналған инновациялық платформа.",
    leadsTitle: "CRM: Басқару", noLeads: "Өтінімдер жоқ", detectedTg: "Сіздің Telegram:",
    termsTitle: "Қолдану ережелері", acceptTermsBtn: "Қабылдау және жалғастыру",
    termsText: "OnAyak сервисін пайдалана отырып, сіз деректеріңізді жинауға келісім бересіз.",
    status_new: "Жаңа", status_progress: "Өңделуде", status_completed: "Аяқталды",
    dateLabel: "Қалаған күн мен уақыт:", commentLabel: "Қосымша пікір (міндетті емес):",
    myLeads: "Профиль", deleteBtn: "Болдырмау", saveBtn: "Сақтау",
    shopTab: "ДҮКЕН", shopTitle: "Кәсіби күтім", orderBtn: "Сұраныс қалдыру",
    products: [
      { id: 1, name: "Ылғалдандыратын жақпа майлар", desc: "Құрғақ теріге және өкшедегі жарықтарға арналған" },
      { id: 2, name: "Опалар мен спрейлер", desc: "Терлеуді және жағымсыз иісті бақылау" },
      { id: 3, name: "Саңырауқұлаққа қарсы құралдар", desc: "Профилактика мен қорғанысқа арналған тамшылар" }
    ],
    deliveryModalTitle: "Тауарға тапсырыс", productLabel: "Таңдалған тауар:",
    tabActive: "Белсенді", tabDone: "Мұрағат",
    tabAppointments: "Жазбалар", tabOrders: "Тапсырыстар",
    notifications: "Хабарламалар", emptyNotif: "Жаңа хабарламалар жоқ",
    priceTab: "БАҒАЛАР", priceTitle: "Қызметтер мен бағалар", priceDisclaimer: "*Нақты құнын маман бетпе-бет қараудан кейін анықтайды.",
    // НОВЫЕ СТРОКИ: ИНФО О КЛИНИКЕ
    clinicInfoTitle: "Podology MK орталығы",
    clinicInfoExperience: "10 жылдан астам тәжірибе",
    clinicInfoMed: "Медициналық білімі бар мамандар",
    clinicInfoTech: "Озық жабдықтар және 100% стерилизация",
    clinicInfoNote: "Кәсіби подологиялық және эстетикалық қызметтер көрсетеміз."
  }
};

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "prices" | "shop" | "my_leads" | "dashboard" | "admin_panel">("main");
  const [crmSubTab, setCrmSubTab] = useState<"active" | "done">("active");
  const [clientSubTab, setClientSubTab] = useState<"appointments" | "orders">("appointments");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [lang, setLang] = useState<"ru" | "kz" | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isClinicInfoOpen, setIsClinicInfoOpen] = useState(false); // НОВЫЙ СТЕЙТ ДЛЯ ИНФО
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

  const triggerHaptic = useCallback((style: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp?.HapticFeedback) {
      const haptic = (window as any).Telegram.WebApp.HapticFeedback;
      if (['light', 'medium', 'heavy'].includes(style)) haptic.impactOccurred(style);
      else haptic.notificationOccurred(style);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      const savedLang = localStorage.getItem('onayak_lang');
      const savedTerms = localStorage.getItem('onayak_terms');
      if (savedLang) setLang(savedLang as any);
      if (savedTerms === 'true') setHasAcceptedTerms(true);

      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready(); tg.expand();
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
    
    if ((userRole === "director" || userRole === "admin") && activeTab === "dashboard") {
      if (crmSubTab === "active") query = query.neq('status', 'completed');
      else query = query.eq('status', 'completed');
    } else if (tgUser?.id) {
      query = query.eq('client_tg_id', tgUser.id);
    } else {
      setIsLeadsLoading(false); return;
    }

    const { data, error } = await query;
    if (!error && data) setLeads(data);
    setIsLeadsLoading(false);
  };

  useEffect(() => {
    if (tgUser?.id) fetchLeads();
  }, [activeTab, crmSubTab, tgUser]);

  const updateLeadStatus = async (id: number, newStatus: string) => {
    triggerHaptic('medium');
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    if (!error) fetchLeads();
  };

  const deleteLead = async (id: number) => {
    triggerHaptic('heavy');
    if(!confirm("Удалить безвозвратно?")) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads(leads.filter(lead => lead.id !== id));
  };

  const saveComment = async (id: number) => {
    triggerHaptic('success');
    const { error } = await supabase.from('leads').update({ client_comment: tempComment }).eq('id', id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, client_comment: tempComment } : lead));
      setEditingCommentId(null);
    }
  };

  const handleReschedule = async (id: number, clientTgId: string) => {
    if (!rescheduleData || rescheduleData.id !== id) return;
    triggerHaptic('medium');
    try {
      const { error } = await supabase.from('leads').update({ appointment_time: rescheduleData.time }).eq('id', id);
      if (error) throw new Error(error.message);
      setLeads(leads.map(lead => lead.id === id ? { ...lead, appointment_time: rescheduleData.time } : lead));
      setRescheduleData(null);
      await fetch('/api/notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reschedule', newDate: rescheduleData.time, client_tg_id: clientTgId }),
      });
      triggerHaptic('success');
      alert("Время успешно перенесено. Клиент получил уведомление!");
    } catch (err: any) { triggerHaptic('error'); alert("Ошибка: " + err.message); }
  };

  const handleCoffeeRequest = async () => {
    triggerHaptic('medium');
    if(!confirm("Вы сейчас находитесь в клинике и хотите кофе/чай?")) return;
    try {
      await fetch('/api/notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'coffee_request', name: tgUser?.first_name || 'Клиент' }),
      });
      triggerHaptic('success');
      alert("Бариста уведомлен и уже готовит ваш напиток! ☕");
    } catch(err) { triggerHaptic('error'); alert("Ошибка отправки."); }
  };

  const switchTab = (tab: any) => { triggerHaptic('light'); setActiveTab(tab); };
  const switchLang = (selectedLang: "ru" | "kz") => { triggerHaptic('light'); setLang(selectedLang); localStorage.setItem('onayak_lang', selectedLang); };

  const handleAcceptTerms = async () => {
    triggerHaptic('success');
    setHasAcceptedTerms(true);
    localStorage.setItem('onayak_terms', 'true');
    if (tgUser?.id) await supabase.from('profiles').update({ terms_accepted: true, lang: lang }).eq('tg_id', tgUser.id);
  };

  const t = lang ? DICT[lang] : DICT.ru;
  const tgContact = tgUser?.username ? `@${tgUser.username}` : (tgUser?.id ? `ID: ${tgUser.id}` : "Unknown");
  const clientLeads = leads.filter(l => l.client_tg_id === tgUser?.id);
  const hasActiveLeads = clientLeads.some(l => !l.status || l.status === 'new' || l.status === 'in_progress');

  const handleSubmit = async (e: React.FormEvent, type: 'appointment' | 'delivery') => {
    e.preventDefault();
    triggerHaptic('medium');
    setIsSubmitting(true);
    try {
      const dbPayload: any = { client_name: formData.name, client_phone: tgContact, client_comment: formData.comment, client_tg_id: tgUser?.id, lead_type: type, status: 'new' };
      if (type === 'appointment') { dbPayload.problem = formData.problem; dbPayload.appointment_time = formData.date; }
      else { dbPayload.problem = selectedProduct; }

      const { error } = await supabase.from('leads').insert([dbPayload]);
      if (error) throw error;
      
      const apiPayload = type === 'appointment' 
        ? { action: 'new_lead', name: formData.name, problem: formData.problem, contact: tgContact, date: formData.date, comment: formData.comment, client_tg_id: tgUser?.id }
        : { action: 'new_delivery', name: formData.name, product: selectedProduct, contact: tgContact, comment: formData.comment, client_tg_id: tgUser?.id };

      await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
      
      setIsSuccess(true);
      triggerHaptic('success');
      setTimeout(() => { setIsModalOpen(false); setIsDeliveryModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "", date: "", comment: "" }); setSelectedProduct(""); fetchLeads(); }, 3000);
    } catch (err: any) { triggerHaptic('error'); alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!lang) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
          <Globe size={48} className="text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-8">Тілді таңдаңыз</h1>
          <div className="flex flex-col gap-3">
            <button onClick={() => switchLang("kz")} className={`w-full py-4 rounded-xl font-bold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}>Қазақ тілі</button>
            <button onClick={() => switchLang("ru")} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold">Русский язык</button>
          </div>
        </div>
      </main>
    );
  }

  if (lang && !hasAcceptedTerms) {
    return (
      <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`border p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
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
        <button onClick={() => { triggerHaptic('light'); setIsMenuOpen(true); }} className="p-1"><Menu size={24} /></button>
        <h1 className="text-lg font-black text-blue-500">OnAyak</h1>
        <button onClick={() => { triggerHaptic('light'); setIsNotificationsOpen(true); }} className="p-1 relative">
          <Bell size={24} />
          {hasActiveLeads && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-inherit"></span>}
        </button>
      </header>

      <div className={`p-3 flex gap-2 border-b overflow-x-auto custom-scrollbar ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => switchTab("main")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-md" : "opacity-40"}`}>ВИТРИНА</button>
        <button onClick={() => switchTab("prices")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "prices" ? "bg-indigo-500 text-white shadow-md" : "opacity-40"}`}><Banknote size={14}/> {t.priceTab}</button>
        <button onClick={() => switchTab("shop")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "shop" ? "bg-pink-600 text-white shadow-md" : "opacity-40"}`}><ShoppingBag size={14}/> {t.shopTab}</button>
        <button onClick={() => switchTab("my_leads")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "my_leads" ? "bg-green-600 text-white shadow-md" : "opacity-40"}`}><Calendar size={14}/> {t.myLeads.toUpperCase()}</button>
        {(userRole === "director" || userRole === "admin") && <button onClick={() => switchTab("dashboard")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-md" : "opacity-40"}`}><UserCog size={14}/> {t.leadsTitle.toUpperCase()}</button>}
      </div>

      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className={`border p-6 rounded-3xl relative overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            {/* КЛИКАБЕЛЬНЫЙ ЗАГОЛОВОК С ИНФО О КЛИНИКЕ */}
            <div className="flex justify-between items-start mb-2 mt-2">
              <button onClick={() => { triggerHaptic('light'); setIsClinicInfoOpen(true); }} className="text-left flex items-center gap-1 active:opacity-70 transition-opacity">
                <div>
                  <h2 className="font-black text-xl flex items-center gap-1">{t.subtitle} <ChevronRight size={18} className="text-blue-500"/></h2>
                  <p className="text-xs text-blue-500 font-bold uppercase mt-1">Podology MK</p>
                </div>
              </button>
              <div className="bg-blue-500/10 px-2 py-1 rounded-lg flex items-center gap-1"><Star size={12} className="text-blue-500 fill-blue-500"/><span className="text-xs font-bold text-blue-500">5.0</span></div>
            </div>

            <div className="flex items-center gap-1.5 mb-4 mt-3 text-blue-500 font-bold text-[10px]"><BadgeCheck size={14} /> {t.verified}</div>
            <div className="space-y-2 mb-6 opacity-70 text-sm"><p className="flex items-center gap-2"><MapPin size={14} /> {t.address}</p></div>
            
            <a href="https://www.instagram.com/podology.mk" target="_blank" onClick={() => triggerHaptic('light')} className={`w-full flex justify-center items-center gap-2 py-3 border rounded-xl text-sm font-bold mb-3 transition-colors ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-pink-500' : 'bg-gray-50 border-gray-200 text-pink-600'}`}>
              <Instagram size={18} /> {t.insta}
            </a>

            {/* ОСНОВНЫЕ КНОПКИ ЗАПИСИ И ПРАЙСА */}
            <div className="flex gap-2">
              <button onClick={() => { triggerHaptic('medium'); setIsModalOpen(true); }} className="flex-1 py-4 bg-blue-600 text-white text-sm font-bold rounded-xl active:scale-95 transition-transform">{t.applyBtn}</button>
              <button onClick={() => switchTab("prices")} className={`px-4 flex items-center justify-center border rounded-xl active:scale-95 transition-transform ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'}`}>
                <Banknote size={20}/>
              </button>
            </div>
          </div>

          <button onClick={handleCoffeeRequest} className={`w-full p-4 rounded-3xl border flex items-center justify-between shadow-sm active:scale-95 transition-transform ${theme === 'dark' ? 'bg-[#111] border-white/5 hover:bg-[#1a1a1a]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center"><Coffee size={20}/></div>
              <div className="text-left"><h3 className="font-bold text-sm">Попросить кофе</h3><p className="text-[10px] opacity-60">Если вы уже в клинике</p></div>
            </div>
          </button>
        </div>
      )}

      {/* НОВАЯ ВКЛАДКА: ПРАЙС-ЛИСТ */}
      {activeTab === "prices" && (
        <div className="p-5 flex-1 flex flex-col pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Banknote className="text-indigo-500" size={24}/>
            <h2 className="text-xl font-black">{t.priceTitle}</h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {PRICE_LIST.map((category, idx) => (
              <div key={idx} className={`rounded-3xl border overflow-hidden shadow-sm ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className={`p-4 font-black text-sm border-b ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  {category.category}
                </div>
                <div className="flex flex-col">
                  {category.items.map((item, i) => (
                    <div key={i} className={`p-4 flex justify-between items-center text-xs border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                      <span className="opacity-80 pr-4">{item.name}</span>
                      <span className="font-bold whitespace-nowrap text-indigo-500">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-[10px] opacity-50 mt-6 px-4">{t.priceDisclaimer}</p>
        </div>
      )}

      {activeTab === "shop" && (
        <div className="p-5 flex-1 flex flex-col pb-10">
          <div className="flex items-center gap-2 mb-4"><ShoppingBag className="text-pink-500" size={24}/><h2 className="text-xl font-black">{t.shopTitle}</h2></div>
          <div className="flex flex-col gap-4">
            {t.products.map(prod => (
              <div key={prod.id} className={`p-5 rounded-3xl border flex flex-col gap-3 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div><h3 className="font-bold text-sm mb-1">{prod.name}</h3><p className="text-[10px] opacity-60 leading-relaxed">{prod.desc}</p></div>
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-50'} text-pink-500`}><Package size={20}/></div>
                </div>
                <button onClick={() => { triggerHaptic('medium'); setSelectedProduct(prod.name); setIsDeliveryModalOpen(true); }} className={`w-full py-3 mt-2 rounded-xl text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>{t.orderBtn}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my_leads" && (
        <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
          <div className="flex justify-between items-center bg-inherit border border-inherit rounded-2xl p-1 shadow-inner">
            <button onClick={() => {triggerHaptic('light'); setClientSubTab("appointments");}} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${clientSubTab === "appointments" ? "bg-green-600 text-white shadow-lg" : "opacity-40"}`}>{t.tabAppointments.toUpperCase()}</button>
            <button onClick={() => {triggerHaptic('light'); setClientSubTab("orders");}} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${clientSubTab === "orders" ? "bg-pink-600 text-white shadow-lg" : "opacity-40"}`}>{t.tabOrders.toUpperCase()}</button>
          </div>

          <div className="flex flex-col gap-3">
            {clientLeads.filter(l => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-10">
                 {clientSubTab === 'appointments' ? <Calendar size={48} className="mb-4"/> : <Package size={48} className="mb-4"/>}
                 <p className="text-sm font-bold">Пусто</p>
               </div>
            ) : (
              clientLeads.filter(l => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').map(lead => {
                const curStatus = lead.status || 'new';
                return (
                  <div key={lead.id} className={`p-4 rounded-2xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className={`inline-block text-[8px] font-bold px-2 py-1 rounded-md mb-2 uppercase ${curStatus === 'new' ? 'bg-yellow-500/20 text-yellow-500' : curStatus === 'in_progress' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>{curStatus === 'new' ? t.status_new : curStatus === 'in_progress' ? t.status_progress : t.status_completed}</div>
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
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && (
        <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
          <div className="flex justify-between items-center bg-inherit border border-inherit rounded-2xl p-1 shadow-inner">
            <button onClick={() => {triggerHaptic('light'); setCrmSubTab("active");}} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${crmSubTab === "active" ? "bg-blue-600 text-white shadow-lg" : "opacity-40"}`}>{t.tabActive.toUpperCase()}</button>
            <button onClick={() => {triggerHaptic('light'); setCrmSubTab("done");}} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${crmSubTab === "done" ? "bg-green-600 text-white shadow-lg" : "opacity-40"}`}>{t.tabDone.toUpperCase()}</button>
          </div>

          <div className="flex flex-col gap-3">
            {leads.map(lead => {
              const status = lead.status || 'new';
              const isNew = status === 'new';
              const isProgress = status === 'in_progress';
              const isCompleted = status === 'completed';
              const isDelivery = lead.lead_type === 'delivery';
              
              const contactUrl = lead.client_phone.startsWith('@') ? `https://t.me/${lead.client_phone.substring(1)}` : `tg://user?id=${lead.client_tg_id}`;

              return (
                <div key={lead.id} className={`p-5 rounded-3xl border relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {isDelivery ? <Package size={18} className="text-pink-500"/> : <Calendar size={18} className="text-blue-500"/>}
                      <h4 className="font-black text-sm">{lead.client_name}</h4>
                    </div>
                    <div className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${isNew ? 'bg-yellow-500/20 text-yellow-500' : isProgress ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                      {isNew ? t.status_new : isProgress ? t.status_progress : t.status_completed}
                    </div>
                  </div>

                  <div className="text-xs font-bold opacity-60 mb-3">{lead.problem}</div>
                  {lead.client_comment && <div className={`text-[10px] p-3 rounded-xl mb-4 italic ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>“{lead.client_comment}”</div>}

                  {!isDelivery && lead.appointment_time && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-blue-500 mb-6 bg-blue-500/5 p-2 rounded-lg flex">
                      <Clock size={14}/> {new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-inherit pt-4 mb-4">
                    <div><p className="text-[8px] uppercase font-bold opacity-40 mb-0.5">Клиент</p><p className="text-xs font-black">{lead.client_phone}</p></div>
                    <a href={contactUrl} target="_blank" onClick={() => triggerHaptic('light')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-2xl text-white text-[10px] font-black shadow-lg shadow-blue-500/30 active:scale-95">
                      <ExternalLink size={14}/> НАПИСАТЬ
                    </a>
                  </div>

                  <div className="flex gap-2">
                    {crmSubTab === "active" && (
                      <>
                        {isNew && <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="flex-1 py-3 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-xl border border-blue-500/20 active:scale-95">ВЗЯТЬ В РАБОТУ</button>}
                        {isProgress && <button onClick={() => updateLeadStatus(lead.id, 'completed')} className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-1 active:scale-95"><Check size={14}/> ЗАВЕРШИТЬ</button>}
                        <button onClick={() => deleteLead(lead.id)} className="p-3 border border-red-500/20 text-red-500 rounded-xl bg-red-500/5 active:scale-95"><Trash2 size={18}/></button>
                      </>
                    )}
                    {crmSubTab === "done" && (
                      <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="w-full py-3 border border-inherit text-[10px] font-black rounded-xl opacity-50 hover:opacity-100 transition-opacity active:scale-95">ВЕРНУТЬ ИЗ АРХИВА</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* МОДАЛКА: ИНФО О КЛИНИКЕ */}
      {isClinicInfoOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsClinicInfoOpen(false)}>
          <div className={`border rounded-3xl w-full max-w-sm p-6 relative shadow-2xl animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => { triggerHaptic('light'); setIsClinicInfoOpen(false); }} className="absolute top-4 right-4 bg-inherit border border-inherit p-1 rounded-full"><X size={20}/></button>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <Activity size={32} className="text-white"/>
            </div>
            <h3 className="text-xl font-black mb-4">{t.clinicInfoTitle}</h3>
            <div className="flex flex-col gap-3 mb-6">
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Star className="text-blue-500" size={20}/>
                <span className="text-sm font-bold">{t.clinicInfoExperience}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <ShieldCheck className="text-green-500" size={20}/>
                <span className="text-sm font-bold">{t.clinicInfoMed}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Activity className="text-purple-500" size={20}/>
                <span className="text-sm font-bold">{t.clinicInfoTech}</span>
              </div>
            </div>
            <p className="text-[10px] opacity-50 text-center uppercase tracking-wider">{t.clinicInfoNote}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsModalOpen(false); }} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (<div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>) : (
              <><h3 className="text-xl font-black mb-6">{t.modalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'appointment')} className="flex flex-col gap-4">
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.dateLabel}</label><input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} style={{colorScheme: theme === 'dark' ? 'dark' : 'light'}}/></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.problemLabel}</label><div className="flex flex-wrap gap-2">{t.problems.map((prob, idx) => (<button key={idx} type="button" onClick={() => { triggerHaptic('light'); setFormData({...formData, problem: prob}); }} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-40"}`}>{prob}</button>))}</div></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.commentLabel}</label><textarea rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="..." /></div>
                  <button type="submit" disabled={isSubmitting || !formData.problem || !formData.date} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : t.submitBtn}</button>
                </form></>)}
          </div>
        </div>
      )}

      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-6 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-pink-500/20' : 'bg-white border-pink-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsDeliveryModalOpen(false); }} className="absolute top-5 right-5"><X size={20} /></button>
            {isSuccess ? (<div className="text-center py-8"><CheckCircle2 size={56} className="text-green-500 mx-auto mb-4 animate-in zoom-in" /><h3 className="text-xl font-bold">{t.successMsg}</h3></div>) : (
              <><div className="w-12 h-12 bg-pink-500/20 text-pink-500 rounded-xl flex items-center justify-center mb-4"><Package size={24}/></div><h3 className="text-xl font-black mb-1">{t.deliveryModalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'delivery')} className="flex flex-col gap-4">
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.productLabel}</label><div className="flex flex-wrap gap-2">{t.products.map((prob) => (<button key={prob.id} type="button" onClick={() => { triggerHaptic('light'); setSelectedProduct(prob.name); }} className={`text-[10px] font-bold py-2 px-3 rounded-lg border transition-all ${selectedProduct === prob.name ? "bg-pink-600 border-pink-600 text-white shadow-md" : "opacity-40"}`}>{prob.name}</button>))}</div></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-50 mb-1">{t.commentLabel}</label><textarea rows={2} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Какая именно пудра/мазь нужна?" /></div>
                  <button type="submit" disabled={isSubmitting || !selectedProduct} className="w-full py-4 mt-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-xl text-white font-bold shadow-lg shadow-pink-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : "Отправить запрос"}</button>
                </form></>)}
          </div>
        </div>
      )}

      {isNotificationsOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col justify-end p-2 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}>
          <div className={`p-6 rounded-3xl w-full max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-4 shadow-2xl ${theme === 'dark' ? 'bg-[#111] border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2"><Bell className="text-blue-500"/> {t.notifications}</h3>
              <button onClick={() => { triggerHaptic('light'); setIsNotificationsOpen(false); }} className="bg-inherit border border-inherit p-2 rounded-full"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-3">
              {clientLeads.length === 0 ? (
                <p className="opacity-50 text-center py-8 text-sm font-bold">{t.emptyNotif}</p>
              ) : (
                clientLeads.map(lead => {
                  const isDeliv = lead.lead_type === 'delivery';
                  const curStat = lead.status || 'new';
                  return (
                    <div key={lead.id} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {isDeliv ? <Package size={14} className="text-pink-500"/> : <Calendar size={14} className="text-blue-500"/>}
                        <span className="font-black text-sm">{lead.problem}</span>
                      </div>
                      <p className="text-xs font-bold opacity-70">
                        {curStat === 'completed' ? '✅ Ваш запрос успешно выполнен!' : 
                         curStat === 'in_progress' ? '🔄 Принято в работу. Скоро свяжемся с вами.' : 
                         '⏳ Заявка получена и ожидает обработки администратором.'}
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 w-[80%] max-w-[300px] border-r z-50 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="p-5 flex justify-between items-center border-b border-inherit"><h2 className="text-xl font-black text-blue-500">OnAyak</h2><button onClick={() => { triggerHaptic('light'); setIsMenuOpen(false); }}><X size={24} /></button></div>
        <div className="p-5 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar pb-32">
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.themeTitle}</p><button onClick={() => {triggerHaptic('light'); setTheme(theme === 'dark' ? 'light' : 'dark');}} className={`w-full flex items-center justify-between p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}><span className="text-sm font-bold flex items-center gap-2">{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}{theme === 'dark' ? t.dark : t.light}</span><div className={`w-8 h-4 rounded-full relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`}></div></div></button></div>
          <div><p className="text-[10px] uppercase font-bold mb-3 opacity-50">{t.langTitle}</p><div className="flex bg-inherit rounded-lg p-1 border border-inherit"><button onClick={() => switchLang("ru")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "ru" ? "bg-blue-600 text-white" : "opacity-40"}`}>RU</button><button onClick={() => switchLang("kz")} className={`flex-1 py-1.5 text-xs font-bold rounded ${lang === "kz" ? "bg-blue-600 text-white" : "opacity-40"}`}>KZ</button></div></div>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
    </main>
  );
}