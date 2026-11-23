import { SITE } from "../lib/seo";
import CLASSEMENT from "../data/oeuvres.json";

export const revalidate = 3600;

export default async function sitemap() {
  const alt = (p) => ({ url: `${SITE}${p || "/"}`, alternates: { languages: { en: `${SITE}${p || "/"}`, fr: `${SITE}${p || "/"}?lang=fr` } } });
  const pages = ["", "/collection", "/composer", "/projets", "/sibcod", "/vu-dans", "/livraison"].map(alt);
  return [...pages, ...CLASSEMENT.map((o) => alt(`/oeuvre/${o.id}`))];
}
