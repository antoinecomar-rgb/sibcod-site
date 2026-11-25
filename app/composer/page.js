import Pied from "../Pied";
import Entete from "../Entete";
import Composer from "./Composer";
import { catalogue } from "../../lib/catalogue";
import { PALETTES } from "../../lib/libelles";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    h1: "Compose a wall", s: "Your wall, your artworks: to scale, with an estimated price.",
    mur: "Your wall", compo: "Layout", palette: "Palette", taille: "Size",
    echelle: "To scale: sofa 2.2 m wide. Sizes offered when ordering. Screen colours are indicative.",
    autre: "Another selection", autreS: "Same layout, same palette: new artworks at every click.", libre: "Free composition", oeuvres: "artworks", voir: "See the first artwork", vide: "No artwork for this combination yet.",
    aria: "Simulation above a sofa: ",
    note: "Each artwork is ordered separately, in the size and support of your choice.",
  },
  fr: {
    h1: "Composer un mur", s: "Votre mur, vos œuvres : à l'échelle, avec un prix estimé.",
    mur: "Votre mur", compo: "Composition", palette: "Palette", taille: "Taille",
    echelle: "À l'échelle : canapé de 2,20 m. Tailles proposées à la commande. Les couleurs d'écran restent indicatives.",
    autre: "Une autre sélection", autreS: "Même composition, même palette : de nouvelles œuvres à chaque clic.", libre: "Composition libre", oeuvres: "œuvres", voir: "Voir la première œuvre", vide: "Pas encore d'œuvre pour cette combinaison.",
    aria: "Simulation au-dessus d’un canapé : ",
    note: "Chaque œuvre se commande séparément, dans la taille et le support de votre choix.",
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: fr ? "Composer un mur – SIBCOD" : "Compose a wall – SIBCOD",
    description: fr ? "Simulez un mur d'œuvres Sibcod à l'échelle : couleur du mur, composition, palette et taille." : "Simulate a wall of Sibcod artworks at scale: wall colour, layout, palette and size.",
    alternates: alternates("/composer", fr ? "fr" : "en"),
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const Q = lang === "fr" ? "?lang=fr" : "";
  const { oeuvres, images, polyptyques, imageDuFichier } = await catalogue(lang);
  // une ligne par œuvre : son image principale, avec la taille maximale et le lien Pictorem de cette image
  const fiche = (v, o) => ({
    id: v.id, titre: v.titre, img: v.img, ratio: v.ratio, maxPo: v.maxPo, url: v.url, fiches: v.fiches,
    palette: o.palette, format: o.format === "panorama" || v.ratio >= 1.75 ? "panorama" : o.format, href: `/oeuvre/${v.id}${Q}`,
  });
  const liste = oeuvres.filter((o) => o.palette.length && o.img).map((o) => fiche(o.variantes[0], o));
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
  return (
    <div className="wrap">
      <Entete lang={lang} actif="mur" hrefLang={(l) => (l === "fr" ? "/composer?lang=fr" : "/composer")} />
      <section className="n-composer-tete">
        <h1>{t.h1}</h1>
        <p>{t.s}</p>
      </section>
      <Composer oeuvres={liste} collection={collection} alias={alias} polys={polys} mode={sp.mode === "moi" ? "moi" : null} lang={lang} txt={t} palettes={PALETTES.map(({ id, c, fr, en }) => ({ id, c, fr, en }))} />
      <Pied lang={lang} />
    </div>
  );
}
