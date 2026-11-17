import Link from "next/link";
import { lire } from "../lib/supabase";
import Galerie from "./Galerie";

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

  const detail = (id) => `/oeuvre/${id}${lang === "fr" ? "?lang=fr" : ""}`;
  const oeuvres = await lire(
    "fichiers_maitres",
    "select=id,titre_fr,titre_en,proportion,taille_max_pictorem_po,pictorem_url,url_vignette" +
      "&statut=eq.Fichier%20ma%C3%AEtre&order=titre_en"
  );
  const visibles = oeuvres.filter((o) => (o.taille_max_pictorem_po || 0) >= filtre.min);

  const ratio = (o) => {
    const m = String(o.proportion || "").match(/(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) / Number(m[2]) : 1;
  };
  // clé de similarité : titre sans numéro final (« Sea and Sky 2 » -> « sea and sky »)
  const cle = (o) =>
    (o.titre_en || "").toLowerCase().replace(/(\s+(\d+|i{1,3}|iv|v|vi{0,3}|[a-d]))+$/i, "").trim();
  // mélange déterministe (même ordre à chaque visite)
  let graine = 7;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const melange = [...visibles];
  for (let i = melange.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [melange[i], melange[j]] = [melange[j], melange[i]];
  }
  // on évite de placer côte à côte des œuvres similaires (même clé) ou deux panoramas proches
  const ordre = [];
  const reste = melange;
  while (reste.length) {
    const recents = ordre.slice(-8);
    const ok = (o) =>
      !recents.some((r) => cle(r) === cle(o)) &&
      !(ratio(o) >= 1.9 && ordre.slice(-5).some((r) => ratio(r) >= 1.9));
    let k = reste.findIndex(ok);
    if (k < 0) k = 0;
    ordre.push(reste.splice(k, 1)[0]);
  }
  const items = ordre.map((o) => {
    const r = ratio(o);
    return {
      id: o.id,
      titre: lang === "fr" ? o.titre_fr : o.titre_en,
      sous: t.upTo(o.taille_max_pictorem_po),
      href: detail(o.id),
      src: o.url_vignette,
      buyUrl: o.pictorem_url,
      ratio: r,
      span: r >= 2.2 ? 3 : r >= 1.9 ? 2 : 1,
    };
  });

  return (
    <div className="wrap">
      <header className="top">
        <Link href={href(filtre.cle)} className="logo">SIBCOD</Link>
        <div className="lang">
          <Link href={href(filtre.cle, "en")} className={lang === "en" ? "on" : ""}>EN</Link>
          <Link href={href(filtre.cle, "fr")} className={lang === "fr" ? "on" : ""}>FR</Link>
        </div>
      </header>

      <section className="hero" aria-label="Sibcod in real interiors">
        {[[1, 2, 3, 4], [5, 6, 7, 8]].map((set, k) => (
          <div key={k} className={`heroset s${k}`}>
            {set.map((n) => (
              <img key={n} src={`/hero/hero-${n}.jpg`} alt="Sibcod artwork in an interior" loading={k === 0 ? "eager" : "lazy"} />
            ))}
          </div>
        ))}
      </section>

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

      <Galerie items={items} buy={t.buy} soon={t.soon} />

      <footer className="foot">{t.foot}</footer>
    </div>
  );
}
