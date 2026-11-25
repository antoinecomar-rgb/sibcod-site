import Pied from "../../Pied";
import Link from "next/link";
import { notFound } from "next/navigation";
import Entete from "../../Entete";
import ScaleView from "./ScaleView";
import VoirAuMur from "./VoirAuMur";
import { catalogue } from "../../../lib/catalogue";
import { PALETTES, THEMES, FORMATS, nom } from "../../../lib/libelles";
import { listeTailles, plageFiche } from "../../../lib/tailles";
import AjouterMur from "./AjouterMur";
import DESCRIPTIONS from "../../../data/descriptions.json";
import { alternates } from "../../../lib/seo";

const T = {
  en: {
    back: "← Collection", by: "Original Sibcod creation",
    voirMur: "On the wall", variantesS: "Click a version to display it.", ensemble: (n, x) => `Part of ${n === 2 ? "a diptych" : n === 3 ? "a triptych" : "a series"}: ${x}`, variantes: "Available versions", supports: "Supports", supportsV: "Fine art paper, canvas, metal, wood, acrylic",
    made: "Made", madeV: "Printed to order and shipped by Pictorem (United States and Canada)",
    buy: "Buy", soon: "Coming soon", choose: "Choose size and support",
    scaleT: "See it at scale", scaleH: "Choose a size to see the artwork next to a 2.2 m sofa.",
    accord: "Goes well with", theme: "In the same theme", compose: "Compose a wall with this palette",
    custom: "A custom size or a project?", write: "Write to us", chez: "At home", pres: "Up close",
  },
  fr: {
    back: "← Collection", by: "Création originale Sibcod",
    voirMur: "Au mur", variantesS: "Cliquez sur une version pour l'afficher.", ensemble: (n, x) => `Fait partie ${n === 2 ? "d'un diptyque" : n === 3 ? "d'un triptyque" : "d'une série"} : ${x}`, variantes: "Versions disponibles", supports: "Supports", supportsV: "Papier d'art, toile, métal, bois, acrylique",
    made: "Fabrication", madeV: "Imprimée à la commande et expédiée par Pictorem (États-Unis et Canada)",
    buy: "Acheter", soon: "Bientôt disponible", choose: "Choisir la taille et le support",
    scaleT: "Voir à l'échelle", scaleH: "Choisissez une taille pour voir l'œuvre à côté d'un canapé de 2,2 m.",
    accord: "S'accorde avec", theme: "Dans le même thème", compose: "Composer un mur dans cette palette",
    custom: "Une taille sur mesure, un projet ?", write: "Nous écrire", chez: "Chez soi", pres: "De près",
  },
};

