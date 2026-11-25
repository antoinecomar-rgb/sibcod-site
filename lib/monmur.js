// Sélection « Mon mur » du visiteur, gardée dans son navigateur (rien n'est envoyé au serveur)
export const MAX_MUR = 8;
const CLE = "sibcod-mon-mur";

export function lireMur() {
  try {
    const l = JSON.parse(window.localStorage.getItem(CLE) || "[]");
    return Array.isArray(l) ? l.filter((x) => typeof x === "string").slice(0, MAX_MUR) : [];
  } catch {
    return [];
  }
}

export function ecrireMur(l) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(l.slice(0, MAX_MUR)));
  } catch {}
}
