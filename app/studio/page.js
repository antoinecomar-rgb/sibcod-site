import { cookies } from "next/headers";
import { connexion, deconnexion, relever, importerHistorique, saisirPictorem } from "./actions";
import Graphique from "./Graphique";
import { lireReleves } from "../../lib/db";
import { jeton } from "../../lib/studio-auth";
import { lireMeta } from "../../lib/meta";
import { lireGA } from "../../lib/ga";

export const dynamic = "force-dynamic";

const box = { border: "1px solid #ddd", borderRadius: 8, padding: 16, background: "#fff" };
const n = (v) => (v ?? "—");

function Carte({ titre, valeur }) {
  return (
    <div style={box}>
      <div style={{ fontSize: 13, color: "#666" }}>{titre}</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>{valeur}</div>
    </div>
  );
}

export default async function Studio({ searchParams }) {
  const sp = await searchParams;
  const mdp = process.env.STUDIO_PASSWORD;
  const ok = mdp && (await cookies()).get("studio")?.value === jeton();

  if (!ok) {
    return (
      <main style={{ maxWidth: 360, margin: "20vh auto", fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 22 }}>Studio SIBCOD</h1>
        {!mdp && <p style={{ color: "#b00" }}>Studio non configuré (STUDIO_PASSWORD manquant).</p>}
        <form action={connexion} style={{ display: "grid", gap: 12 }}>
          <input name="mdp" type="password" placeholder="Mot de passe" required style={{ padding: 10 }} />
          <button style={{ padding: 10 }}>Entrer</button>
          {sp?.erreur && <p style={{ color: "#b00" }}>Mot de passe incorrect.</p>}
        </form>
      </main>
    );
  }

  const [m, ga, hist] = await Promise.all([lireMeta(), lireGA(), lireReleves(365)]);
  const serie = (canal, metrique) => hist.lignes.filter((l) => l.canal === canal && l.metrique === metrique).map((l) => ({ jour: l.jour, valeur: Number(l.valeur) }));
  const LIENS = {
    ig: "https://www.instagram.com/sibcod/",
    igStats: "https://business.facebook.com/latest/insights/results?asset_id=126135473925176&business_id=1300080180827948",
    fb: "https://business.facebook.com/latest/insights/results?asset_id=126135473925176&business_id=1300080180827948",
    pictorem: "https://www.pictorem.com/portalstats.html",
    ga: "https://analytics.google.com/analytics/web/#/a416667074p564850170/reports/intelligenthome",
  };
  const exp = process.env.META_TOKEN_EXPIRES || "2027-01-16";
  const jours = Math.ceil((new Date(exp) - new Date()) / 86400000);
  const reach = m.portee?.data?.data?.find((x) => x.name === "reach")?.total_value?.value;
  const vues = m.portee?.data?.data?.find((x) => x.name === "profile_views")?.total_value?.value;
  const posts = m.medias?.data?.data || [];
  const erreurs = [m.erreur, m.fb?.erreur, m.profil?.erreur, m.medias?.erreur, m.portee?.erreur].filter(Boolean);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24 }}>Studio SIBCOD – Tableau de bord (lecture seule)</h1>
        <form action={deconnexion}><button>Quitter</button></form>
      </div>

      {jours <= 14 && (
        <p style={{ ...box, borderColor: "#c60", color: "#c60" }}>
          Le jeton Meta expire dans {jours} jour(s) ({exp}). À renouveler.
        </p>
      )}
      {erreurs.length > 0 && (
        <p style={{ ...box, borderColor: "#b00", color: "#b00" }}>Erreur Meta : {erreurs.join(" | ")}</p>
      )}

      {sp?.msg && <p style={{ ...box, borderColor: "#2a5d9f" }}>{sp.msg}</p>}
      {hist.erreur && (
        <p style={{ ...box, borderColor: "#c60", color: "#c60" }}>Historique indisponible : {hist.erreur}</p>
      )}

      <h2 style={{ fontSize: 16, marginTop: 24 }}>1. Évolution des abonnés</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        <Graphique titre="Instagram – abonnés" serie={serie("instagram", "abonnes")} lien={LIENS.ig} lienTexte="Ouvrir Instagram" />
        <Graphique titre="Facebook – abonnés" serie={serie("facebook", "abonnes")} lien={LIENS.fb} lienTexte="Ouvrir Meta Business Suite" />
        <Graphique titre="Pictorem – abonnés" serie={serie("pictorem", "abonnes")} lien={LIENS.pictorem} lienTexte="Ouvrir les stats Pictorem" note="Saisie manuelle" />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>2. Évolution des vues</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
        <Graphique titre="Instagram – vues par jour" serie={serie("instagram", "vues")} lien={LIENS.igStats} lienTexte="Ouvrir les statistiques Instagram" />
        <Graphique titre="Facebook – vues par jour" serie={serie("facebook", "vues")} lien={LIENS.fb} lienTexte="Ouvrir les statistiques Facebook" />
        <Graphique titre="Pictorem – vues d'œuvres (30 j)" serie={serie("pictorem", "vues")} lien={LIENS.pictorem} lienTexte="Ouvrir les stats Pictorem" note="Saisie manuelle, cumul sur 30 jours" />
        <Graphique titre="Site – visiteurs par jour" serie={serie("site", "visiteurs")} lien={LIENS.ga} lienTexte="Ouvrir Google Analytics" note="Visiteurs ayant accepté les cookies" />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Bot Analyste</h2>
      <div style={box}>
        <a href="/studio/rapport"><button>Rapport de la semaine</button></a>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Actions</h2>
      <div style={{ ...box, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <form action={relever}><button>Relever maintenant (Meta + site)</button></form>
          <form action={importerHistorique}><button>Importer l'historique du site (12 mois)</button></form>
        </div>
        <form action={saisirPictorem} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "end" }}>
          <label style={{ fontSize: 13 }}>Pictorem – abonnés<br /><input name="abonnes" type="number" min="0" required style={{ padding: 6, width: 120 }} /></label>
          <label style={{ fontSize: 13 }}>Pictorem – vues d'œuvres (30 j)<br /><input name="vues" type="number" min="0" required style={{ padding: 6, width: 160 }} /></label>
          <button>Enregistrer le relevé Pictorem</button>
          <a href={LIENS.pictorem} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>Ouvrir les stats Pictorem ↗</a>
        </form>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Chiffres actuels</h2>
      <h2 style={{ fontSize: 16, marginTop: 24 }}>Site sibcod.com – 7 derniers jours <a href={LIENS.ga} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 400 }}>Google Analytics ↗</a></h2>
      {ga.erreur ? (
        <p style={{ ...box, borderColor: "#b00", color: "#b00" }}>Erreur Google Analytics : {ga.erreur}</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <Carte titre="Visiteurs" valeur={ga.visiteurs} />
            <Carte titre="Sessions" valeur={ga.sessions} />
            <Carte titre="Pages vues" valeur={ga.pagesVues} />
            <Carte titre="Clics « Acheter » (Pictorem)" valeur={ga.clicsPictorem} />
            <Carte titre="Clics contact" valeur={ga.clicsContact} />
          </div>
          <p style={{ fontSize: 12, color: "#666" }}>
            Visiteurs ayant accepté les cookies uniquement (bandeau de consentement).
          </p>
          {ga.topPages.length > 0 && (
            <div style={{ ...box, marginTop: 8 }}>
              <div style={{ fontSize: 13, color: "#666" }}>Pages les plus vues</div>
              {ga.topPages.map((p) => (
                <div key={p.page}>{p.page} — {p.vues}</div>
              ))}
            </div>
          )}
        </>
      )}

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Instagram @{m.profil?.data?.username || "sibcod"} <a href={LIENS.ig} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 400 }}>Instagram ↗</a></h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        <Carte titre="Abonnés" valeur={n(m.profil?.data?.followers_count)} />
        <Carte titre="Publications" valeur={n(m.profil?.data?.media_count)} />
        <Carte titre="Portée (24 h)" valeur={n(reach)} />
        <Carte titre="Visites du profil (24 h)" valeur={n(vues)} />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>Facebook {m.fb?.data?.name || "Sibcod"} <a href={LIENS.fb} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 400 }}>Business Suite ↗</a></h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        <Carte titre="Fans" valeur={n(m.fb?.data?.fan_count)} />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 24 }}>10 dernières publications Instagram <a href={LIENS.ig} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 400 }}>Instagram ↗</a></h2>
      <div style={{ display: "grid", gap: 8 }}>
        {posts.map((p) => (
          <a key={p.id} href={p.permalink} target="_blank" rel="noreferrer" style={{ ...box, textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: 12, color: "#666" }}>{p.timestamp?.slice(0, 10)} · {p.media_type}</div>
            <div>{(p.caption || "(sans légende)").slice(0, 120)}</div>
            <div style={{ fontSize: 13 }}>♥ {n(p.like_count)} · 💬 {n(p.comments_count)}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
