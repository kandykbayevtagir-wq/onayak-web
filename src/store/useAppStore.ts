import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  lang: 'ru' | 'kz' | null;
  userRole: 'client' | 'director' | 'admin';
  tgUser: any | null;
  activeTab: string;
  hasAcceptedTerms: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLang: (lang: 'ru' | 'kz') => void;
  setAuth: (user: any, role: 'client' | 'director' | 'admin') => void;
  setActiveTab: (tab: string) => void;
  setHasAcceptedTerms: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  lang: null,
  userRole: 'client',
  tgUser: null,
  activeTab: 'main',
  hasAcceptedTerms: false,
  setTheme: (theme) => set({ theme }),
  setLang: (lang) => {
    localStorage.setItem('onayak_lang', lang);
    set({ lang });
  },
  setAuth: (tgUser, userRole) => set({ tgUser, userRole }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setHasAcceptedTerms: (status) => {
    localStorage.setItem('onayak_terms', status ? 'true' : 'false');
    set({ hasAcceptedTerms: status });
  }
}));