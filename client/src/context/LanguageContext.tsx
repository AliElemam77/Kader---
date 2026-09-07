import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/config';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  setLanguage: () => {},
  isRtl: true,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const language = (i18n.language === 'en' ? 'en' : 'ar') as Language;
  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('ats_lang', language);
  }, [language, isRtl]);

  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
