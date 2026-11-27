import Pied from "../Pied";
import Entete from "../Entete";
import { catalogue } from "../../lib/catalogue";
import { PALETTES, THEMES, FORMATS, nom, ratioPoly, typePoly, ECART_POLY } from "../../lib/libelles";
import { alternates } from "../../lib/seo";
import DEROULE from "../../data/deroule.json";
// ordre de chaque famille : un dégradé de couleur qui part d'une œuvre emblème
import ORDRES from "../../data/ordres.json";

const T = {
  en: {
    k: (n) => `Collection · ${n} artworks`, h1: "A collection designed like a colour chart",
    s: "Start from the colour of your room, or from the atmosphere you are looking for. Every artwork in a family goes with the others.",
    tout: "All artworks", polyS: "Diptychs, triptychs and series: artworks designed to hang together.", polyT: "Polyptychs", panneaux: "panels", toutS: "The whole collection in one flow: each artwork leads to the next through its colours.", couleur: "By colour", theme: "By theme", format: "Format", tous: "All", autres: "Other artworks",
    autresT: "Recently added artworks, not yet placed in a family.", n: (n) => `${n} artworks`, aucun: "No artwork in this format here.",
  },
  fr: {
    k: (n) => `Collection · ${n} œuvres`, h1: "Une collection pensée comme un nuancier",
    s: "Entrez par la couleur de votre pièce, ou par l'atmosphère que vous cherchez. Toutes les œuvres d'une même famille s'accordent entre elles.",
    tout: "Toute la galerie", polyS: "Diptyques, triptyques et séries : des œuvres pensées pour être accrochées ensemble.", polyT: "Polyptyques", panneaux: "panneaux", toutS: "Toute la collection d'un seul tenant : chaque œuvre mène à la suivante par ses couleurs.", couleur: "Par couleur", theme: "Par thème", format: "Format", tous: "Tous", autres: "Autres œuvres",
    autresT: "Œuvres ajoutées récemment, pas encore classées.", n: (n) => `${n} œuvres`, aucun: "Aucune œuvre dans ce format ici.",
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  const titre = fr ? "Collection – SIBCOD" : "Collection – SIBCOD";
  const description = fr
    ? "Toute la collection Sibcod, par couleur ou par thème : des œuvres qui s'accordent entre elles, en portrait, paysage ou panorama."
    : "The whole Sibcod collection, by colour or by theme: artworks that go together, in portrait, landscape or panorama.";
  return { title: titre, description, alternates: alternates("/collection", fr ? "fr" : "en") };
}

export default async function Collection({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const mode = sp.mode === "theme" ? "theme" : sp.mode === "couleur" ? "couleur" : "tout";
  const fmt = FORMATS.some((f) => f.id === sp.format) ? sp.format : "tous";
  const { oeuvres: toutes, images, polyptyques } = await catalogue(lang);
  // une œuvre enregistrée deux fois (même image sous deux titres) n'apparaît qu'une fois
  const oeuvres = toutes.filter((o) => !o.doublon);
  const poly = fmt === "polyptyque";

  const lien = (m, f) => {
    const p = new URLSearchParams();
    if (m !== "tout") p.set("mode", m);
    if (f !== "tous") p.set("format", f);
    if (lang === "fr") p.set("lang", "fr");
    const s = p.toString();
    return `/collection${s ? "?" + s : ""}`;
  };
  const filtre = (l) => (fmt === "tous" ? l : l.filter((o) => o.format === fmt || (fmt === "paysage" && o.format === "carre")));
  const familles = (mode === "couleur" ? PALETTES : THEMES).map((f) => ({
    ...f,
    dot: mode === "couleur" ? f.c : null,
    liste: filtre(rangerFamille(oeuvres.filter((o) => (mode === "couleur" ? o.palette.includes(f.id) : o.themes.includes(f.id))), (mode === "couleur" ? "p:" : "t:") + f.id)),
  }));
  const rang = Object.fromEntries(DEROULE.map((id, i) => [id, i]));
  // le filtre Panorama montre les panoramas eux-mêmes (dans la galerie, une œuvre en panneaux montre ses panneaux)
  const panos = oeuvres.flatMap((o) => o.variantes.filter((v) => v.ratio >= 1.75).map((v) => ({ ...v, oeuvre: o.id, ordre: 0, format: "panorama" })));
  const flot = filtre([...(fmt === "panorama" ? panos : images)].sort((a, b) => (rang[a.oeuvre] ?? 1e4) - (rang[b.oeuvre] ?? 1e4) || a.ordre - b.ordre));
  const autres = filtre(oeuvres.filter((o) => !o.palette.length));
  const Q = lang === "fr" ? "?lang=fr" : "";

  return (
    <div className="wrap">
      <Entete lang={lang} actif="collection" hrefLang={(l) => {
        const p = new URLSearchParams(); if (mode !== "tout") p.set("mode", mode); if (fmt !== "tous") p.set("format", fmt); if (l === "fr") p.set("lang", "fr");
        const s = p.toString(); return `/collection${s ? "?" + s : ""}`;
      }} />
      <section className="n-col-tete">
        <p className="n-k">{t.k(oeuvres.length)}</p>
        <h1>{t.h1}</h1>
        <p className="n-lead">{t.s}</p>
        <div className="n-modes">
          <a href={lien("tout", fmt)} className={mode === "tout" ? "n-arc on" : "n-arc"}>{t.tout}</a>
          <a href={lien("couleur", fmt)} className={mode === "couleur" ? "on" : ""}>{t.couleur}</a>
          <a href={lien("theme", fmt)} className={mode === "theme" ? "on" : ""}>{t.theme}</a>

        </div>
      </section>

      <div className="n-barre">
        {mode === "tout" || poly ? <p className="n-petit n-flot-s">{poly ? t.polyS : t.toutS}</p> : <nav className="n-sauts" aria-label={lang === "fr" ? "Familles" : "Families"}>
          {familles.map((f) => (
            <a key={f.id} href={`#f-${f.id}`}>{f.dot && <i style={{ background: f.dot }} />}{f[lang]}</a>
          ))}
        </nav>}
        <nav className="n-formats" aria-label={t.format}>
          <span>{t.format}</span>
          {[{ id: "tous", fr: t.tous, en: t.tous }, ...FORMATS.filter((f) => f.id !== "carre")].map((f) => (
            <a key={f.id} href={lien(mode, f.id)} className={fmt === f.id ? "on" : ""}>{f[lang]}</a>
          ))}
        </nav>
      </div>

      {poly && (
        <section className="n-polys" aria-label={t.polyT}>
          {polyptyques.map((p) => (
            <a key={p.id} className="n-carte n-carte-poly" href={`/oeuvre/${p.panneaux[0].id}${Q}`}>
              <span className="n-mat"><Poly o={p} /></span>
              <span className="n-carte-t"><strong>{p.titre}</strong></span>
              <span className="n-petit">{typePoly(p.panneaux.length, lang)} · {p.panneaux.length} {t.panneaux}</span>
            </a>
          ))}
        </section>
      )}
      {!poly && mode === "tout" && (
        <section className="n-flot" aria-label={t.tout}>
          {flot.length === 0 && <p className="n-petit">{t.aucun}</p>}
          {flot.map((o) => (
            <a key={o.id} className={o.ratio >= 1.7 ? "n-flot-o large" : "n-flot-o"} href={`/oeuvre/${o.id}${Q}`} style={{ flexGrow: o.ratio, flexBasis: `${Math.round(o.ratio * 230)}px`, aspectRatio: String(o.ratio) }}>
              <img src={o.img} alt={o.titre} loading="lazy" />
              <span>{o.titre}</span>
            </a>
          ))}
          <i className="n-flot-fin" aria-hidden="true" />
        </section>
      )}
      {!poly && mode !== "tout" && familles.map((f) => (
        <section key={f.id} id={`f-${f.id}`} className="n-famille">
          <div className="n-famille-tete">
            {f.ech ? (
              <div className="n-planche petite"><img className="n-planche-piece" src={f.img} alt="" loading="lazy" />{f.ech.map((e) => <img key={e} className="n-planche-ech" src={e} alt="" loading="lazy" />)}</div>
            ) : <img src={f.img} alt="" loading="lazy" />}
            <h2>{f.dot && <i style={{ background: f.dot }} />}{f[lang]}</h2>
            <p>{lang === "fr" ? f.tfr : f.ten}</p>
            <span className="n-petit">{t.n(f.liste.length)}</span>
          </div>
          <div className="n-grille">
            {f.liste.length === 0 && <p className="n-petit">{t.aucun}</p>}
            {f.liste.map((o) => <Carte key={o.id} o={o} lang={lang} mode={mode} Q={Q} />)}
          </div>
        </section>
      ))}
      {!poly && mode !== "tout" && autres.length > 0 && (
        <section className="n-famille">
          <div className="n-famille-tete"><h2>{t.autres}</h2><p>{t.autresT}</p></div>
          <div className="n-grille">{autres.map((o) => <Carte key={o.id} o={o} lang={lang} mode={mode} Q={Q} />)}</div>
        </section>
      )}
      <Pied lang={lang} />
    </div>
  );
}

// range une famille selon l'ordre enregistré ; les œuvres absentes de cet ordre viennent à la fin
function rangerFamille(liste, cle) {
  const r = Object.fromEntries((ORDRES[cle] || []).map((id, i) => [id, i]));
  return [...liste].sort((a, b) => (r[a.id] ?? 1e4) - (r[b.id] ?? 1e4));
}

function Carte({ o, lang, mode, Q }) {
  const c = (id) => PALETTES.find((p) => p.id === id)?.c;
  const sous = mode === "couleur" ? nom(THEMES, o.theme, lang) : nom(PALETTES, o.palette[0], lang);
  return (
    <a className={o.ratio >= 1.7 ? "n-carte large" : "n-carte"} href={`/oeuvre/${o.id}${Q}`}>
      <span className="n-mat"><img src={o.img} alt={o.titre} loading="lazy" /></span>
      <span className="n-carte-t">
        <span>{o.titre}</span>
        <span className="n-pts" aria-hidden="true">{o.palette.map((p) => <i key={p} style={{ background: c(p) }} />)}</span>
      </span>
      <span className="n-petit">{[sous, nom(FORMATS, o.format, lang)].filter(Boolean).join(" · ")}</span>
    </a>
  );
}

// panneaux d'un polyptyque, côte à côte, chacun à sa proportion
function Poly({ o }) {
  const total = ratioPoly(o);
  return (
    <span className="n-poly" style={{ aspectRatio: String(total), gap: `${(ECART_POLY / total) * 100}%` }}>
      {o.panneaux.map((p) => <img key={p.id} src={p.img} alt={p.titre} loading="lazy" style={{ width: `${(p.ratio / total) * 100}%` }} />)}
    </span>
  );
}
