import Link from "next/link";
import Icone from "./Icone";

export const GALERIE_PICTOREM = "https://www.pictorem.com/gallery/Sibcod";

const NAV = {
  en: { collection: "Collection", mur: "Compose a wall", projets: "Custom projects", sibcod: "Sibcod" },
  fr: { collection: "Collection", mur: "Composer un mur", projets: "Projets sur mesure", sibcod: "Sibcod" },
};

// En-tête : logo, quatre onglets, Instagram, langue. clair = texte blanc sur image.
export default function Entete({ lang, hrefLang, actif, children, clair }) {
  const q = lang === "fr" ? "?lang=fr" : "";
  const n = NAV[lang];
  const lien = (cle, href) => (
    <Link href={`${href}${q}`} className={actif === cle ? "on" : ""}>{n[cle]}</Link>
  );
  return (
    <div className={clair ? "stick clair" : "stick"}>
      <header className="top">
        <Link href={`/${q}`} className="logo">SIBCOD</Link>
        <nav className="menu">
          {lien("collection", "/collection")}
          {lien("mur", "/composer")}
          {lien("projets", "/projets")}
          {lien("sibcod", "/sibcod")}
        </nav>
        <div className="soc">
          <a href="https://www.instagram.com/sibcod/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><Icone nom="instagram" /></a>
        </div>
        <div className="lang">
          <Link href={hrefLang("en")} className={lang === "en" ? "on" : ""}>EN</Link>
          <Link href={hrefLang("fr")} className={lang === "fr" ? "on" : ""}>FR</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
