import { lire } from "../lib/supabase";

export default async function Accueil() {
  const oeuvres = await lire("oeuvres", "select=id,titre,variantes(format,url_vignette)&order=titre");
  const fmt = (o) => [...new Set(o.variantes.map((v) => v.format).filter(Boolean))].sort();
  const image = (o) => o.variantes.find((v) => v.url_vignette)?.url_vignette;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ letterSpacing: 4 }}>SIBCOD</h1>
      <p>Page de test : {oeuvres.length} œuvres lues dans la base.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {oeuvres.map((o) => (
          <div key={o.id} style={{ background: "#fff", border: "1px solid #e5e0d8" }}>
            <div style={{ aspectRatio: "4 / 3", background: "#eee9e1" }}>
              {image(o) && (
                <img
                  src={image(o)}
                  alt={o.titre}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
            </div>
            <div style={{ padding: 14 }}>
              <strong>{o.titre}</strong>
              <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                {fmt(o).length ? fmt(o).join(" · ") + " cm" : "format à préciser"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
