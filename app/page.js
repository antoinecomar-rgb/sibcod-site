import Pied from "./Pied";
import Link from "next/link";
import { lire } from "../lib/supabase";
import GalerieComposee from "./GalerieComposee";
import Entete from "./Entete";
import Pictorem from "./Pictorem";
import BandeauGala from "./BandeauGala";
import COUL from "../data/couleurs.json";
import { alternates } from "../lib/seo";

const TXT = {
  en: {
    kicker: "Original art prints · Martinique",
    hero: "The colours of Martinique, made for your walls.",
    cta: "Explore the collection",
    coll: "The collection",
    collSub: (n) => `${n} works, printed to order`,
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
    kicker: "Affiches d'art originales · Martinique",
    hero: "Les couleurs de la Martinique, pour vos murs.",
    cta: "Découvrir la collection",
    coll: "La collection",
    collSub: (n) => `${n} œuvres, imprimées à la commande`,
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

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const fr = sp.lang === "fr";
  const titre = fr ? "SIBCOD – Affiches d'art de Martinique" : "SIBCOD – Art prints from Martinique";
  const description = fr
    ? "Œuvres originales de Sibcod, inspirées de la Martinique, imprimées à la commande sur toile, métal, acrylique, bois ou papier."
    : "Original artworks by Sibcod, inspired by Martinique, printed to order on canvas, metal, acrylic, wood or paper.";
  return { title: titre, description, alternates: alternates("/", fr ? "fr" : "en"), openGraph: { title: titre, description, locale: fr ? "fr_FR" : "en_US", images: ["/hero/hero-1.jpg"] } };
}

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
  const items = {};
  visibles.forEach((o) => {
    items[o.id] = {
      id: o.id,
      titre: lang === "fr" ? o.titre_fr : o.titre_en,
      href: detail(o.id),
      src: o.url_vignette,
      ratio: ratio(o),
      dispo: !!o.pictorem_url,
    };
  });

  return (
    <>
      <div className="wrap headwrap">
        <Entete lang={lang} actif="oeuvres" hrefLang={(l) => href(filtre.cle, l)} />
      </div>

      <section className="hero2 wrap">
        <div className="hero2-text">
          <p className="kicker">{t.kicker}</p>
          <h1>{t.hero}</h1>
          <p className="lead">{t.intro[0]}</p>
          <a className="btn" href="#oeuvres">{t.cta}</a>
        </div>
        <img className="hero2-img" src="/hero/hero-7.jpg" alt={lang === "fr" ? "Une œuvre Sibcod près d'une fenêtre" : "A Sibcod artwork by a window"} />
      </section>

      <BandeauGala lang={lang} />

      <div className="wrap">
        <div className="coll-head" id="oeuvres">
          <div>
            <h2>{t.coll}</h2>
            <p>{t.collSub(visibles.length)}</p>
          </div>
          <nav className="filters">
            {FILTRES.map((f, i) => (
              <Link key={f.cle} href={href(f.cle) + "#oeuvres"} className={f.cle === filtre.cle ? "on" : ""}>
                {lang === "en" && f.cle !== "tous" && f.cle !== "grand" ? `${f.min} in and up` : t.filters[i]}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="gal-wrap">
        <GalerieComposee items={items} lang={lang} sequences={filtre.cle === "tous"} soon={t.soon} />
      </div>

      <div className="wrap">
        <Pictorem lang={lang} />
        <Pied lang={lang} />
      </div>
    </>
  );
}
