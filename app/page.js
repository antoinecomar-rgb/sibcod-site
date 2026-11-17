import Link from "next/link";
import { lire } from "../lib/supabase";
import Galerie from "./Galerie";
import Banniere from "./Banniere";
import COUL from "../data/couleurs.json";

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

  // ratio réel de l'image (largeur/hauteur), mesuré sur la vignette ; repli sur la proportion déclarée
  const ratio = (o) => {
    if (COUL[o.id]) return COUL[o.id].r;
    const m = String(o.proportion || "").match(/(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) / Number(m[2]) : 1;
  };
  // clé de similarité : titre sans numéro final (« Sea and Sky 2 » -> « sea and sky »)
  const cle = (o) =>
    (o.titre_en || "").toLowerCase().replace(/(\s+(\d+|i{1,3}|iv|v|vi{0,3}|[a-d]))+$/i, "").trim();
  // ordre par proximité de couleur (distance Lab), en évitant les œuvres de la même série à moins de 8 places
  const dist = (x, y) => {
    const a = COUL[x.id]?.c || [50, 0, 0], b = COUL[y.id]?.c || [50, 0, 0];
    return Math.hypot(a[0] - b[0], 1.5 * (a[1] - b[1]), 1.5 * (a[2] - b[2]));
  };
  const estPano = (o) => ratio(o) >= 1.9;
  let graine = 7;
  const alea = () => ((graine = (graine * 16807) % 2147483647) / 2147483647);
  const panosL = visibles.filter(estPano);
  const reste = visibles.filter((o) => !estPano(o));
  const ordre = [];
  if (reste.length) ordre.push(reste.splice(Math.floor(alea() * reste.length), 1)[0]);
  while (reste.length) {
    const dernier = ordre[ordre.length - 1];
    const recents = ordre.slice(-8);
    let meilleur = -1, md = Infinity;
    reste.forEach((o, k) => {
      if (recents.some((r) => cle(r) === cle(o))) return;
      const d = dist(dernier, o);
      if (d < md) { md = d; meilleur = k; }
    });
    ordre.push(reste.splice(meilleur < 0 ? 0 : meilleur, 1)[0]);
  }
  // panoramas répartis dans la page (vers 20 %, 50 % et 80 %), placés au meilleur voisinage de couleur
  panosL.forEach((p, i) => {
    const cible = Math.round(ordre.length * (0.2 + (0.6 * i) / Math.max(1, panosL.length - 1)));
    let best = cible, bd = Infinity;
    for (let k = Math.max(4, cible - 12); k <= Math.min(ordre.length, cible + 12); k++) {
      const d = dist(p, ordre[Math.max(0, k - 1)]);
      if (d < bd) { bd = d; best = k; }
    }
    ordre.splice(best, 0, p);
  });
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

      <Banniere lang={lang} />

      <section className="intro">
        <h1>{t.title}</h1>
        {t.intro.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <nav className="filters" id="oeuvres">
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
