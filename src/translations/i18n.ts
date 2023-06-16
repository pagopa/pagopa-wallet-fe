import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import lang from "./lang";

export const fallbackLang = "it";

const DETECTION_OPTIONS = {
  order: ["querystring", "navigator"],
  caches: [],
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: DETECTION_OPTIONS,
    fallbackLng: fallbackLang,
    resources: {
      ...lang,
    },
  });

export default i18n;
