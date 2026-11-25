"use client";
// lien « Ma sélection (n) » dans l'en-tête, visible dès qu'une œuvre a été choisie
import { useEffect, useState } from "react";
import { lireSel, EVT } from "../lib/monmur";

export default function LienSelection({ lang, actif }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const maj = () => setN(lireSel().length);
    maj();
    window.addEventListener(EVT, maj);
    window.addEventListener("storage", maj);
    return () => { window.removeEventListener(EVT, maj); window.removeEventListener("storage", maj); };
  }, []);
  if (!n && !actif) return null;
  return (
    <a href={`/selection${lang === "fr" ? "?lang=fr" : ""}`} className={`n-lien-sel${actif ? " on" : ""}`}>
      {lang === "fr" ? "Ma sélection" : "My selection"} ({n})
    </a>
  );
}
