import Link from "next/link";
import { lire } from "../lib/supabase";

// Filtres : taille maximale disponible chez Pictorem (en pouces) -> libellé en cm
const FILTRES = [
  { cle: "tous", label: "Toutes", min: 0 },
  { cle: "40", label: "40 cm et +", min: 16 },
  { cle: "50", label: "50 cm et +", min: 20 },
  { cle: "70", label: "70 cm et +", min: 28 },
  { cle: "grand", label: "Grands formats (> 70 cm)", min: 29 },
];

export const metadata = { title: "SIBCOD – Catalogue", description: "Les affiches de Sibylle" };

export default async function Accueil({ searchParams }) {
  const { taille = "tous" } = await searchParams;
  const filtre = FILTRES.find((f) => f.cle === taille) || FILTRES[0];

  const oeuvres = await lire(
    "fichiers_maitres",
    "select=id,titre_fr,titre_en,taille_max_pictorem_po,pictorem_url,url_vignette" +
      "&statut=eq.Fichier%20ma%C3%AEtre&order=titre_fr"
  );
  const visibles = oeuvres.filter((o) => (o.taille_max_pictorem_po || 0) >= filtre.min);
  const cm = (po) => Math.round(po * 2.54);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ letterSpacing: 4 }}>SIBCOD</h1>

      <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 24px" }}>
        {FILTRES.map((f) => (
          <Link
            key={f.cle}
            href={f.cle === "tous" ? "/" : `/?taille=${f.cle}`}
            style={{
              padding: "6px 14px",
              border: "1px solid #222",
              textDecoration: "none",
              color: f.cle === filtre.cle ? "#fff" : "#222",
              background: f.cle === filtre.cle ? "#222" : "transparent",
              fontSize: 14,
            }}
          >
            {f.label}
          </Link>
        ))}
      </nav>
      <p style={{ color: "#666", fontSize: 14 }}>{visibles.length} œuvres</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {visibles.map((o) => (
          <div key={o.id} style={{ background: "#fff", border: "1px solid #e5e0d8" }}>
            <div style={{ aspectRatio: "4 / 3", background: "#eee9e1" }}>
              {o.url_vignette && (
                <img
                  src={o.url_vignette}
                  alt={o.titre_fr}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
            </div>
            <div style={{ padding: 14 }}>
              <strong>{o.titre_fr}</strong>
              <div style={{ fontSize: 13, color: "#666", margin: "6px 0 12px" }}>
                Jusqu'à {cm(o.taille_max_pictorem_po)} cm
              </div>
              {o.pictorem_url ? (
                <a
                  href={o.pictorem_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", padding: "8px 0", background: "#222", color: "#fff", textDecoration: "none", fontSize: 14 }}
                >
                  Acheter
                </a>
              ) : (
                <span style={{ display: "block", textAlign: "center", padding: "8px 0", border: "1px solid #ccc", color: "#888", fontSize: 14 }}>
                  Bientôt disponible
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
