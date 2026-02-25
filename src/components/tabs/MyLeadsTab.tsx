import { Calendar, Package, Clock, Edit3, Save, Trash2 } from "lucide-react";

export default function MyLeadsTab({ t, theme, clientLeads, clientSubTab, setClientSubTab, triggerHaptic, editingCommentId, setEditingCommentId, tempComment, setTempComment, saveComment, deleteLead }: any) {
  return (
    <div className="p-5 flex-1 flex flex-col gap-4 pb-10">
      <div className="flex justify-between items-center bg-inherit border border-inherit rounded-2xl p-1 shadow-inner">
        <button onClick={() => {triggerHaptic('light'); setClientSubTab("appointments");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${clientSubTab === "appointments" ? "bg-green-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabAppointments.toUpperCase()}</button>
        <button onClick={() => {triggerHaptic('light'); setClientSubTab("orders");}} className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${clientSubTab === "orders" ? "bg-pink-600 text-white shadow-lg" : "opacity-50"}`}>{t.tabOrders.toUpperCase()}</button>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {clientLeads.filter((l: any) => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center opacity-40 mt-12">
             {clientSubTab === 'appointments' ? <Calendar size={56} className="mb-4"/> : <Package size={56} className="mb-4"/>}
             <p className="text-base font-bold">Пусто</p>
           </div>
        ) : (
          clientLeads.filter((l: any) => clientSubTab === 'appointments' ? l.lead_type !== 'delivery' : l.lead_type === 'delivery').map((lead: any) => {
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
  );
}