import Pied from "../../Pied";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lire } from "../../../lib/supabase";
import Entete from "../../Entete";
import ScaleView from "./ScaleView";
import { alternates } from "../../../lib/seo";

const T = {
  en: {
    back: "← All works",
    by: "Original artwork by Sibcod",
    desc: (t) => `“${t}” is an original artwork by Sibcod, inspired by Martinique. It is printed to order on the support of your choice.`,
    format: "Format", sizes: "Available sizes", supports: "Supports", made: "Made", madeV: "Printed to order and shipped by Pictorem",
    supportsV: "Canvas, metal, acrylic, wood, paper",
    buy: "Buy", soon: "Coming soon",
    scaleT: "See it at scale", scaleH: "Choose a size to see the artwork next to a 2.2 m sofa.",
    fmt: (p) => (p ? `${p} ratio` : "—"),
    sz: (max) => `From 8 in (20 cm) up to ${max} in (${Math.round(max * 2.54)} cm) on the longest side`,
  },
  fr: {
    back: "← Toutes les œuvres",
    by: "Œuvre originale de Sibcod",
    desc: (t) => `« ${t} » est une œuvre originale de Sibcod, inspirée de la Martinique. Elle est imprimée à la commande sur le support de votre choix.`,
    format: "Format", sizes: "Tailles disponibles", supports: "Supports", made: "Fabrication", madeV: "Imprimé à la commande et expédié par Pictorem",
    supportsV: "Toile, métal, acrylique, bois, papier",
    buy: "Acheter", soon: "Bientôt disponible",
    scaleT: "Voir à l'échelle", scaleH: "Choisissez une taille pour voir l'œuvre à côté d'un canapé de 2,2 m.",
    fmt: (p) => (p ? `Proportion ${p}` : "—"),
    sz: (max) => `De 20 cm (8 po) à ${Math.round(max * 2.54)} cm (${max} po) sur le plus grand côté`,
  },
};

async function charger(id) {
  const r = await lire("fichiers_maitres", `select=*&id=eq.${encodeURIComponent(id)}`);
  return r[0];
}

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params; const sp = await searchParams;
  const o = await charger(id);
  if (!o) return {};
  const fr = sp.lang === "fr";
  const titre = fr ? o.titre_fr : o.titre_en;
  const cm = Math.round((o.taille_max_pictorem_po || 0) * 2.54);
  const description = fr
    ? `« ${titre} », œuvre originale de Sibcod inspirée de la Martinique. Imprimée à la commande sur toile, métal, acrylique, bois ou papier, jusqu'à ${cm} cm.`
    : `“${titre}”, an original artwork by Sibcod inspired by Martinique. Printed to order on canvas, metal, acrylic, wood or paper, up to ${o.taille_max_pictorem_po} in (${cm} cm).`;
  return {
    title: `${titre} – SIBCOD`,
    description,
    alternates: alternates(`/oeuvre/${id}`, fr ? "fr" : "en"),
    openGraph: { title: `${titre} – SIBCOD`, description, images: o.url_vignette ? [o.url_vignette] : undefined },
  };
}

export default async function Oeuvre({ params, searchParams }) {
  const { id } = await params; const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const o = await charger(id);
  if (!o) notFound();
  const titre = lang === "fr" ? o.titre_fr : o.titre_en;
  const q = lang === "fr" ? "?lang=fr" : "";
  const rm = (o.proportion || "").match(/([\d.]+):([\d.]+)/);
  const pano = rm ? Number(rm[1]) / Number(rm[2]) >= 1.9 : false;
  const prop = (o.proportion || "").match(/\(?\s*([\d.]+:[\d.]+)\s*\)?$/)?.[1];

  return (
    <div className="wrap">
      <Entete lang={lang} hrefLang={(l) => (l === "fr" ? `/oeuvre/${id}?lang=fr` : `/oeuvre/${id}`)} />
      <Link href={`/${q}`} className="back">{t.back}</Link>

      <div className={pano ? "detail pano" : "detail"}>
        <div className="big">{o.url_vignette && <img src={o.url_vignette} alt={titre} />}</div>
        <div>
          <h1>{titre}</h1>
          <div className="by">{t.by}</div>
          <p>{t.desc(titre)}</p>
          <table className="facts"><tbody>
            <tr><th>{t.format}</th><td>{t.fmt(prop)}</td></tr>
            <tr><th>{t.sizes}</th><td>{t.sz(o.taille_max_pictorem_po)}</td></tr>
            <tr><th>{t.supports}</th><td>{t.supportsV}</td></tr>
            <tr><th>{t.made}</th><td>{t.madeV}</td></tr>
          </tbody></table>
          {o.pictorem_url
            ? <a className="buybig" href={o.pictorem_url} target="_blank" rel="noopener noreferrer">{t.buy}</a>
            : <span className="soonbig">{t.soon}</span>}
        </div>
      </div>

      {o.url_vignette && (
        <ScaleView src={o.url_vignette} alt={titre} maxIn={o.taille_max_pictorem_po} lang={lang} title={t.scaleT} hint={t.scaleH} />
      )}
      <Pied lang={lang} />
    </div>
  );
}
