"use client";
// « Ma sélection » : le panier du visiteur. Il règle chaque œuvre (taille, support, cadre) sur le site,
// voit le total estimé, puis commande œuvre par œuvre chez l'atelier, avec les réglages à reprendre.
import { useEffect, useMemo, useState } from "react";
import { taillesPictorem, libelle } from "../../lib/tailles";
import { lireSel, ecrireSel, cleTaille, EVT } from "../../lib/monmur";
import { SUPPORTS, cadresDe, BORDS, PASSE_PARTOUTS, prix, enDollars } from "../../lib/prix";

// noms des onglets et options tels qu'ils apparaissent chez l'atelier (site en anglais)
const ONGLET = { toile: "Canvas", affiche: "Paper", metal: "Metal", bois: "Wood", acrylique: "Acrylic" };
const COUL = { noir: "black", blanc: "white", chene: "natural wood" };

function aChoisir(l, t, fr) {
  const taille = `${t.w} x ${t.h} in`;
  const enc = l.c && l.c !== "sans" && cadresDe(l.s).some((c) => c.id === l.c);
  let r;
  if (l.s === "affiche" && enc) r = [`« Frame »`, taille, `frame: ${COUL[l.c]}`, l.p ? `mat ${l.p} in` : "no mat"];
  else if (l.s === "affiche") r = [`« Paper »`, taille, l.b === "marge" ? "white border" : "no border"];
  else if (l.s === "toile" && enc) r = [`« Canvas »`, taille, `Floating Frame ${COUL[l.c]}`];
  else if (l.s === "metal" && enc) r = [`« HD Metal »`, taille, "With Moulding (black)"];
  else r = [`« ${ONGLET[l.s] || "Canvas"} »`, taille];
  return r.join(" · ");
}

