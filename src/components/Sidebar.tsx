import { X, Moon, Sun, Info, Phone } from "lucide-react";
import { CITIES_KZ } from "../config/constants";

export default function Sidebar({ isMenuOpen, setIsMenuOpen, theme, setTheme, lang, switchLang, t, setIsAboutOpen, triggerHaptic }: any) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-[320px] border-r z-50 transform transition-transform duration-300 flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="p-6 flex justify-between items-center border-b border-inherit shrink-0">
          <h2 className="text-2xl font-black text-blue-500">OnAyak</h2>
          <button onClick={() => { triggerHaptic('light'); setIsMenuOpen(false); }} className="p-2"><X size={28} /></button>
        </div>
        
        <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto custom-scrollbar pb-32">
          <a href="tel:+77752823561" onClick={() => triggerHaptic('medium')} className="w-full flex justify-center items-center gap-3 py-4 bg-green-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-transform shrink-0">
             <Phone size={20}/> {t.callAdmin}
          </a>

          <div className="shrink-0"><p className="text-xs uppercase font-bold mb-4 opacity-50 tracking-wider">{t.themeTitle}</p><button onClick={() => {triggerHaptic('light'); setTheme(theme === 'dark' ? 'light' : 'dark');}} className={`w-full flex items-center justify-between p-4 rounded-2xl border ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-gray-200'}`}><span className="text-base font-bold flex items-center gap-3">{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}{theme === 'dark' ? t.dark : t.light}</span><div className={`w-10 h-6 rounded-full relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div></div></button></div>
          <div className="shrink-0"><p className="text-xs uppercase font-bold mb-4 opacity-50 tracking-wider">{t.langTitle}</p><div className="flex bg-inherit rounded-xl p-1.5 border border-inherit"><button onClick={() => switchLang("ru")} className={`flex-1 py-3 text-sm font-bold rounded-lg ${lang === "ru" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>RU</button><button onClick={() => switchLang("kz")} className={`flex-1 py-3 text-sm font-bold rounded-lg ${lang === "kz" ? "bg-blue-600 text-white shadow-md" : "opacity-50"}`}>KZ</button></div></div>
          
          <div className="shrink-0">
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
          
          <button onClick={() => { triggerHaptic('light'); setIsMenuOpen(false); setIsAboutOpen(true); }} className="flex items-center gap-3 text-base font-bold shrink-0"><Info size={20} className="text-blue-500" /> {t.aboutApp}</button>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
    </>
  );
}