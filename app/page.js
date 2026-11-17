import Link from "next/link";
import { lire } from "../lib/supabase";

const TXT = {
  en: {
    title: "Visual creations born of an architect's eye, nourished by Martinique.",
    intro: [
      "Sibcod is a brand of visual creations, born of an architect's eye nourished by Martinique. Wall art, textiles and accessories: each piece extends this sensitive memory into forms made to live with at home.",
      "After years of free creation and projects made to order for professionals and individuals, Sibcod now opens part of its universe to online ordering.",
      "Each work is printed to order on canvas, metal, acrylic, wood or paper. Custom work is available on request.",
    ],
    filters: ["All", "16 in and up", "20 in and up", "28 in and up", "Grand formats"],
    works: (n) => `${n} works`,
    upTo: (po) => `Up to ${po} in`,
    buy: "Buy",
    soon: "Coming soon",
    foot: "Prints made to order by Pictorem. © Sibcod",
  },
  fr: {
    title: "Des créations visuelles nées d'un regard d'architecte, nourri par la Martinique.",
    intro: [
      "Sibcod est une marque de créations visuelles, née d'un regard d'architecte nourri par la Martinique. Décoration murale, produits textiles et accessoires : chaque pièce prolonge cette mémoire sensible dans des formes à intégrer chez soi.",
      "Après des années de création libre et de projets réalisés à la demande pour des professionnels et des particuliers, Sibcod ouvre aujourd'hui une partie de son univers à la commande en ligne.",
      "Chaque œuvre est imprimée à la commande sur toile, métal, acrylique, bois ou papier. Des créations sur mesure sont possibles sur demande.",
    ],
    filters: ["Toutes", "40 cm et +", "50 cm et +", "70 cm et +", "Grands formats"],
    works: (n) => `${n} œuvres`,
    upTo: (po) => `Jusqu'à ${Math.round(po * 2.54)} cm`,
    buy: "Acheter",
    soon: "Bientôt disponible",
    foot: "Tirages réalisés à la commande par Pictorem. © Sibcod",
  },
};
// clé de filtre -> taille minimale (pouces)
const FILTRES = [
  { cle: "tous", min: 0 },
  { cle: "16", min: 16 },
  { cle: "20", min: 20 },
  { cle: "28", min: 28 },
  { cle: "grand", min: 29 },
];

export default async function Accueil({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = TXT[lang];
  const filtre = FILTRES.find((f) => f.cle === sp.taille) || FILTRES[0];
  const href = (taille, l = lang) => {
    const q = new URLSearchParams();
    if (l === "fr") q.set("lang", "fr");
    if (taille !== "tous") q.set("taille", taille);
    const s = q.toString();
    return s ? `/?${s}` : "/";
  };

  const oeuvres = await lire(
    "fichiers_maitres",
    "select=id,titre_fr,titre_en,taille_max_pictorem_po,pictorem_url,url_vignette" +
      "&statut=eq.Fichier%20ma%C3%AEtre&order=titre_en"
  );
  const visibles = oeuvres.filter((o) => (o.taille_max_pictorem_po || 0) >= filtre.min);

  return (
    <div className="wrap">
      <header className="top">
        <Link href={href(filtre.cle)} className="logo">SIBCOD</Link>
        <div className="lang">
          <Link href={href(filtre.cle, "en")} className={lang === "en" ? "on" : ""}>EN</Link>
          <Link href={href(filtre.cle, "fr")} className={lang === "fr" ? "on" : ""}>FR</Link>
        </div>
      </header>

      <section className="intro">
        <h1>{t.title}</h1>
        {t.intro.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <nav className="filters">
        {FILTRES.map((f, i) => (
          <Link key={f.cle} href={href(f.cle)} className={f.cle === filtre.cle ? "on" : ""}>
            {lang === "en" && f.cle !== "tous" && f.cle !== "grand" ? `${f.min} in and up` : t.filters[i]}
          </Link>
        ))}
      </nav>
      <p className="count">{t.works(visibles.length)}</p>

      <div className="grid">
        {visibles.map((o) => {
          const titre = lang === "fr" ? o.titre_fr : o.titre_en;
          return (
            <article key={o.id} className="card">
              <span className="img">
                {o.url_vignette && <img src={o.url_vignette} alt={titre} loading="lazy" />}
              </span>
              <div className="meta">
                <div>
                  <div className="t">{titre}</div>
                  <div className="s">{t.upTo(o.taille_max_pictorem_po)}</div>
                </div>
                {o.pictorem_url ? (
                  <a className="buy" href={o.pictorem_url} target="_blank" rel="noopener noreferrer">{t.buy}</a>
                ) : (
                  <span className="soon">{t.soon}</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="foot">{t.foot}</footer>
    </div>
  );
}
