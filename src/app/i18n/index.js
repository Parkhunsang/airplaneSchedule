import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ko from "./locales/ko";

const savedLanguage =
  typeof window !== "undefined" ? window.localStorage.getItem("language") : null;

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLanguage || "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
