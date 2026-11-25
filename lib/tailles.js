// Tailles proposées par Pictorem pour une œuvre (relevé du 25/11/2026 sur les fiches publiques).
// Pictorem propose des tailles standard, repérées par leur grand côté (en pouces), comprises entre
// le minimum et le maximum réglés sur la fiche ; le petit côté suit la proportion de l'image.
// Exemples relevés : 3:4 réglé 8-16 → 9×12 et 12×16 ; 4:5 réglé 8-20 → 10×12, 13×16, 16×20 ;
// 3:4 réglé 24-40 → 18×24, 23×30, 27×36 ; 1:2 réglé 48-80 → 24×48, 28×55, 30×60, 36×72.
import MIN from "../data/pictorem-min.json";

const GRANDS_COTES = [12, 16, 20, 24, 30, 36, 42, 48, 55, 60, 72];

// identifiant Pictorem tiré du lien de la fiche (https://www.pictorem.com/2824312/star/)
const idPictorem = (url) => (String(url || "").match(/pictorem\.com\/(\d+)\//) || [])[1];

export const minPo = (url, maxPo) => MIN[idPictorem(url)] || (maxPo > 20 ? 24 : 8);

// liste des tailles : [{ w, h, url }] en pouces, largeur × hauteur selon l'orientation de l'image.
// Une image vendue sur plusieurs fiches (petits formats d'un côté, grands formats de l'autre) réunit leurs tailles ;
// chaque taille garde le lien de la fiche qui la vend. Deux tailles de même grand côté : celle dont la proportion
// est la plus proche de l'image montrée.
export function taillesPictorem(o = {}) {
  const fiches = (o.fiches || []).filter((f) => f.url);
  if (fiches.length < 2) return taillesFiche(fiches[0] ? { ...fiches[0], ratio: o.ratio || fiches[0].ratio } : o);
  const parLong = new Map();
  fiches.forEach((f) => taillesFiche(f).forEach((t) => {
    const l = Math.max(t.w, t.h), ecart = Math.abs(f.ratio - (o.ratio || f.ratio));
    const deja = parLong.get(l);
    if (!deja || ecart < deja.ecart) parLong.set(l, { ...t, ecart });
  }));
  return [...parLong.values()].sort((a, b) => Math.max(a.w, a.h) - Math.max(b.w, b.h)).map(({ ecart, ...t }) => t);
}

function taillesFiche({ ratio = 0.75, maxPo = 16, url } = {}) {
  const r = ratio >= 1 ? 1 / ratio : ratio; // petit côté / grand côté
  const mn = minPo(url, maxPo), mx = maxPo || 16;
  let longs = GRANDS_COTES.filter((l) => l >= mn && l <= mx);
  if (!longs.length) longs = [GRANDS_COTES.filter((l) => l <= mx).pop() || 12];
  return longs.map((l) => {
    const s = Math.round(l * r);
    return ratio >= 1 ? { w: l, h: s, url } : { w: s, h: l, url };
  });
}

// Pictorem arrondit les centimètres au-dessus (9 po → 23 cm, 12 po → 31 cm)
export const enCm = (po) => Math.ceil(po * 2.54);
export const libelle = ({ w, h }, lang) => (lang === "fr" ? `${enCm(w)} × ${enCm(h)} cm` : `${w} × ${h} in`);
export const listeTailles = (v, lang) => taillesPictorem(v).map((t) => libelle(t, lang)).join(lang === "fr" ? " · " : " · ");

// plage de tailles d'une seule fiche Pictorem, pour libeller son bouton d'achat
export const plageFiche = (f, ratio, lang) => {
  const l = taillesFiche(f);
  const a = libelle(l[0], lang), b = libelle(l[l.length - 1], lang);
  return l.length > 1 ? (lang === "fr" ? `${a.replace(" cm", "")} à ${b}` : `${a.replace(" in", "")} to ${b}`) : a;
};
