"use client";
import { useState } from "react";

const PRESETS = [8, 12, 16, 20, 24, 28, 36, 48, 60, 72, 96];
const WALL_W = 300, WALL_H = 250; // cm représentés par la scène

export default function ScaleView({ src, alt, maxIn, lang, title, hint }) {
  const sizes = [...PRESETS.filter((n) => n < maxIn), maxIn];
  const [size, setSize] = useState(sizes[Math.min(2, sizes.length - 1)]);
  const [ratio, setRatio] = useState(1.33);
  const cmOf = (po) => Math.round(po * 2.54);
  const long = size * 2.54;
  const w = ratio >= 1 ? long : long * ratio;
  const h = ratio >= 1 ? long / ratio : long;
  const bottomCm = Math.max(0, Math.min(110, WALL_H - 15 - h)); // au-dessus du canapé, sans dépasser le plafond
  const label = lang === "fr" ? `${Math.round(w)} × ${Math.round(h)} cm` : `${Math.round(w / 2.54)} × ${Math.round(h / 2.54)} in`;
  return (
    <section className="scale">
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      <div className="sizes">
        {sizes.map((n) => (
          <button key={n} className={n === size ? "on" : ""} onClick={() => setSize(n)}>
            {lang === "fr" ? `${cmOf(n)} cm` : `${n} in`}
          </button>
        ))}
      </div>
      <div className="room">
        <div className="floor" />
        <div className="art" style={{ width: `${(w / WALL_W) * 100}%`, height: `${(h / WALL_H) * 100}%`, bottom: `${(6 + (bottomCm / WALL_H) * 94)}%` }}>
          <img src={src} alt={alt} onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)} />
        </div>
        {/* canapé : 220 cm de large, 85 cm de haut */}
        <svg viewBox="0 0 220 85" aria-hidden="true">
          <rect x="0" y="25" width="220" height="55" rx="10" fill="#b9ad9a" />
          <rect x="10" y="0" width="200" height="50" rx="12" fill="#c9bdaa" />
          <rect x="6" y="78" width="10" height="7" fill="#7b6f5e" />
          <rect x="204" y="78" width="10" height="7" fill="#7b6f5e" />
        </svg>
        <div className="dim" style={{ bottom: `${(6 + ((bottomCm + h) / WALL_H) * 94) + 1}%`, display: (bottomCm + h) / WALL_H > 0.93 ? "none" : "block" }}>{label}</div>
      </div>
    </section>
  );
}
