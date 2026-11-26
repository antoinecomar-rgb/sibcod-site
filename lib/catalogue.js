// Catalogue « par œuvre » : fusionne la table fichiers_maitres (Supabase)
// avec le classement data/oeuvres.json (une œuvre = un ou plusieurs fichiers).
import { lire } from "./supabase";
import CLASSEMENT from "../data/oeuvres.json";
import COUL from "../data/couleurs.json";
import PHOTOS from "../data/photos.json";
import TUILES from "../data/tuiles.json";
import POLY from "../data/polyptyques.json";
// œuvres enregistrées deux fois sous deux titres (même image) : la seconde n'est pas répétée dans la galerie ni le simulateur
import DOUBLONS from "../data/doublons.json";

// une « image » = une création distincte ; ses membres sont la même image enregistrée à plusieurs formats
const IMAGE_DE = {};
TUILES.forEach((t) => t.membres.forEach((f) => (IMAGE_DE[f] = t)));
const propre = (t) => String(t || "").replace(/Pop mazoutes?,?\s*trio/gi, "Jungle Pop").replace(/Pop mazoutes?,?/gi, "Jungle Pop").replace(/Pop Mazoute( Trio)?/g, "Jungle Pop").replace(/\s+\d+$/, "").trim();

const ratio = (f) => {
  if (COUL[f.id]) return COUL[f.id].r;
  const m = String(f.proportion || "").match(/(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) / Number(m[2]) : 1;
};
const formatDe = (r) => (r < 0.9 ? "portrait" : r < 1.12 ? "carre" : r < 1.75 ? "paysage" : "panorama");

// fiches Pictorem distinctes d'un groupe de fichiers (une même image enregistrée à plusieurs formats)
const fichesDe = (membres) => {
  // deux fichiers peuvent pointer vers la même fiche : on garde celui qui a la plus grande taille maximale
  const parUrl = new Map();
  membres.filter((m) => m.pictorem_url).forEach((m) => {
    const f = { id: m.id, url: m.pictorem_url, maxPo: m.taille_max_pictorem_po || 0, ratio: ratio(m) };
    const deja = parUrl.get(f.url);
    if (!deja || f.maxPo > deja.maxPo) parUrl.set(f.url, f);
  });
  return [...parUrl.values()].sort((a, b) => a.maxPo - b.maxPo);
};

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
    // une ligne par image distincte ; on achète le format le plus grand disponible
    const vuesI = new Set();
    const variantes = [];
    for (const f of fs) {
      const t = IMAGE_DE[f.id];
      const cle = t ? t.id : f.id;
      if (vuesI.has(cle)) continue;
      vuesI.add(cle);
      const membres = (t ? t.membres : [f.id]).map((i) => parId[i]).filter(Boolean);
      const montre = parId[cle] || f;
      const achat = [...membres].sort((a, b) => (b.pictorem_url ? 1 : 0) - (a.pictorem_url ? 1 : 0) || (b.taille_max_pictorem_po || 0) - (a.taille_max_pictorem_po || 0))[0];
      // titre : celui qui nomme le panneau (gauche, centre, droite…), sinon celui de l'image montrée
      // œuvre renommée sur le site : ses panneaux reprennent le nouveau titre (« Ancien — I (gauche) » → « Nouveau — I (gauche) »)
      const ancien = c.ancien_titre && c.ancien_titre[lang === "fr" ? "fr" : "en"];
      const tf = (m) => {
        const x = propre(lang === "fr" ? m.titre_fr : m.titre_en);
        return ancien && x.startsWith(ancien) ? titreO + x.slice(ancien.length) : x;
      };
      const noms = membres.map(tf).filter((x) => /—|\(/.test(x) && !/panorama|carré|square/i.test(x));
      // de préférence le nom qui reprend celui de l'œuvre (panneau du triptyque plutôt qu'une étude ancienne)
      const nomme = noms.find((x) => x.startsWith(titreO)) || noms[0];
      // l'image principale porte le titre de l'œuvre ; les autres, leur propre titre
      const impose = c.titres_versions && c.titres_versions[montre.id];
      const tt = (impose && impose[lang === "fr" ? "fr" : "en"]) || nomme || (membres.some((m) => m.id === rep.id) ? titreO : tf(montre));
      variantes.push({
        id: montre.id, membres: membres.map((m) => m.id),
        titre: tt || titreO, img: montre.url_vignette, ratio: ratio(montre),
        maxPo: Math.max(...membres.map((m) => m.taille_max_pictorem_po || 0)), url: achat.pictorem_url || null,
        // toutes les fiches Pictorem de cette image (petits et grands formats) : chacune vend sa propre plage de tailles
        fiches: fichesDe(membres),
      });
    }
    // l'image principale de l'œuvre en premier
    variantes.sort((a, b) => (b.membres.includes(rep.id) ? 1 : 0) - (a.membres.includes(rep.id) ? 1 : 0));
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
      photos: (PHOTOS[rep.id] || []).map(([type, k]) => ({ type, src: `/ambiance/${k}.jpg` })),
    });
  }
  // Fichiers ajoutés depuis le classement : œuvres non classées
  for (const f of rows) {
    if (vus.has(f.id)) continue;
    const r = ratio(f);
    oeuvres.push({
      id: f.id, titre: lang === "fr" ? f.titre_fr : f.titre_en, theme: null, palette: [], format: formatDe(r),
      img: f.url_vignette, ratio: r, url: f.pictorem_url || null, maxPo: f.taille_max_pictorem_po || 0, variantes: [{ ...fichier(f), membres: [f.id] }],
    });
  }
  // doublons : l'œuvre enregistrée en double disparaît des listes ; ses fichiers renvoient vers l'œuvre gardée
  const doublons = oeuvres.filter((o) => DOUBLONS[o.id]);
  for (let i = oeuvres.length - 1; i >= 0; i--) if (DOUBLONS[oeuvres[i].id]) oeuvres.splice(i, 1);
  const oeuvreDuFichier = {}, imageDuFichier = {};
  oeuvres.forEach((o) => o.variantes.forEach((v) => v.membres.forEach((m) => { oeuvreDuFichier[m] = o.id; imageDuFichier[m] = v; })));
  doublons.forEach((d) => {
    const garde = oeuvres.find((o) => o.variantes.some((v) => v.membres.includes(DOUBLONS[d.id])));
    if (garde) d.variantes.forEach((v) => v.membres.forEach((m) => { oeuvreDuFichier[m] = garde.id; imageDuFichier[m] = imageDuFichier[DOUBLONS[d.id]]; }));
  });
  // toutes les images distinctes, avec la palette de leur œuvre (pour « Toute la galerie »)
  // « Toute la galerie » : chaque image une seule fois. Une œuvre faite de panneaux montre ses panneaux,
  // séparés, de gauche à droite (pas son panorama, qui les répète) ; sinon, son image principale seule.
  const PANNEAU = /—\s*(?:[IVX]+|[A-D])\b|\((?:gauche|droite|centre|left|right|center)\)/i;
  const POS = (t) => (/\((gauche|left)\)|—\s*(I|A)\b/i.test(t) ? 0 : /\((centre|center)\)|—\s*(II|B)\b/i.test(t) ? 1 : 2);
  const images = oeuvres.filter((o) => !DOUBLONS[o.id]).flatMap((o) => {
    const panneaux = o.variantes.filter((v) => PANNEAU.test(v.titre));
    const garder = panneaux.length > 1 ? [...panneaux].sort((a, b) => POS(a.titre) - POS(b.titre)) : [o.variantes[0]];
    return garder.map((v, i) => ({ ...v, oeuvre: o.id, ordre: i, palette: o.palette, format: formatDe(v.ratio) }));
  });
  // polyptyques complets, panneaux dans l'ordre
  const polyptyques = POLY.map((p) => {
    const panneaux = p.panneaux.map((f) => imageDuFichier[f]).filter(Boolean);
    const o = oeuvres.find((x) => x.id === oeuvreDuFichier[p.panneaux[0]]);
    return { id: p.id, titre: lang === "fr" ? p.titre_fr : p.titre_en, panneaux, palette: o ? o.palette : [], theme: o ? o.theme : null };
  }).filter((p) => p.panneaux.length > 1);
  return { oeuvres, oeuvreDuFichier, imageDuFichier, images, polyptyques };
}
