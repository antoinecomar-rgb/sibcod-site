"use client";
import { useEffect, useMemo, useState } from "react";
import { MURS, estSombre } from "../../lib/murs";
import { taillesPictorem, enCm, libelle } from "../../lib/tailles";
import { lireMur, ecrireMur, MAX_MUR } from "../../lib/monmur";
import { SUPPORTS, CADRES, BORDS, MARGE_CM, PASSE_PARTOUT_PO, BAGUETTE_CM, prix, enDollars } from "../../lib/prix";

const LAYS = [
  { id: "trio", n: 3, fr: "Trio", en: "Trio" },
  { id: "grille", n: 4, fr: "Grille de 4", en: "Grid of 4" },
  { id: "grille6", n: 6, fr: "Grille de 6", en: "Grid of 6" },
  { id: "colonne", n: 3, fr: "Colonne", en: "Column" },
  { id: "grand", n: 1, fr: "Un grand format", en: "One large piece" },
  { id: "panorama", n: 1, fr: "Panorama", en: "Panorama" },
  { id: "triptyque", n: 1, fr: "Diptyque, triptyque", en: "Diptych, triptych" },
  { id: "libre", n: 0, fr: "Au hasard", en: "Random" },
  { id: "moi", n: 0, fr: "Ma sélection", en: "My selection" },
];
// taille choisie : la plus petite, celle du milieu ou la plus grande proposée pour chaque œuvre
const TAILLES = [
  { id: "p", fr: "Petit", en: "Small" },
  { id: "m", fr: "Moyen", en: "Medium" },
  { id: "g", fr: "Grand", en: "Large" },
];
const FORMATS_F = [
  { id: "tous", fr: "Tous", en: "All" },
  { id: "portrait", fr: "Portrait", en: "Portrait" },
  { id: "paysage", fr: "Paysage", en: "Landscape" },
  { id: "carre", fr: "Carré", en: "Square" },
  { id: "panorama", fr: "Panorama", en: "Panorama" },
  { id: "polyptyque", fr: "Diptyque, triptyque", en: "Diptych, triptych" },
];
const MUR_MIN_L = 320, MUR_MIN_H = 230, CANAPE_H = 85, BAS = CANAPE_H + 22; // cm
const ECART = 8; // cm entre deux œuvres

const choisirTaille = (o, t) => {
  const l = taillesPictorem(o);
  const i = t === "p" ? 0 : t === "g" ? l.length - 1 : Math.floor((l.length - 1) / 2);
  return { l, i };
};
const ECART_PANNEAUX = 4; // cm entre les panneaux d'un diptyque ou d'un triptyque
const enPlaceNu = (o, i) => {
  const l = taillesPictorem(o), x = l[Math.max(0, Math.min(i, l.length - 1))];
  // un polyptyque choisi d'un bloc : ses panneaux côte à côte, chacun à la même taille
  if (o.panneaux) {
    const n = o.panneaux.length;
    return { ...o, taille: x, w: n * enCm(x.w) + ECART_PANNEAUX * (n - 1), h: enCm(x.h) };
  }
  return { ...o, taille: x, w: enCm(x.w), h: enCm(x.h) };
};
const etiquette = (o, lang) => (o.panneaux ? `${o.panneaux.length} × ${libelle(o.taille, lang)}` : libelle(o.taille, lang));

// rangées d'œuvres (en cm, taille réelle) → positions sur le mur ; chaque rangée est centrée
function placer(rangees, ecart = ECART) {
  const R = rangees.filter((r) => r.length);
  const larg = (r) => r.reduce((t, x) => t + x.w, 0) + ecart * (r.length - 1);
  const haut = (r) => Math.max(...r.map((x) => x.h));
  const L = Math.max(0, ...R.map(larg)), H = R.reduce((t, r) => t + haut(r), 0) + ecart * Math.max(0, R.length - 1);
  const murL = Math.max(MUR_MIN_L, L + 40), murH = Math.max(MUR_MIN_H, BAS + H + 18);
  const pos = [];
  let y = BAS + H;
  R.forEach((r, ri) => {
    const h = haut(r);
    let x = (murL - larg(r)) / 2;
    r.forEach((it) => {
      // deux rangées : celle du haut alignée en bas, celle du bas alignée en haut, autour d'une ligne médiane
      const b = R.length === 2 ? (ri === 0 ? y - h : y - it.h) : y - h + (h - it.h) / 2;
      pos.push({ ...it, x, b });
      x += it.w + ecart;
    });
    y -= h + ecart;
  });
  return { pos, murL, murH };
}

