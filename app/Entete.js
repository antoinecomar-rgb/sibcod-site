import Link from "next/link";

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
        <div className="lang">
          <Link href={hrefLang("en")} className={lang === "en" ? "on" : ""}>EN</Link>
          <Link href={hrefLang("fr")} className={lang === "fr" ? "on" : ""}>FR</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
