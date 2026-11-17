"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ROW = 8, GAP = 40;

export default function Galerie({ items, buy, soon }) {
  const ref = useRef(null);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const cells = Array.from(ref.current.children);
    const mesure = () => {
      cells.forEach((c) => {
        const h = c.firstChild.getBoundingClientRect().height;
        c.style.gridRowEnd = `span ${Math.ceil((h + GAP) / ROW)}`;
      });
      setPret(true);
    };
    mesure();
    const ro = new ResizeObserver(mesure);
    ro.observe(ref.current);
    window.addEventListener("resize", mesure);
    return () => { ro.disconnect(); window.removeEventListener("resize", mesure); };
  }, [items]);

  return (
    <div ref={ref} className="grid" style={{ opacity: pret ? 1 : 0 }}>
      {items.map((o) => (
        <div key={o.id} className={`cell s${o.span}`}>
          <article className="card">
            <Link className="img" href={o.href} style={{ aspectRatio: o.ratio }}>
              {o.src && <img src={o.src} alt={o.titre} loading="lazy" />}
            </Link>
            <div className="meta">
              <div>
                <Link className="t" href={o.href}>{o.titre}</Link>
                <div className="s">{o.sous}</div>
              </div>
              {o.buyUrl ? (
                <a className="buy" href={o.buyUrl} target="_blank" rel="noopener noreferrer">{buy}</a>
              ) : (
                <span className="soon">{soon}</span>
              )}
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
