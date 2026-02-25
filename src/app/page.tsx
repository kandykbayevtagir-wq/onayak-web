"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Star, ShieldCheck, Instagram, Menu, X, UserCog, Mail, Info, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Moon, Sun, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play, Calendar, Trash2, Edit3, Save, ShoppingBag, Package, Archive, Clock, Coffee, Bell, Banknote, ChevronRight, Phone, Mic, MicOff } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

const DIRECTOR_ID = 5720865346;
const ADMIN_ID = 5623597772;
const CITIES_KZ = ["Актобе", "Астана", "Алматы", "Шымкент", "Атырау", "Актау", "Орал", "Костанай"];

// ГЕНЕРАТОР ВРЕМЕНИ
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

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
    commentLabel: "Комментарий (голосом или текстом):",
    myLeads: "Профиль", deleteBtn: "Отменить", saveBtn: "Сохранить",
    shopTab: "МАГАЗИН", shopTitle: "Профессиональный уход", orderBtn: "Оставить запрос",
    products: [
      { id: 1, name: "Увлажняющие мази и крема", desc: "Для сухой кожи и глубоких трещин на пятках" },
      { id: 2, name: "Пудры и спреи", desc: "Контроль потливости и неприятного запаха" },
      { id: 3, name: "Противогрибковые средства", desc: "Капли и сыворотки для профилактики и защиты" }
    ],
    deliveryModalTitle: "Заказ товара", productLabel: "Выбранный товар:",
    tabActive: "Активные", tabDone: "Архив", tabAppointments: "Записи", tabOrders: "Заказы",
    notifications: "Уведомления", emptyNotif: "Нет новых уведомлений", menuBtn: "Меню",
    priceTab: "ПРАЙС", priceTitle: "Услуги и цены", priceDisclaimer: "*Точная стоимость определяется специалистом после очного осмотра.",
    clinicInfoTitle: "О центре Podology MK", clinicInfoExperience: "Более 10 лет опыта работы", clinicInfoMed: "Специалисты с медицинским образованием", clinicInfoTech: "Передовое оборудование и 100% стерилизация", clinicInfoNote: "Центр оказывает профессиональные подологические и эстетические услуги.",
    callAdmin: "Позвонить администратору",
    pickDate: "Выберите дату:", pickTime: "Выберите время:", booked: "Занято",
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
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
    commentLabel: "Қосымша пікір (дауыспен немесе мәтінмен):",
    myLeads: "Профиль", deleteBtn: "Болдырмау", saveBtn: "Сақтау",
    shopTab: "ДҮКЕН", shopTitle: "Кәсіби күтім", orderBtn: "Сұраныс қалдыру",
    products: [
      { id: 1, name: "Ылғалдандыратын жақпа майлар", desc: "Құрғақ теріге және өкшедегі жарықтарға арналған" },
      { id: 2, name: "Опалар мен спрейлер", desc: "Терлеуді және жағымсыз иісті бақылау" },
      { id: 3, name: "Саңырауқұлаққа қарсы құралдар", desc: "Профилактика мен қорғанысқа арналған тамшылар" }
    ],
    deliveryModalTitle: "Тауарға тапсырыс", productLabel: "Таңдалған тауар:",
    tabActive: "Белсенді", tabDone: "Мұрағат", tabAppointments: "Жазбалар", tabOrders: "Тапсырыстар",
    notifications: "Хабарламалар", emptyNotif: "Жаңа хабарламалар жоқ", menuBtn: "Мәзір",
    priceTab: "БАҒАЛАР", priceTitle: "Қызметтер мен бағалар", priceDisclaimer: "*Нақты құнын маман бетпе-бет қараудан кейін анықтайды.",
    clinicInfoTitle: "Podology MK орталығы", clinicInfoExperience: "10 жылдан астам тәжірибе", clinicInfoMed: "Медициналық білімі бар мамандар", clinicInfoTech: "Озық жабдықтар және 100% стерилизация", clinicInfoNote: "Кәсіби подологиялық және эстетикалық қызметтер көрсетеміз.",
    callAdmin: "Администраторға қоңырау шалу",
    pickDate: "Күнді таңдаңыз:", pickTime: "Уақытты таңдаңыз:", booked: "Бос емес",
    days: ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сн"],
    months: ["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"]
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
  const [isClinicInfoOpen, setIsClinicInfoOpen] = useState(false);
  
  // ИСПРАВЛЕНИЕ: ВОЗВРАЩЕНЫ НЕДОСТАЮЩИЕ ПЕРЕМЕННЫЕ
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<{full: string, day: number, month: number, weekDay: number}[]>([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({ name: "", problem: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState("");
  const [rescheduleData, setRescheduleData] = useState<{id: number, time: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const triggerHaptic = useCallback((style: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp?.HapticFeedback) {
      const haptic = (window as any).Telegram.WebApp.HapticFeedback;
      if (['light', 'medium', 'heavy'].includes(style)) haptic.impactOccurred(style);
      else haptic.notificationOccurred(style);
    }
  }, []);

  // Генерация дат на 14 дней вперед
  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push({
        full: `${yyyy}-${mm}-${dd}`,
        day: d.getDate(),
        month: d.getMonth(),
        weekDay: d.getDay()
      });
    }
    setUpcomingDates(dates);
    setSelectedDate(dates[0].full);
  }, []);

  // Запрос занятых слотов
  useEffect(() => {
    if (isModalOpen && selectedDate) {
      const getBooked = async () => {
        setIsSlotsLoading(true);
        const { data, error } = await supabase.from('leads')
          .select('appointment_time')
          .eq('lead_type', 'appointment')
          .like('appointment_time', `${selectedDate}%`);
        
        if (data) {
          const times = data.map((item: any) => {
             if (!item.appointment_time) return "";
             return item.appointment_time.split('T')[1].substring(0,5);
          });
          setBookedSlots(times.filter(Boolean));
        }
        setIsSlotsLoading(false);
      };
      getBooked();
      setSelectedTime(""); 
    }
  }, [selectedDate, isModalOpen]);

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

  const toggleRecording = () => {
    triggerHaptic('medium');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод."); return;
    }
    if (isRecording) {
      (window as any).recognitionInstance?.stop(); setIsRecording(false); return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'kz' ? 'kk-KZ' : 'ru-RU';
    recognition.continuous = false; recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, comment: prev.comment ? `${prev.comment} ${transcript}` : transcript }));
    };
    recognition.onerror = () => { setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    (window as any).recognitionInstance = recognition;
    recognition.start();
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
      
      if (type === 'appointment') { 
        dbPayload.problem = formData.problem; 
        dbPayload.appointment_time = `${selectedDate}T${selectedTime}`; 
      } else { 
        dbPayload.problem = selectedProduct; 
      }

      const { error } = await supabase.from('leads').insert([dbPayload]);
      if (error) throw error;
      
      const apiPayload = type === 'appointment' 
        ? { action: 'new_lead', name: formData.name, problem: formData.problem, contact: tgContact, date: `${selectedDate} ${selectedTime}`, comment: formData.comment, client_tg_id: tgUser?.id }
        : { action: 'new_delivery', name: formData.name, product: selectedProduct, contact: tgContact, comment: formData.comment, client_tg_id: tgUser?.id };

      await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
      
      setIsSuccess(true);
      triggerHaptic('success');
      setTimeout(() => { setIsModalOpen(false); setIsDeliveryModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "", comment: "" }); setSelectedProduct(""); fetchLeads(); }, 3000);
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
          <div className={`p-4 rounded-xl mb-6 text-sm text-left border leading-relaxed ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>{t.termsText}</div>
          <button onClick={handleAcceptTerms} className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold"><CheckCircle2 size={18} className="inline" /> {t.acceptTermsBtn}</button>
        </div>
      </main>
    );
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return (
    <main className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <header className={`p-4 flex justify-between items-center sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={() => { triggerHaptic('light'); setIsMenuOpen(true); }} className={`p-2 flex items-center gap-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <Menu size={20} /> <span className="text-xs font-bold hidden sm:inline">{t.menuBtn}</span>
        </button>
        <h1 className="text-lg font-black text-blue-500 tracking-wide">OnAyak</h1>
        <button onClick={() => { triggerHaptic('light'); setIsNotificationsOpen(true); }} className={`p-2 relative flex items-center gap-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <Bell size={20} />
          <span className="text-xs font-bold hidden sm:inline">{t.notifications}</span>
          {hasActiveLeads && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-inherit shadow-sm"></span>}
        </button>
      </header>

      <div className={`p-3 flex gap-2 border-b overflow-x-auto custom-scrollbar ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'}`}>
        <button onClick={() => switchTab("main")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === "main" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>ВИТРИНА</button>
        <button onClick={() => switchTab("prices")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "prices" ? "bg-indigo-500 text-white shadow-md" : "opacity-50"}`}><Banknote size={16}/> {t.priceTab}</button>
        <button onClick={() => switchTab("shop")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "shop" ? "bg-pink-600 text-white shadow-md" : "opacity-50"}`}><ShoppingBag size={16}/> {t.shopTab}</button>
        <button onClick={() => switchTab("my_leads")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "my_leads" ? "bg-green-600 text-white shadow-md" : "opacity-50"}`}><Calendar size={16}/> {t.myLeads.toUpperCase()}</button>
        {(userRole === "director" || userRole === "admin") && <button onClick={() => switchTab("dashboard")} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-md" : "opacity-50"}`}><UserCog size={16}/> {t.leadsTitle.toUpperCase()}</button>}
      </div>

      {activeTab === "main" && (
        <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
          <div className={`border p-6 rounded-3xl relative overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-2 mt-2">
              <button onClick={() => { triggerHaptic('light'); setIsClinicInfoOpen(true); }} className="text-left flex items-center gap-1 active:opacity-70 transition-opacity">
                <div>
                  <h2 className="font-black text-xl flex items-center gap-1">{t.subtitle} <ChevronRight size={18} className="text-blue-500"/></h2>
                  <p className="text-sm text-blue-500 font-bold uppercase mt-1">Podology MK</p>
                </div>
              </button>
              <div className="bg-blue-500/10 px-3 py-1.5 rounded-xl flex items-center gap-1"><Star size={14} className="text-blue-500 fill-blue-500"/><span className="text-sm font-bold text-blue-500">5.0</span></div>
            </div>

            <div className="flex items-center gap-1.5 mb-5 mt-3 text-blue-500 font-bold text-xs"><BadgeCheck size={16} /> {t.verified}</div>
            <div className="space-y-3 mb-6 opacity-80 text-sm font-medium"><p className="flex items-center gap-2"><MapPin size={16} /> {t.address}</p></div>
            
            <a href="https://www.instagram.com/podology.mk" target="_blank" onClick={() => triggerHaptic('light')} className={`w-full flex justify-center items-center gap-2 py-3 border rounded-xl text-sm font-bold mb-4 transition-colors ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-pink-500' : 'bg-gray-50 border-gray-200 text-pink-600'}`}>
              <Instagram size={18} /> {t.insta}
            </a>

            <button onClick={() => { triggerHaptic('medium'); setIsModalOpen(true); }} className="w-full py-4 bg-blue-600 text-white text-base font-black rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-transform mb-3">{t.applyBtn}</button>
            
            <a href="tel:+77752823561" onClick={() => triggerHaptic('medium')} className="w-full flex justify-center items-center gap-2 py-4 bg-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-transform">
              <Phone size={18}/> {t.callAdmin}
            </a>
          </div>

          <button onClick={handleCoffeeRequest} className={`w-full p-4 rounded-3xl border flex items-center justify-between shadow-sm active:scale-95 transition-transform ${theme === 'dark' ? 'bg-[#111] border-white/5 hover:bg-[#1a1a1a]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center"><Coffee size={24}/></div>
              <div className="text-left"><h3 className="font-bold text-base">Попросить кофе</h3><p className="text-xs opacity-60">Если вы уже в клинике</p></div>
            </div>
          </button>
        </div>
      )}

      {activeTab === "prices" && (
        <div className="p-5 flex-1 flex flex-col pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Banknote className="text-indigo-500" size={28}/>
            <h2 className="text-2xl font-black">{t.priceTitle}</h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {PRICE_LIST.map((category, idx) => (
              <div key={idx} className={`rounded-3xl border overflow-hidden shadow-sm ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className={`p-5 font-black text-base border-b ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  {category.category}
                </div>
                <div className="flex flex-col">
                  {category.items.map((item, i) => (
                    <div key={i} className={`p-5 flex justify-between items-center text-sm border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                      <span className="opacity-90 font-medium pr-4 leading-relaxed">{item.name}</span>
                      <span className="font-black whitespace-nowrap text-indigo-500 text-base">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs opacity-60 mt-6 px-4 font-medium">{t.priceDisclaimer}</p>
        </div>
      )}

      {activeTab === "shop" && (
        <div className="p-5 flex-1 flex flex-col pb-10">
          <div className="flex items-center gap-2 mb-6"><ShoppingBag className="text-pink-500" size={28}/><h2 className="text-2xl font-black">{t.shopTitle}</h2></div>
          <div className="flex flex-col gap-5">
            {t.products.map(prod => (
              <div key={prod.id} className={`p-6 rounded-3xl border flex flex-col gap-4 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div><h3 className="font-black text-base mb-2">{prod.name}</h3><p className="text-sm opacity-70 leading-relaxed">{prod.desc}</p></div>
                  <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-50'} text-pink-500`}><Package size={24}/></div>
                </div>
                <button onClick={() => { triggerHaptic('medium'); setSelectedProduct(prod.name); setIsDeliveryModalOpen(true); }} className={`w-full py-4 mt-2 rounded-xl text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>{t.orderBtn}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "my_leads" && (
        <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
          <div className="flex justify-between items-center bg-inherit border border-inherit rounded-2xl p-1 shadow-inner">
            <button onClick={() => {triggerHaptic('light'); setClientSubTab("appointments");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${clientSubTab === "appointments" ? "bg-green-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabAppointments.toUpperCase()}</button>
            <button onClick={() => {triggerHaptic('light'); setClientSubTab("orders");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${clientSubTab === "orders" ? "bg-pink-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabOrders.toUpperCase()}</button>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {clientLeads.filter(l => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center opacity-40 mt-12">
                 {clientSubTab === 'appointments' ? <Calendar size={56} className="mb-4"/> : <Package size={56} className="mb-4"/>}
                 <p className="text-base font-bold">Пусто</p>
               </div>
            ) : (
              clientLeads.filter(l => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').map(lead => {
                const curStatus = lead.status || 'new';
                return (
                  <div key={lead.id} className={`p-5 rounded-3xl border relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className={`inline-block text-[10px] font-bold px-3 py-1.5 rounded-lg mb-3 uppercase tracking-wider ${curStatus === 'new' ? 'bg-yellow-500/20 text-yellow-500' : curStatus === 'in_progress' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>{curStatus === 'new' ? t.status_new : curStatus === 'in_progress' ? t.status_progress : t.status_completed}</div>
                    <h4 className="font-black text-base mb-2 pr-10">{lead.problem}</h4>
                    {lead.lead_type !== 'delivery' && (<p className="text-sm font-mono text-blue-500 mb-4 flex items-center gap-2"><Clock size={16}/> {lead.appointment_time ? new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'}) : 'Время не указано'}</p>)}
                    
                    <div className={`p-4 rounded-2xl border mb-4 mt-2 ${theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      {editingCommentId === lead.id ? (
                        <div className="flex gap-2 items-start"><textarea value={tempComment} onChange={(e)=>setTempComment(e.target.value)} className={`flex-1 text-sm p-3 rounded-xl border outline-none ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-gray-200'}`} rows={3}/><button onClick={() => saveComment(lead.id)} className="p-3 bg-green-600 text-white rounded-xl"><Save size={20}/></button></div>
                      ) : (
                        <div className="flex justify-between items-start"><div><p className="text-[10px] uppercase font-bold opacity-50 mb-1">Ваш комментарий:</p><p className="text-sm font-medium">{lead.client_comment || 'Нет комментария'}</p></div><button onClick={() => {setEditingCommentId(lead.id); setTempComment(lead.client_comment || '');}} className="text-gray-400 hover:text-blue-500 p-1"><Edit3 size={18}/></button></div>
                      )}
                    </div>
                    <button onClick={() => deleteLead(lead.id)} className="w-full flex justify-center items-center gap-2 py-3 text-sm font-bold text-red-500 bg-red-500/10 rounded-xl active:scale-95 transition-transform"><Trash2 size={16}/> {t.deleteBtn}</button>
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
            <button onClick={() => {triggerHaptic('light'); setCrmSubTab("active");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${crmSubTab === "active" ? "bg-blue-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabActive.toUpperCase()}</button>
            <button onClick={() => {triggerHaptic('light'); setCrmSubTab("done");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${crmSubTab === "done" ? "bg-green-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabDone.toUpperCase()}</button>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {leads.map(lead => {
              const status = lead.status || 'new';
              const isNew = status === 'new';
              const isProgress = status === 'in_progress';
              const isCompleted = status === 'completed';
              const isDelivery = lead.lead_type === 'delivery';
              
              const contactUrl = lead.client_phone.startsWith('@') ? `https://t.me/${lead.client_phone.substring(1)}` : `tg://user?id=${lead.client_tg_id}`;

              return (
                <div key={lead.id} className={`p-6 rounded-3xl border relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {isDelivery ? <Package size={20} className="text-pink-500"/> : <Calendar size={20} className="text-blue-500"/>}
                      <h4 className="font-black text-base">{lead.client_name}</h4>
                    </div>
                    <div className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${isNew ? 'bg-yellow-500/20 text-yellow-500' : isProgress ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                      {isNew ? t.status_new : isProgress ? t.status_progress : t.status_completed}
                    </div>
                  </div>

                  <div className="text-sm font-bold opacity-80 mb-4">{lead.problem}</div>
                  {lead.client_comment && <div className={`text-xs p-4 rounded-xl mb-5 italic font-medium ${theme === 'dark' ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>“{lead.client_comment}”</div>}

                  {!isDelivery && lead.appointment_time && (
                    <div className="flex items-center gap-2 text-sm font-mono text-blue-500 mb-6 bg-blue-500/5 p-3 rounded-xl">
                      <Clock size={16}/> {new Date(lead.appointment_time).toLocaleString('ru-RU', {day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'})}
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-inherit pt-5 mb-5">
                    <div><p className="text-[10px] uppercase font-bold opacity-50 mb-1">Клиент</p><p className="text-sm font-black">{lead.client_phone}</p></div>
                    <a href={contactUrl} target="_blank" onClick={() => triggerHaptic('light')} className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-2xl text-white text-xs font-black shadow-lg shadow-blue-500/30 active:scale-95">
                      <ExternalLink size={16}/> НАПИСАТЬ
                    </a>
                  </div>

                  <div className="flex gap-3">
                    {crmSubTab === "active" && (
                      <>
                        {isNew && <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="flex-1 py-4 bg-blue-600/10 text-blue-500 text-xs font-black rounded-xl border border-blue-500/20 active:scale-95">ВЗЯТЬ В РАБОТУ</button>}
                        {isProgress && <button onClick={() => updateLeadStatus(lead.id, 'completed')} className="flex-1 py-4 bg-green-600 text-white text-xs font-black rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95"><Check size={16}/> ЗАВЕРШИТЬ</button>}
                        <button onClick={() => deleteLead(lead.id)} className="p-4 border border-red-500/20 text-red-500 rounded-xl bg-red-500/5 active:scale-95"><Trash2 size={20}/></button>
                      </>
                    )}
                    {crmSubTab === "done" && (
                      <button onClick={() => updateLeadStatus(lead.id, 'in_progress')} className="w-full py-4 border border-inherit text-xs font-black rounded-xl opacity-60 hover:opacity-100 transition-opacity active:scale-95">ВЕРНУТЬ ИЗ АРХИВА</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* МОДАЛКИ (ИНФО О КЛИНИКЕ, ЗАПИСЬ, ДОСТАВКА) */}
      {isClinicInfoOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsClinicInfoOpen(false)}>
          <div className={`border rounded-3xl w-full max-w-sm p-8 relative shadow-2xl animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => { triggerHaptic('light'); setIsClinicInfoOpen(false); }} className="absolute top-4 right-4 bg-inherit border border-inherit p-2 rounded-full"><X size={20}/></button>
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 mx-auto">
              <Activity size={40} className="text-white"/>
            </div>
            <h3 className="text-2xl font-black mb-6 text-center">{t.clinicInfoTitle}</h3>
            <div className="flex flex-col gap-4 mb-8">
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Star className="text-blue-500" size={24}/>
                <span className="text-base font-bold leading-tight">{t.clinicInfoExperience}</span>
              </div>
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <ShieldCheck className="text-green-500" size={24}/>
                <span className="text-base font-bold leading-tight">{t.clinicInfoMed}</span>
              </div>
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <Activity className="text-purple-500" size={24}/>
                <span className="text-base font-bold leading-tight">{t.clinicInfoTech}</span>
              </div>
            </div>
            <p className="text-xs opacity-60 text-center uppercase tracking-widest font-bold">{t.clinicInfoNote}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsModalOpen(false); }} className="absolute top-6 right-6 p-2"><X size={24} /></button>
            {isSuccess ? (<div className="text-center py-10"><CheckCircle2 size={64} className="text-green-500 mx-auto mb-6 animate-in zoom-in" /><h3 className="text-2xl font-black">{t.successMsg}</h3></div>) : (
              <><h3 className="text-2xl font-black mb-8">{t.modalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'appointment')} className="flex flex-col gap-6">
                  
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.problemLabel}</label><div className="flex flex-wrap gap-2.5">{t.problems.map((prob, idx) => (<button key={idx} type="button" onClick={() => { triggerHaptic('light'); setFormData({...formData, problem: prob}); }} className={`text-xs font-bold py-3 px-4 rounded-xl border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>{prob}</button>))}</div></div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.pickDate}</label>
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                      {upcomingDates.map((dt, idx) => {
                         const isSelected = selectedDate === dt.full;
                         return (
                           <button type="button" key={idx} onClick={() => { triggerHaptic('light'); setSelectedDate(dt.full); }} className={`flex-shrink-0 w-16 p-3 rounded-2xl border text-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : (theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'bg-gray-50 border-gray-200')}`}>
                             <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{t.days[dt.weekDay]}</p>
                             <p className="text-xl font-black">{dt.day}</p>
                             <p className="text-[10px] uppercase font-bold opacity-70 mt-1">{t.months[dt.month]}</p>
                           </button>
                         )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.pickTime}</label>
                    {isSlotsLoading ? (
                      <div className="flex justify-center py-4"><RefreshCw size={24} className="animate-spin text-blue-500" /></div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {TIME_SLOTS.map(time => {
                          const isBooked = bookedSlots.includes(time);
                          let isPast = false;
                          if (selectedDate === todayStr) {
                             const slotHour = parseInt(time.split(':')[0]);
                             const slotMinute = parseInt(time.split(':')[1]);
                             if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
                               isPast = true;
                             }
                          }
                          const disabled = isBooked || isPast;
                          const isSelected = selectedTime === time;

                          return (
                            <button type="button" key={time} disabled={disabled} onClick={() => { triggerHaptic('light'); setSelectedTime(time); }} className={`py-3 rounded-xl text-sm font-black border transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md' : disabled ? 'opacity-20 cursor-not-allowed bg-transparent' : (theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')}`}>
                              {disabled && isBooked ? <span className="text-[10px] block opacity-100 text-red-500">Занято</span> : time}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.commentLabel}</label>
                    <div className="relative">
                      <textarea rows={3} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none resize-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} pr-14`} placeholder="..." />
                      <button type="button" onClick={toggleRecording} className={`absolute right-3 top-3 p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : (theme === 'dark' ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}`}>
                        {isRecording ? <MicOff size={20}/> : <Mic size={20}/>}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting || !formData.problem || !selectedTime} className="w-full py-5 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl text-white text-base font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : t.submitBtn}</button>
                </form></>)}
          </div>
        </div>
      )}

      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className={`border rounded-3xl w-full max-w-md p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-pink-500/20' : 'bg-white border-pink-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsDeliveryModalOpen(false); }} className="absolute top-6 right-6 p-2"><X size={24} /></button>
            {isSuccess ? (<div className="text-center py-10"><CheckCircle2 size={64} className="text-green-500 mx-auto mb-6 animate-in zoom-in" /><h3 className="text-2xl font-black">{t.successMsg}</h3></div>) : (
              <><div className="w-16 h-16 bg-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center mb-6"><Package size={32}/></div><h3 className="text-2xl font-black mb-2">{t.deliveryModalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'delivery')} className="flex flex-col gap-5 mt-6">
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} /></div>
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.productLabel}</label><div className="flex flex-wrap gap-2.5">{t.products.map((prob) => (<button key={prob.id} type="button" onClick={() => { triggerHaptic('light'); setSelectedProduct(prob.name); }} className={`text-xs font-bold py-3 px-4 rounded-xl border transition-all ${selectedProduct === prob.name ? "bg-pink-600 border-pink-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>{prob.name}</button>))}</div></div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.commentLabel}</label>
                    <div className="relative">
                      <textarea rows={3} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none resize-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} pr-14`} placeholder="Какая именно пудра/мазь нужна?" />
                      <button type="button" onClick={toggleRecording} className={`absolute right-3 top-3 p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : (theme === 'dark' ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}`}>
                        {isRecording ? <MicOff size={20}/> : <Mic size={20}/>}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting || !selectedProduct} className="w-full py-5 mt-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-2xl text-white text-base font-black shadow-lg shadow-pink-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : "Отправить запрос"}</button>
                </form></>)}
          </div>
        </div>
      )}

      {/* ШТОРКА УВЕДОМЛЕНИЙ */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col justify-end p-2 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}>
          <div className={`p-8 rounded-3xl w-full max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-4 shadow-2xl ${theme === 'dark' ? 'bg-[#111] border border-white/10 text-white' : 'bg-white border border-gray-200 text-gray-900'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black flex items-center gap-3"><Bell className="text-blue-500" size={28}/> {t.notifications}</h3>
              <button onClick={() => { triggerHaptic('light'); setIsNotificationsOpen(false); }} className="bg-inherit border border-inherit p-3 rounded-full"><X size={24}/></button>
            </div>
            <div className="flex flex-col gap-4">
              {clientLeads.length === 0 ? (
                <p className="opacity-50 text-center py-10 text-base font-bold">{t.emptyNotif}</p>
              ) : (
                clientLeads.map(lead => {
                  const isDeliv = lead.lead_type === 'delivery';
                  const curStat = lead.status || 'new';
                  return (
                    <div key={lead.id} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        {isDeliv ? <Package size={18} className="text-pink-500"/> : <Calendar size={18} className="text-blue-500"/>}
                        <span className="font-black text-base">{lead.problem}</span>
                      </div>
                      <p className="text-sm font-bold opacity-80 leading-relaxed">
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

      {/* О ПРИЛОЖЕНИИ */}
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
                <div className="text-left"><p className="text-[10px] opacity-40 uppercase">Version</p><p className="text-sm font-bold">1.3.0 Pro</p></div>
                <ShieldCheck size={20} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* БОКОВОЕ МЕНЮ С ГОРОДАМИ И КНОПКАМИ */}
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-[320px] border-r z-50 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="p-6 flex justify-between items-center border-b border-inherit"><h2 className="text-2xl font-black text-blue-500">OnAyak</h2><button onClick={() => { triggerHaptic('light'); setIsMenuOpen(false); }} className="p-2"><X size={28} /></button></div>
        <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto custom-scrollbar pb-32">
          
          <a href="tel:+77752823561" onClick={() => triggerHaptic('medium')} className="w-full flex justify-center items-center gap-3 py-4 bg-green-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-transform">
             <Phone size={20}/> {t.callAdmin}
          </a>

          <div><p className="text-xs uppercase font-bold mb-4 opacity-50 tracking-wider">{t.themeTitle}</p><button onClick={() => {triggerHaptic('light'); setTheme(theme === 'dark' ? 'light' : 'dark');}} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}><span className="text-base font-bold flex items-center gap-3">{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}{theme === 'dark' ? t.dark : t.light}</span><div className={`w-10 h-6 rounded-full relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div></div></button></div>
          <div><p className="text-xs uppercase font-bold mb-4 opacity-50 tracking-wider">{t.langTitle}</p><div className="flex bg-inherit rounded-xl p-1.5 border border-inherit"><button onClick={() => switchLang("ru")} className={`flex-1 py-3 text-sm font-bold rounded-lg ${lang === "ru" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>RU</button><button onClick={() => switchLang("kz")} className={`flex-1 py-3 text-sm font-bold rounded-lg ${lang === "kz" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>KZ</button></div></div>
          
          <div>
            <p className="text-xs uppercase font-bold mb-4 opacity-50 tracking-wider">{t.netTitle}</p>
            <div className="flex flex-col gap-2">
              {CITIES_KZ.map(city => (
                <div key={city} className={`flex justify-between items-center py-3 border-b last:border-0 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={`text-base ${city === "Актобе" ? "font-bold" : "opacity-40"}`}>{city === "Актобе" && lang === "kz" ? "Ақтөбе" : city}</span>
                  {city === "Актобе" ? <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">{t.active}</span> : <span className="text-xs opacity-20">{t.noCenters}</span>}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={() => { triggerHaptic('light'); setIsMenuOpen(false); setIsAboutOpen(true); }} className="flex items-center gap-3 text-base font-bold"><Info size={20} className="text-blue-500" /> {t.aboutApp}</button>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
    </main>
  );
}