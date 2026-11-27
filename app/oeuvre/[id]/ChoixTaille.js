"use client";
// « Choisir la taille et le support » : déplie les tailles ; une taille choisie entre dans « Ma sélection »,
// où le visiteur règle le support et le cadre puis commande. Il reste sur le site jusqu'à la commande.
import { useState } from "react";
import { taillesReunies, libelle } from "../../../lib/tailles";
import { ajouterSel, cleTaille } from "../../../lib/monmur";

export default function ChoixTaille({ v, freres = [], label, lang, petit }) {
  const [choisie, setChoisie] = useState(null);
  const fr = lang === "fr";
  const q = fr ? "?lang=fr" : "";
  const choisir = (w, x) => {
    ajouterSel({ id: w.id, t: cleTaille(x) });
    setChoisie(cleTaille(x));
  };
  return (
    <details className={`n-choix-taille${petit ? " petit" : ""}`}>
      <summary className={`buybig${petit ? " n-var" : ""}`}>{label}</summary>
      <ul>
        {taillesReunies(v, freres).map(({ v: w, x }) => (
          <li key={cleTaille(x)}>
            <button type="button" onClick={() => choisir(w, x)} aria-pressed={choisie === cleTaille(x)}>
              {libelle(x, lang)}<span className="n-choix-sel">{choisie === cleTaille(x) ? (fr ? "✓ Ajoutée" : "✓ Added") : (fr ? "+ Ma sélection" : "+ My selection")}</span>
            </button>
            {x.url && <a className="n-choix-acheter" href={x.url} target="_blank" rel="noopener noreferrer">{fr ? "Acheter" : "Buy"}</a>}
          </li>
        ))}
      </ul>
      {choisie && (
        <p className="n-choix-ok">
          {fr ? "Ajoutée à votre sélection." : "Added to your selection."}{" "}
          <a href={`/selection${q}`}>{fr ? "Choisir le support et commander →" : "Choose the medium and order →"}</a>
        </p>
      )}
    </details>
  );
}
