// import i18next, { i18n as i18nInstance } from "i18next";
// import { languages, namespaces } from "./i18n.constants";
// import HttpApi from "i18next-http-backend";

// const createI18n = (language: string): i18nInstance => {
//   const i18n = i18next.createInstance();
//   if (!i18n.isInitialized) {
//     i18n
//       .use(HttpApi) // Use backend plugin for translation file download.
//       .init({
//         backend: {
//           loadPath: "./src/locales/{{lng}}/{{ns}}.json", // Specify where backend will find translation files.
//         },
//         debug: false,
//         lng: language,
//         fallbackLng: language,
//         defaultNS: namespaces.common,
//         ns: [namespaces.common],
//         load: "currentOnly",
//       });
//   }
//   return i18n;
// };

// export const i18n = createI18n(languages.en);

import i18next, { StringMap, TFunction, TOptions } from "i18next";
import HttpApi from "i18next-http-backend";

export { i18next,  type  StringMap, type  TOptions, type  TFunction };

const i18nInit = (languageResources: string) => {
  if (!i18next.isInitialized) {
    i18next.use(HttpApi)
    .init({
      debug: false,
      defaultNS: "common",
      ns: ["common"],
      load: "currentOnly",
      lng: "pl",
      fallbackLng: 'pl',
      backend: {
        loadPath: languageResources,
      },
    });
  }
};

const languageResources: string = "./src/locales/{{lng}}/{{ns}}.json";
i18nInit(languageResources);

export const translateConfig = (key: string, def: string): string => {
  return i18next.t(key, i18next.t(`config:${key}`, def)) || "";
};

export const translate = (
  key: string | string[],
  options?: string | TOptions<StringMap> | undefined
): string => {
  if (typeof key === "string" && key.includes(":")) {
    if (options == undefined) {
      options = i18next.t(key.split(":")[1], "");
    } else if (typeof options === "string") {
      options = i18next.t(key.split(":")[1], options) ?? options;
    } else {
      options.defaultValue =
        i18next.t(key.split(":")[1], options) ?? options.defaultValue;
    }
  }
  return i18next.t(key, options) ?? "";
};
export const loadNamespaces = i18next.loadNamespaces.bind(i18next);
export const loadLanguages = i18next.loadLanguages.bind(i18next);
export const changeLanguage = (locale: string, reloadWindow?: boolean) => {
  if (reloadWindow) {
    var href = new URL(window.location.href);
    href.searchParams.set("locale", locale);
    window.location.href = href.toString();
  }
  return i18next.changeLanguage(locale);
};
export const getLanguage = (withoutDialect: boolean = true) => {
  let lang = i18next.language || "pl";
  if (withoutDialect) {
    return lang.split("-")[0];
  }
  console.log({ lang });
  return lang;
};
