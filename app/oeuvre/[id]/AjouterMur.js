"use client";
// « Ajouter à ma sélection » : garde la sélection du visiteur dans son navigateur (page Composer et page Ma sélection)
import { useEffect, useState } from "react";
import { lireSel, ecrireSel, ajouterSel, MAX_MUR, EVT } from "../../../lib/monmur";

export default function AjouterMur({ id, lang, Q }) {
  const [liste, setListe] = useState([]);
  useEffect(() => {
    const maj = () => setListe(lireSel());
    maj();
    window.addEventListener(EVT, maj);
    return () => window.removeEventListener(EVT, maj);
  }, []);
  const dedans = liste.some((x) => x.id === id);
  const plein = !dedans && liste.length >= MAX_MUR;
  const basculer = () => {
    if (dedans) ecrireSel(liste.filter((x) => x.id !== id));
    else ajouterSel({ id });
  };
  const fr = lang === "fr";
  const q = Q || "";
  return (
    <p className="n-ajout-mur">
      <button type="button" className="n-btn2" onClick={basculer} aria-pressed={dedans} disabled={plein}>
        {dedans ? (fr ? "✓ Dans ma sélection" : "✓ In my selection") : (fr ? "+ Ajouter à ma sélection" : "+ Add to my selection")}
      </button>
      {liste.length > 0 && (
        <>
          <a className="n-lien" href={`/composer${q ? q + "&" : "?"}mode=moi`}>{fr ? "Voir sur mon mur" : "See on my wall"} →</a>
          <a className="n-lien" href={`/selection${q}`}>{fr ? `Ma sélection (${liste.length})` : `My selection (${liste.length})`} →</a>
        </>
      )}
      {plein && <span className="n-petit">{fr ? `${MAX_MUR} œuvres au plus.` : `${MAX_MUR} artworks at most.`}</span>}
    </p>
  );
}
