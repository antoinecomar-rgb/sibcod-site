import { releverMaintenant } from "../../../lib/releve";

export const dynamic = "force-dynamic";

// Appelé chaque jour par la tâche planifiée Vercel (en-tête Authorization: Bearer CRON_SECRET).
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorisé", { status: 401 });
  }
  return Response.json(await releverMaintenant());
}
