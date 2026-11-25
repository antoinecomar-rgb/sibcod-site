"use client";
// « Ajouter à mon mur » : garde la sélection du visiteur dans son navigateur, reprise par la page Composer
import { useEffect, useState } from "react";
import { lireMur, ecrireMur, MAX_MUR } from "../../../lib/monmur";

export default function AjouterMur({ id, lang, Q }) {
  const [liste, setListe] = useState([]);
  useEffect(() => setListe(lireMur()), []);
  const dedans = liste.includes(id);
  const plein = !dedans && liste.length >= MAX_MUR;
  const basculer = () => {
    const l = dedans ? liste.filter((x) => x !== id) : [...liste, id].slice(-MAX_MUR);
    ecrireMur(l); setListe(l);
  };
  const fr = lang === "fr";
  return (
    <p className="n-ajout-mur">
      <button type="button" className="n-btn2" onClick={basculer} aria-pressed={dedans} disabled={plein}>
        {dedans ? (fr ? "✓ Dans mon mur" : "✓ On my wall") : (fr ? "+ Ajouter à mon mur" : "+ Add to my wall")}
      </button>
      {liste.length > 0 && (
        <a className="n-lien" href={`/composer${Q ? Q + "&" : "?"}mode=moi`}>
          {fr ? `Composer mon mur (${liste.length})` : `Compose my wall (${liste.length})`} →
        </a>
      )}
      {plein && <span className="n-petit">{fr ? `${MAX_MUR} œuvres au plus.` : `${MAX_MUR} artworks at most.`}</span>}
    </p>
  );
}
