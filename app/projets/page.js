import Pied from "../Pied";
import Entete from "../Entete";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    k: "Custom projects", h1: "Give a place its identity",
    s: "Hotels, holiday rentals, restaurants, offices, property developments: Sibcod puts together a series of artworks matched to your walls, your colours and your light, with an interior architect's eye.",
    pts: [
      ["A coordinated series", "Artworks chosen to work together from room to room, within one palette or one theme."],
      ["Every format", "From small frames to very large formats covering an entire wall, on paper, canvas, metal, wood or acrylic."],
      ["Made to measure", "Custom sizes, crops and adaptations of existing artworks for your spaces."],
    ],
    c: "Tell us about your place, your walls and your timing: we will reply with a first selection.",
    b: "Write to us", wa: "WhatsApp",
    gift: "A gift, a single artwork?", col: "Browse the collection",
  },
  fr: {
    k: "Projets sur mesure", h1: "Donner une identité à un lieu",
    s: "Hôtel, location saisonnière, restaurant, bureaux, programme immobilier : Sibcod compose une série d'œuvres accordées à vos murs, à vos couleurs et à votre lumière, avec un œil d'architecte d'intérieur.",
    pts: [
      ["Une série coordonnée", "Des œuvres choisies pour dialoguer d'une pièce à l'autre, dans une même palette ou un même thème."],
      ["Tous les formats", "Du petit cadre au très grand format couvrant un mur entier, sur papier, toile, métal, bois ou acrylique."],
      ["Sur mesure", "Dimensions, cadrages et adaptations d'œuvres existantes pour vos espaces."],
    ],
    c: "Parlez-nous de votre lieu, de vos murs et de votre calendrier : nous vous répondrons avec une première sélection.",
    b: "Nous écrire", wa: "WhatsApp",
    gift: "Un cadeau, une seule œuvre ?", col: "Parcourir la collection",
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: fr ? "Projets sur mesure – SIBCOD" : "Custom projects – SIBCOD",
    description: fr ? "Séries d'œuvres sur mesure pour hôtels, locations, restaurants, bureaux et programmes immobiliers." : "Custom series of artworks for hotels, rentals, restaurants, offices and property developments.",
    alternates: alternates("/projets", fr ? "fr" : "en"),
  };
}

export default async function Projets({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const Q = lang === "fr" ? "?lang=fr" : "";
  return (
    <>
      <div className="wrap"><Entete lang={lang} actif="projets" hrefLang={(l) => (l === "fr" ? "/projets?lang=fr" : "/projets")} /></div>
      <section className="n-projets haut">
        <img src="/ambiance/d71.jpg" alt={lang === "fr" ? "Une personne face à une œuvre de branchages couvrant tout un mur" : "A person facing a branch artwork covering an entire wall"} />
        <div className="n-projets-carte">
          <p className="n-k">{t.k}</p><h1>{t.h1}</h1><p>{t.s}</p>
          <a className="n-btn" href={`mailto:sibcodesigns@gmail.com?subject=${encodeURIComponent(t.k)}`}>{t.b}</a>
        </div>
      </section>
      <div className="wrap">
        <section className="n-etapes trois">
          {t.pts.map(([a, b]) => <div key={a}><strong>{a}</strong><span>{b}</span></div>)}
        </section>
        <section className="n-projets-photos">
          <img src="/ambiance/d93.jpg" alt="" loading="lazy" />
          <img src="/ambiance/d52.jpg" alt="" loading="lazy" />
          <img src="/ambiance/d26.jpg" alt="" loading="lazy" />
        </section>
        <section className="n-col-tete centre">
          <p className="n-lead">{t.c}</p>
          <div className="n-btns centre">
            <a className="n-btn" href={`mailto:sibcodesigns@gmail.com?subject=${encodeURIComponent(t.k)}`}>{t.b}</a>
            <a className="n-btn2" href="https://wa.me/596696655699" target="_blank" rel="noopener noreferrer">{t.wa}</a>
          </div>
          <p className="n-petit">{t.gift} <a href={`/collection${Q}`}>{t.col}</a></p>
        </section>
        <Pied lang={lang} />
      </div>
    </>
  );
}
