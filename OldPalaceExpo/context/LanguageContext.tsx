import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, LANGUAGE_META, TRANSLATIONS, TranslationMap } from '@/constants/translations';

const STORAGE_KEY = '@splash/language';
const DEFAULT_LANG: Language = 'en';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  language:    Language;
  isRTL:       boolean;
  setLanguage: (lang: Language) => void;
  t:           (key: string, params?: Record<string, string | number>) => string;
  dayShort:    string[];   // ['Sun','Mon',...] in active language
  dayFull:     string[];   // ['Sunday','Monday',...] in active language
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANG);

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && saved in LANGUAGE_META) {
        setLanguageState(saved as Language);
      }
    });
  }, []);

  // Persist whenever language changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const isRTL = LANGUAGE_META[language].rtl;

  // t() — translate a key, optionally interpolating {{param}} placeholders
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const map: TranslationMap = TRANSLATIONS[language];
      let str = map[key] ?? (TRANSLATIONS.en[key] ?? key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        });
      }
      return str;
    },
    [language],
  );

  const dayShort = useMemo(
    () => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((d) => t(`day_${d}`)),
    [t],
  );

  const dayFull = useMemo(
    () => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((d) => t(`day_full_${d}`)),
    [t],
  );

  const value = useMemo(
    () => ({ language, isRTL, setLanguage, t, dayShort, dayFull }),
    [language, isRTL, setLanguage, t, dayShort, dayFull],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

// ─── Re-export language meta for selectors ────────────────────────────────────

export { LANGUAGE_META };
export type { Language };
