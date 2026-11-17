"use client";
import { useEffect, useState } from "react";

const SLIDES = [
  { img: "/banner/b1.jpg", pos: "50% 40%",
    en: ["Interior art", "A palette born of tropical light, on many supports."],
    fr: ["Art d'intérieur", "Une palette née de la lumière des tropiques, des supports multiples."] },
  { img: "/banner/b2.jpg", pos: "50% 62%",
    en: ["Wall art", "ENRICH YOUR WALLS"],
    fr: ["Décoration murale", "ENRICHISSEZ VOS MURS"] },
  { img: "/banner/b3.jpg", pos: "50% 55%",
    en: ["Always more to discover", "A large body of work, put online progressively."],
    fr: ["Toujours plus à découvrir", "Une production large, mise en ligne progressivement."] },
];

export default function Banniere({ lang }) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    if (pause) return;
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, [pause]);
  const go = (d) => setI((x) => (x + d + SLIDES.length) % SLIDES.length);
  return (
    <section className="banner" aria-roledescription="carousel" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      {SLIDES.map((s, k) => (
        <div key={k} className={`slide${k === i ? " on" : ""}`} aria-hidden={k !== i}>
          <img src={s.img} alt="" style={{ objectPosition: s.pos }} loading={k === 0 ? "eager" : "lazy"} />
          <div className="cap">
            <h2>{s[lang][0]}</h2>
            <p>{s[lang][1]}</p>
            <a href="#oeuvres" className="explore">{lang === "fr" ? "Explorer" : "Explore"}</a>
          </div>
        </div>
      ))}
      <button className="arr l" onClick={() => go(-1)} aria-label="Previous">‹</button>
      <button className="arr r" onClick={() => go(1)} aria-label="Next">›</button>
      <div className="dots">
        {SLIDES.map((_, k) => (
          <button key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
        ))}
      </div>
    </section>
  );
}
