// Catalogue « par œuvre » : fusionne la table fichiers_maitres (Supabase)
// avec le classement data/oeuvres.json (une œuvre = un ou plusieurs fichiers).
import { lire } from "./supabase";
import CLASSEMENT from "../data/oeuvres.json";
import COUL from "../data/couleurs.json";
import PHOTOS from "../data/photos.json";

const ratio = (f) => {
  if (COUL[f.id]) return COUL[f.id].r;
  const m = String(f.proportion || "").match(/(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) / Number(m[2]) : 1;
};
const formatDe = (r) => (r < 0.9 ? "portrait" : r < 1.12 ? "carre" : r < 1.75 ? "paysage" : "panorama");

export async function catalogue(lang) {
  const rows = await lire(
    "fichiers_maitres",
    "select=id,titre_fr,titre_en,proportion,taille_max_pictorem_po,pictorem_url,url_vignette&statut=eq.Fichier%20ma%C3%AEtre&order=id"
  );
  const parId = Object.fromEntries(rows.map((r) => [r.id, r]));
  const vus = new Set();
  const oeuvres = [];
  const fichier = (f) => ({
    id: f.id,
    titre: lang === "fr" ? f.titre_fr : f.titre_en,
    maxPo: f.taille_max_pictorem_po || 0,
    url: f.pictorem_url || null,
    img: f.url_vignette,
    ratio: ratio(f),
  });
  for (const c of CLASSEMENT) {
    const fs = c.fichiers.map((i) => parId[i]).filter(Boolean);
    if (!fs.length) continue;
    fs.forEach((f) => vus.add(f.id));
    const rep = parId[c.id] || fs[fs.length - 1];
    const titreO = lang === "fr" ? c.titre_fr : c.titre_en;
    // libellé d'une version : nom de l'œuvre, sauf volet de diptyque/triptyque, panorama ou carré
    const variantes = fs.map(fichier).map((v) => {
      const t = String(v.titre || "").replace(/Pop mazoutes?,?/gi, "Jungle Pop").replace(/Pop Mazoute/g, "Jungle Pop").replace(/\s+\d+$/, "");
      return { ...v, titre: /—|\(|panorama|carré|square|trio|diptyque|diptych/i.test(t) ? t : titreO };
    }).sort((a, b) => a.maxPo - b.maxPo);
    oeuvres.push({
      id: rep.id,
      titre: lang === "fr" ? c.titre_fr : c.titre_en,
      theme: c.theme,
      palette: c.palette,
      format: c.format,
      img: rep.url_vignette,
      ratio: ratio(rep),
      url: rep.pictorem_url || variantes.find((v) => v.url)?.url || null,
      maxPo: Math.max(...variantes.map((v) => v.maxPo)),
      variantes,
      // polyptyque : panneaux à montrer côte à côte (ordre gauche → droite)
      panneaux: (c.panneaux || []).map((i) => parId[i]).filter(Boolean).map((f) => ({ id: f.id, img: f.url_vignette, ratio: ratio(f) })),
      photos: (PHOTOS[rep.id] || []).map(([type, k]) => ({ type, src: `/ambiance/${k}.jpg` })),
    });
  }
  // Fichiers ajoutés depuis le classement : œuvres non classées
  for (const f of rows) {
    if (vus.has(f.id)) continue;
    const r = ratio(f);
    oeuvres.push({
      id: f.id, titre: lang === "fr" ? f.titre_fr : f.titre_en, theme: null, palette: [], format: formatDe(r),
      img: f.url_vignette, ratio: r, url: f.pictorem_url || null, maxPo: f.taille_max_pictorem_po || 0, variantes: [fichier(f)], panneaux: [],
    });
  }
  const oeuvreDuFichier = {};
  oeuvres.forEach((o) => o.variantes.forEach((v) => (oeuvreDuFichier[v.id] = o.id)));
  return { oeuvres, oeuvreDuFichier };
}
