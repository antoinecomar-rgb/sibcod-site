import { redirect } from "next/navigation";

// L'ancienne page « À propos » est remplacée par l'onglet Sibcod
export default async function APropos({ searchParams }) {
  const sp = await searchParams;
  redirect(sp.lang === "fr" ? "/sibcod?lang=fr" : "/sibcod");
}
