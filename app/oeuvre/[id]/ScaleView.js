"use client";
import { useEffect, useState } from "react";
import { MURS, estSombre } from "../../../lib/murs";
import { taillesPictorem, enCm, libelle } from "../../../lib/tailles";
const WALL_W = 300, WALL_H = 250; // cm représentés par la scène

export default function ScaleView({ init, lang, title, hint }) {
  // version affichée : l'image principale de la page, ou celle choisie dans « Versions disponibles »
  const [cur, setCur] = useState(init);
  // tailles réellement proposées par Pictorem pour cette version ; la plus grande par défaut
  const sizes = taillesPictorem(cur);
  const [idx, setIdx] = useState(sizes.length - 1);
  useEffect(() => {
    const f = (e) => {
      const v = e.detail; setCur(v);
      setIdx(taillesPictorem(v).length - 1);
    };
    window.addEventListener("sib-variante", f);
    return () => window.removeEventListener("sib-variante", f);
  }, []);
  const ratio = cur.ratio || 1.33;
  const src = cur.img, alt = cur.titre;
  const [mur, setMur] = useState("lin");
  const murC = MURS.find((m) => m.id === mur);
  const t = sizes[Math.min(idx, sizes.length - 1)];
  const w = enCm(t.w), h = enCm(t.h);
  // bas de l'œuvre à 22 cm au-dessus du dossier du canapé (85 cm), sans dépasser le plafond
  const bottomCm = Math.max(0, Math.min(107, WALL_H - 15 - h));
  const label = libelle(t, lang);
  return (
    <section className="scale" id="a-l-echelle">
      <h2>{title}</h2>
      <p className="n-petit n-scale-version">{cur.titre}</p>
      <p className="hint">{hint}</p>
      <div className="sizes">
        {sizes.map((x, i) => (
          <button key={i} className={i === idx ? "on" : ""} onClick={() => setIdx(i)}>
            {libelle(x, lang)}
          </button>
        ))}
      </div>
      <div className="n-teintes petit" role="group" aria-label={lang === "fr" ? "Couleur du mur" : "Wall colour"}>
        {MURS.map((m) => (
          <button key={m.id} type="button" title={m[lang]} aria-label={m[lang]} aria-pressed={mur === m.id} className={mur === m.id ? "on" : ""} style={{ background: m.c }} onClick={() => setMur(m.id)} />
        ))}
        <span className="n-teinte-nom">{murC[lang]}</span>
      </div>
      <div className={estSombre(murC.c) ? "room sombre" : "room"} style={{ background: murC.c }}>
        <div className="floor" />
        <div className="art" style={{ width: `${(w / WALL_W) * 100}%`, height: `${(h / WALL_H) * 100}%`, bottom: `${(6 + (bottomCm / WALL_H) * 94)}%` }}>
          <img src={src} alt={alt} />
        </div>
        {/* canapé : 220 cm de large, 85 cm de haut */}
        <img className="n-silhouette" src="/ambiance/silhouette-2.webp" alt="" aria-hidden="true" style={{ width: `${(258.3 / WALL_W) * 100}%`, left: `${((WALL_W / 2 - 136.2) / WALL_W) * 100}%`, bottom: `${6 - (2.6 / WALL_H) * 94}%` }} />
        <div className="dim" style={{ bottom: `${(6 + ((bottomCm + h) / WALL_H) * 94) + 1}%`, display: (bottomCm + h) / WALL_H > 0.93 ? "none" : "block" }}>{label}</div>
      </div>
    </section>
  );
}
