"use client";
// Accueil : un salon garni d'un mur d'œuvres, tirées au hasard dans une famille de couleur à chaque visite.
// Les œuvres sont à l'échelle du salon (canapé ≈ 2,3 m) et accrochées derrière les plantes.
import { useEffect, useRef, useState } from "react";

// image du salon : 1445 × 1036 px ; 4,5 px par cm ; centre du mur d'œuvres et ligne médiane entre les deux rangées
const IW = 1445, IH = 1036, PXCM = 4.5, CX = 650, AXE = 365, ECART = 6;
// deux rangées, alignées de part et d'autre de la ligne médiane : orientation et hauteur réelle (cm) de chaque emplacement
const GABARIT = [
  [["p", 50], ["l", 50], ["p", 61], ["p", 50]],
  [["l", 38], ["p", 50], ["l", 50], ["p", 50]],
];

function melanger(l, graine) {
  const a = [...l];
  let s = graine;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function composer(oeuvres, palettes, graine) {
  const pal = palettes[graine % palettes.length];
  const pool = melanger(oeuvres.filter((o) => o.palette.includes(pal)), graine);
  const pris = new Set();
  const prendre = (sens) => {
    const o = pool.find((x) => !pris.has(x.id) && (sens === "p" ? x.ratio < 0.9 : x.ratio > 1.12 && x.ratio < 1.7));
    if (o) pris.add(o.id);
    return o;
  };
  const rangees = GABARIT.map((r) => r.map(([sens, h]) => {
    const o = prendre(sens);
    return o ? { ...o, h, w: h * o.ratio } : null;
  }).filter(Boolean));
  const pos = [];
  rangees.forEach((r, ri) => {
    const larg = r.reduce((t, x) => t + x.w, 0) + ECART * (r.length - 1);
    let x = CX / PXCM - larg / 2;
    r.forEach((it) => {
      // rangée du haut : alignée en bas sur la ligne médiane ; rangée du bas : alignée en haut
      const haut = ri === 0 ? AXE / PXCM - ECART / 2 - it.h : AXE / PXCM + ECART / 2;
      pos.push({ ...it, x, y: haut });
      x += it.w + ECART;
    });
  });
  return pos;
}

export default function SalonAccueil({ oeuvres, palettes, lang, lien }) {
  const fr = lang === "fr";
  const [graine, setGraine] = useState(0);
  const defile = useRef(null);
  // une composition différente à chaque visite (tirée après l'affichage, pour que la page serveur reste stable)
  useEffect(() => { setGraine(1 + Math.floor(Math.random() * 1000)); }, []);
  // sur téléphone, la scène s'ouvre centrée sur le canapé
  useEffect(() => {
    const centrer = () => {
      const el = defile.current;
      if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth * (CX / IW) - el.clientWidth / 2;
    };
    const id = requestAnimationFrame(centrer);
    return () => cancelAnimationFrame(id);
  }, [graine]);
  const pos = composer(oeuvres, palettes, graine);
  const pc = (v, t) => `${(v / t) * 100}%`;
  return (
    <div className="n-salon">
      <div className="n-salon-defile" ref={defile}>
        <div className="n-salon-scene">
          {pos.map((o) => (
            <a key={o.id} href={o.href} className="n-salon-oeuvre" title={o.titre}
              style={{ left: pc(o.x * PXCM, IW), top: pc(o.y * PXCM, IH), width: pc(o.w * PXCM, IW), height: pc(o.h * PXCM, IH) }}>
              <img src={o.img} alt={o.titre} loading="lazy" />
            </a>
          ))}
          <img className="n-salon-decor" src="/ambiance/salon-accueil.webp" alt="" aria-hidden="true" />
        </div>
      </div>
      <p className="n-salon-glisser" aria-hidden="true">← {fr ? "faites glisser" : "swipe"} →</p>
      <div className="n-salon-actions">
        <button type="button" className="n-lien" onClick={() => setGraine((g) => g + 1)}>↻ {fr ? "Une autre composition" : "Another composition"}</button>
        <a className="n-btn" href={lien}>{fr ? "Composer mon mur" : "Compose my wall"} →</a>
      </div>
    </div>
  );
}
