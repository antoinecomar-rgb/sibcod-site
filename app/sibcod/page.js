import Pied from "../Pied";
import Entete from "../Entete";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    k: "Sibcod", h1: "An interior architect's eye on wall art",
    p: [
      "Sibcod (Sibylle Comar Design) is the signature of an interior architect trained at École Camondo and based in Martinique.",
      "Her artworks are conceived as a presence: there to inhabit a space, bring room to breathe, complete a harmony of colours, fill the emptiness of a room, whether physical or a lack of identity. They invite you to travel, to refocus or to lighten the mind, to contemplate.",
      "Each one is designed for the place it will take: the light of a room, the breathing space around a frame, the dialogue with its neighbours. This is why the collection works like a colour chart.",
      "The light, the sea and the vegetation of Martinique are its source.",
    ],
    m: "Prints are made to order by our partner workshop Pictorem, on fine art paper, canvas, metal, wood or acrylic.",
    col: "Discover the collection",
  },
  fr: {
    k: "Sibcod", h1: "Un regard d'architecte d'intérieur, posé sur l'art mural",
    p: [
      "Sibcod (Sibylle Comar Design) est la signature d'une architecte d'intérieur formée à l'École Camondo et basée en Martinique.",
      "Ses œuvres sont pensées comme une présence : là pour habiter l'espace, apporter une respiration, aboutir une harmonie de couleurs, combler le vide d'une pièce, vide physique ou vide d'identité. Elles invitent à voyager, à recentrer l'attention ou au contraire à alléger l'esprit, à contempler.",
      "Chacune est pensée pour la place qu'elle prendra : la lumière d'une pièce, la respiration autour d'un cadre, le dialogue avec ses voisines. C'est pourquoi la collection fonctionne comme un nuancier.",
      "La lumière, la mer et la végétation de la Martinique en sont la source.",
    ],
    m: "Les tirages sont réalisés à la commande par notre atelier partenaire Pictorem, sur papier d'art, toile, métal, bois ou acrylique.",
    col: "Découvrir la collection",
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: "Sibcod – SIBCOD",
    description: fr ? "Sibcod, la signature d'une architecte d'intérieur basée en Martinique : des œuvres pensées pour habiter l'espace." : "Sibcod, the signature of an interior architect based in Martinique: artworks made to inhabit a space.",
    alternates: alternates("/sibcod", fr ? "fr" : "en"),
  };
}

export default async function Sibcod({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const Q = lang === "fr" ? "?lang=fr" : "";
  return (
    <div className="wrap">
      <Entete lang={lang} actif="sibcod" hrefLang={(l) => (l === "fr" ? "/sibcod?lang=fr" : "/sibcod")} />
      <section className="n-section n-sibcod">
        <img src="/ambiance/d88.jpg" alt={lang === "fr" ? "Chevalet en bois dans la lumière et l'ombre des feuilles" : "A wooden easel in the light and shadow of leaves"} />
        <div>
          <p className="n-k">{t.k}</p><h1>{t.h1}</h1>
          {t.p.map((x, i) => <p key={i} className="n-lead">{x}</p>)}
          <p className="n-petit">{t.m}</p>
          <a className="n-btn" href={`/collection${Q}`}>{t.col}</a>
        </div>
      </section>
      <section className="n-projets-photos">
        <img src="/ambiance/d54.jpg" alt="" loading="lazy" />
        <img src="/ambiance/d46.jpg" alt="" loading="lazy" />
        <img src="/ambiance/d48.jpg" alt="" loading="lazy" />
      </section>
      <Pied lang={lang} />
    </div>
  );
}
