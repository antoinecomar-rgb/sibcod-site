"use client";
import { useMemo, useState } from "react";
import { MURS, estSombre } from "../../lib/murs";

const LAYS = [
  { id: "trio", n: 3, fr: "Trio", en: "Trio" },
  { id: "grille", n: 4, fr: "Grille de 4", en: "Grid of 4" },
  { id: "colonne", n: 3, fr: "Colonne", en: "Column" },
  { id: "grand", n: 1, fr: "Un grand format", en: "One large piece" },
  { id: "libre", n: 0, fr: "Libre", en: "Free" },
];
const TAILLES = [
  { id: "p", fr: "Petit", en: "Small", multi: 30, grand: 80 },
  { id: "m", fr: "Moyen", en: "Medium", multi: 40, grand: 110 },
  { id: "g", fr: "Grand", en: "Large", multi: 50, grand: 140 },
];
const MUR_L = 320, MUR_H = 230, CANAPE_L = 220, CANAPE_H = 85, ECART = 6;
// composition libre : grand côté de chaque format (cm), orientations
const LIBRE_T = { p: 30, m: 50, g: 80 };
const ORIENTS = [
  { id: "portrait", fr: "Portrait", en: "Portrait" },
  { id: "paysage", fr: "Paysage", en: "Landscape" },
];
const BAS = CANAPE_H + 22; // bas de la composition (cm au-dessus du sol)

// place n œuvres en une ou deux rangées centrées, de part et d'autre d'une ligne médiane
function placerLibre(items) {
  const n = items.length;
  const rangs = n <= 3 ? [items] : [items.slice(0, Math.ceil(n / 2)), items.slice(Math.ceil(n / 2))];
  // dans chaque rangée, la plus grande au centre
  const centrer = (r) => {
    const t = [...r].sort((a, b) => b.w * b.h - a.w * a.h), out = [];
    t.forEach((x, i) => (i % 2 ? out.unshift(x) : out.push(x)));
    return out;
  };
  const R = rangs.map(centrer);
  const larg = (r) => r.reduce((t, x) => t + x.w, 0) + ECART * (r.length - 1);
  const haut = (r) => Math.max(...r.map((x) => x.h));
  const H = R.reduce((t, r) => t + haut(r), 0) + ECART * (R.length - 1);
  const k = Math.min(1, (MUR_L - 24) / Math.max(...R.map(larg)), (MUR_H - BAS - 10) / H);
  const pos = [];
  let y = BAS + H * k; // haut de la composition
  R.forEach((r, ri) => {
    const h = haut(r) * k;
    let x = (MUR_L - larg(r) * k) / 2;
    r.forEach((it) => {
      // rangée du haut alignée en bas sur la ligne médiane, rangée du bas alignée en haut
      const hi = it.h * k;
      const b = R.length === 1 ? y - h + (h - hi) / 2 : ri === 0 ? y - h : y - hi;
      pos.push({ ...it, x, b, w: it.w * k, h: hi });
      x += (it.w + ECART) * k;
    });
    y -= h + ECART * k;
  });
  return pos;
}

