import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import performance_ar from "./arabic/performance_ar.json";
import performance_en from "./english/performance_en.json";
import common_ar from "./arabic/common_ar.json";
import common_en from "./english/common_en.json";
import header_ar from "./arabic/header_ar.json";
import header_en from "./english/header_en.json";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      ar: {
        performance: performance_ar,
        common: common_ar,
        header: header_ar,
      },
      en: {
        performance: performance_en,
        common: common_en,
        header: header_en,
      },
    },
    lng: ["ar", "en"],
    fallbackLng: "ar",
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
