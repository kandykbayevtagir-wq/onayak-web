import { MapPin, Star, BadgeCheck, Instagram, ChevronRight, Phone, Coffee } from "lucide-react";

export default function MainTab({ t, theme, triggerHaptic, setIsClinicInfoOpen, setIsModalOpen, handleCoffeeRequest, switchTab }: any) {
  return (
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
  );
}