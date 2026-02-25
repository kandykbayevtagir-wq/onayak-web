"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Star, ShieldCheck, Instagram, X, CalendarPlus, Database, Globe, CheckCircle2, BadgeCheck, Activity, ExternalLink, RefreshCw, ScrollText, BarChart3, Users, Check, Play, Calendar, Trash2, Edit3, Save, ShoppingBag, Package, Archive, Clock, Coffee, Bell, Banknote, ChevronRight, Phone, Mic, MicOff } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

// НАШИ КОНСТАНТЫ
import { DIRECTOR_ID, ADMIN_ID, TIME_SLOTS, PRICE_LIST, DICT } from "../config/constants";

// НАШИ НОВЫЕ КОМПОНЕНТЫ
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";

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
      
      {/* ИСПОЛЬЗУЕМ ВЫНЕСЕННЫЕ КОМПОНЕНТЫ */}
      <Header theme={theme} t={t} hasActiveLeads={hasActiveLeads} setIsMenuOpen={setIsMenuOpen} setIsNotificationsOpen={setIsNotificationsOpen} triggerHaptic={triggerHaptic} />
      
      <Navigation theme={theme} t={t} activeTab={activeTab} switchTab={switchTab} userRole={userRole} />

      {/* ОСТАЛЬНОЙ КОД ВКЛАДОК ОСТАЛСЯ БЕЗ ИЗМЕНЕНИЙ */}
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

      {/* ИСПОЛЬЗУЕМ КОМПОНЕНТ САЙДБАРА */}
      <Sidebar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        theme={theme} 
        setTheme={setTheme} 
        lang={lang} 
        switchLang={switchLang} 
        t={t} 
        setIsAboutOpen={setIsAboutOpen} 
        triggerHaptic={triggerHaptic} 
      />
    </main>
  );
}