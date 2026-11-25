import Pied from "../Pied";
import Entete from "../Entete";
import Composer from "./Composer";
import { collectionMur } from "../../lib/collectionMur";
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
  const { liste, collection, alias, polys } = await collectionMur(lang);
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
