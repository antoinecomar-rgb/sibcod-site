// Lecture seule de Google Analytics 4 (API Data) via un compte de service.
import { createSign } from "crypto";

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");

async function jetonAcces(cle) {
  const now = Math.floor(Date.now() / 1000);
  const entete = b64({ alg: "RS256", typ: "JWT" });
  const corps = b64({
    iss: cle.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });
  const sig = createSign("RSA-SHA256").update(`${entete}.${corps}`).sign(cle.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${entete}.${corps}.${sig}`,
    }),
    cache: "no-store",
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(j.error_description || j.error || "jeton Google refusé");
  return j.access_token;
}

async function rapport(token, propriete, corps) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propriete}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(corps),
    cache: "no-store",
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

const periode = [{ startDate: "7daysAgo", endDate: "today" }];

export async function lireGA() {
  const brut = process.env.GA_SERVICE_ACCOUNT_JSON;
  const propriete = process.env.GA_PROPERTY_ID;
  if (!brut || !propriete) return { erreur: "GA_SERVICE_ACCOUNT_JSON ou GA_PROPERTY_ID manquant" };
  try {
    const cle = JSON.parse(brut);
    const token = await jetonAcces(cle);
    const [totaux, pages, clics] = await Promise.all([
      rapport(token, propriete, {
        dateRanges: periode,
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      }),
      rapport(token, propriete, {
        dateRanges: periode,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
      rapport(token, propriete, {
        dateRanges: periode,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", inListFilter: { values: ["pictorem_click", "contact_click"] } },
        },
      }),
    ]);
    const t = totaux.rows?.[0]?.metricValues?.map((v) => v.value) || [];
    const ev = Object.fromEntries((clics.rows || []).map((r) => [r.dimensionValues[0].value, r.metricValues[0].value]));
    return {
      visiteurs: t[0] ?? "0",
      sessions: t[1] ?? "0",
      pagesVues: t[2] ?? "0",
      clicsPictorem: ev.pictorem_click ?? "0",
      clicsContact: ev.contact_click ?? "0",
      topPages: (pages.rows || []).map((r) => ({ page: r.dimensionValues[0].value, vues: r.metricValues[0].value })),
    };
  } catch (e) {
    return { erreur: String(e.message || e) };
  }
}
