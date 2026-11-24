import Pied from "../Pied";
import Entete from "../Entete";
import { catalogue } from "../../lib/catalogue";
import { PALETTES, THEMES, FORMATS, nom, ratioPoly, typePoly, ECART_POLY } from "../../lib/libelles";
import { alternates } from "../../lib/seo";
import DEROULE from "../../data/deroule.json";

const T = {
  en: {
    k: (n) => `Collection · ${n} artworks`, h1: "A collection designed like a colour chart",
    s: "Start from the colour of your room, or from the atmosphere you are looking for. Every artwork in a family goes with the others.",
    tout: "All artworks", toutS: "The whole collection in one flow: each artwork leads to the next through its colours.", couleur: "By colour", theme: "By theme", format: "Format", tous: "All", autres: "Other artworks",
    autresT: "Recently added artworks, not yet placed in a family.", n: (n) => `${n} artworks`, aucun: "No artwork in this format here.",
  },
  fr: {
    k: (n) => `Collection · ${n} œuvres`, h1: "Une collection pensée comme un nuancier",
    s: "Entrez par la couleur de votre pièce, ou par l'atmosphère que vous cherchez. Toutes les œuvres d'une même famille s'accordent entre elles.",
    tout: "Toute la galerie", toutS: "Toute la collection d'un seul tenant : chaque œuvre mène à la suivante par ses couleurs.", couleur: "Par couleur", theme: "Par thème", format: "Format", tous: "Tous", autres: "Autres œuvres",
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
  const { oeuvres } = await catalogue(lang);

  const lien = (m, f) => {
    const p = new URLSearchParams();
    if (m !== "tout") p.set("mode", m);
    if (f !== "tous") p.set("format", f);
    if (lang === "fr") p.set("lang", "fr");
    const s = p.toString();
    return `/collection${s ? "?" + s : ""}`;
  };
  const filtre = (l) => (fmt === "tous" ? l : fmt === "polyptyque" ? l.filter((o) => o.panneaux.length > 1) : l.filter((o) => o.format === fmt || (fmt === "paysage" && o.format === "carre")));
  const familles = (mode === "couleur" ? PALETTES : THEMES).map((f) => ({
    ...f,
    dot: mode === "couleur" ? f.c : null,
    liste: filtre(oeuvres.filter((o) => (mode === "couleur" ? o.palette[0] === f.id : o.theme === f.id))),
  }));
  const rang = Object.fromEntries(DEROULE.map((id, i) => [id, i]));
  const flot = filtre([...oeuvres].sort((a, b) => (rang[a.id] ?? 1e4) - (rang[b.id] ?? 1e4)));
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
        {mode === "tout" ? <p className="n-petit n-flot-s">{t.toutS}</p> : <nav className="n-sauts" aria-label={lang === "fr" ? "Familles" : "Families"}>
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

      {mode === "tout" && (
        <section className="n-flot" aria-label={t.tout}>
          {flot.length === 0 && <p className="n-petit">{t.aucun}</p>}
          {flot.map((o) => (
            <a key={o.id} className={o.panneaux.length > 1 ? "n-flot-o poly" : "n-flot-o"} href={`/oeuvre/${o.id}${Q}`} style={{ flexGrow: ratioPoly(o), flexBasis: `${Math.round(ratioPoly(o) * 230)}px`, aspectRatio: String(ratioPoly(o)) }}>
              {o.panneaux.length > 1 ? <Poly o={o} /> : <img src={o.img} alt={o.titre} loading="lazy" />}
              <span>{o.titre}</span>
            </a>
          ))}
          <i className="n-flot-fin" aria-hidden="true" />
        </section>
      )}
      {mode !== "tout" && familles.map((f) => (
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
      {mode !== "tout" && autres.length > 0 && (
        <section className="n-famille">
          <div className="n-famille-tete"><h2>{t.autres}</h2><p>{t.autresT}</p></div>
          <div className="n-grille">{autres.map((o) => <Carte key={o.id} o={o} lang={lang} mode={mode} Q={Q} />)}</div>
        </section>
      )}
      <Pied lang={lang} />
    </div>
  );
}

function Carte({ o, lang, mode, Q }) {
  const c = (id) => PALETTES.find((p) => p.id === id)?.c;
  const sous = mode === "couleur" ? nom(THEMES, o.theme, lang) : nom(PALETTES, o.palette[0], lang);
  return (
    <a className="n-carte" href={`/oeuvre/${o.id}${Q}`}>
      <span className="n-mat">{o.panneaux.length > 1 ? <Poly o={o} /> : <img src={o.img} alt={o.titre} loading="lazy" />}</span>
      <span className="n-carte-t">
        <span>{o.titre}</span>
        <span className="n-pts" aria-hidden="true">{o.palette.map((p) => <i key={p} style={{ background: c(p) }} />)}</span>
      </span>
      <span className="n-petit">{[sous, o.panneaux.length > 1 ? typePoly(o.panneaux.length, lang) : nom(FORMATS, o.format, lang)].filter(Boolean).join(" · ")}</span>
    </a>
  );
}

// panneaux d'un polyptyque, côte à côte, chacun à sa proportion
function Poly({ o }) {
  const total = ratioPoly(o);
  return (
    <span className="n-poly" style={{ aspectRatio: String(total), gap: `${(ECART_POLY / total) * 100}%` }}>
      {o.panneaux.map((p) => <img key={p.id} src={p.img} alt={o.titre} loading="lazy" style={{ width: `${(p.ratio / total) * 100}%` }} />)}
    </span>
  );
}
