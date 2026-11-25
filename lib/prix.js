// Prix estimés Pictorem (prix public, en dollars US, hors promotions et taxes ; livraison gratuite USA et Canada).
// Relevé sur les fiches Pictorem : voir data/prix-pictorem.json (date du relevé dans « releve »).
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
// options propres à l'affiche (Pictorem) : bord et encadrement
export const BORDS = [
  { id: "coupe", fr: "Coupe au bord", en: "Exact cut" },
  { id: "marge", fr: "Marge blanche", en: "White border" },
];
export const MARGE_CM = 2.5; // largeur approximative de la marge blanche proposée par Pictorem (à confirmer)

// affiche encadrée : cadres Pictorem retenus (références de leurs baguettes), toujours avec passe-partout blanc de 2 po (5 cm)
export const CADRES = [
  { id: "sans", fr: "Sans cadre", en: "No frame", k: 0 },
  { id: "noir", fr: "Noir", en: "Black", ref: "832-745", c: "#1E1E1E", k: 1 },
  { id: "blanc", fr: "Blanc", en: "White", ref: "629-102", c: "#F3F1EC", k: P.cadre.coefBlanc },
  { id: "chene", fr: "Chêne", en: "Oak", ref: "702-001", c: "#B88B5C", k: P.cadre.coefChene },
];
export const PASSE_PARTOUT_PO = 2;
export const BAGUETTE_CM = 2; // largeur visible approximative de la baguette

const cle = ({ w, h }) => `${Math.min(w, h)}x${Math.max(w, h)}`;

// prix encadré : interpolé sur le relevé (grand côté + petit côté du cadre, passe-partout compris)
function prixCadre(t) {
  const ui = t.w + t.h + 4 * PASSE_PARTOUT_PO;
  const pts = P.cadre.points; // [[pouces unis, prix], …] triés
  if (ui < pts[0][0] - 2 || ui > pts[pts.length - 1][0]) return null;
  if (ui <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (ui <= pts[i][0]) {
      const [a, pa] = pts[i - 1], [b, pb] = pts[i];
      return pa + ((ui - a) / (b - a)) * (pb - pa);
    }
  }
  return null;
}

// prix d'une taille (pouces) pour un support ; null si Pictorem ne la propose pas ou si elle n'a pas été relevée
export function prix(t, support, cadre = "sans") {
  if (!t) return null;
  if (support === "affiche" && cadre !== "sans") {
    const p = prixCadre(t);
    const k = CADRES.find((c) => c.id === cadre)?.k || 1;
    return p == null ? null : Math.round((p * k) / 5) * 5;
  }
  const v = P.supports[support]?.[cle(t)];
  return v == null ? null : Number(v);
}

export const enDollars = (v, lang) => (v == null ? "—" : lang === "fr" ? `${Math.round(v)} $` : `$${Math.round(v)}`);
