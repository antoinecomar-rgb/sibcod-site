import Link from "next/link";
import PLAN from "../data/galerie.json";

// Galerie composée : suite chromatique pré-calculée (data/galerie.json),
// rythmée par des séquences « At Home » (mises en situation).
// Hors filtre « Toutes », les œuvres gardent le même ordre, sans les séquences.

const LABEL = {
  en: { t: "At home with Sibcod", s: "Prints in real interiors", alt: "Sibcod artwork at home" },
  fr: { t: "Sibcod chez vous", s: "Nos tirages dans de vrais intérieurs", alt: "Œuvre Sibcod dans un intérieur" },
};

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// Fenêtre d'affichage de l'œuvre dans son passe-partout, en % de la cellule.
// L'image remplit la fenêtre (recadrage léger si le format de l'œuvre s'en écarte).
function fenetre(r, large) {
  if (!large) {
    const H = 1.25, aw = 0.88, top = 0.06 * H, ah = H * (1 - 0.06 - 0.13);
    const a = clamp(r, 0.78, 0.86);
    const w = Math.min(aw, a * ah), h = w / a;
    return { left: ((1 - w) / 2) * 100, top: ((top + (ah - h) / 2) / H) * 100, width: w * 100, height: (h / H) * 100 };
  }
  const H = 426 / 686, aw = 0.9, top = 0.07 * H, ah = H * (1 - 0.07 - 0.15);
  const a = r >= 1.9 ? r : clamp(r, 1.45, 1.85);
  const w = Math.min(aw, a * ah), h = w / a;
  return { left: ((1 - w) / 2) * 100, top: ((top + (ah - h) / 2) / H) * 100, width: w * 100, height: (h / H) * 100 };
}

function Carte({ o, large, soon, buy }) {
  const f = fenetre(o.ratio, large);
  const pos = { left: `${f.left}%`, top: `${f.top}%`, width: `${f.width}%`, height: `${f.height}%` };
  return (
    <div className={`mat${large ? " w2" : ""}`}>
      <Link href={o.href} className="mat-lien" tabIndex={-1} aria-hidden="true">
        <span className="win" style={pos}>
          {o.src && <img src={o.src} alt={o.titre} loading="lazy" />}
        </span>
      </Link>
      <span className="lbl">
        <Link href={o.href} className="t">{o.titre}</Link>
        {o.buyUrl ? (
          <a className="buy" href={o.buyUrl} target="_blank" rel="noopener noreferrer">{buy}</a>
        ) : (
          <em>{soon}</em>
        )}
      </span>
    </div>
  );
}

function Photo({ src, cls, label, alt }) {
  return (
    <figure className={`ph ${cls || ""}`}>
      <img src={src} alt={alt} loading="lazy" />
      {label && (
        <figcaption className="athome">
          <span>{label.t}</span>
          <small>{label.s}</small>
        </figcaption>
      )}
    </figure>
  );
}

export default function GalerieComposee({ items, lang, sequences, soon, buy }) {
  const L = LABEL[lang];
  const vus = new Set();
  const carte = (id, w) => {
    const o = items[id];
    if (!o) return null;
    vus.add(id);
    return <Carte key={id} o={o} large={w === 2} soon={soon} buy={buy} />;
  };
  const restants = () => Object.keys(items).filter((id) => !vus.has(id));
  const largeur = (id) => (items[id].ratio >= 1.2 ? 2 : 1);

  if (!sequences) {
    const ids = PLAN.blocks.flatMap((b) => b.items.map(([id]) => id)).filter((id) => items[id]);
    const tous = [...ids, ...Object.keys(items).filter((id) => !ids.includes(id))];
    return (
      <div className="gal">
        <div className="blk row dense">{tous.map((id) => carte(id, largeur(id)))}</div>
      </div>
    );
  }

  let premiere = true;
  const blocs = PLAN.blocks.map((b, k) => {
    const cartes = b.items.map(([id, w]) => carte(id, w));
    if (b.t === "row") return <div key={k} className="blk row">{cartes}</div>;
    const label = premiere ? L : null;
    premiere = false;
    const p = (i, cls) => <Photo key={`p${i}`} src={b.photos[i]} cls={cls} label={i === 0 ? label : null} alt={L.alt} />;
    switch (b.t) {
      case "T3L": return <div key={k} className="blk row dense">{p(0, "t3 gauche")}{cartes}</div>;
      case "T3R": return <div key={k} className="blk row dense">{p(0, "t3 droite")}{cartes}</div>;
      case "T6L": return <div key={k} className="blk row dense">{p(0, "t6 gauche")}{cartes}</div>;
      case "T6R": return <div key={k} className="blk row dense">{p(0, "t6 droite")}{cartes}</div>;
      case "T4L": return <div key={k} className="blk row">{p(0, "t4")}{cartes}</div>;
      case "T4R": return <div key={k} className="blk row">{cartes}{p(0, "t4")}</div>;
      case "T2": return <div key={k} className="blk duo">{p(0, "d1")}{p(1, "d2")}</div>;
      case "T5": return <div key={k} className="blk trio">{p(0)}{p(1)}{p(2)}</div>;
      default: return null;
    }
  });
  const reste = restants();
  return (
    <div className="gal">
      {blocs}
      {reste.length > 0 && <div className="blk row dense">{reste.map((id) => carte(id, largeur(id)))}</div>}
    </div>
  );
}
