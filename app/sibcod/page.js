import Pied from "../Pied";
import Entete from "../Entete";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    k: "Sibcod", h1: "An interior architect's eye on wall decor",
    p: [
      "Sibcod (Sibylle Comar Design) is the signature of an interior architect trained at École Camondo.",
      "Born in Martinique, Sibylle has always thought in images. Since childhood, the island has been an endless source of colour and light, which she now translates into wall art and home textiles.",
      "Sibcod began just after lockdown. While finishing house projects, she looked for pieces to hang and found nothing that suited the spaces, so she started printing her own images. Commissions followed straight away: formats designed for each space, palettes adjusted to each place, lush for the north of the island, more pared-back for the south.",
      "Her artworks are conceived as a presence: there to inhabit a space, bring room to breathe, complete a harmony of colours, fill the emptiness of a room, whether physical or a lack of identity. They invite you to travel, to refocus or to lighten the mind, to contemplate.",
      "Each artwork takes into account the place it will hold: the light of a room, the space around the frame, the dialogue with its neighbours. The collection thus works like a colour chart.",
      "Her world brings together diffuse softness and almost wild bursts of colour: translucent seas, vibrant vegetation, Creole houses, calm horizons. Each piece has its own process, sometimes digital, sometimes by hand. No posturing, no artifice: the vivid beauty of an island turned into a language.",
      "The light, the sea and the vegetation of Martinique are its source.",
    ],
    m: "Prints are made to order by our partner workshop Pictorem, on fine art paper, canvas, metal, wood or acrylic.",
    col: "Discover the collection",
  },
  fr: {
    k: "Sibcod", h1: "Un regard d'architecte d'intérieur, posé sur la décoration murale",
    p: [
      "Sibcod (Sibylle Comar Design) est la signature d'une architecte d'intérieur formée à l'École Camondo.",
      "Originaire de Martinique, Sibylle a toujours pensé en images. Elle y puise depuis l'enfance un réservoir infini de couleurs et de lumière, qu'elle transpose aujourd'hui en décors muraux et en linge de maison.",
      "L'aventure Sibcod naît à la sortie du confinement. Alors qu'elle achève des chantiers de maisons et cherche des pièces à accrocher, elle ne trouve pas d'œuvres adaptées aux lieux : elle décide d'éditer ses propres images. Les commandes sur mesure suivent aussitôt, avec des formats pensés selon les espaces et des palettes ajustées aux lieux, luxuriantes pour le nord de l'île, plus épurées pour le sud.",
      "Ses œuvres sont pensées comme une présence : là pour habiter l'espace, apporter une respiration, aboutir une harmonie de couleurs, combler le vide d'une pièce, vide physique ou vide d'identité. Elles invitent à voyager, à recentrer l'attention ou au contraire à alléger l'esprit, à contempler.",
      "Chaque œuvre tient compte de la place qu'elle occupera : la lumière d'une pièce, l'espace autour du cadre, le dialogue avec ses voisines. La collection fonctionne ainsi comme un nuancier.",
      "Son univers conjugue douceur diffuse et éclats presque sauvages : mers diaphanes, végétation vibrante, maisons créoles, horizons apaisants. Chaque création a son procédé propre, tantôt digital, tantôt à la main. Sans posture ni artifice : la beauté vibrante d'une île devenue langage.",
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
    description: fr ? "Sibcod, la signature d'une architecte d'intérieur formée à l'École Camondo : des œuvres faites pour habiter l'espace." : "Sibcod, the signature of an interior architect trained at École Camondo: artworks made to inhabit a space.",
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
