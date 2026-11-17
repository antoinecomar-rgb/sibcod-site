import Link from "next/link";
import Icone from "./Icone";

export const GALERIE_PICTOREM = "https://www.pictorem.com/gallery/Sibcod";

const NAV = {
  en: { oeuvres: "Works", apropos: "About", vu: "Seen in" },
  fr: { oeuvres: "Œuvres", apropos: "À propos", vu: "Vu dans" },
};

// En-tête collant : logo + menu sur la 1re ligne, filtres éventuels (children) sur la 2e
export default function Entete({ lang, hrefLang, actif, children }) {
  const q = lang === "fr" ? "?lang=fr" : "";
  const n = NAV[lang];
  return (
    <div className="stick">
      <header className="top">
        <Link href={`/${q}`} className="logo">SIBCOD</Link>
        <nav className="menu">
          <Link href={`/${q}`} className={actif === "oeuvres" ? "on" : ""}>{n.oeuvres}</Link>
          <Link href={`/a-propos${q}`} className={actif === "apropos" ? "on" : ""}>{n.apropos}</Link>
          <Link href={`/vu-dans${q}`} className={actif === "vu" ? "on" : ""}>{n.vu}</Link>
        </nav>
        <div className="soc">
          <a href={GALERIE_PICTOREM} target="_blank" rel="noopener noreferrer" className="pict" title="Pictorem"><img src="/pictorem-logo.png" alt="Pictorem" height="30" /></a>
          <a href="https://wa.me/596696655699" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><Icone nom="whatsapp" /></a>
          <a href="https://www.instagram.com/sibcod/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><Icone nom="instagram" /></a>
          <a href="https://www.facebook.com/profile.php?id=61552197352365" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><Icone nom="facebook" /></a>
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
