import Link from "next/link";

const T = {
  en: {
    kicker: "Seen in",
    title: "Gala, Trends 2026 file",
    text: "Sibcod featured in Gala magazine's Trends 2026 file (29 January 2026).",
    cta: "See the feature",
    alt: "Featured in Gala",
  },
  fr: {
    kicker: "Vu dans",
    title: "Gala, Dossier Tendances 2026",
    text: "Sibcod parue dans le Dossier Tendances 2026 du magazine Gala (29 janvier 2026).",
    cta: "Voir la parution",
    alt: "Paru dans Gala",
  },
};

export default function BandeauGala({ lang }) {
  const t = T[lang];
  const href = lang === "fr" ? "/vu-dans?lang=fr" : "/vu-dans";
  return (
    <section className="gala2" aria-label={t.kicker}>
      <div className="wrap gala2-in">
        <span>{t.kicker}</span>
        <em>Gala</em>
        <span>{lang === "fr" ? "— Dossier Tendances 2026" : "— Trends 2026"}</span>
        <Link className="gala2-cta" href={href}>{t.cta}</Link>
      </div>
    </section>
  );
}
