// Relevé quotidien : lit Meta et Google Analytics (lecture seule), enregistre dans Supabase.
import { enregistrer } from "./db";
import { historiqueGA } from "./ga";

const V = "v27.0";
const tz = "America/Martinique";
const fmt = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d); // AAAA-MM-JJ

async function meta(path, params = {}) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) return { erreur: "META_ACCESS_TOKEN manquant" };
  try {
    const r = await fetch(`https://graph.facebook.com/${V}/${path}?${new URLSearchParams({ ...params, access_token: token })}`, { cache: "no-store" });
    const j = await r.json();
    return j.error ? { erreur: j.error.message } : { data: j };
  } catch (e) {
    return { erreur: String(e.message || e) };
  }
}

const total = (j, nom) => j?.data?.data?.find((x) => x.name === nom)?.total_value?.value;

export async function releverMaintenant() {
  const hier = fmt(new Date(Date.now() - 86400000));
  const aujourdhui = fmt(new Date());
  const ig = process.env.META_IG_ID;
  const page = process.env.META_PAGE_ID;
  const lignes = [];
  const notes = [];
  const ajouter = (jour, canal, metrique, valeur) => {
    if (valeur !== undefined && valeur !== null && !Number.isNaN(Number(valeur))) lignes.push({ jour, canal, metrique, valeur: Number(valeur), source: "auto" });
  };

  const u = Math.floor(new Date(`${hier}T04:00:00Z`).getTime() / 1000); // minuit Martinique = 04:00 UTC
  const [pIg, vIg, pFb, vFb] = await Promise.all([
    meta(ig, { fields: "followers_count" }),
    meta(`${ig}/insights`, { metric: "views", period: "day", metric_type: "total_value", since: String(u), until: String(u + 86400) }),
    meta(page, { fields: "fan_count" }),
    meta(`${page}/insights`, { metric: "page_media_view", period: "day", since: String(u), until: String(u + 86400) }),
  ]);

  if (pIg.erreur) notes.push("Instagram abonnés : " + pIg.erreur); else ajouter(aujourdhui, "instagram", "abonnes", pIg.data.followers_count);
  if (vIg.erreur) notes.push("Instagram vues : " + vIg.erreur); else ajouter(hier, "instagram", "vues", total(vIg, "views"));
  if (pFb.erreur) notes.push("Facebook fans : " + pFb.erreur); else ajouter(aujourdhui, "facebook", "abonnes", pFb.data.fan_count);
  if (vFb.erreur) notes.push("Facebook vues : " + vFb.erreur);
  else ajouter(hier, "facebook", "vues", vFb.data.data?.[0]?.values?.slice(-1)?.[0]?.value);

  const ga = await historiqueGA(3);
  if (ga.erreur) notes.push("Site : " + ga.erreur);
  else lignes.push(...ga.lignes.filter((l) => l.jour >= hier).map((l) => ({ ...l, source: "auto" })));

  const e = await enregistrer(lignes);
  return { enregistres: e.ok || 0, notes: e.erreur ? [...notes, e.erreur] : notes };
}

export async function importerHistoriqueSite() {
  const h = await historiqueGA(365);
  if (h.erreur) return { enregistres: 0, notes: ["Site : " + h.erreur] };
  const e = await enregistrer(h.lignes);
  return { enregistres: e.ok || 0, notes: e.erreur ? [e.erreur] : [] };
}
