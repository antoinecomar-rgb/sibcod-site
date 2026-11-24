"use client";
// Ligne de version cliquable : affiche cette version dans la vue « À l'échelle » plus bas
export default function VoirAuMur({ v, label }) {
  const voir = () => {
    window.dispatchEvent(new CustomEvent("sib-variante", { detail: v }));
    document.getElementById("a-l-echelle")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button type="button" className="n-variante-voir" onClick={voir} aria-label={`${label} : ${v.titre}`}>
      {label}
    </button>
  );
}