export default function Selection({ collection, alias, lang }) {
  const fr = lang === "fr";
  const q = fr ? "?lang=fr" : "";
  const parId = useMemo(() => Object.fromEntries(collection.map((c) => [c.id, c])), [collection]);
  const [sel, setSel] = useState(null);
  useEffect(() => {
    const lire = () => {
      const vus = new Set();
      setSel(lireSel().map((x) => ({ ...x, id: parId[x.id] ? x.id : alias[x.id] })).filter((x) => parId[x.id] && !vus.has(x.id) && vus.add(x.id)));
    };
    lire();
    window.addEventListener(EVT, lire);
    return () => window.removeEventListener(EVT, lire);
  }, [parId, alias]);
  if (sel === null) return <p className="n-petit">…</p>;

  const maj = (id, ch) => { const l = sel.map((x) => (x.id === id ? { ...x, ...ch } : x)); setSel(l); ecrireSel(l); };
  const retirer = (id) => { const l = sel.filter((x) => x.id !== id); setSel(l); ecrireSel(l); };

  const lignes = sel.map((l) => {
    const o = parId[l.id];
    const ts = taillesPictorem(o);
    const t = ts.find((x) => cleTaille(x) === l.t) || ts[ts.length - 1];
    const s = SUPPORTS.some((x) => x.id === l.s) ? l.s : "toile";
    const cadres = cadresDe(s);
    const c = cadres.some((x) => x.id === l.c) ? l.c : "sans";
    const p = Number.isFinite(l.p) ? l.p : 2;
    const n = o.panneaux ? o.panneaux.length : 1;
    const v = prix(t, s, c, p);
    return { l: { ...l, s, c, p }, o, ts, t, cadres, n, prix: v == null ? null : v * n };
  });
  const total = lignes.length && lignes.every((x) => x.prix != null) ? lignes.reduce((a, x) => a + x.prix, 0) : null;
  const restants = lignes.filter((x) => !x.l.fait).length;

  if (!lignes.length) {
    return (
      <div className="n-sel-vide">
        <p>{fr ? "Votre sélection est vide pour l'instant." : "Your selection is empty for now."}</p>
        <p>
          <a className="n-lien" href={`/collection${q}`}>{fr ? "Parcourir la collection" : "Browse the collection"} →</a>{" "}
          <a className="n-lien" href={`/composer${q}`}>{fr ? "Composer un mur" : "Compose a wall"} →</a>
        </p>
      </div>
    );
  }

  return (
    <div className="n-sel">
      <ol className="n-sel-lignes">
        {lignes.map(({ l, o, ts, t, cadres, n, prix: pv }) => (
          <li key={l.id} className={l.fait ? "fait" : ""}>
            <a href={o.href} className="n-sel-img"><img src={o.img} alt={o.titre} loading="lazy" /></a>
            <div className="n-sel-corps">
              <h2><a href={o.href}>{o.titre}</a>{n > 1 && <small> · {n} {fr ? "panneaux" : "panels"}</small>}</h2>
              <div className="n-sel-reglages">
                <label>{fr ? "Taille" : "Size"}
                  <select value={cleTaille(t)} onChange={(e) => maj(l.id, { t: e.target.value })}>
                    {ts.map((x) => <option key={cleTaille(x)} value={cleTaille(x)}>{libelle(x, lang)}{n > 1 ? (fr ? " chacun" : " each") : ""}</option>)}
                  </select>
                </label>
                <label>{fr ? "Support" : "Medium"}
                  <select value={l.s} onChange={(e) => maj(l.id, { s: e.target.value, c: "sans" })}>
                    {SUPPORTS.map((x) => <option key={x.id} value={x.id}>{x[lang]}</option>)}
                  </select>
                </label>
                {cadres.length > 0 && (
                  <label>{fr ? "Cadre" : "Frame"}
                    <select value={l.c} onChange={(e) => maj(l.id, { c: e.target.value })}>
                      {cadres.map((x) => <option key={x.id} value={x.id}>{x[lang]}</option>)}
                    </select>
                  </label>
                )}
                {l.s === "affiche" && l.c !== "sans" && (
                  <label>{fr ? "Passe-partout" : "Mat"}
                    <select value={l.p} onChange={(e) => maj(l.id, { p: Number(e.target.value) })}>
                      {PASSE_PARTOUTS.map((x) => <option key={x.id} value={x.id}>{x[lang]}</option>)}
                    </select>
                  </label>
                )}
                {l.s === "affiche" && l.c === "sans" && (
                  <label>{fr ? "Bord" : "Edge"}
                    <select value={l.b || "coupe"} onChange={(e) => maj(l.id, { b: e.target.value })}>
                      {BORDS.map((x) => <option key={x.id} value={x.id}>{x[lang]}</option>)}
                    </select>
                  </label>
                )}
              </div>
              <p className="n-sel-atelier">{fr ? "À choisir chez l'atelier : " : "To choose at the print studio: "}<b>{aChoisir(l, t, fr)}</b></p>
            </div>
            <div className="n-sel-fin">
              <b className="n-sel-prix">{enDollars(pv, lang)}</b>
              {(o.panneaux || [o]).map((pnl, k) => {
                const tp = o.panneaux ? (taillesPictorem(pnl).find((x) => cleTaille(x) === cleTaille(t)) || t) : t;
                const url = tp.url || pnl.url;
                return url ? (
                  <a key={pnl.id} className="buybig" href={url} target="_blank" rel="noopener noreferrer" onClick={() => maj(l.id, { fait: true })}>
                    {fr ? "Commander" : "Order"}{o.panneaux ? ` ${k + 1}/${n}` : ""} →
                  </a>
                ) : null;
              })}
              <label className="n-sel-fait"><input type="checkbox" checked={!!l.fait} onChange={(e) => maj(l.id, { fait: e.target.checked })} /> {fr ? "Commandée" : "Ordered"}</label>
              <button type="button" className="n-retirer" onClick={() => retirer(l.id)} aria-label={fr ? `Retirer ${o.titre}` : `Remove ${o.titre}`}>{fr ? "Retirer" : "Remove"}</button>
            </div>
          </li>
        ))}
      </ol>

      <div className="n-total">
        <strong>{fr ? "Total estimé" : "Estimated total"} : {total != null ? enDollars(total, lang) : (fr ? "sur demande" : "on request")}</strong>
        <p className="n-petit">
          {fr
            ? `${lignes.length} œuvre${lignes.length > 1 ? "s" : ""}${restants < lignes.length ? `, dont ${restants} à commander` : ""}. Prix publics de notre atelier d'impression, en dollars US, hors taxes et promotions ; les prix des cadres sont estimés. Livraison offerte aux États-Unis et au Canada.`
            : `${lignes.length} artwork${lignes.length > 1 ? "s" : ""}${restants < lignes.length ? `, ${restants} still to order` : ""}. Public prices from our print studio, in US dollars, before taxes and promotions; frame prices are estimates. Free shipping in the USA and Canada.`}
        </p>
        <p><a className="n-lien" href={`/composer${q ? q + "&" : "?"}mode=moi`}>{fr ? "Voir ma sélection sur un mur" : "See my selection on a wall"} →</a></p>
      </div>
    </div>
  );
}
