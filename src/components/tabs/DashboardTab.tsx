import { Calendar, Package, Clock, ExternalLink, Check, Trash2 } from "lucide-react";

export default function DashboardTab({ t, theme, leads, crmSubTab, setCrmSubTab, triggerHaptic, updateLeadStatus, deleteLead }: any) {
  return (
    <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
      <div className="flex justify-between items-center bg-inherit border border-inherit rounded-2xl p-1 shadow-inner">
        <button onClick={() => {triggerHaptic('light'); setCrmSubTab("active");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${crmSubTab === "active" ? "bg-blue-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabActive.toUpperCase()}</button>
        <button onClick={() => {triggerHaptic('light'); setCrmSubTab("done");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${crmSubTab === "done" ? "bg-green-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabDone.toUpperCase()}</button>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {leads.map((lead: any) => {
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
                <div className="items-center gap-2 text-sm font-mono text-blue-500 mb-6 bg-blue-500/5 p-3 rounded-xl flex">
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
  );
}