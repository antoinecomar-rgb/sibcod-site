// Lecture du catalogue via l'API REST de Supabase (clé publique : lecture seule grâce aux règles RLS)
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export async function lire(table, query = "select=*") {
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: KEY },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}
