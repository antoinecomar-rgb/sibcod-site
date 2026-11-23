import Pied from "../../Pied";
import Link from "next/link";
import { notFound } from "next/navigation";
import Entete from "../../Entete";
import ScaleView from "./ScaleView";
import { catalogue } from "../../../lib/catalogue";
import { PALETTES, THEMES, FORMATS, nom, taille } from "../../../lib/libelles";
import { alternates } from "../../../lib/seo";

const T = {
  en: {
    back: "← Collection", by: "Original artwork by Sibcod",
    variantes: "Available versions", supports: "Supports", supportsV: "Fine art paper, canvas, metal, wood, acrylic",
    made: "Made", madeV: "Printed to order and shipped by Pictorem (United States and Canada)",
    buy: "Buy", soon: "Coming soon", choose: "Choose size and support",
    scaleT: "See it at scale", scaleH: "Choose a size to see the artwork next to a 2.2 m sofa.",
    accord: "Goes well with", theme: "In the same theme", compose: "Compose a wall with this palette",
    custom: "A custom size or a project?", write: "Write to us",
  },
  fr: {
    back: "← Collection", by: "Œuvre originale de Sibcod",
    variantes: "Versions disponibles", supports: "Supports", supportsV: "Papier d'art, toile, métal, bois, acrylique",
    made: "Fabrication", madeV: "Imprimée à la commande et expédiée par Pictorem (États-Unis et Canada)",
    buy: "Acheter", soon: "Bientôt disponible", choose: "Choisir la taille et le support",
    scaleT: "Voir à l'échelle", scaleH: "Choisissez une taille pour voir l'œuvre à côté d'un canapé de 2,2 m.",
    accord: "S'accorde avec", theme: "Dans le même thème", compose: "Composer un mur dans cette palette",
    custom: "Une taille sur mesure, un projet ?", write: "Nous écrire",
  },
};

async function trouver(id, lang) {
  const { oeuvres, oeuvreDuFichier } = await catalogue(lang);
  const wid = oeuvreDuFichier[id];
  const o = oeuvres.find((x) => x.id === wid);
  return { o, oeuvres };
}

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params; const sp = await searchParams;
  const fr = sp.lang === "fr";
  const { o } = await trouver(id, fr ? "fr" : "en");
  if (!o) return {};
  const description = fr
    ? `« ${o.titre} », œuvre originale de Sibcod. ${nom(THEMES, o.theme, "fr")}, ${nom(PALETTES, o.palette[0], "fr").toLowerCase()}. Imprimée à la commande sur papier d'art, toile, métal, bois ou acrylique.`
    : `“${o.titre}”, an original artwork by Sibcod. ${nom(THEMES, o.theme, "en")}, ${nom(PALETTES, o.palette[0], "en").toLowerCase()}. Printed to order on fine art paper, canvas, metal, wood or acrylic.`;
  return {
    title: `${o.titre} – SIBCOD`, description,
    alternates: alternates(`/oeuvre/${o.id}`, fr ? "fr" : "en"),
    openGraph: { title: `${o.titre} – SIBCOD`, description, images: o.img ? [o.img] : undefined },
  };
}

// choix stable de n œuvres dans une liste
const pick = (l, cle, n) => [...l].sort((a, b) => ((a.id + cle).length * 31 + a.id.charCodeAt(3) * 7) % 97 - ((b.id + cle).length * 31 + b.id.charCodeAt(3) * 7) % 97 || a.id.localeCompare(b.id)).slice(0, n);

export default async function Oeuvre({ params, searchParams }) {
  const { id } = await params; const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const { o, oeuvres } = await trouver(id, lang);
  if (!o) notFound();
  const Q = lang === "fr" ? "?lang=fr" : "";
  const pal = PALETTES.find((p) => p.id === o.palette[0]);
  const th = THEMES.find((x) => x.id === o.theme);
  const pano = o.ratio >= 1.9;
  const autres = oeuvres.filter((x) => x.id !== o.id && x.palette.length);
  const accords = pal ? pick(autres.filter((x) => x.palette[0] === pal.id && x.theme !== o.theme), o.id, 4) : [];
  const memeTheme = th ? pick(autres.filter((x) => x.theme === th.id && !accords.includes(x)), o.id + "t", 4) : [];
  const desc = [th && (lang === "fr" ? th.tfr : th.ten), pal && (lang === "fr" ? pal.tfr : pal.ten)].filter(Boolean);
  const principale = [...o.variantes].reverse().find((v) => v.url);

  return (
    <div className="wrap">
      <Entete lang={lang} actif="collection" hrefLang={(l) => (l === "fr" ? `/oeuvre/${o.id}?lang=fr` : `/oeuvre/${o.id}`)} />
      <Link href={`/collection${Q}`} className="back">{t.back}</Link>

      <div className={pano ? "detail pano" : "detail"}>
        <div className="big">{o.img && <img src={o.img} alt={o.titre} />}</div>
        <div>
          <p className="n-k">{[th && th[lang], pal && pal[lang], nom(FORMATS, o.format, lang)].filter(Boolean).join(" · ")}</p>
          <h1>{o.titre}</h1>
          <div className="by">{t.by}</div>
          {desc.map((d) => <p key={d}>{d}</p>)}
          {principale
            ? <a className="buybig" href={principale.url} target="_blank" rel="noopener noreferrer">{t.choose}</a>
            : <span className="soonbig">{t.soon}</span>}
          {o.variantes.length > 1 && (
            <div className="n-variantes">
              <h2>{t.variantes}</h2>
              {[...o.variantes].reverse().map((v) => (
                <div key={v.id} className="n-variante">
                  <img src={v.img} alt="" loading="lazy" />
                  <span><strong>{v.titre}</strong><em>{taille(v.maxPo, lang)}</em></span>
                  {v.url ? <a className="buybig n-var" href={v.url} target="_blank" rel="noopener noreferrer">{t.buy}</a> : <span className="soon">{t.soon}</span>}
                </div>
              ))}
            </div>
          )}
          <table className="facts"><tbody>
            {o.variantes.length === 1 && <tr><th>{lang === "fr" ? "Tailles" : "Sizes"}</th><td>{taille(o.maxPo, lang)}</td></tr>}
            <tr><th>{t.supports}</th><td>{t.supportsV}</td></tr>
            <tr><th>{t.made}</th><td>{t.madeV}</td></tr>
          </tbody></table>
          <p className="n-petit">{t.custom} <a href={`/projets${Q}`}>{t.write}</a></p>
        </div>
      </div>

      {o.img && <ScaleView src={o.img} alt={o.titre} maxIn={o.maxPo} lang={lang} title={t.scaleT} hint={t.scaleH} />}

      {accords.length > 0 && (
        <section className="n-accords">
          <h2>{t.accord}</h2>
          <div className="n-grille quatre">{accords.map((x) => <Mini key={x.id} x={x} Q={Q} />)}</div>
          <a className="n-lien" href={`/composer${Q}`}>{t.compose} →</a>
        </section>
      )}
      {memeTheme.length > 0 && (
        <section className="n-accords">
          <h2>{t.theme}</h2>
          <div className="n-grille quatre">{memeTheme.map((x) => <Mini key={x.id} x={x} Q={Q} />)}</div>
        </section>
      )}
      <Pied lang={lang} />
    </div>
  );
}

function Mini({ x, Q }) {
  return (
    <a className="n-carte" href={`/oeuvre/${x.id}${Q}`}>
      <span className="n-mat"><img src={x.img} alt={x.titre} loading="lazy" /></span>
      <span className="n-carte-t"><span>{x.titre}</span></span>
    </a>
  );
}
