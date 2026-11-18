import Pied from "../Pied";
import Entete from "../Entete";
import { alternates } from "../../lib/seo";

const SHIP = "https://www.pictorem.com/shippinginfo.html";
const TERMS = "https://www.pictorem.com/terms.html";
const MAIL = "mailto:sibcodesigns@gmail.com";

const T = {
  en: {
    title: "Shipping & prices",
    s: [
      ["Who prints and ships", "Every work is printed to order and shipped by Pictorem, a fine-art print studio based in Montreal, Canada. Nothing sits in a warehouse: your piece is produced for you."],
      ["Where we deliver", "United States and Canada for now. Pictorem lists free standard shipping within continental USA and Canada; the exact cost and any faster option are shown at checkout. Pictorem also ships to many other countries, priced at checkout. If you are elsewhere, or in Martinique, please contact us first."],
      ["Delivery times", "Production time depends on the support you choose (typically several working days at Pictorem), then delivery time. Current estimates are shown on Pictorem's shipping page and again before you pay."],
      ["Prices", "The price depends on the size and the support (canvas, metal, acrylic, wood or paper). It is displayed on the Pictorem page of each work before you order, with taxes and shipping shown at checkout."],
      ["Payment", "Payment is handled on Pictorem's website."],
      ["Returns and guarantee", "Pictorem offers a 30-day satisfaction guarantee for quality problems within its control (defects, damage in transit). Contact their customer service within 30 days of delivery; returns need an approved return authorization (RMA). An order can be cancelled within 48 hours; once production has started, fees may apply. Full conditions are on Pictorem's terms page."],
      ["Questions", "Write to us by e-mail or WhatsApp. We are in Martinique (UTC−4) and reply as soon as possible."],
    ],
    links: [["Pictorem shipping information", SHIP], ["Pictorem terms and returns", TERMS]],
    mail: "Write to us",
  },
  fr: {
    title: "Livraison et prix",
    s: [
      ["Qui imprime et expédie", "Chaque œuvre est imprimée à la commande et expédiée par Pictorem, atelier d'impression d'art basé à Montréal, au Canada. Rien ne dort en entrepôt : votre pièce est produite pour vous."],
      ["Où nous livrons", "États-Unis et Canada pour l'instant. Pictorem indique une livraison standard gratuite en Amérique du Nord continentale ; le coût exact et les options plus rapides s'affichent au moment de la commande. Pictorem livre aussi dans de nombreux autres pays, au tarif indiqué à la commande. Si vous êtes ailleurs, ou en Martinique, contactez-nous d'abord."],
      ["Délais", "Le délai de fabrication dépend du support choisi (en général plusieurs jours ouvrés chez Pictorem), auquel s'ajoute le délai de livraison. Les estimations à jour figurent sur la page d'expédition de Pictorem et avant le paiement."],
      ["Prix", "Le prix dépend du format et du support (toile, métal, acrylique, bois ou papier). Il s'affiche sur la fiche Pictorem de chaque œuvre avant la commande ; les taxes et la livraison sont indiquées au moment du paiement."],
      ["Paiement", "Le paiement se fait sur le site de Pictorem."],
      ["Retours et garantie", "Pictorem offre une garantie de satisfaction de 30 jours pour les problèmes de qualité qui relèvent de sa responsabilité (défaut, dommage pendant le transport). Contactez leur service client dans les 30 jours suivant la livraison ; un retour exige une autorisation de retour (RMA). Une commande peut être annulée dans les 48 heures ; une fois la fabrication lancée, des frais peuvent s'appliquer. Les conditions complètes figurent sur la page des conditions de Pictorem."],
      ["Questions", "Écrivez-nous par e-mail ou WhatsApp. Nous sommes en Martinique (UTC−4) et répondons dès que possible."],
    ],
    links: [["Informations d'expédition Pictorem", SHIP], ["Conditions et retours Pictorem", TERMS]],
    mail: "Nous écrire",
  },
};

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  return {
    title: fr ? "Livraison et prix – SIBCOD" : "Shipping & prices – SIBCOD",
    description: fr
      ? "Livraison, délais, prix, paiement et retours pour les tirages Sibcod fabriqués à la commande par Pictorem."
      : "Shipping, delivery times, prices, payment and returns for Sibcod prints made to order by Pictorem.",
    alternates: alternates("/livraison", fr ? "fr" : "en"),
  };
}

export default async function Livraison({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const ext = { target: "_blank", rel: "noopener noreferrer" };
  return (
    <div className="wrap">
      <Entete lang={lang} hrefLang={(l) => (l === "fr" ? "/livraison?lang=fr" : "/livraison")} />
      <section className="page">
        <h1>{t.title}</h1>
        {t.s.map(([h, p]) => (
          <div key={h}>
            <h2 style={{ fontSize: 17, margin: "28px 0 6px" }}>{h}</h2>
            <p>{p}</p>
          </div>
        ))}
        <p>
          {t.links.map(([l, u]) => <span key={u}><a href={u} {...ext}>{l} ↗</a>{" · "}</span>)}
          <a href={MAIL}>{t.mail}</a>
        </p>
      </section>
      <Pied lang={lang} />
    </div>
  );
}
