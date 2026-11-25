import Pied from "../Pied";
import Entete from "../Entete";
import Selection from "./Selection";
import { collectionMur } from "../../lib/collectionMur";

const T = {
  en: {
    h1: "My selection",
    s: "Set the size, medium and frame of each artwork here, then order them one by one.",
    etapes: [
      "Choose the size, medium and frame of each artwork, and check the estimated total.",
      "Click “Order”: our print studio opens in a new tab. Choose the settings shown, then add to cart.",
      "Come back to this tab for the next artwork. The print studio’s cart keeps all your artworks: you pay once, at the end.",
    ],
  },
  fr: {
    h1: "Ma sélection",
    s: "Réglez ici la taille, le support et le cadre de chaque œuvre, puis commandez-les une à une.",
    etapes: [
      "Choisissez la taille, le support et le cadre de chaque œuvre, et vérifiez le total estimé.",
      "Cliquez sur « Commander » : notre atelier d'impression s'ouvre dans un nouvel onglet. Choisissez les réglages indiqués, puis ajoutez au panier.",
      "Revenez sur cet onglet pour l'œuvre suivante. Le panier de l'atelier garde toutes vos œuvres : vous payez une seule fois, à la fin.",
    ],
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: fr ? "Ma sélection – SIBCOD" : "My selection – SIBCOD",
    robots: { index: false },
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const { collection, alias } = await collectionMur(lang);
  return (
    <div className="wrap">
      <Entete lang={lang} actif="selection" hrefLang={(l) => (l === "fr" ? "/selection?lang=fr" : "/selection")} />
      <section className="n-composer-tete">
        <h1>{t.h1}</h1>
        <p>{t.s}</p>
      </section>
      <ol className="n-sel-etapes">{t.etapes.map((e) => <li key={e}>{e}</li>)}</ol>
      <Selection collection={collection} alias={alias} lang={lang} />
      <Pied lang={lang} />
    </div>
  );
}
