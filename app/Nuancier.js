"use client";
import { useState } from "react";

// Aperçu du nuancier : une palette choisie -> photo d'ambiance + œuvres accordées
export default function Nuancier({ palettes, oeuvres, lang, tout, toutImg, voirTout }) {
  const [p, setP] = useState("tout");
  const pal = palettes.find((x) => x.id === p);
  const liste = (p === "tout" ? oeuvres : oeuvres.filter((o) => o.palette.includes(p))).slice(0, 12);
  return (
    <div className="n-nuancier">
      <div className="n-chips" role="radiogroup" aria-label={lang === "fr" ? "Palette" : "Palette"}>
        <button type="button" role="radio" aria-checked={p === "tout"} className={p === "tout" ? "on" : ""} onClick={() => setP("tout")}>
          <span className="n-dot" style={{ background: "conic-gradient(#7FC4CF 0 25%, #8FA77E 0 50%, #D9735E 0 75%, #D8CBB5 0)" }} />{tout}
        </button>
        {palettes.map((x) => (
          <button type="button" role="radio" aria-checked={p === x.id} key={x.id} className={p === x.id ? "on" : ""} onClick={() => setP(x.id)}>
            <span className="n-dot" style={{ background: x.c }} />{x[lang]}
          </button>
        ))}
      </div>
      <div className="n-nuancier-corps">
        <figure className="n-mood" key={p}>
          <img src={pal ? pal.img : toutImg} alt="" />
          {pal && <figcaption>{lang === "fr" ? pal.tfr : pal.ten}</figcaption>}
        </figure>
        <div className="n-mini">
          {liste.map((o) => (
            <a key={o.id} href={o.href} className="n-mini-item">
              <img src={o.img} alt={o.titre} loading="lazy" />
              <span>{o.titre}</span>
            </a>
          ))}
        </div>
      </div>
      <a className="n-lien" href={voirTout.href}>{voirTout.txt} →</a>
    </div>
  );
}
