// Lecture seule des statistiques Meta (Facebook + Instagram).
const V = "v27.0";
const BASE = `https://graph.facebook.com/${V}`;

async function get(path, params = {}) {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) return { erreur: "META_ACCESS_TOKEN manquant" };
  const qs = new URLSearchParams({ ...params, access_token: token });
  try {
    const r = await fetch(`${BASE}/${path}?${qs}`, { cache: "no-store" });
    const j = await r.json();
    if (j.error) return { erreur: j.error.message };
    return { data: j };
  } catch (e) {
    return { erreur: String(e.message || e) };
  }
}

export async function lireMeta() {
  const page = process.env.META_PAGE_ID;
  const ig = process.env.META_IG_ID;
  if (!page || !ig) return { erreur: "META_PAGE_ID ou META_IG_ID manquant" };

  const [fb, profil, medias, portee] = await Promise.all([
    get(page, { fields: "name,fan_count" }),
    get(ig, { fields: "username,followers_count,media_count" }),
    get(`${ig}/media`, {
      fields: "caption,media_type,timestamp,like_count,comments_count,permalink",
      limit: "10",
    }),
    get(`${ig}/insights`, {
      metric: "reach,profile_views",
      period: "day",
      metric_type: "total_value",
    }),
  ]);

  return { fb, profil, medias, portee };
}
