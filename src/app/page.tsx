'use client';
import { useEffect, useState } from 'react';
import { Search, MapPin, Calendar, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen max-w-md mx-auto p-5 flex flex-col gap-6">
      {/* Шапка */}
      <header className="bg-blue-600 p-8 rounded-[2.5rem] text-center text-white shadow-2xl shadow-blue-500/20">
        <h1 className="text-4xl font-black tracking-tighter mb-1">OnAyak</h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-70">
          Professional Podology Service
        </p>
      </header>

      {/* Выбор города */}
      <section className="space-y-3">
        <label className="text-xs font-bold uppercase text-zinc-400 px-1">Ваша локация</label>
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <MapPin className="text-blue-500" size={20} />
          <span className="font-semibold text-lg">Актобе, Казахстан</span>
        </div>
      </section>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 gap-3">
        <button className="flex items-center justify-between p-5 bg-blue-600 rounded-2xl text-white active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <Search size={24} />
            <div className="text-left">
              <p className="font-bold">Найти мастера</p>
              <p className="text-[10px] opacity-70">Запись напрямую за 1 минуту</p>
            </div>
          </div>
        </button>

        <button className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4 text-zinc-500">
            <Calendar size={24} />
            <div className="text-left">
              <p className="font-bold text-black dark:text-white">Мои записи</p>
              <p className="text-[10px]">История посещений</p>
            </div>
          </div>
        </button>
      </div>

      {/* Футер для доверия */}
      <footer className="mt-auto py-6 flex flex-col items-center gap-2 opacity-40">
        <ShieldCheck size={32} className="text-blue-500" />
        <p className="text-[10px] font-medium uppercase tracking-widest">
          Sourced & Developed in Aktobe
        </p>
      </footer>
    </main>
  );
}