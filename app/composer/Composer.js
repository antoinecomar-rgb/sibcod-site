"use client";
import { useMemo, useState } from "react";
import { MURS, estSombre } from "../../lib/murs";

const LAYS = [
  { id: "trio", n: 3, fr: "Trio", en: "Trio" },
  { id: "grille", n: 4, fr: "Grille de 4", en: "Grid of 4" },
  { id: "colonne", n: 3, fr: "Colonne", en: "Column" },
  { id: "grand", n: 1, fr: "Un grand format", en: "One large piece" },
];
const TAILLES = [
  { id: "p", fr: "Petit", en: "Small", multi: 30, grand: 80 },
  { id: "m", fr: "Moyen", en: "Medium", multi: 40, grand: 110 },
  { id: "g", fr: "Grand", en: "Large", multi: 50, grand: 140 },
];
const MUR_L = 320, MUR_H = 230, CANAPE_L = 220, CANAPE_H = 85, ECART = 6;

export default function Composer({ oeuvres, palettes, lang, txt }) {
  const [mur, setMur] = useState("blanc");
  const [lay, setLay] = useState("trio");
  const [pal, setPal] = useState(palettes[0].id);
  const [taille, setTaille] = useState("m");
  const [graine, setGraine] = useState(0);

  const L = LAYS.find((x) => x.id === lay);
  const T = TAILLES.find((x) => x.id === taille);
  const choix = useMemo(() => {
    const ok = (o) => (lay === "grand" ? o.format === "paysage" || o.format === "panorama" : lay === "colonne" ? o.format !== "panorama" : o.format === "portrait");
    let c = oeuvres.filter((o) => o.palette[0] === pal && ok(o));
    if (c.length < L.n) c = c.concat(oeuvres.filter((o) => o.palette.includes(pal) && ok(o) && !c.includes(o)));
    if (!c.length) return [];
    const d = (graine * L.n) % c.length;
    return [...c.slice(d), ...c.slice(0, d)].slice(0, L.n);
  }, [oeuvres, pal, lay, graine, L.n]);

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
        <Groupe nom={txt.taille} items={TAILLES} val={taille} set={setTaille} />
      </div>

      <div className="n-scene" style={{ background: murC.c, aspectRatio: `${MUR_L} / ${MUR_H}` }} role="img" aria-label={txt.aria + choix.map((o) => o.titre).join(", ")}>
        <div className={`n-scene-oeuvres ${lay}`} style={{ bottom: `${((CANAPE_H + 22) / MUR_H) * 100}%`, gap: lay === "grille" ? `${(ECART / MUR_H) * 100}% ${pct(ECART)}` : pct(ECART) }}>
          {choix.map((o) => {
            const { w } = dims(o);
            return <img key={o.id} src={o.img} alt="" style={{ width: lay === "grille" ? "100%" : pct(w) }} />;
          })}
        </div>
        {lay === "grille" && (
          <style>{`.n-scene-oeuvres.grille{grid-template-columns:repeat(2, ${pct(dims(choix[0] || { ratio: 0.75 }).w)})}`}</style>
        )}
        <div className="n-scene-canape" style={{ width: pct(CANAPE_L), height: `${(CANAPE_H / MUR_H) * 100}%` }}><i /><b /><span /></div>
        <p className={sombre ? "n-echelle-note clair" : "n-echelle-note"}>{txt.echelle}</p>
      </div>

      <div className="n-composer-pied">
        <div>
          <strong>{L[lang]} · {palettes.find((p) => p.id === pal)[lang]}</strong>
          <ul>
            {choix.map((o) => <li key={o.id}><a href={o.href}>{o.titre}</a></li>)}
          </ul>
          {!choix.length && <p>{txt.vide}</p>}
        </div>
        <div className="n-btns">
          <button type="button" className="n-btn2" onClick={() => setGraine((g) => g + 1)}>{txt.autre}</button>
          {choix[0] && <a className="n-btn" href={choix[0].href}>{txt.voir}</a>}
        </div>
      </div>
    </div>
  );
}
