import translationIT from "./it/translations.json";
import translationEN from "./en/translations.json";
import translationDE from "./de/translations.json";

const lang: Languages = {
  it: {
    label: "Italiano",
    lang: "it-IT",
    translation: translationIT
  },
  en: {
    label: "English",
    lang: "en-US",
    translation: translationEN
  },
  de: {
    label: "Deutsch",
    lang: "de-DE",
    translation: translationDE
  }
};

export interface Languages {
  [key: string]: {
    label: string;
    lang: string;
    translation: any;
  };
}

export function getSortedLang(): Array<{
  label: string;
  lang: string;
}> {
  // eslint-disable-next-line functional/immutable-data
  return Object.keys(lang)
    .sort()
    .reduce((obj: Array<{ label: string; lang: string }>, key: string) => {
      // eslint-disable-next-line functional/immutable-data
      obj.push(lang[key]);
      return obj;
    }, []);
}

export default lang;
