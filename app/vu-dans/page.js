import Pied from "../Pied";
import Entete from "../Entete";
import { alternates } from "../../lib/seo";

const T = {
  en: { title: "Seen in", p: "Sibcod featured in Gala's 2026 Trends file (29 January 2026)", foot: "Prints made to order by Pictorem. © Sibcod" },
  fr: { title: "Vu dans", p: "Sibcod parue dans le Dossier Tendances 2026, Gala (29 Janvier 2026)", foot: "Tirages réalisés à la commande par Pictorem. © Sibcod" },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: fr ? "Vu dans – SIBCOD" : "Seen in – SIBCOD",
    description: fr
      ? "Sibcod parue dans le Dossier Tendances 2026 du magazine Gala (29 janvier 2026)."
      : "Sibcod featured in the Trends 2026 file of Gala magazine (29 January 2026).",
    alternates: alternates("/vu-dans", fr ? "fr" : "en"),
  };
}

export default async function VuDans({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  return (
    <div className="wrap">
      <Entete lang={lang} actif="vu" hrefLang={(l) => (l === "fr" ? "/vu-dans?lang=fr" : "/vu-dans")} />
      <section className="page presse">
        <h1>{t.title}</h1>
        <p>{t.p}</p>
        <a href="https://www.moncarnet-gala.fr/articles/view/SIBCOD" target="_blank" rel="noopener noreferrer">
          <img className="logo-gala" src="/presse/PARUDANS_GALA2_LD.jpg" alt="Paru dans Gala" />
        </a>
        <a href="https://www.instagram.com/p/DUJDAwpjmVi/" target="_blank" rel="noopener noreferrer">
          <img src="/presse/WhatsApp_Image_2026-02-16_at_6.23.13_PM.jpg" alt="Sibcod in Gala, Trends 2026" />
        </a>
        <img src="/presse/Sibcod_1.jpg" alt="Sibcod" />
      </section>
      <Pied lang={lang} />
    </div>
  );
}
