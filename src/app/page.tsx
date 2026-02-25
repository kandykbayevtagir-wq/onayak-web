"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Globe, CheckCircle2, RefreshCw, ScrollText, Calendar, Package, Clock, Bell, Activity, Mic, MicOff, Star, ShieldCheck } from "lucide-react";
// @ts-ignore
import { supabase } from "./supabase";

import { DIRECTOR_ID, ADMIN_ID, TIME_SLOTS, DICT } from "../config/constants";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";

import MainTab from "../components/tabs/MainTab";
import PricesTab from "../components/tabs/PricesTab";
import ShopTab from "../components/tabs/ShopTab";
import MyLeadsTab from "../components/tabs/MyLeadsTab";
import DashboardTab from "../components/tabs/DashboardTab";

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

  const t = lang ? (DICT as any)[lang] : DICT.ru;
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
      
      <Header theme={theme} t={t} hasActiveLeads={hasActiveLeads} setIsMenuOpen={setIsMenuOpen} setIsNotificationsOpen={setIsNotificationsOpen} triggerHaptic={triggerHaptic} />
      <Navigation theme={theme} t={t} activeTab={activeTab} switchTab={switchTab} userRole={userRole} />

      {activeTab === "main" && <MainTab t={t} theme={theme} triggerHaptic={triggerHaptic} setIsClinicInfoOpen={setIsClinicInfoOpen} setIsModalOpen={setIsModalOpen} handleCoffeeRequest={handleCoffeeRequest} switchTab={switchTab} />}
      {activeTab === "prices" && <PricesTab t={t} theme={theme} />}
      {activeTab === "shop" && <ShopTab t={t} theme={theme} triggerHaptic={triggerHaptic} setSelectedProduct={setSelectedProduct} setIsDeliveryModalOpen={setIsDeliveryModalOpen} />}
      {activeTab === "my_leads" && <MyLeadsTab t={t} theme={theme} clientLeads={clientLeads} clientSubTab={clientSubTab} setClientSubTab={setClientSubTab} triggerHaptic={triggerHaptic} editingCommentId={editingCommentId} setEditingCommentId={setEditingCommentId} tempComment={tempComment} setTempComment={setTempComment} saveComment={saveComment} deleteLead={deleteLead} />}
      {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && <DashboardTab t={t} theme={theme} leads={leads} crmSubTab={crmSubTab} setCrmSubTab={setCrmSubTab} triggerHaptic={triggerHaptic} updateLeadStatus={updateLeadStatus} deleteLead={deleteLead} />}

      {/* МОДАЛКА ИНФОРМАЦИИ - Добавлено items-start и pt-12 для правильного скролла */}
      {isClinicInfoOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-start justify-center p-4 pt-12 pb-20 backdrop-blur-sm overflow-y-auto" onClick={() => setIsClinicInfoOpen(false)}>
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

      {/* МОДАЛКА ЗАПИСИ НА ПРИЕМ - Исправлено выравнивание (items-start) и блокировка кнопки */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-12 pb-32 backdrop-blur-sm overflow-y-auto">
          <div className={`border rounded-3xl w-full max-w-md p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsModalOpen(false); }} className="absolute top-6 right-6 p-2"><X size={24} /></button>
            {isSuccess ? (<div className="text-center py-10"><CheckCircle2 size={64} className="text-green-500 mx-auto mb-6 animate-in zoom-in" /><h3 className="text-2xl font-black">{t.successMsg}</h3></div>) : (
              <><h3 className="text-2xl font-black mb-8">{t.modalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'appointment')} className="flex flex-col gap-6">
                  
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Введите ваше имя" /></div>
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.problemLabel}</label><div className="flex flex-wrap gap-2.5">{t.problems.map((prob: string, idx: number) => (<button key={idx} type="button" onClick={() => { triggerHaptic('light'); setFormData({...formData, problem: prob}); }} className={`text-xs font-bold py-3 px-4 rounded-xl border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>{prob}</button>))}</div></div>
                  
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
                              {disabled && isBooked ? <span className="text-[10px] block opacity-100 text-red-500">{t.booked}</span> : time}
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

                  {/* Кнопка заблокирована пока не введено имя, чтобы не вылетала клавиатура */}
                  <button type="submit" disabled={isSubmitting || !formData.name || !formData.problem || !selectedTime} className="w-full py-5 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-2xl text-white text-base font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : t.submitBtn}</button>
                </form></>)}
          </div>
        </div>
      )}

      {/* МОДАЛКА МАГАЗИНА - Тоже исправлено выравнивание и блокировка */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-12 pb-32 backdrop-blur-sm overflow-y-auto">
          <div className={`border rounded-3xl w-full max-w-md p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-pink-500/20' : 'bg-white border-pink-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsDeliveryModalOpen(false); }} className="absolute top-6 right-6 p-2"><X size={24} /></button>
            {isSuccess ? (<div className="text-center py-10"><CheckCircle2 size={64} className="text-green-500 mx-auto mb-6 animate-in zoom-in" /><h3 className="text-2xl font-black">{t.successMsg}</h3></div>) : (
              <><div className="w-16 h-16 bg-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center mb-6"><Package size={32}/></div><h3 className="text-2xl font-black mb-2">{t.deliveryModalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'delivery')} className="flex flex-col gap-5 mt-6">
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Введите ваше имя" /></div>
                  <div><label className="block text-xs font-bold uppercase opacity-60 mb-3">{t.productLabel}</label><div className="flex flex-wrap gap-2.5">{t.products.map((prob: any) => (<button key={prob.id} type="button" onClick={() => { triggerHaptic('light'); setSelectedProduct(prob.name); }} className={`text-xs font-bold py-3 px-4 rounded-xl border transition-all ${selectedProduct === prob.name ? "bg-pink-600 border-pink-600 text-white shadow-md" : "opacity-60 hover:opacity-100"}`}>{prob.name}</button>))}</div></div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-60 mb-2">{t.commentLabel}</label>
                    <div className="relative">
                      <textarea rows={3} value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} className={`w-full border rounded-2xl px-5 py-4 text-base outline-none resize-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} pr-14`} placeholder="Какая именно пудра/мазь нужна?" />
                      <button type="button" onClick={toggleRecording} className={`absolute right-3 top-3 p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : (theme === 'dark' ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}`}>
                        {isRecording ? <MicOff size={20}/> : <Mic size={20}/>}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting || !formData.name || !selectedProduct} className="w-full py-5 mt-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-2xl text-white text-base font-black shadow-lg shadow-pink-500/20 transition-all active:scale-95">{isSubmitting ? t.submitting : "Отправить запрос"}</button>
                </form></>)}
          </div>
        </div>
      )}

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

      {isAboutOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-20 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
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

      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} theme={theme} setTheme={setTheme} lang={lang} switchLang={switchLang} t={t} setIsAboutOpen={setIsAboutOpen} triggerHaptic={triggerHaptic} />
    </main>
  );
}