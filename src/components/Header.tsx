import { Menu, Bell } from "lucide-react";

export default function Header({ theme, t, hasActiveLeads, setIsMenuOpen, setIsNotificationsOpen, triggerHaptic }: any) {
  return (
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
  );
}