async function trouver(id, lang) {
  const { oeuvres, oeuvreDuFichier, imageDuFichier, polyptyques } = await catalogue(lang);
  const wid = oeuvreDuFichier[id];
  const o = oeuvres.find((x) => x.id === wid);
  // l'image demandée devient l'image principale de la page
  const img = o ? imageDuFichier[id] || o.variantes[0] : null;
  const polys = img ? polyptyques.filter((p) => p.panneaux.some((x) => x.id === img.id)) : [];
  return { o, img, oeuvres, polys };
}

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params; const sp = await searchParams;
  const fr = sp.lang === "fr";
  const { o } = await trouver(id, fr ? "fr" : "en");
  if (!o) return {};
  const description = fr
    ? `« ${o.titre} », création originale Sibcod. ${nom(THEMES, o.theme, "fr")}, ${nom(PALETTES, o.palette[0], "fr").toLowerCase()}. Imprimée à la commande sur papier d'art, toile, métal, bois ou acrylique.`
    : `“${o.titre}”, an original Sibcod creation. ${nom(THEMES, o.theme, "en")}, ${nom(PALETTES, o.palette[0], "en").toLowerCase()}. Printed to order on fine art paper, canvas, metal, wood or acrylic.`;
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
  const { o, img, oeuvres, polys } = await trouver(id, lang);
  if (!o) notFound();
  const fmtImg = img.ratio < 0.9 ? "portrait" : img.ratio < 1.12 ? "carre" : img.ratio < 1.75 ? "paysage" : "panorama";
  const Q = lang === "fr" ? "?lang=fr" : "";
  const pal = PALETTES.find((p) => p.id === o.palette[0]);
  const th = THEMES.find((x) => x.id === o.theme);
  const pano = img.ratio >= 1.9;
  const autres = oeuvres.filter((x) => x.id !== o.id && x.palette.length);
  const accords = pal ? pick(autres.filter((x) => x.palette[0] === pal.id && x.theme !== o.theme), o.id, 4) : [];
  const memeTheme = th ? pick(autres.filter((x) => x.theme === th.id && !accords.includes(x)), o.id + "t", 4) : [];
  // description propre à l'œuvre, seulement si Sibylle l'a validée (data/descriptions.json)
  const dv = DESCRIPTIONS[img.id] || DESCRIPTIONS[o.id];
  const desc = dv && dv[lang] ? [dv[lang]] : [];
  const principale = img.url ? img : o.variantes.find((v) => v.url);

  return (
    <div className="wrap">
      <Entete lang={lang} actif="collection" hrefLang={(l) => (l === "fr" ? `/oeuvre/${img.id}?lang=fr` : `/oeuvre/${img.id}`)} />
      <Link href={`/collection${Q}`} className="back">{t.back}</Link>

      <div className={pano ? "detail pano" : "detail"}>
        <div className="big">{img.img && <img src={img.img} alt={img.titre} />}</div>
        <div>
          <p className="n-k">{[th && th[lang], pal && pal[lang], nom(FORMATS, fmtImg, lang)].filter(Boolean).join(" · ")}</p>
          <h1>{o.titre}</h1>
          {img.titre && img.titre !== o.titre && <p className="n-sous-titre">{img.titre}</p>}
          <div className="by">{t.by}</div>
          {desc.map((d) => <p key={d}>{d}</p>)}
          {principale && (principale.fiches || []).length > 1
            ? <div className="n-achats">
                {principale.fiches.map((f) => (
                  <a key={f.url} className="buybig" href={f.url} target="_blank" rel="noopener noreferrer">{t.choose} <small>{plageFiche(f, principale.ratio, lang)}</small></a>
                ))}
              </div>
            : principale
              ? <a className="buybig" href={principale.url} target="_blank" rel="noopener noreferrer">{t.choose}</a>
              : <span className="soonbig">{t.soon}</span>}
          {o.variantes.length > 1 && (
            <div className="n-variantes">
              <h2>{t.variantes}</h2>
              <p className="n-petit">{t.variantesS}</p>
              {o.variantes.map((v) => (
                <div key={v.id} className={v.id === img.id ? "n-variante on" : "n-variante"}>
                  <Link href={`/oeuvre/${v.id}${Q}`} scroll={false} className="n-variante-lien" aria-current={v.id === img.id ? "true" : undefined}>
                    <img src={v.img} alt="" loading="lazy" />
                    <span><strong>{v.titre}</strong><em>{listeTailles(v, lang)}</em></span>
                  </Link>
                  <span className="n-variante-actions">
                    <VoirAuMur v={{ id: v.id, img: v.img, ratio: v.ratio, maxPo: v.maxPo, url: v.url, fiches: v.fiches, titre: v.titre }} label={t.voirMur} />
                    {v.url ? <a className="buybig n-var" href={v.url} target="_blank" rel="noopener noreferrer">{t.buy}</a> : <span className="soon">{t.soon}</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
          {polys.map((p) => (
            <div key={p.id} className="n-ensemble">
              <h2>{t.ensemble(p.panneaux.length, p.titre)}</h2>
              <div className="n-ensemble-panneaux">
                {p.panneaux.map((x) => (
                  <Link key={x.id} href={`/oeuvre/${x.id}${Q}`} scroll={false} className={x.id === img.id ? "on" : ""} style={{ flexGrow: x.ratio }} title={x.titre}>
                    <img src={x.img} alt={x.titre} loading="lazy" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <table className="facts"><tbody>
            {o.variantes.length === 1 && <tr><th>{lang === "fr" ? "Tailles" : "Sizes"}</th><td>{listeTailles(img, lang)}</td></tr>}
            <tr><th>{t.supports}</th><td>{t.supportsV}</td></tr>
            <tr><th>{t.made}</th><td>{t.madeV}</td></tr>
          </tbody></table>
          <AjouterMur id={img.id} lang={lang} Q={Q} />
          <p className="n-petit">{t.custom} <a href={`/projets${Q}`}>{t.write}</a></p>
        </div>
      </div>

      {(o.photos || []).length > 0 && (
        <section className="n-photos-oeuvre">
          {o.photos.map((ph) => (
            <figure key={ph.src}><img src={ph.src} alt={`${o.titre} – ${ph.type === "pres" ? t.pres : t.chez}`} loading="lazy" /><figcaption>{ph.type === "pres" ? t.pres : t.chez}</figcaption></figure>
          ))}
        </section>
      )}

      {img.img && <ScaleView key={img.id} init={{ id: img.id, img: img.img, ratio: img.ratio, maxPo: img.maxPo, url: img.url, fiches: img.fiches, titre: img.titre }} lang={lang} title={t.scaleT} hint={t.scaleH} />}

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
