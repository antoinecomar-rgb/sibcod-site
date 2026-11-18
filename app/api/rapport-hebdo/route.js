// Déclenché chaque lundi par la tâche planifiée Vercel (voir vercel.json). Protégé par CRON_SECRET.
import { produireRapport } from "../../../lib/analyste";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorisé", { status: 401 });
  }
  const r = await produireRapport("auto");
  return Response.json({ ok: Boolean(r.texte), note: r.note || null, stockage: r.stockage });
}
