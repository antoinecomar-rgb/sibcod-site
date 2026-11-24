import Pied from "../Pied";
import Entete from "../Entete";
import Composer from "./Composer";
import { catalogue } from "../../lib/catalogue";
import { PALETTES } from "../../lib/libelles";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    h1: "Compose a wall", s: "Choose your wall colour, a layout and a palette: the artworks fall into place, at real scale above a 2.2 m sofa.",
    mur: "Your wall", compo: "Layout", palette: "Palette", taille: "Size",
    echelle: "To scale: wall 3.2 m wide, sofa 2.2 m. Screen colours are indicative.",
    autre: "Another selection", autreS: "Same layout, same palette: new artworks at every click.", libre: "Free composition", oeuvres: "artworks", voir: "See the first artwork", vide: "No artwork for this combination yet.",
    aria: "Simulation above a sofa: ",
    note: "Each artwork is ordered separately, in the size and support of your choice.",
  },
  fr: {
    h1: "Composer un mur", s: "Choisissez la couleur de votre mur, une composition et une palette : les œuvres s'accordent d'elles-mêmes, à l'échelle réelle au-dessus d'un canapé de 2,20 m.",
    mur: "Votre mur", compo: "Composition", palette: "Palette", taille: "Taille",
    echelle: "À l'échelle : mur de 3,20 m, canapé de 2,20 m. Les couleurs d'écran restent indicatives.",
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
  const { oeuvres } = await catalogue(lang);
  const liste = oeuvres.filter((o) => o.palette.length && !o.doublon).map((o) => ({
    id: o.id, titre: o.titre, img: o.img, palette: o.palette, format: o.format, ratio: o.ratio, href: `/oeuvre/${o.id}${Q}`,
  }));
  return (
    <div className="wrap">
      <Entete lang={lang} actif="mur" hrefLang={(l) => (l === "fr" ? "/composer?lang=fr" : "/composer")} />
      <section className="n-col-tete">
        <h1>{t.h1}</h1>
        <p className="n-lead">{t.s}</p>
      </section>
      <Composer oeuvres={liste} lang={lang} txt={t} palettes={PALETTES.map(({ id, c, fr, en }) => ({ id, c, fr, en }))} />
      <p className="n-petit" style={{ marginTop: 16 }}>{t.note}</p>
      <Pied lang={lang} />
    </div>
  );
}
