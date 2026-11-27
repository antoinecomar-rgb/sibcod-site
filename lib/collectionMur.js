// Données communes à « Composer un mur » et à « Ma sélection » : œuvres, images distinctes, panoramas, polyptyques
import { catalogue } from "./catalogue";

export async function collectionMur(lang) {
  const Q = lang === "fr" ? "?lang=fr" : "";
  const { oeuvres, images, polyptyques, imageDuFichier } = await catalogue(lang);
  // une ligne par œuvre : son image principale, avec la taille maximale et le lien Pictorem de cette image
  const fiche = (v, o) => ({
    id: v.id, oeuvre: o.id, titre: v.titre, img: v.img, ratio: v.ratio, maxPo: v.maxPo, url: v.url, fiches: v.fiches,
    palette: o.palette, format: o.format === "panorama" || v.ratio >= 1.75 ? "panorama" : o.format, href: `/oeuvre/${v.id}${Q}`,
  });
  // chaque œuvre garde ses autres images (une même œuvre existe souvent en 3:4 et en 4:5) : une série peut ainsi être montrée dans une seule proportion
  const liste = oeuvres.filter((o) => o.palette.length && o.img).map((o) => ({
    ...fiche(o.variantes[0], o),
    autres: o.variantes.slice(1).filter((v) => v.img && v.ratio < 1.75).map((v) => fiche(v, o)),
  }));
  // collection à parcourir pour « Ma sélection » : chaque image distincte une fois
  const parId = Object.fromEntries(oeuvres.map((o) => [o.id, o]));
  const collection = images.filter((v) => v.img).map((v) => {
    const o = parId[v.oeuvre];
    return { ...fiche(v, o), format: v.ratio >= 1.75 ? "panorama" : v.ratio < 0.9 ? "portrait" : v.ratio < 1.12 ? "carre" : "paysage" };
  });
  // les panoramas (absents de la liste des images, qui montre leurs panneaux séparés)
  oeuvres.forEach((o) => o.variantes.forEach((v) => {
    if (v.img && v.ratio >= 1.75 && !collection.some((c) => c.id === v.id)) collection.push({ ...fiche(v, o), format: "panorama" });
  }));
  // toutes les autres versions (chaque ligne d'une œuvre, à ses propres proportions) : on peut les mettre au mur
  // depuis leur page, mais elles ne sont pas répétées dans la liste à parcourir (cache: true)
  oeuvres.forEach((o) => o.variantes.forEach((v) => {
    if (v.img && !collection.some((c) => c.id === v.id)) {
      collection.push({ ...fiche(v, o), cache: true, format: v.ratio >= 1.75 ? "panorama" : v.ratio < 0.9 ? "portrait" : v.ratio < 1.12 ? "carre" : "paysage" });
    }
  }));
  // les panneaux d'un diptyque ou d'un triptyque sont des images différentes : jamais confondus entre eux
  const idsPanneaux = new Set(polyptyques.flatMap((p) => p.panneaux.map((v) => v.id)));
  collection.forEach((c) => { if (idsPanneaux.has(c.id)) c.panneau = true; });
  // pour reprendre une sélection faite depuis une fiche (identifiant d'image quelconque)
  const alias = {};
  Object.keys(imageDuFichier).forEach((f) => {
    const v = imageDuFichier[f];
    if (v && !collection.some((c) => c.id === f)) alias[f] = v.id;
  });
  const polys = polyptyques.map((p) => ({
    id: p.id, titre: p.titre, palette: p.palette,
    panneaux: p.panneaux.map((v) => ({ id: v.id, titre: v.titre, img: v.img, ratio: v.ratio, maxPo: v.maxPo, url: v.url, fiches: v.fiches, href: `/oeuvre/${v.id}${Q}` })),
  }));
  // diptyques et triptyques complets, choisis d'un seul geste dans « Ma sélection »
  polys.forEach((p) => {
    const a = p.panneaux[0];
    collection.push({ id: `poly-${p.id}`, titre: p.titre, img: a.img, ratio: a.ratio, maxPo: a.maxPo, url: a.url, fiches: a.fiches, href: a.href, palette: p.palette, format: "polyptyque", panneaux: p.panneaux });
  });
  return { liste, collection, alias, polys };
}
