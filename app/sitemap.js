import { lire } from "../lib/supabase";
import { SITE } from "../lib/seo";

export const revalidate = 3600;

export default async function sitemap() {
  const pages = ["", "/a-propos", "/vu-dans", "/livraison"].map((p) => ({
    url: `${SITE}${p || "/"}`,
    alternates: { languages: { en: `${SITE}${p || "/"}`, fr: `${SITE}${p}${p ? "" : "/"}?lang=fr` } },
  }));
  let oeuvres = [];
  try {
    oeuvres = await lire("fichiers_maitres", "select=id&statut=eq.Fichier%20ma%C3%AEtre&order=id");
  } catch {}
  return [
    ...pages,
    ...oeuvres.map((o) => ({
      url: `${SITE}/oeuvre/${o.id}`,
      alternates: { languages: { en: `${SITE}/oeuvre/${o.id}`, fr: `${SITE}/oeuvre/${o.id}?lang=fr` } },
    })),
  ];
}
