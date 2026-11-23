import Pied from "../Pied";
import Entete from "../Entete";
import { catalogue } from "../../lib/catalogue";
import { PALETTES, THEMES, FORMATS, nom } from "../../lib/libelles";
import { alternates } from "../../lib/seo";

const T = {
  en: {
    k: (n) => `Collection · ${n} artworks`, h1: "A collection designed like a colour chart",
    s: "Start from the colour of your room, or from the atmosphere you are looking for. Every artwork in a family goes with the others.",
    couleur: "By colour", theme: "By theme", format: "Format", tous: "All", autres: "Other artworks",
    autresT: "Recently added artworks, not yet placed in a family.", n: (n) => `${n} artworks`, aucun: "No artwork in this format here.",
  },
  fr: {
    k: (n) => `Collection · ${n} œuvres`, h1: "Une collection pensée comme un nuancier",
    s: "Entrez par la couleur de votre pièce, ou par l'atmosphère que vous cherchez. Toutes les œuvres d'une même famille s'accordent entre elles.",
    couleur: "Par couleur", theme: "Par thème", format: "Format", tous: "Tous", autres: "Autres œuvres",
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
  const mode = sp.mode === "theme" ? "theme" : "couleur";
  const fmt = FORMATS.some((f) => f.id === sp.format) ? sp.format : "tous";
  const { oeuvres } = await catalogue(lang);

  const lien = (m, f) => {
    const p = new URLSearchParams();
    if (m === "theme") p.set("mode", "theme");
    if (f !== "tous") p.set("format", f);
    if (lang === "fr") p.set("lang", "fr");
    const s = p.toString();
    return `/collection${s ? "?" + s : ""}`;
  };
  const filtre = (l) => (fmt === "tous" ? l : l.filter((o) => o.format === fmt || (fmt === "paysage" && o.format === "carre")));
  const familles = (mode === "couleur" ? PALETTES : THEMES).map((f) => ({
    ...f,
    dot: mode === "couleur" ? f.c : null,
    liste: filtre(oeuvres.filter((o) => (mode === "couleur" ? o.palette[0] === f.id : o.theme === f.id))),
  }));
  const autres = filtre(oeuvres.filter((o) => !o.palette.length));
  const Q = lang === "fr" ? "?lang=fr" : "";

  return (
    <div className="wrap">
      <Entete lang={lang} actif="collection" hrefLang={(l) => {
        const p = new URLSearchParams(); if (mode === "theme") p.set("mode", "theme"); if (fmt !== "tous") p.set("format", fmt); if (l === "fr") p.set("lang", "fr");
        const s = p.toString(); return `/collection${s ? "?" + s : ""}`;
      }} />
      <section className="n-col-tete">
        <p className="n-k">{t.k(oeuvres.length)}</p>
        <h1>{t.h1}</h1>
        <p className="n-lead">{t.s}</p>
        <div className="n-modes">
          <a href={lien("couleur", fmt)} className={mode === "couleur" ? "on" : ""}>{t.couleur}</a>
          <a href={lien("theme", fmt)} className={mode === "theme" ? "on" : ""}>{t.theme}</a>
        </div>
      </section>

      <div className="n-barre">
        <nav className="n-sauts" aria-label={lang === "fr" ? "Familles" : "Families"}>
          {familles.map((f) => (
            <a key={f.id} href={`#f-${f.id}`}>{f.dot && <i style={{ background: f.dot }} />}{f[lang]}</a>
          ))}
        </nav>
        <nav className="n-formats" aria-label={t.format}>
          <span>{t.format}</span>
          {[{ id: "tous", fr: t.tous, en: t.tous }, ...FORMATS.filter((f) => f.id !== "carre")].map((f) => (
            <a key={f.id} href={lien(mode, f.id)} className={fmt === f.id ? "on" : ""}>{f[lang]}</a>
          ))}
        </nav>
      </div>

      {familles.map((f) => (
        <section key={f.id} id={`f-${f.id}`} className="n-famille">
          <div className="n-famille-tete">
            <img src={f.img} alt="" loading="lazy" />
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
      {autres.length > 0 && (
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
      <span className="n-mat"><img src={o.img} alt={o.titre} loading="lazy" /></span>
      <span className="n-carte-t">
        <span>{o.titre}</span>
        <span className="n-pts" aria-hidden="true">{o.palette.map((p) => <i key={p} style={{ background: c(p) }} />)}</span>
      </span>
      <span className="n-petit">{[sous, nom(FORMATS, o.format, lang)].filter(Boolean).join(" · ")}</span>
    </a>
  );
}
