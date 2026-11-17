"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jeton } from "../../lib/studio-auth";
import { enregistrer } from "../../lib/db";
import { releverMaintenant, importerHistoriqueSite } from "../../lib/releve";

async function verifier() {
  const ok = process.env.STUDIO_PASSWORD && (await cookies()).get("studio")?.value === jeton();
  if (!ok) redirect("/studio");
}

export async function connexion(formData) {
  const mdp = process.env.STUDIO_PASSWORD;
  if (!mdp || formData.get("mdp") !== mdp) redirect("/studio?erreur=1");
  (await cookies()).set("studio", jeton(), {
    httpOnly: true, secure: true, sameSite: "strict", path: "/studio", maxAge: 60 * 60 * 8,
  });
  redirect("/studio");
}

export async function deconnexion() {
  (await cookies()).delete({ name: "studio", path: "/studio" });
  redirect("/studio");
}

const msg = (t) => redirect("/studio?msg=" + encodeURIComponent(t));

export async function relever() {
  await verifier();
  const r = await releverMaintenant();
  msg(`Relevé fait : ${r.enregistres} valeur(s) enregistrée(s).${r.notes.length ? " Remarques : " + r.notes.join(" | ") : ""}`);
}

export async function importerHistorique() {
  await verifier();
  const r = await importerHistoriqueSite();
  msg(`Historique du site importé : ${r.enregistres} valeur(s).${r.notes.length ? " Remarques : " + r.notes.join(" | ") : ""}`);
}

export async function saisirPictorem(formData) {
  await verifier();
  const abonnes = Number(formData.get("abonnes"));
  const vues = Number(formData.get("vues"));
  if (!Number.isFinite(abonnes) || !Number.isFinite(vues) || formData.get("abonnes") === "" || formData.get("vues") === "") {
    msg("Saisie Pictorem invalide : deux nombres sont attendus.");
  }
  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Martinique" }).format(new Date());
  const e = await enregistrer([
    { jour, canal: "pictorem", metrique: "abonnes", valeur: abonnes, source: "manuel" },
    { jour, canal: "pictorem", metrique: "vues", valeur: vues, source: "manuel" },
  ]);
  msg(e.erreur ? "Erreur d'enregistrement : " + e.erreur : "Relevé Pictorem enregistré.");
}
