import translationIT from "./it/translations.json";

const lang: Languages = {
  it: {
    label: "Italiano",
    lang: "it-IT",
    translation: translationIT
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
