// Historique des relevés (table Supabase "releves"), accès serveur uniquement.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const entetes = () => ({ apikey: CLE, Authorization: `Bearer ${CLE}`, "Content-Type": "application/json" });

export async function enregistrer(lignes) {
  if (!CLE || !URL_) return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquant" };
  if (!lignes.length) return { ok: 0 };
  const r = await fetch(`${URL_}/rest/v1/releves?on_conflict=jour,canal,metrique`, {
    method: "POST",
    headers: { ...entetes(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(lignes),
    cache: "no-store",
  });
  if (!r.ok) return { erreur: `Supabase ${r.status} : ${(await r.text()).slice(0, 200)}` };
  return { ok: lignes.length };
}

export async function lireReleves(jours = 365) {
  if (!CLE || !URL_) return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquant", lignes: [] };
  const depuis = new Date(Date.now() - jours * 86400000).toISOString().slice(0, 10);
  const r = await fetch(`${URL_}/rest/v1/releves?select=jour,canal,metrique,valeur&jour=gte.${depuis}&order=jour.asc&limit=5000`, {
    headers: entetes(),
    cache: "no-store",
  });
  if (!r.ok) return { erreur: `Supabase ${r.status}`, lignes: [] };
  return { lignes: await r.json() };
}

// Rapports de l'Analyste (table Supabase "rapports").
export async function enregistrerRapport(r) {
  if (!CLE || !URL_) return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquant" };
  const x = await fetch(`${URL_}/rest/v1/rapports`, {
    method: "POST",
    headers: { ...entetes(), Prefer: "return=minimal" },
    body: JSON.stringify([r]),
    cache: "no-store",
  });
  if (!x.ok) return { erreur: `Supabase ${x.status} : ${(await x.text()).slice(0, 200)}` };
  return { ok: true };
}

export async function lireRapports(n = 5) {
  if (!CLE || !URL_) return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquant", lignes: [] };
  const x = await fetch(`${URL_}/rest/v1/rapports?select=id,cree_le,periode_du,periode_au,texte,source&order=cree_le.desc&limit=${n}`, {
    headers: entetes(),
    cache: "no-store",
  });
  if (!x.ok) return { erreur: `Supabase ${x.status} : ${(await x.text()).slice(0, 200)}`, lignes: [] };
  return { lignes: await x.json() };
}
