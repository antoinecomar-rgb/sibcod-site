import { GALERIE_PICTOREM } from "./Entete";

const T = {
  en: {
    kicker: "Made by Pictorem",
    title: "Every print, made to order by a fine-art printing studio",
    text: "Each Sibcod work is printed on demand by Pictorem, a fine-art print studio based in Montreal, Canada, working since 2014. Nothing sits in a warehouse: your piece is produced for you, then shipped directly to your door.",
    points: [
      ["Your choice of material", "Canvas, metal, acrylic, wood or fine-art paper"],
      ["Your size", "From 8 in (20 cm) up to the largest format of each work"],
      ["Order in a few clicks", "Pictorem handles payment, printing and delivery"],
    ],
    cta: "Browse the full gallery on Pictorem",
    note: "Delivery to the United States and Canada for now. Europe to follow.",
  },
  fr: {
    kicker: "Fabriqué par Pictorem",
    title: "Chaque tirage est fabriqué à la commande par un atelier d'impression d'art",
    text: "Chaque œuvre Sibcod est imprimée à la demande par Pictorem, atelier d'impression d'art basé à Montréal, au Canada, en activité depuis 2014. Rien ne dort en entrepôt : votre pièce est produite pour vous, puis expédiée directement chez vous.",
    points: [
      ["Le support de votre choix", "Toile, métal, acrylique, bois ou papier d'art"],
      ["Votre taille", "De 20 cm (8 po) jusqu'au plus grand format de chaque œuvre"],
      ["Commande en quelques clics", "Pictorem gère le paiement, l'impression et la livraison"],
    ],
    cta: "Voir toute la galerie sur Pictorem",
    note: "Livraison aux États-Unis et au Canada pour l'instant. L'Europe suivra.",
  },
};

export default function Pictorem({ lang }) {
  const t = T[lang];
  return (
    <section className="pictorem" aria-label="Pictorem">
      <div className="pic-text">
        <div className="kicker">{t.kicker}</div>
        <h2>{t.title}</h2>
        <p>{t.text}</p>
        <a className="pic-cta" href={GALERIE_PICTOREM} target="_blank" rel="noopener noreferrer">{t.cta} <span aria-hidden="true">↗</span></a>
        <div className="pic-note">{t.note}</div>
      </div>
      <ul className="pic-points">
        {t.points.map(([a, b]) => (
          <li key={a}><strong>{a}</strong><span>{b}</span></li>
        ))}
      </ul>
    </section>
  );
}
