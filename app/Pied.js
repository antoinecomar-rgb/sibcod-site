const C = {
  en: { liv: "Shipping & prices", t: "Custom project? Get in touch.", foot: "Prints made to order by Pictorem. © Sibcod" },
  fr: { liv: "Livraison et prix", t: "Un projet sur mesure ? Contactez-nous.", foot: "Tirages réalisés à la commande par Pictorem. © Sibcod" },
};

export default function Pied({ lang }) {
  const c = C[lang];
  const ext = { target: "_blank", rel: "noopener noreferrer" };
  return (
    <footer className="foot">
      <div className="contact">
        <p>{c.t}</p>
        <nav>
          <a href="https://wa.me/596696655699" {...ext}>WhatsApp</a>
          <a href="https://www.instagram.com/sibcod/" {...ext}>Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61552197352365" {...ext}>Facebook</a>
          <a href="mailto:sibcodesigns@gmail.com">E-mail</a>
        </nav>
      </div>
      <div><a href={lang === "fr" ? "/livraison?lang=fr" : "/livraison"}>{c.liv}</a></div>
      <div>{c.foot}</div>
    </footer>
  );
}
