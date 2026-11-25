// « Ma sélection » du visiteur (son panier), gardée dans son navigateur : rien n'est envoyé au serveur.
// Une ligne : { id, t: "16x20" (taille en pouces, largeur × hauteur), s: support, c: cadre, p: passe-partout (po), b: bord, fait: commandée }
export const MAX_MUR = 12;
const CLE = "sibcod-mon-mur";
export const EVT = "sibcod-selection";

const ligne = (x) => (typeof x === "string" ? { id: x } : x && typeof x.id === "string" ? x : null);

export function lireSel() {
  try {
    const l = JSON.parse(window.localStorage.getItem(CLE) || "[]");
    return Array.isArray(l) ? l.map(ligne).filter(Boolean).slice(0, MAX_MUR) : [];
  } catch {
    return [];
  }
}

export function ecrireSel(l) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(l.slice(0, MAX_MUR)));
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

// ajoute une œuvre (ou met à jour sa taille et ses réglages si elle y est déjà)
export function ajouterSel(item) {
  const l = lireSel();
  const i = l.findIndex((x) => x.id === item.id);
  if (i >= 0) l[i] = { ...l[i], ...item, fait: false };
  else l.push({ s: "toile", c: "sans", p: 2, b: "coupe", ...item });
  ecrireSel(l);
  return l;
}

export const cleTaille = (x) => (x ? `${x.w}x${x.h}` : undefined);

// compatibilité : identifiants seuls
export const lireMur = () => lireSel().map((x) => x.id);
