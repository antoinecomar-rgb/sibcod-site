import Entete from "../Entete";

const T = {
  en: {
    title: "About",
    p: [
      "Sibcod (Sibylle Comar Design) is the signature of an interior architect trained at École Camondo and based in Martinique.",
      "The studio designs visuals and pieces able to dialogue with spaces. It is now developing a collection of premium wall art as well as home textiles, born of precise work on composition, colour and support.",
      "Pieces are produced in small series or to order, with partners selected for their manufacturing standards.",
      "Sibcod is part of a contemporary creative approach rooted in its territory, between interior architecture, image and object.",
    ],
    foot: "Prints made to order by Pictorem. © Sibcod",
  },
  fr: {
    title: "À propos",
    p: [
      "Sibcod (Sibylle Comar Design) est la signature d'une architecte d'intérieur formée à l'École Camondo et basée en Martinique.",
      "Le studio conçoit des visuels et des pièces capables de dialoguer avec les espaces. Il développe aujourd'hui une collection de décoration murale premium ainsi que des textiles maison, issus d'un travail précis de composition, de couleur et de support.",
      "Les pièces sont produites en petites séries ou à la demande, avec des partenaires sélectionnés pour leur exigence de fabrication.",
      "Sibcod s'inscrit dans une démarche de création contemporaine ancrée dans son territoire, entre architecture d'intérieur, image et objet.",
    ],
    foot: "Tirages réalisés à la commande par Pictorem. © Sibcod",
  },
};

export const metadata = { title: "About – SIBCOD" };

export default async function APropos({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  return (
    <div className="wrap">
      <Entete lang={lang} actif="apropos" hrefLang={(l) => (l === "fr" ? "/a-propos?lang=fr" : "/a-propos")} />
      <section className="page">
        <h1>{t.title}</h1>
        {t.p.map((x, i) => <p key={i}>{x}</p>)}
      </section>
      <footer className="foot">{t.foot}</footer>
    </div>
  );
}
