import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jeton } from "../../../lib/studio-auth";
import { produireRapport } from "../../../lib/analyste";
import { lireRapports } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const box = { border: "1px solid #ddd", borderRadius: 8, padding: 16, background: "#fff", marginTop: 16 };

export default async function Rapport({ searchParams }) {
  const sp = await searchParams;
  const ok = process.env.STUDIO_PASSWORD && (await cookies()).get("studio")?.value === jeton();
  if (!ok) redirect("/studio");

  const go = sp?.go === "1";
  let donnees = null, texte = null, note = null, stockage = null;
  let anciens = { lignes: [] };
  if (go) {
    const r = await produireRapport("manuel");
    donnees = r.donnees; texte = r.texte; note = r.note; stockage = r.stockage;
  } else {
    anciens = await lireRapports(5);
  }
  const date = (d) => new Intl.DateTimeFormat("fr-FR", { timeZone: "America/Martinique", dateStyle: "long", timeStyle: "short" }).format(new Date(d));

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <a href="/studio">← Retour au Studio</a>
      <h1 style={{ fontSize: 24 }}>Bot Analyste – rapport de la semaine</h1>
      {!go && (
        <div style={box}>
          <p>L'analyste lit les relevés, Google Analytics et Instagram, calcule la semaine, puis rédige un commentaire. Il ne publie et n'envoie rien.</p>
          <a href="/studio/rapport?go=1"><button>Générer le rapport maintenant</button></a>
          <p style={{ color: "#666", fontSize: 13 }}>Un rapport est aussi généré automatiquement chaque lundi matin (heure de Martinique) et rangé ci-dessous.</p>
        </div>
      )}
      {!go && anciens.erreur && <p style={{ ...box, borderColor: "#c60", color: "#c60" }}>Rapports indisponibles : {anciens.erreur}</p>}
      {!go && !anciens.erreur && anciens.lignes.length === 0 && <p style={{ color: "#666" }}>Aucun rapport enregistré pour l'instant.</p>}
      {!go && anciens.lignes.map((r) => (
        <div key={r.id} style={box}>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            Rapport du {date(r.cree_le)} · semaine du {r.periode_du} au {r.periode_au} · {r.source === "auto" ? "automatique" : "à la demande"}
          </div>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{r.texte}</div>
        </div>
      ))}
      {go && (
        <>
          <p style={{ color: "#666" }}>Période : du {donnees.periode.du} au {donnees.periode.au}</p>
          {donnees.avertissements.map((a) => <p key={a} style={{ ...box, borderColor: "#c60", color: "#c60" }}>{a}</p>)}
          {note && <p style={{ ...box, borderColor: "#c60", color: "#c60" }}>{note}</p>}
          {stockage && <p style={{ ...box, borderColor: "#c60", color: "#c60" }}>Rapport non enregistré : {stockage}</p>}
          {texte && <div style={{ ...box, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{texte}</div>}
          <h2 style={{ fontSize: 16, marginTop: 24 }}>Chiffres utilisés (calculés par le code)</h2>
          <pre style={{ ...box, fontSize: 12, overflow: "auto" }}>{JSON.stringify(donnees, null, 1)}</pre>
          <a href="/studio/rapport?go=1"><button>Régénérer</button></a>
        </>
      )}
    </main>
  );
}