// rangées équilibrées : la plus grande œuvre au centre de chaque rangée
function enRangees(items, parRangee) {
  const n = items.length;
  const k = parRangee || (n <= 3 ? n : Math.ceil(n / 2));
  const out = [];
  for (let i = 0; i < n; i += k) {
    const t = [...items.slice(i, i + k)].sort((a, b) => b.w * b.h - a.w * a.h), r = [];
    t.forEach((x, j) => (j % 2 ? r.unshift(x) : r.push(x)));
    out.push(r);
  }
  return out;
}

export default function Composer({ oeuvres, collection, alias, polys, palettes, lang, txt, mode }) {
  const fr = lang === "fr";
  const [mur, setMur] = useState("blanc");
  const [lay, setLay] = useState(mode === "moi" ? "moi" : "trio");
  const [pal, setPal] = useState(palettes[0].id);
  const [taille, setTaille] = useState("g");
  const [graine, setGraine] = useState(0);
  const [nombre, setNombre] = useState(5);
  const [support, setSupport] = useState("toile");
  const [cadre, setCadre] = useState("sans");
  const [bord, setBord] = useState("coupe");
  // remplacements ciblés dans une sélection proposée : { rang: identifiant de l'œuvre choisie à la place }
  const [remplace, setRemplace] = useState({});
  const encadre = support === "affiche" && cadre !== "sans";
  const marge = support === "affiche" && !encadre && bord === "marge";
  // « Ma sélection » : [{ id, i }] (i = rang de la taille choisie), gardée dans le navigateur
  const [moi, setMoi] = useState([]);
  const [filtreP, setFiltreP] = useState("toutes");
  const [filtreF, setFiltreF] = useState("tous");
  const parId = useMemo(() => Object.fromEntries(collection.map((c) => [c.id, c])), [collection]);
  useEffect(() => {
    const ids = lireMur().map((id) => (parId[id] ? id : alias[id])).filter((id) => parId[id]);
    setMoi([...new Set(ids)].map((id) => ({ id, i: taillesPictorem(parId[id]).length - 1 })));
  }, [parId, alias]);
  const majMoi = (l) => { setMoi(l); ecrireMur(l.map((x) => x.id)); };
  const basculerMoi = (id) => {
    if (moi.some((x) => x.id === id)) majMoi(moi.filter((x) => x.id !== id));
    else if (moi.length < MAX_MUR) majMoi([...moi, { id, i: taillesPictorem(parId[id]).length - 1 }]);
  };

  const L = LAYS.find((x) => x.id === lay);
  const okPal = (o) => o.palette[0] === pal;
  const avecPal = (filtre) => {
    const a = oeuvres.filter((o) => okPal(o) && filtre(o));
    return a.concat(oeuvres.filter((o) => o.palette.includes(pal) && filtre(o) && !a.includes(o)));
  };
  const tourner = (c, n) => {
    const vues = new Set();
    c = c.filter((o) => (vues.has(o.img) || vues.has(o.titre) ? false : (vues.add(o.img), vues.add(o.titre), true)));
    if (!c.length) return [];
    const d = (graine * n) % c.length;
    return [...c.slice(d), ...c.slice(0, d)].slice(0, n);
  };

  // une sélection proposée change (composition, palette, taille, nouveau tirage) : les remplacements ciblés repartent de zéro
  useEffect(() => setRemplace({}), [lay, pal, graine, taille, nombre]);
  const parIdO = useMemo(() => Object.fromEntries(oeuvres.map((o) => [o.id, o])), [oeuvres]);
  const remplacer = (c) => c.map((o, k) => (remplace[k] && parIdO[remplace[k]]) || o);

  const scene = useMemo(() => {
    // encadré : baguette + passe-partout autour de chaque image (de chaque panneau pour un polyptyque)
    const enPlace = (o, i) => {
      const x = enPlaceNu(o, i);
      if (!encadre && !marge) return x;
      const e = encadre ? BAGUETTE_CM + PASSE_PARTOUT_PO * 2.54 : MARGE_CM, n = o.panneaux ? o.panneaux.length : 1;
      const uw = enCm(x.taille.w) + 2 * e, uh = enCm(x.taille.h) + 2 * e;
      return { ...x, w: n * uw + ECART_PANNEAUX * (n - 1), h: uh, unite: { w: uw, h: uh } };
    };
    const dim = (o) => { const { i } = choisirTaille(o, taille); return enPlace(o, i); };
    if (lay === "moi") {
      const items = moi.map(({ id, i }) => enPlace(parId[id], i));
      return placer(enRangees(items));
    }
    if (lay === "triptyque") {
      let c = polys.filter((p) => p.palette[0] === pal);
      if (!c.length) c = polys.filter((p) => p.palette.includes(pal));
      if (!c.length) c = polys;
      const p = c[graine % c.length];
      if (!p) return placer([]);
      const items = p.panneaux.map((v) => ({ ...dim(v), palette: p.palette }));
      return { ...placer([items], 4), poly: p };
    }
    if (lay === "libre") {
      const pool = avecPal((o) => o.format !== "panorama");
      const c = remplacer(tourner(pool, nombre));
      // des tailles variées : chaque œuvre reçoit à tour de rôle sa plus petite, sa moyenne ou sa plus grande taille
      const items = c.map((o, k) => { const { i } = choisirTaille(o, ["g", "m", "p"][(k + graine) % 3]); return { ...enPlace(o, i), rang: k }; });
      return { ...placer(enRangees(items)), pool };
    }
    const filtre = {
      trio: (o) => o.format === "portrait",
      grille: (o) => o.format === "portrait",
      grille6: (o) => o.format === "portrait",
      colonne: (o) => o.format === "paysage",
      grand: (o) => o.format !== "panorama" && o.maxPo >= 32,
      panorama: (o) => o.format === "panorama",
    }[lay];
    let pool = avecPal(filtre);
    if (!pool.length) pool = oeuvres.filter(filtre);
    // une série homogène : de préférence des œuvres proposées dans la même taille que la première
    const long = (x) => Math.max(x.w, x.h);
    const premiere = tourner(pool, 1)[0];
    const ref = premiere ? choisirTaille(premiere, taille) : null;
    const cibleL = ref ? long(ref.l[ref.i]) : 0;
    const memes = pool.filter((o) => taillesPictorem(o).some((x) => long(x) === cibleL));
    const serie = memes.length >= L.n ? memes : pool;
    const c = remplacer(tourner(serie, L.n));
    const items = c.map((o, r) => {
      const l = taillesPictorem(o);
      let j = 0;
      l.forEach((x, k) => { if (Math.abs(long(x) - cibleL) < Math.abs(long(l[j]) - cibleL)) j = k; });
      return { ...enPlace(o, j), rang: r };
    });
    const rangees = lay === "colonne" ? items.map((x) => [x]) : lay === "grille" ? enRangees(items, 2) : lay === "grille6" ? enRangees(items, 3) : [items];
    return { ...placer(rangees), pool: serie };
  }, [oeuvres, polys, pal, lay, graine, nombre, taille, moi, parId, encadre, marge, remplace]);

  const { pos, murL, murH, poly } = scene;
  const pctX = (cm) => `${(cm / murL) * 100}%`;
  const pctY = (cm) => `${(cm / murH) * 100}%`;
  const murC = MURS.find((m) => m.id === mur);
  const sombre = estSombre(murC.c);
  const Chips = ({ label, items, val, set, rond, petit }) => (
    <div className={petit ? "n-barre-ligne petit" : "n-barre-ligne"} role="group" aria-label={label}>
      <span className="n-barre-titre">{label}</span>
      <div className="n-barre-choix">
        {items.map((x) => (
          <button key={x.id} type="button" aria-pressed={val === x.id} className={(val === x.id ? "on" : "") + (x.id === "moi" ? " n-moi" : "")} onClick={() => set(x.id)} title={x[lang]}>
            {rond && x.c && <i style={{ background: rond(x) }} />}{x.id === "moi" && <span aria-hidden="true">＋</span>}{x[lang]}
          </button>
        ))}
      </div>
    </div>
  );
  // « changer celle-ci » : l'œuvre suivante de la même série, absente du mur
  const changer = (rang) => {
    const pool = scene.pool || [];
    const montres = new Set(pos.map((o) => o.id));
    const actuelle = pos.find((o) => o.rang === rang);
    if (!pool.length || !actuelle) return;
    const d = Math.max(0, pool.findIndex((o) => o.id === actuelle.id));
    for (let k = 1; k <= pool.length; k++) {
      const o = pool[(d + k) % pool.length];
      if (!montres.has(o.id) && o.img !== actuelle.img) { setRemplace((r) => ({ ...r, [rang]: o.id })); return; }
    }
  };
  const visibles = collection.filter((c) => (filtreP === "toutes" || c.palette.includes(filtreP)) && (filtreF === "tous" || c.format === filtreF));
  const cadreC = CADRES.find((c) => c.id === cadre);
  const prixDe = (o) => { const v = prix(o.taille, support, cadre); return v == null ? null : v * (o.panneaux ? o.panneaux.length : 1); };
  const prixListe = pos.map(prixDe);
  const total = prixListe.every((v) => v != null) && pos.length ? prixListe.reduce((t, v) => t + v, 0) : null;
  // une image, nue ou encadrée (baguette + passe-partout blanc)
  const Image = ({ src, u }) => (encadre && u
    ? <span className="n-cadre" style={{ background: cadreC.c, padding: `${(BAGUETTE_CM / u.w) * 100}%` }}>
        <span className="n-pp" style={{ padding: `${((PASSE_PARTOUT_PO * 2.54) / (u.w - 2 * BAGUETTE_CM)) * 100}%` }}><img src={src} alt="" /></span>
      </span>
    : marge && u
      ? <span className="n-marge" style={{ padding: `${(MARGE_CM / u.w) * 100}%` }}><img src={src} alt="" /></span>
      : <img src={src} alt="" />);

  return (
    <div className="n-composer">
      <div className="n-scene-cadre"><div className={`n-scene s-${support}`} style={{ background: murC.c, aspectRatio: `${murL} / ${murH}` }} role="img" aria-label={txt.aria + pos.map((o) => `${o.titre} (${etiquette(o, lang)})`).join(", ")}>
        {pos.map((o, k) => (
          <figure key={o.id + k} className={`n-piece s-${support}${encadre ? " s-cadre" : ""}`} style={{ left: pctX(o.x), bottom: pctY(o.b), width: pctX(o.w), height: o.unite ? "auto" : pctY(o.h) }}>
            {o.panneaux
              ? <div className="n-piece-panneaux" style={{ gap: `${(ECART_PANNEAUX / o.w) * 100}%` }}>{o.panneaux.map((p) => <Image key={p.id} src={p.img} u={o.unite} />)}</div>
              : <Image src={o.img} u={o.unite} />}
            <figcaption className={sombre ? "clair" : ""}>{etiquette(o, lang)}</figcaption>
            {o.rang != null && <button type="button" className="n-changer" onClick={() => changer(o.rang)} title={fr ? "Changer celle-ci" : "Swap this one"} aria-label={fr ? `Changer ${o.titre}` : `Swap ${o.titre}`}>↻</button>}
          </figure>
        ))}
        <img className="n-silhouette" src="/ambiance/silhouette-2.webp" alt="" style={{ width: pctX(258.3), left: pctX(murL / 2 - 136.2), bottom: pctY(-2.6) }} />
        {lay !== "moi" && <button type="button" className="n-relance" onClick={() => setGraine((g) => g + 1)} title={txt.autre} aria-label={txt.autre}>↻</button>}
        {lay === "moi" && !pos.length && <p className="n-scene-vide">{fr ? "Choisissez vos œuvres dans la collection, ci-dessous." : "Pick your artworks from the collection, below."}</p>}
      </div></div>
      <p className="n-echelle-sous">{txt.echelle}</p>

      <div className="n-barre">
        <Chips label={txt.compo} items={LAYS} val={lay} set={(v) => { setLay(v); setGraine(0); }} />
        <Chips label={fr ? "Support" : "Medium"} items={SUPPORTS} val={support} set={setSupport} />
        {support === "affiche" && <Chips label={fr ? "Cadre" : "Frame"} items={CADRES} val={cadre} set={setCadre} rond={(x) => x.c} petit />}
        {support === "affiche" && !encadre && <Chips label={fr ? "Bord" : "Edge"} items={BORDS} val={bord} set={setBord} petit />}
        {lay !== "moi" && lay !== "libre" && <Chips label={txt.taille} items={TAILLES} val={taille} set={setTaille} petit />}
        {lay === "libre" && (
          <div className="n-barre-ligne petit">
            <span className="n-barre-titre">{fr ? "Nombre" : "Number"}</span>
            <div className="n-barre-choix">
              <button type="button" aria-label="−" onClick={() => setNombre((n) => Math.max(2, n - 1))}>−</button>
              <b className="n-barre-nombre">{nombre}</b>
              <button type="button" aria-label="+" onClick={() => setNombre((n) => Math.min(8, n + 1))}>+</button>
            </div>
          </div>
        )}
        {lay !== "moi" && <Chips label={txt.palette} items={palettes} val={pal} set={(v) => { setPal(v); setGraine(0); }} rond={(x) => x.c} petit />}
        <div className="n-barre-ligne petit" role="group" aria-label={txt.mur}>
          <span className="n-barre-titre">{txt.mur}</span>
          <div className="n-teintes petit">
            {MURS.map((m) => (
              <button key={m.id} type="button" title={m[lang]} aria-label={m[lang]} aria-pressed={mur === m.id} className={mur === m.id ? "on" : ""} style={{ background: m.c }} onClick={() => setMur(m.id)} />
            ))}
          </div>
        </div>
      </div>

      <div className="n-composer-pied">
        <ul className="n-legende">
          {pos.map((o, k) => (
            <li key={o.id + k}>
              <a href={o.href}>{o.titre}</a> <span>{etiquette(o, lang)}</span> <b>{enDollars(prixListe[k], lang)}</b>
              {lay === "moi" && (
                <span className="n-legende-tailles">
                  {taillesPictorem(o).map((x, i) => {
                    const m = moi.find((y) => y.id === o.id);
                    return <button key={i} type="button" className={m && m.i === i ? "on" : ""} aria-pressed={m && m.i === i} onClick={() => majMoi(moi.map((y) => (y.id === o.id ? { ...y, i } : y)))}>{libelle(x, lang)}</button>;
                  })}
                  <button type="button" className="n-retirer" aria-label={fr ? `Retirer ${o.titre}` : `Remove ${o.titre}`} onClick={() => basculerMoi(o.id)}>×</button>
                </span>
              )}
              {o.url && <a className="n-acheter" href={o.url} target="_blank" rel="noopener noreferrer">{fr ? "Acheter" : "Buy"}</a>}
            </li>
          ))}
        </ul>
        {!pos.length && lay !== "moi" && <p>{txt.vide}</p>}
        {pos.length > 0 && (
          <div className="n-total">
            <strong>{fr ? "Estimation" : "Estimate"} : {total != null ? enDollars(total, lang) : (fr ? "sur demande" : "on request")}</strong>
            <p className="n-petit">
              {fr
                ? `${SUPPORTS.find((x) => x.id === support).fr}${encadre ? `, cadre ${cadreC.fr.toLowerCase()} et passe-partout blanc 5 cm` : marge ? ", marge blanche" : ""}. Prix publics Pictorem en dollars US, hors taxes et promotions, livraison offerte aux États-Unis et au Canada. Le prix exact s'affiche chez Pictorem. D'autres cadres et passe-partout sont possibles pour les affiches à la commande.`
                : `${SUPPORTS.find((x) => x.id === support).en}${encadre ? `, ${cadreC.en.toLowerCase()} frame and 2 in white mat` : marge ? ", white border" : ""}. Pictorem public prices in US dollars, before taxes and promotions, free shipping in the USA and Canada. The exact price is shown on Pictorem. More frames and mats are available for posters when ordering.`}
            </p>
          </div>
        )}
      </div>

      {lay === "moi" && (
        <section className="n-choix">
          <h2>{fr ? "Choisir dans la collection" : "Choose from the collection"}</h2>
          <p className="n-petit">{fr ? `Touchez une œuvre pour l'ajouter ou la retirer (${MAX_MUR} au plus). Votre sélection reste dans ce navigateur ; vous pouvez aussi l'enrichir depuis chaque fiche avec « Ajouter à mon mur ».` : `Tap an artwork to add or remove it (${MAX_MUR} at most). Your selection stays in this browser; you can also add to it from each artwork page with “Add to my wall”.`}</p>
          <div className="n-barre-choix">
            {[{ id: "toutes", fr: "Toutes", en: "All" }, ...palettes].map((x) => (
              <button key={x.id} type="button" className={filtreP === x.id ? "on" : ""} aria-pressed={filtreP === x.id} onClick={() => setFiltreP(x.id)}>{x.c && <i style={{ background: x.c }} />}{x[lang]}</button>
            ))}
          </div>
          <div className="n-barre-choix">
            {FORMATS_F.map((x) => (
              <button key={x.id} type="button" className={filtreF === x.id ? "on" : ""} aria-pressed={filtreF === x.id} onClick={() => setFiltreF(x.id)}>{x[lang]}</button>
            ))}
          </div>
          <div className="n-choix-grille">
            {visibles.map((c) => {
              const on = moi.some((x) => x.id === c.id);
              return (
                <button key={c.id} type="button" className={on ? "on" : ""} aria-pressed={on} title={c.titre} onClick={() => basculerMoi(c.id)} disabled={!on && moi.length >= MAX_MUR}>
                  {c.panneaux
                    ? <span className="n-choix-poly">{c.panneaux.map((p) => <img key={p.id} src={p.img} alt="" loading="lazy" />)}</span>
                    : <img src={c.img} alt="" loading="lazy" />}
                  <span>{c.titre}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
