// Courbe SVG simple (aucune dépendance), avec bouton vers la source des chiffres.
const W = 320, H = 120, P = 6;

export default function Graphique({ titre, serie, lien, lienTexte, note }) {
  const pts = serie || [];
  let corps;
  if (pts.length < 2) {
    corps = (
      <div style={{ height: H, display: "grid", placeItems: "center", color: "#777", fontSize: 13, textAlign: "center" }}>
        {pts.length === 1
          ? `1 relevé (${pts[0].valeur}) – la courbe se construit avec les jours`
          : "Pas encore de données"}
      </div>
    );
  } else {
    const vals = pts.map((p) => p.valeur);
    const min = Math.min(...vals), max = Math.max(...vals);
    const ecart = max - min || 1;
    const x = (i) => P + (i * (W - 2 * P)) / (pts.length - 1);
    const y = (v) => H - P - ((v - min) * (H - 2 * P)) / ecart;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.valeur).toFixed(1)}`).join(" ");
    corps = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={titre}>
        <path d={d} fill="none" stroke="#2a5d9f" strokeWidth="2" />
        <circle cx={x(pts.length - 1)} cy={y(vals[vals.length - 1])} r="3" fill="#2a5d9f" />
      </svg>
    );
  }
  const dernier = pts[pts.length - 1];
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ fontSize: 14 }}>{titre}</strong>
        {dernier && <span style={{ fontSize: 20, fontWeight: 600 }}>{dernier.valeur}</span>}
      </div>
      {corps}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777" }}>
        <span>{pts[0]?.jour}</span>
        <span>{pts.length > 1 ? dernier.jour : ""}</span>
      </div>
      {note && <div style={{ fontSize: 11, color: "#777" }}>{note}</div>}
      <a href={lien} target="_blank" rel="noreferrer"
        style={{ display: "inline-block", marginTop: 8, fontSize: 13, padding: "4px 10px", border: "1px solid #2a5d9f", borderRadius: 6, color: "#2a5d9f", textDecoration: "none" }}>
        {lienTexte} ↗
      </a>
    </div>
  );
}