export default function Composer({ oeuvres, palettes, lang, txt }) {
  const [mur, setMur] = useState("blanc");
  const [lay, setLay] = useState("trio");
  const [pal, setPal] = useState(palettes[0].id);
  const [taille, setTaille] = useState("g");
  const [graine, setGraine] = useState(0);
  const [nombre, setNombre] = useState(5);
  const [libT, setLibT] = useState(["p", "m", "g"]);
  const [libO, setLibO] = useState(["portrait", "paysage"]);
  const basculer = (liste, set, id) => set(liste.includes(id) ? (liste.length > 1 ? liste.filter((x) => x !== id) : liste) : [...liste, id]);

  const L = LAYS.find((x) => x.id === lay);
  const T = TAILLES.find((x) => x.id === taille);
  // composition libre : chaque emplacement reçoit un format et une orientation, puis une œuvre de la palette
  const libre = useMemo(() => {
    if (lay !== "libre") return [];
    const tl = ["p", "m", "g"].filter((x) => libT.includes(x));
    const okO = (o, or) => (or === "portrait" ? o.format === "portrait" : o.format === "paysage" || o.format === "carre");
    const pool = (or) => {
      const a = oeuvres.filter((o) => o.palette[0] === pal && okO(o, or));
      return a.concat(oeuvres.filter((o) => o.palette.includes(pal) && okO(o, or) && !a.includes(o)));
    };
    const pools = { portrait: pool("portrait"), paysage: pool("paysage") };
    const pris = new Set(), out = [];
    for (let i = 0; i < nombre; i++) {
      let or = libO[(i + graine) % libO.length];
      if (!pools[or].length) or = libO.find((x) => pools[x].length) || or;
      const p = pools[or];
      if (!p.length) continue;
      let j = (graine * 7 + i * 3) % p.length, tours = 0;
      while (pris.has(p[j].id) && tours++ < p.length) j = (j + 1) % p.length;
      const o = p[j]; pris.add(o.id);
      const long = LIBRE_T[tl[(i * 2 + graine) % tl.length]];
      const w = o.ratio >= 1 ? long : long * o.ratio;
      out.push({ ...o, w, h: w / o.ratio });
    }
    return out.length ? placerLibre(out) : [];
  }, [oeuvres, pal, lay, graine, nombre, libT, libO]);

  const choix = useMemo(() => {
    if (lay === "libre") return libre;
    const ok = (o) => (lay === "grand" ? o.format === "paysage" || o.format === "panorama" : lay === "colonne" ? o.format !== "panorama" : o.format === "portrait");
    let c = oeuvres.filter((o) => o.palette[0] === pal && ok(o));
    if (c.length < L.n) c = c.concat(oeuvres.filter((o) => o.palette.includes(pal) && ok(o) && !c.includes(o)));
    // jamais deux fois la même image (deux œuvres peuvent partager une vignette)
    const vues = new Set();
    c = c.filter((o) => (vues.has(o.img) || vues.has(o.titre) ? false : (vues.add(o.img), vues.add(o.titre), true)));
    if (!c.length) return [];
    const d = (graine * L.n) % c.length;
    return [...c.slice(d), ...c.slice(0, d)].slice(0, L.n);
  }, [oeuvres, pal, lay, graine, L.n, libre]);

  const dims = (o) => {
    const long = lay === "grand" ? T.grand : T.multi;
    const w = o.ratio >= 1 ? long : long * o.ratio;
    return { w, h: w / o.ratio };
  };
  const pct = (cm) => `${(cm / MUR_L) * 100}%`;
  const murC = MURS.find((m) => m.id === mur);
  const sombre = estSombre(murC.c);
  const Groupe = ({ nom, items, val, set, rond }) => (
    <fieldset className="n-groupe">
      <legend>{nom}</legend>
      <div>
        {items.map((x) => (
          <button key={x.id} type="button" aria-pressed={val === x.id} className={val === x.id ? "on" : ""} onClick={() => set(x.id)}>
            {rond && <i style={{ background: rond(x) }} />}{x[lang]}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="n-composer">
      <div className="n-reglages">
        <fieldset className="n-groupe">
          <legend>{txt.mur} : <span className="n-teinte-nom">{murC[lang]}</span></legend>
          <div className="n-teintes">
            {MURS.map((m) => (
              <button key={m.id} type="button" title={m[lang]} aria-label={m[lang]} aria-pressed={mur === m.id} className={mur === m.id ? "on" : ""} style={{ background: m.c }} onClick={() => setMur(m.id)} />
            ))}
          </div>
        </fieldset>
        <Groupe nom={txt.compo} items={LAYS} val={lay} set={(v) => { setLay(v); setGraine(0); }} />
        <Groupe nom={txt.palette} items={palettes} val={pal} set={(v) => { setPal(v); setGraine(0); }} rond={(x) => x.c} />
        {lay !== "libre" ? <Groupe nom={txt.taille} items={TAILLES} val={taille} set={setTaille} /> : (
          <fieldset className="n-groupe n-libre">
            <legend>{txt.libre}</legend>
            <div>
              <span className="n-nombre">
                <button type="button" aria-label="−" onClick={() => setNombre((n) => Math.max(2, n - 1))}>−</button>
                <b>{nombre} {txt.oeuvres}</b>
                <button type="button" aria-label="+" onClick={() => setNombre((n) => Math.min(8, n + 1))}>+</button>
              </span>
            </div>
            <div>
              {TAILLES.map((x) => <button key={x.id} type="button" aria-pressed={libT.includes(x.id)} className={libT.includes(x.id) ? "on" : ""} onClick={() => basculer(libT, setLibT, x.id)}>{x[lang]}</button>)}
            </div>
            <div>
              {ORIENTS.map((x) => <button key={x.id} type="button" aria-pressed={libO.includes(x.id)} className={libO.includes(x.id) ? "on" : ""} onClick={() => basculer(libO, setLibO, x.id)}>{x[lang]}</button>)}
            </div>
          </fieldset>
        )}
      </div>

      <div className="n-relancer">
        <button type="button" className="n-btn" onClick={() => setGraine((g) => g + 1)}><span aria-hidden="true">↻</span> {txt.autre}</button>
        <span className="n-petit">{txt.autreS}</span>
      </div>

      <div className="n-scene-cadre"><div className="n-scene" style={{ background: murC.c, aspectRatio: `${MUR_L} / ${MUR_H}` }} role="img" aria-label={txt.aria + choix.map((o) => o.titre).join(", ")}>
        {lay === "libre" && choix.map((o) => (
          <img key={o.id} className="n-libre-o" src={o.img} alt="" style={{ left: pct(o.x), bottom: `${(o.b / MUR_H) * 100}%`, width: pct(o.w) }} />
        ))}
        {lay !== "libre" && <div className={`n-scene-oeuvres ${lay}`} style={{ bottom: `${((CANAPE_H + 22) / MUR_H) * 100}%`, gap: lay === "grille" ? `${(ECART / MUR_H) * 100}% ${pct(ECART)}` : pct(ECART) }}>
          {choix.map((o) => {
            const { w } = dims(o);
            return <img key={o.id} src={o.img} alt="" style={{ width: lay === "grille" ? "100%" : pct(w) }} />;
          })}
        </div>}
        {lay === "grille" && (
          <style>{`.n-scene-oeuvres.grille{grid-template-columns:repeat(2, ${pct(dims(choix[0] || { ratio: 0.75 }).w)})}`}</style>
        )}
        <div className="n-scene-canape" style={{ width: pct(CANAPE_L), height: `${(CANAPE_H / MUR_H) * 100}%` }}><i /><b /><span /></div>
        <p className={sombre ? "n-echelle-note clair" : "n-echelle-note"}>{txt.echelle}</p>
      </div></div>

      <div className="n-composer-pied">
        <div>
          <strong>{L[lang]} · {palettes.find((p) => p.id === pal)[lang]}</strong>
          <ul>
            {choix.map((o) => <li key={o.id}><a href={o.href}>{o.titre}</a></li>)}
          </ul>
          {!choix.length && <p>{txt.vide}</p>}
        </div>
        <div className="n-btns">
          {choix[0] && <a className="n-btn2" href={choix[0].href}>{txt.voir}</a>}
        </div>
      </div>
    </div>
  );
}
