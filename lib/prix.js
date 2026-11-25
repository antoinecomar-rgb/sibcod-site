// Prix estimés Pictorem (prix public, en dollars US, hors promotions et taxes ; livraison gratuite USA et Canada).
// Relevé sur les fiches et configurateurs Pictorem : voir data/prix-pictorem.json (date du relevé dans « releve »).
import P from "../data/prix-pictorem.json";

export const RELEVE = P.releve;

// supports proposés par Pictorem, dans l'ordre d'affichage
export const SUPPORTS = [
  { id: "toile", fr: "Toile", en: "Canvas" },
  { id: "affiche", fr: "Affiche", en: "Poster" },
  { id: "metal", fr: "Métal", en: "Metal" },
  { id: "bois", fr: "Bois", en: "Wood" },
  { id: "acrylique", fr: "Acrylique", en: "Acrylic" },
];

// cadres réellement proposés par Pictorem, selon le support
// affiche : cadre avec ou sans passe-partout (baguettes 832-745, 629-102, 702-001)
// toile : caisse américaine, la toile flotte dans le cadre (FL-814-67, 301-22, 303-12)
// métal : uniquement le métal HD dans un cadre flottant noir
// bois, acrylique : pas de cadre
const SANS = { id: "sans", fr: "Sans cadre", en: "No frame" };
export const CADRES_PAR_SUPPORT = {
  affiche: [SANS,
    { id: "noir", fr: "Noir", en: "Black", c: "#1E1E1E", k: 1 },
    { id: "blanc", fr: "Blanc", en: "White", c: "#F3F1EC", k: P.cadre.coefBlanc },
    { id: "chene", fr: "Chêne", en: "Oak", c: "#B88B5C", k: P.cadre.coefChene }],
  toile: [SANS,
    { id: "noir", fr: "Caisse noire", en: "Black floater", c: "#1E1E1E", k: 1 },
    { id: "blanc", fr: "Caisse blanche", en: "White floater", c: "#F3F1EC", k: 1 },
    { id: "chene", fr: "Caisse bois", en: "Wood floater", c: "#C49A6C", k: 1 }],
  metal: [SANS, { id: "noir", fr: "Cadre noir (métal HD)", en: "Black frame (HD metal)", c: "#1E1E1E", k: 1 }],
};
export const cadresDe = (support) => CADRES_PAR_SUPPORT[support] || [];

// affiche sans cadre : coupe au bord ou marge blanche (choix proposé par Pictorem à la commande)
export const BORDS = [
  { id: "coupe", fr: "Coupe au bord", en: "Exact cut" },
  { id: "marge", fr: "Marge blanche", en: "White border" },
];
export const MARGE_CM = 2.5; // largeur approximative de la marge blanche Pictorem (à confirmer)

// affiche encadrée : passe-partout au choix, comme chez Pictorem (aucun, ou 1 à 8 po ; ici les plus courants)
export const PASSE_PARTOUTS = [
  { id: 0, fr: "Sans", en: "None" },
  { id: 1, fr: "2,5 cm", en: "1 in" },
  { id: 2, fr: "5 cm", en: "2 in" },
  { id: 3, fr: "7,5 cm", en: "3 in" },
  { id: 4, fr: "10 cm", en: "4 in" },
];

// habillage autour de l'image, en cm de chaque côté : [cadre, passe-partout ou marge]
export function habillage(support, cadre, bord, pp) {
  const avecCadre = cadre && cadre !== "sans" && cadresDe(support).some((c) => c.id === cadre);
  if (support === "affiche" && avecCadre) return { cadre: 2, interieur: pp * 2.54, type: "cadre" };
  if (support === "affiche" && bord === "marge") return { cadre: 0, interieur: MARGE_CM, type: "marge" };
  if (support === "toile" && avecCadre) return { cadre: 1.6, interieur: 0.9, type: "caisse" }; // 1 po au total, dont l'ombre entre toile et cadre
  if (support === "metal" && avecCadre) return { cadre: 1.6, interieur: 0.9, type: "caisse" };
  return null;
}

const cle = ({ w, h }) => `${Math.min(w, h)}x${Math.max(w, h)}`;
const interp = (pts, x) => {
  if (x < pts[0][0] - 2 || x > pts[pts.length - 1][0] + 2) return null;
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [a, pa] = pts[i - 1], [b, pb] = pts[i];
      return pa + ((x - a) / (b - a)) * (pb - pa);
    }
  }
  return pts[pts.length - 1][1];
};

// affiche encadrée : prix sans passe-partout de la taille extérieure + coût du passe-partout à la surface
function prixAfficheEncadree(t, pp) {
  const W = t.w + 2 * pp, H = t.h + 2 * pp;
  const base = interp(P.cadre.sansPassePartout.points, W + H);
  if (base == null) return null;
  return base + P.cadre.passePartoutParPouceCarre * (W * H - t.w * t.h);
}

// prix d'une taille (pouces) ; null si Pictorem ne la propose pas ou si elle n'a pas été relevée
export function prix(t, support, cadre = "sans", pp = 2) {
  if (!t) return null;
  const c = cadresDe(support).find((x) => x.id === cadre && x.id !== "sans");
  if (support === "affiche" && c) {
    const p = prixAfficheEncadree(t, pp);
    return p == null ? null : Math.round((p * c.k) / 5) * 5;
  }
  const v = P.supports[support]?.[cle(t)];
  if (v == null) return null;
  if (support === "toile" && c) return Math.round((v * P.caisseAmericaine.coef) / 5) * 5;
  if (support === "metal" && c) return Math.round((v * P.metalCadre.coef) / 5) * 5;
  return Number(v);
}

export const enDollars = (v, lang) => (v == null ? "—" : lang === "fr" ? `${Math.round(v)} $` : `$${Math.round(v)}`);
