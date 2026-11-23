const C = {
  en: { liv: "Shipping & prices", vu: "Seen in", t: "A custom project? Get in touch.", foot: "Prints made to order by Pictorem. © Sibcod" },
  fr: { liv: "Livraison et prix", vu: "Vu dans", t: "Un projet sur mesure ? Contactez-nous.", foot: "Tirages réalisés à la commande par Pictorem. © Sibcod" },
};

export default function Pied({ lang }) {
  const c = C[lang];
  const q = lang === "fr" ? "?lang=fr" : "";
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
      <div><a href={`/livraison${q}`}>{c.liv}</a> · <a href={`/vu-dans${q}`}>{c.vu}</a></div>
      <div>{c.foot}</div>
    </footer>
  );
}
