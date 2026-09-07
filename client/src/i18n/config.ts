import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar';
import en from './locales/en';

const initialLang = (typeof window !== 'undefined' && localStorage.getItem('ats_lang')) || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: initialLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // React already escapes values safely
    },
  });

// Apply document direction and language on init and language switch
if (typeof document !== 'undefined') {
  const isRtl = i18n.language === 'ar';
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

  i18n.on('languageChanged', (lng: string) => {
    const isAr = lng === 'ar';
    document.documentElement.lang = lng;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    localStorage.setItem('ats_lang', lng);
  });
}

export default i18n;
