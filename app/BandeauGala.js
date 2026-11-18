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
    <section className="gala" aria-label={t.kicker}>
      <img className="gala-logo" src="/presse/PARUDANS_GALA2_LD.jpg" alt={t.alt} width="84" height="64" loading="lazy" />
      <div className="gala-text">
        <div className="kicker">{t.kicker}</div>
        <h2>{t.title}</h2>
        <p>{t.text}</p>
      </div>
      <Link className="gala-cta" href={href}>{t.cta} <span aria-hidden="true">→</span></Link>
    </section>
  );
}
