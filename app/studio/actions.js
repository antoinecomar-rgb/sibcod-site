"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jeton } from "../../lib/studio-auth";

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
