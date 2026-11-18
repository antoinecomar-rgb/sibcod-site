// Aides de référencement : adresse du site et variantes de langue.
export const SITE = "https://www.sibcod.com";

export function alternates(chemin, lang) {
  const fr = chemin + (chemin.includes("?") ? "&" : "?") + "lang=fr";
  return {
    canonical: lang === "fr" ? fr : chemin,
    languages: { en: chemin, fr, "x-default": chemin },
  };
}
