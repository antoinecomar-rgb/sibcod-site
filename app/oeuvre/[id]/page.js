import Link from "next/link";
import { notFound } from "next/navigation";
import { lire } from "../../../lib/supabase";

const surface = { background: "#fff", border: "1px solid #e5e0d8" };

export default async function Oeuvre({ params }) {
  const { id } = await params;
  const [oeuvres, prix] = await Promise.all([
    lire("oeuvres", `select=id,titre,description,variantes(id,format,url_vignette,signe)&id=eq.${encodeURIComponent(id)}`),
    lire("prix", "select=format,prix_eur"),
  ]);
  const oeuvre = oeuvres[0];
  if (!oeuvre) notFound();

  const prixParFormat = Object.fromEntries(prix.map((p) => [p.format, p.prix_eur]));
  const variantes = [...oeuvre.variantes].sort((a, b) => (a.format || "").localeCompare(b.format || "", "fr", { numeric: true }));
  const principale = variantes.find((v) => v.url_vignette);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <p><Link href="/" style={{ color: "#666" }}>← Toutes les œuvres</Link></p>
      <h1 style={{ marginBottom: 4 }}>{oeuvre.titre}</h1>
      {oeuvre.description && <p style={{ maxWidth: 650 }}>{oeuvre.description}</p>}

      {principale && (
        <img
          src={principale.url_vignette}
          alt={oeuvre.titre}
          style={{ width: "100%", maxHeight: 560, objectFit: "contain", background: "#eee9e1", display: "block", margin: "20px 0" }}
        />
      )}

      <h2 style={{ fontSize: 18 }}>Formats disponibles</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {variantes.map((v) => {
          const p = prixParFormat[v.format];
          return (
            <div key={v.id} style={surface}>
              <div style={{ aspectRatio: "4 / 3", background: "#eee9e1" }}>
                {v.url_vignette && (
                  <img src={v.url_vignette} alt={`${oeuvre.titre} ${v.format || ""}`} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </div>
              <div style={{ padding: 12 }}>
                <strong>{v.format ? `${v.format} cm` : "Format à préciser"}</strong>
                <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
                  {p != null ? `${Number(p).toLocaleString("fr-FR")} €` : "Prix à venir"}
                  {v.signe ? " · signée" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
