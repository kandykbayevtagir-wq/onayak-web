"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, Globe, CheckCircle2, Bell, Activity, Sparkles, Send, Calendar, Package, Clock, Star, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
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
import TasksTab from "../components/tabs/TasksTab";

import { analyzeInput } from "../lib/ai/triggerEngine";
import { executeAiAction } from "../lib/ai/actionController";

export default function Home() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"client" | "director" | "admin">("client");
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<any>("main");
  const [crmSubTab, setCrmSubTab] = useState<"active" | "done">("active");
  const [clientSubTab, setClientSubTab] = useState<"appointments" | "orders">("appointments");

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
  
  // === ИЗМЕНЕНИЯ ЗДЕСЬ: Добавлен ID для предотвращения крашей React ===
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{id: string, sender: 'user'|'ai', text: string}[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = useCallback((style: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp?.HapticFeedback) {
      const haptic = (window as any).Telegram.WebApp.HapticFeedback;
      if (['light', 'medium', 'heavy'].includes(style)) haptic.impactOccurred(style);
      else haptic.notificationOccurred(style);
    }
  }, []);

  useEffect(() => {
    if (isAiChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isAiTyping, isAiChatOpen]);

  useEffect(() => {
    if (isAiChatOpen && chatHistory.length === 0) {
      setChatHistory([{id: 'welcome', sender: 'ai', text: lang === 'kz' ? 'Сәлеметсіз бе! Мен OnAyak AI көмекшісімін. Сізге қалай көмектесе аламын?' : 'Здравствуйте! Я OnAyak AI. Чем могу помочь?'}]);
    }
  }, [isAiChatOpen, lang, chatHistory.length]);

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear(); const mm = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0');
      dates.push({ full: `${yyyy}-${mm}-${dd}`, day: d.getDate(), month: d.getMonth(), weekDay: d.getDay() });
    }
    setUpcomingDates(dates); setSelectedDate(dates[0].full);
  }, []);

  useEffect(() => {
    if (isModalOpen && selectedDate) {
      const getBooked = async () => {
        setIsSlotsLoading(true);
        const { data } = await supabase.from('leads').select('appointment_time').eq('lead_type', 'appointment').like('appointment_time', `${selectedDate}%`);
        if (data) {
          const times = data.map((item: any) => item.appointment_time ? item.appointment_time.split('T')[1].substring(0,5) : "");
          setBookedSlots(times.filter(Boolean));
        }
        setIsSlotsLoading(false);
      };
      getBooked();
      if(!selectedTime) setSelectedTime(""); 
    }
  }, [selectedDate, isModalOpen]);

  useEffect(() => {
    const initApp = async () => {
      const savedLang = localStorage.getItem('onayak_lang'); const savedTerms = localStorage.getItem('onayak_terms');
      if (savedLang) setLang(savedLang as any); if (savedTerms === 'true') setHasAcceptedTerms(true);

      if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp; tg.ready(); tg.expand();
        const user = tg.initDataUnsafe?.user; setTgUser(user || null);
        if (tg.colorScheme === 'light') setTheme('light');
        if (user?.id === DIRECTOR_ID) setUserRole("director"); else if (user?.id === ADMIN_ID) setUserRole("admin");
      }
    };
    initApp();
  }, []);

  const fetchLeads = async () => {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if ((userRole === "director" || userRole === "admin") && activeTab === "dashboard") {
      if (crmSubTab === "active") query = query.neq('status', 'completed'); else query = query.eq('status', 'completed');
    } else if (tgUser?.id) { query = query.eq('client_tg_id', tgUser.id); } 
    else { return; }
    const { data } = await query; if (data) setLeads(data);
  };
  useEffect(() => { if (tgUser?.id) fetchLeads(); }, [activeTab, crmSubTab, tgUser]);

  // === АНТИ-КРАШ ЛОГИКА ЧАТА ===
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const currentInput = aiInput.trim();
    const msgId = Date.now().toString();
    // Оставляем только последние 40 сообщений, чтобы не перегружать память телефона
    setChatHistory(prev => [...prev.slice(-40), {id: `u_${msgId}`, sender: 'user', text: currentInput}]);
    setAiInput("");
    setIsAiTyping(true);
    triggerHaptic('light');

    setTimeout(() => {
      try {
        const result = analyzeInput(currentInput, lang || 'ru');
        
        if (result.intent === 'SERVICE_REQUEST' && currentInput.toLowerCase().includes('кофе')) {
          fetch('/api/notify', { method: 'POST', body: JSON.stringify({ action: 'coffee_request', name: tgUser?.first_name || 'Клиент' }) }).catch(e=>console.log(e));
        }

        setIsAiTyping(false);
        setChatHistory(prev => [...prev.slice(-40), {id: `a_${Date.now()}`, sender: 'ai', text: result.response}]);
        triggerHaptic('success');
        
        if (result.action.type !== 'NONE') {
          setTimeout(() => {
            setIsAiChatOpen(false); 
            executeAiAction(result, { setActiveTab, setIsModalOpen, setSelectedTime });
          }, 1200);
        }
      } catch (err) {
        // Защита от падения: если ИИ сломался, приложение продолжит работать
        setIsAiTyping(false);
        setChatHistory(prev => [...prev.slice(-40), {id: `err_${Date.now()}`, sender: 'ai', text: lang === 'kz' ? 'Жүйелік қате. Қайта көріңіз.' : 'Сбой алгоритма. Попробуйте еще раз или используйте обычное меню.'}]);
      }
    }, 1000 + Math.random() * 500);
  };

  const updateLeadStatus = async (id: number, newStatus: string) => { triggerHaptic('medium'); await supabase.from('leads').update({ status: newStatus }).eq('id', id); fetchLeads(); };
  const deleteLead = async (id: number) => { triggerHaptic('heavy'); if(confirm("Удалить?")) { await supabase.from('leads').delete().eq('id', id); fetchLeads(); } };
  const saveComment = async (id: number) => { triggerHaptic('success'); await supabase.from('leads').update({ client_comment: tempComment }).eq('id', id); setEditingCommentId(null); fetchLeads(); };
  const handleCoffeeRequest = async () => { triggerHaptic('medium'); if(confirm("Попросить кофе?")) { await fetch('/api/notify', { method: 'POST', body: JSON.stringify({ action: 'coffee_request', name: tgUser?.first_name || 'Клиент' }) }); alert("Бариста уведомлен! ☕"); } };
  const switchTab = (tab: any) => { triggerHaptic('light'); setActiveTab(tab); };
  const switchLang = (selectedLang: "ru" | "kz") => { triggerHaptic('light'); setLang(selectedLang); localStorage.setItem('onayak_lang', selectedLang); };
  const handleAcceptTerms = async () => { triggerHaptic('success'); setHasAcceptedTerms(true); localStorage.setItem('onayak_terms', 'true'); if (tgUser?.id) await supabase.from('profiles').upsert({ tg_id: tgUser.id, lang: lang, terms_accepted: true }); };

  const t = lang ? (DICT as any)[lang] : DICT.ru;
  const tgContact = tgUser?.username ? `@${tgUser.username}` : (tgUser?.id ? `ID: ${tgUser.id}` : "Unknown");
  const clientLeads = leads.filter(l => l.client_tg_id === tgUser?.id);
  const hasActiveLeads = clientLeads.some(l => !l.status || l.status === 'new' || l.status === 'in_progress');

  const handleSubmit = async (e: React.FormEvent, type: 'appointment' | 'delivery') => {
    e.preventDefault(); triggerHaptic('medium'); setIsSubmitting(true);
    try {
      const dbPayload: any = { client_name: formData.name, client_phone: tgContact, client_comment: formData.comment, client_tg_id: tgUser?.id, lead_type: type, status: 'new' };
      if (type === 'appointment') { dbPayload.problem = formData.problem; dbPayload.appointment_time = `${selectedDate}T${selectedTime}`; } else { dbPayload.problem = selectedProduct; }
      const { error } = await supabase.from('leads').insert([dbPayload]);
      if (error) throw error;
      await fetch('/api/notify', { method: 'POST', body: JSON.stringify({ action: type === 'appointment' ? 'new_lead' : 'new_delivery', name: formData.name, problem: formData.problem || selectedProduct, contact: tgContact, date: `${selectedDate} ${selectedTime}`, comment: formData.comment, client_tg_id: tgUser?.id }) });
      setIsSuccess(true); triggerHaptic('success');
      setTimeout(() => { setIsModalOpen(false); setIsDeliveryModalOpen(false); setIsSuccess(false); setFormData({ name: "", problem: "", comment: "" }); setSelectedProduct(""); fetchLeads(); }, 3000);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  if (!lang) return (<main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><div className="border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center bg-[#111]"><Globe size={48} className="text-blue-500 mx-auto mb-6" /><h1 className="text-2xl font-black mb-8">Тілді таңдаңыз</h1><div className="flex flex-col gap-3"><button onClick={() => switchLang("kz")} className="w-full py-4 rounded-xl font-bold border border-white/5 bg-[#1a1a1a]">Қазақ тілі</button><button onClick={() => switchLang("ru")} className="w-full py-4 bg-blue-600 rounded-xl font-bold">Русский язык</button></div></div></main>);
  if (lang && !hasAcceptedTerms) return (<main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><div className="border border-white/10 p-8 rounded-3xl w-full max-w-sm text-center bg-[#111]"><h1 className="text-xl font-black mb-4">{t.termsTitle}</h1><div className="p-4 rounded-xl mb-6 text-sm text-left border border-white/5 bg-[#1a1a1a] text-gray-400">{t.termsText}</div><button onClick={handleAcceptTerms} className="w-full py-4 bg-blue-600 rounded-xl font-bold"><CheckCircle2 size={18} className="inline" /> {t.acceptTermsBtn}</button></div></main>);

  const now = new Date(); const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentHour = now.getHours(); const currentMinute = now.getMinutes();

  return (
    <main className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header theme={theme} t={t} hasActiveLeads={hasActiveLeads} setIsMenuOpen={setIsMenuOpen} setIsNotificationsOpen={setIsNotificationsOpen} triggerHaptic={triggerHaptic} />
      <Navigation theme={theme} t={t} activeTab={activeTab} switchTab={switchTab} userRole={userRole} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === "main" && <MainTab t={t} theme={theme} triggerHaptic={triggerHaptic} setIsClinicInfoOpen={setIsClinicInfoOpen} setIsModalOpen={setIsModalOpen} handleCoffeeRequest={handleCoffeeRequest} switchTab={switchTab} />}
        {activeTab === "prices" && <PricesTab t={t} theme={theme} />}
        {activeTab === "shop" && <ShopTab t={t} theme={theme} triggerHaptic={triggerHaptic} setSelectedProduct={setSelectedProduct} setIsDeliveryModalOpen={setIsDeliveryModalOpen} />}
        {activeTab === "my_leads" && <MyLeadsTab t={t} theme={theme} clientLeads={clientLeads} clientSubTab={clientSubTab} setClientSubTab={setClientSubTab} triggerHaptic={triggerHaptic} editingCommentId={editingCommentId} setEditingCommentId={setEditingCommentId} tempComment={tempComment} setTempComment={setTempComment} saveComment={saveComment} deleteLead={deleteLead} />}
        {activeTab === "dashboard" && (userRole === "director" || userRole === "admin") && <DashboardTab t={t} theme={theme} leads={leads} crmSubTab={crmSubTab} setCrmSubTab={setCrmSubTab} triggerHaptic={triggerHaptic} updateLeadStatus={updateLeadStatus} deleteLead={deleteLead} />}
        {activeTab === "tasks" && (userRole === "director" || userRole === "admin") && <TasksTab theme={theme} triggerHaptic={triggerHaptic} tgUser={tgUser} />}
      </div>

      <button onClick={() => {triggerHaptic('medium'); setIsAiChatOpen(true);}} className="fixed bottom-24 right-5 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center z-40 active:scale-90 transition-transform">
        <Sparkles size={24} className="text-white" />
      </button>

      <div className={`fixed inset-0 z-[100] flex flex-col transition-transform duration-300 ${isAiChatOpen ? 'translate-y-0' : 'translate-y-full'} ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
        <div className={`flex items-center p-4 border-b ${theme === 'dark' ? 'border-white/10 bg-[#111]' : 'border-gray-200 bg-white'}`}>
          <button onClick={() => {triggerHaptic('light'); setIsAiChatOpen(false);}} className="p-2"><ArrowLeft size={24}/></button>
          <div className="ml-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"><Sparkles size={20} className="text-white"/></div>
            <div>
              <h3 className="font-black text-base leading-tight">OnAyak AI</h3>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Ассистент в сети</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 px-4 rounded-2xl text-sm font-medium ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : (theme === 'dark' ? 'bg-[#1a1a1a] border border-white/5 rounded-bl-sm' : 'bg-white border border-gray-200 rounded-bl-sm')}`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isAiTyping && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl rounded-bl-sm flex gap-1 items-center ${theme === 'dark' ? 'bg-[#1a1a1a] border border-white/5' : 'bg-white border border-gray-200'}`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10 bg-[#111]' : 'border-gray-200 bg-white'}`}>
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder={t.aiPlaceholder} className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            <button type="submit" disabled={!aiInput.trim() || isAiTyping} className="p-3 bg-blue-600 rounded-xl text-white disabled:opacity-50"><Send size={20}/></button>
          </form>
        </div>
      </div>

      {/* МОДАЛКА БРОНИРОВАНИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 pt-12 pb-32 backdrop-blur-sm overflow-y-auto">
          <div className={`border rounded-3xl w-full max-w-md p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <button onClick={() => { triggerHaptic('light'); setIsModalOpen(false); }} className="absolute top-6 right-6 p-2"><X size={24} /></button>
            {isSuccess ? (<div className="text-center py-10"><CheckCircle2 size={64} className="text-green-500 mx-auto mb-6 animate-in zoom-in" /><h3 className="text-2xl font-black">{t.successMsg}</h3></div>) : (
              <><h3 className="text-2xl font-black mb-6">{t.modalTitle}</h3><form onSubmit={(e) => handleSubmit(e, 'appointment')} className="flex flex-col gap-5">
                  <div><label className="block text-[10px] font-bold uppercase opacity-60 mb-2">{t.nameLabel}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-4 py-4 text-sm outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-200'}`} placeholder="Ваше имя" /></div>
                  <div><label className="block text-[10px] font-bold uppercase opacity-60 mb-2">{t.problemLabel}</label><div className="flex flex-wrap gap-2">{t.problems.map((prob: string) => (<button key={prob} type="button" onClick={() => { triggerHaptic('light'); setFormData({...formData, problem: prob}); }} className={`text-xs font-bold py-2.5 px-3 rounded-xl border transition-all ${formData.problem === prob ? "bg-blue-600 border-blue-600 text-white" : "opacity-60"}`}>{prob}</button>))}</div></div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-60 mb-2">{t.pickDate}</label>
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                      {upcomingDates.map((dt) => {
                         const isSelected = selectedDate === dt.full;
                         return (
                           <button type="button" key={dt.full} onClick={() => { triggerHaptic('light'); setSelectedDate(dt.full); setSelectedTime(""); }} className={`flex-shrink-0 w-16 p-3 rounded-2xl border text-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : (theme === 'dark' ? 'border-white/10' : 'bg-gray-50 border-gray-200')}`}>
                             <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{t.days[dt.weekDay]}</p>
                             <p className="text-xl font-black">{dt.day}</p>
                           </button>
                         )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase opacity-60 mb-2">{t.pickTime} {selectedTime && <span className="text-blue-500 ml-2">(Выбрано AI: {selectedTime})</span>}</label>
                    {isSlotsLoading ? (
                      <div className="flex justify-center py-4"><RefreshCw size={24} className="animate-spin text-blue-500" /></div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(time => {
                          const isBooked = bookedSlots.includes(time);
                          let isPast = false;
                          if (selectedDate === todayStr) {
                             const slotHour = parseInt(time.split(':')[0]); const slotMinute = parseInt(time.split(':')[1]);
                             if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) isPast = true;
                          }
                          const disabled = isBooked || isPast;
                          const isSelected = selectedTime === time;

                          return (
                            <button type="button" key={time} disabled={disabled} onClick={() => { triggerHaptic('light'); setSelectedTime(time); }} className={`py-3 rounded-xl text-[11px] font-black border transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md' : disabled ? 'opacity-20 cursor-not-allowed' : (theme === 'dark' ? 'border-white/10' : 'bg-gray-50 border-gray-200')}`}>
                              {disabled && isBooked ? <span className="text-red-500">{t.booked}</span> : time}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={isSubmitting || !formData.name || !formData.problem || !selectedTime} className="w-full py-4 mt-2 bg-blue-600 disabled:opacity-50 rounded-xl text-white text-sm font-black shadow-lg shadow-blue-500/20">{isSubmitting ? "Отправка..." : t.submitBtn}</button>
                </form></>)}
          </div>
        </div>
      )}
      
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} theme={theme} setTheme={setTheme} lang={lang} switchLang={switchLang} t={t} setIsAboutOpen={setIsAboutOpen} triggerHaptic={triggerHaptic} />
    </main>
  );
}