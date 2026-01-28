import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from './locales/en/common.json';
import commonAR from './locales/ar/common.json';
import chatbotEN from './locales/en/chatbot.json';
import chatbotAR from './locales/ar/chatbot.json';
import customerSummaryEN from './locales/en/customerSummary.json';
import customerSummaryAR from './locales/ar/customerSummary.json';
import dashboardEN from './locales/en/dashboard.json';
import dashboardAR from './locales/ar/dashboard.json';
import requestFormEN from './locales/en/requestForm.json';
import requestFormAR from './locales/ar/requestForm.json';

// Translation resources
const resources = {
  en: {
    common: commonEN,
    chatbot: chatbotEN,
    customerSummary: customerSummaryEN,
    dashboard: dashboardEN,
    requestForm: requestFormEN
  },
  ar: {
    common: commonAR,
    chatbot: chatbotAR,
    customerSummary: customerSummaryAR,
    dashboard: dashboardAR,
    requestForm: requestFormAR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'chatbot', 'customerSummary', 'dashboard', 'requestForm'],
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;
