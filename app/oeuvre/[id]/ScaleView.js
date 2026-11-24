"use client";
import { useEffect, useState } from "react";
import { MURS, estSombre } from "../../../lib/murs";

const PRESETS = [8, 12, 16, 20, 24, 28, 36, 48, 60, 72, 96];
const WALL_W = 300, WALL_H = 250; // cm représentés par la scène

export default function ScaleView({ init, lang, title, hint }) {
  // version affichée : l'image principale de la page, ou celle choisie dans « Versions disponibles »
  const [cur, setCur] = useState(init);
  const maxIn = cur.maxPo || 96;
  const sizes = [...PRESETS.filter((n) => n < maxIn), maxIn];
  const [size, setSize] = useState(sizes[Math.min(2, sizes.length - 1)]);
  useEffect(() => {
    const f = (e) => {
      const v = e.detail; setCur(v);
      const s2 = [...PRESETS.filter((n) => n < (v.maxPo || 96)), v.maxPo || 96];
      setSize((s) => (s2.includes(s) ? s : s2[Math.min(2, s2.length - 1)]));
    };
    window.addEventListener("sib-variante", f);
    return () => window.removeEventListener("sib-variante", f);
  }, []);
  const ratio = cur.ratio || 1.33;
  const src = cur.img, alt = cur.titre;
  const [mur, setMur] = useState("lin");
  const murC = MURS.find((m) => m.id === mur);
  const cmOf = (po) => Math.round(po * 2.54);
  const long = size * 2.54;
  const w = ratio >= 1 ? long : long * ratio;
  const h = ratio >= 1 ? long / ratio : long;
  const bottomCm = Math.max(0, Math.min(110, WALL_H - 15 - h)); // au-dessus du canapé, sans dépasser le plafond
  const label = lang === "fr" ? `${Math.round(w)} × ${Math.round(h)} cm` : `${Math.round(w / 2.54)} × ${Math.round(h / 2.54)} in`;
  return (
    <section className="scale" id="a-l-echelle">
      <h2>{title}</h2>
      <p className="n-petit n-scale-version">{cur.titre}</p>
      <p className="hint">{hint}</p>
      <div className="sizes">
        {sizes.map((n) => (
          <button key={n} className={n === size ? "on" : ""} onClick={() => setSize(n)}>
            {lang === "fr" ? `${cmOf(n)} cm` : `${n} in`}
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
        <img className="n-silhouette" src="/ambiance/silhouette.webp" alt="" aria-hidden="true" style={{ width: `${(258.3 / WALL_W) * 100}%`, left: `${((WALL_W / 2 - 136.2) / WALL_W) * 100}%`, bottom: `${6 - (2.6 / WALL_H) * 94}%` }} />
        <div className="dim" style={{ bottom: `${(6 + ((bottomCm + h) / WALL_H) * 94) + 1}%`, display: (bottomCm + h) / WALL_H > 0.93 ? "none" : "block" }}>{label}</div>
      </div>
    </section>
  );
}
