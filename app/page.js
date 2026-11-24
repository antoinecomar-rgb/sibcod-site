import Pied from "./Pied";
import Entete from "./Entete";
import BandeauGala from "./BandeauGala";
import SELECTION from "../data/selection-accueil.json";
import { catalogue } from "../lib/catalogue";
import { PALETTES, THEMES, TOUT, q } from "../lib/libelles";
import { alternates } from "../lib/seo";

const T = {
  en: {
    h1: ["Art", "to live with."],
    sub: "Original artworks by Sibcod, from the softest to the most vivid. Printed to order in gallery quality, on fine art paper, canvas, metal, wood or acrylic.",
    cta1: "Discover the collection", cta2: "Compose a wall",
    apK: "What an artwork brings to a room",
    apT: "You only look at it intently if you decide to. The rest of the time, it is simply there: it inhabits the space.",
    apports: [
      ["An escape", "Open a wall like a window and travel elsewhere without leaving the room.", ["d99", "d56", "d33", "d64", "d77"]],
      ["A harmony", "Bring together the colours of a room, from fabric to wall.", ["d90", "d86", "d07", "d36", "d47"]],
      ["A presence", "Fill the emptiness of a space, or give it its identity.", ["d26", "d66", "d93", "d05", "d70"]],
    ],
    chK: "How to choose", chT: "Start from what matters to you",
    chS: "A colour to match, an atmosphere to create, a wall to dress, a material: browse the collection in every direction.",
    portes: [
      ["By colour", "Match it to your room", "From a sofa, a rug, a painting: each palette gathers artworks that go together."],
      ["By theme", "Choose an atmosphere", "A horizon to breathe, a jungle to escape, a botanical plate for softness."],
      ["By format and wall", "Start from the space", "A large wall, a narrow hallway, a headboard: every space has its formats."],
      ["By size and material", "Choose the support", "From a 30 cm frame to very large formats, on fine art paper, canvas, metal, wood or acrylic."],
    ],
    formats: ["Portrait", "Landscape", "Panorama", "Trio", "Column"],
    supports: ["Fine art paper", "Canvas", "Metal", "Wood", "Acrylic"],
    colK: "Collection", colT: "A collection designed like a colour chart",
    colS: "From the gentlest to the most vivid, colours flow from one artwork to the next.",
    tout: "All", voir: (n) => `See all ${n} artworks`,
    taK: "Sizes and supports", taT: "The same artwork, from a small frame to a whole wall",
    taS: "Each artwork comes in several sizes, on the support that suits the room: fine art paper to frame, stretched canvas ready to hang, metal or wood for more presence.",
    taN: [["Small", "up to 30 cm"], ["Medium", "up to 40 cm"], ["Large", "up to 50 cm"], ["Very large", "70 cm and more"]],
    muK: "Compose a wall", muT: "See them at home before you choose",
    muS: "Your wall colour, a layout, a palette, a size: the artworks fall into place, at real scale.",
    muB: "Compose my wall",
    prK: "Custom projects", prT: "Give a place its identity",
    prS: "Hotel, holiday rental, restaurant, offices, property development: a series of artworks matched to your walls, up to very large formats, chosen with an interior architect's eye.",
    prB: "Talk about your project", prC: "A gift, a single artwork?", prL: "The collection",
    sbK: "Sibcod", sbT: "An interior architect's eye on wall art",
    sbS: "Sibcod was born from a profession: composing spaces, matching colours, revealing a wall. Each artwork is designed for the place it will take: the light of a room, the breathing space around a frame, the dialogue with its neighbours.",
    sbM: "Its source: the light, the sea and the vegetation of Martinique.", sbL: "Discover Sibcod",
    steps: [["Choose the artwork", "By colour, by theme, or by composing your wall."], ["Size and support", "From a small frame to very large formats, on paper, canvas, metal, wood or acrylic."], ["Printed for you", "Made to order by our partner workshop Pictorem, then delivered."]],
  },
  fr: {
    h1: ["Des œuvres", "à vivre."],
    sub: "Les créations originales de Sibcod, du plus doux au plus vif. Imprimées à la demande en qualité galerie, sur papier d'art, toile, métal, bois ou acrylique.",
    cta1: "Découvrir la collection", cta2: "Composer un mur",
    apK: "Ce qu'une œuvre apporte à une pièce",
    apT: "On ne la regarde avec insistance que si on le décide. Le reste du temps, elle est là : elle habite l'espace.",
    apports: [
      ["Une évasion", "Ouvrir un mur comme une fenêtre, partir ailleurs sans quitter la pièce.", ["d99", "d56", "d33", "d64", "d77"]],
      ["Une harmonie", "Accorder les couleurs d'une pièce, du tissu au mur.", ["d90", "d86", "d07", "d36", "d47"]],
      ["Une présence", "Combler le vide d'un espace, ou lui donner son identité.", ["d26", "d66", "d93", "d05", "d70"]],
    ],
    chK: "Comment choisir", chT: "Partez de ce qui compte pour vous",
    chS: "Une couleur à accorder, une atmosphère à créer, un mur à habiller, une matière : la collection se parcourt dans tous les sens.",
    portes: [
      ["Par couleur", "Accordez-la à votre pièce", "D'un canapé, d'un tapis, d'une peinture : chaque palette réunit des œuvres qui s'accordent."],
      ["Par thème", "Choisissez une atmosphère", "Un horizon pour respirer, une jungle pour s'évader, une planche botanique pour la douceur."],
      ["Par format et par mur", "Partez de l'espace à habiller", "Un grand mur, un couloir étroit, une tête de lit : chaque espace a ses formats."],
      ["Par taille et support", "Choisissez la matière", "Du petit cadre de 30 cm au très grand format, sur papier d'art, toile, métal, bois ou acrylique."],
    ],
    formats: ["Portrait", "Paysage", "Panorama", "Trio", "Colonne"],
    supports: ["Papier d'art", "Toile tendue", "Métal", "Bois", "Acrylique"],
    colK: "Collection", colT: "Une collection pensée comme un nuancier",
    colS: "Du plus doux au plus coloré, les teintes glissent d'une œuvre à l'autre.",
    tout: "Toutes", voir: (n) => `Voir les ${n} œuvres`,
    taK: "Tailles et supports", taT: "La même œuvre, du petit cadre au mur entier",
    taS: "Chaque œuvre existe en plusieurs tailles, et sur le support qui convient à la pièce : papier d'art à encadrer, toile tendue prête à accrocher, métal ou bois pour plus de présence.",
    taN: [["Petit", "jusqu'à 30 cm"], ["Moyen", "jusqu'à 40 cm"], ["Grand", "jusqu'à 50 cm"], ["Très grand", "70 cm et plus"]],
    muK: "Composer un mur", muT: "Voyez-les chez vous avant de choisir",
    muS: "La couleur de votre mur, une composition, une palette, une taille : les œuvres s'accordent d'elles-mêmes, à l'échelle réelle.",
    muB: "Composer mon mur",
    prK: "Projets sur mesure", prT: "Donner une identité à un lieu",
    prS: "Hôtel, location saisonnière, restaurant, bureaux, programme immobilier : une série d'œuvres accordées à vos murs, jusqu'au très grand format, choisie avec un œil d'architecte d'intérieur.",
    prB: "Parler de votre projet", prC: "Un cadeau, une seule œuvre ?", prL: "La collection",
    sbK: "Sibcod", sbT: "Un regard d'architecte d'intérieur, posé sur l'art mural",
    sbS: "Sibcod est né d'un métier : composer des espaces, accorder des couleurs, révéler un mur. Chaque œuvre est pensée pour la place qu'elle prendra : la lumière d'une pièce, la respiration autour d'un cadre, le dialogue avec ses voisines.",
    sbM: "La lumière, la mer et la végétation de la Martinique en sont la source.", sbL: "Découvrir Sibcod",
    steps: [["Choisissez l'œuvre", "Par couleur, par thème, ou en composant votre mur."], ["Taille et support", "Du petit cadre au très grand format, sur papier, toile, métal, bois ou acrylique."], ["Imprimée pour vous", "À la demande, par notre atelier partenaire Pictorem, puis livrée."]],
  },
};

// cadrage de chaque image du défilé en plein écran (position verticale du centre)
// [fichier, cadrage] dans l'ordre du défilé (boucle)
const HERO = [[1, "50% 50%"], [6, "50% 55%"], [2, "50% 50%"], [3, "50% 50%"], [4, "50% 50%"], [5, "50% 50%"], [8, "50% 50%"], [7, "50% 50%"]];

export async function generateMetadata({ searchParams }) {
  const fr = (await searchParams).lang === "fr";
  const titre = fr ? "SIBCOD – Art mural, affiches et toiles d'art" : "SIBCOD – Wall art, art prints and canvases";
  const description = fr
    ? "Des œuvres pensées comme un nuancier, à accorder par couleur, par thème et par format. Imprimées à la commande sur papier d'art, toile, métal, bois ou acrylique."
    : "Artworks designed like a colour chart, to match by colour, theme and format. Printed to order on fine art paper, canvas, metal, wood or acrylic.";
  return { title: titre, description, alternates: alternates("/", fr ? "fr" : "en"), openGraph: { title: titre, description, locale: fr ? "fr_FR" : "en_US", images: ["/ambiance/hero-1.jpg"] } };
}

export default async function Accueil({ searchParams }) {
  const sp = await searchParams;
  const lang = sp.lang === "fr" ? "fr" : "en";
  const t = T[lang];
  const Q = q(lang);
  const { oeuvres } = await catalogue(lang);
  const classees = oeuvres.filter((o) => o.palette.length);
  const vign = Object.fromEntries(oeuvres.flatMap((o) => o.variantes.map((v) => [v.id, v.img])));
  // ordre stable mais mélangé : alterne les thèmes pour l'aperçu
  const parId = Object.fromEntries(oeuvres.map((o) => [o.id, o]));
  // une entrée est une œuvre (sa version principale) ou un fichier précis (une version ou un panneau)
  const selection = SELECTION.map((id) => {
    if (parId[id]) return { ...parId[id].variantes[0], id: parId[id].id, titre: parId[id].titre };
    for (const o of oeuvres) {
      const v = o.variantes.find((x) => x.id === id || (x.membres || []).some((m) => m.id === id));
      if (v) return { ...v, id: v.id, titre: v.titre || o.titre };
    }
    return null;
  }).filter(Boolean);

  return (
    <>
      <section className="n-hero">
        <div className="n-hero-img" aria-hidden="true">
          {HERO.map(([f, pos], i) => (
            <div key={f} className="n-slide" style={{ animationDelay: `${i * 4 - 1.2}s` }}>
              <img className="n-slide-fond" src={`/ambiance/hero-${f}.jpg`} alt="" />
              <img className="n-slide-net" src={`/ambiance/hero-${f}.jpg`} alt="" style={{ objectPosition: pos }} />
            </div>
          ))}
        </div>
        <div className="n-hero-voile" />
        <div className="wrap n-hero-tete"><Entete lang={lang} clair hrefLang={(l) => (l === "fr" ? "/?lang=fr" : "/")} /></div>
        <div className="wrap n-hero-texte">
          <img className="n-hero-logo" src="/ambiance/logo-rond-blanc.png" alt="Sibcod" width="415" height="415" />
          <h1>{t.h1[0]}<br />{t.h1[1]}</h1>
          <p>{t.sub}</p>
          <div className="n-btns">
            <a className="n-btn clair" href={`/collection${Q}`}>{t.cta1}</a>
            <a className="n-btn2 clair" href={`/composer${Q}`}>{t.cta2}</a>
          </div>
        </div>
      </section>

      <BandeauGala lang={lang} />

      <section className="wrap n-apports">
        <div className="n-centre">
          <p className="n-k">{t.apK}</p>
          <p className="n-citation">{t.apT}</p>
        </div>
        <div className="n-apports-grille">
          {t.apports.map(([ti, tx, ims], i) => (
            <figure key={ti} style={{ marginTop: i % 2 ? 56 : 0 }}>
              <div className="n-tourne" aria-hidden="true">
                {ims.map((im, k) => <img key={im} src={`/ambiance/${im}.jpg`} alt="" loading="lazy" style={k ? { animationDelay: `${k * 4 + i * 0.8}s` } : undefined} />)}
              </div>
              <figcaption><strong>{ti}</strong><span>{tx}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wrap n-section">
        <div className="n-entete large">
          <div><p className="n-k">{t.colK}</p><h2>{t.colT}</h2><p className="n-lead">{t.colS}</p></div>
        </div>
        <div className="n-degrade">
          {selection.map((o) => (
            <a key={o.id} href={`/oeuvre/${o.id}${Q}`}>
              <img src={o.img} alt={o.titre} loading="lazy" />
              <span>{o.titre}</span>
            </a>
          ))}
        </div>
        <a className="n-lien" href={`/collection${Q}`}>{t.voir(oeuvres.length)} →</a>
      </section>

      <section className="n-fond">
        <div className="wrap n-section">
          <div className="n-entete"><p className="n-k">{t.chK}</p><h2>{t.chT}</h2><p className="n-lead">{t.chS}</p></div>
          <div className="n-portes">
            <a className="n-porte" href={`/collection?mode=couleur${lang === "fr" ? "&lang=fr" : ""}`}>
              <span className="n-k">{t.portes[0][0]}</span><strong>{t.portes[0][1]}</strong>
              <span className="n-pastilles">{PALETTES.map((p) => <i key={p.id} style={{ background: p.c }} />)}</span>
              <span className="n-txt">{t.portes[0][2]}</span>
            </a>
            <a className="n-porte" href={`/collection?mode=theme${lang === "fr" ? "&lang=fr" : ""}`}>
              <span className="n-k">{t.portes[1][0]}</span><strong>{t.portes[1][1]}</strong>
              <span className="n-tags">{THEMES.map((x) => <i key={x.id}>{x[lang]}</i>)}</span>
              <span className="n-txt">{t.portes[1][2]}</span>
            </a>
            <a className="n-porte" href={`/composer${Q}`}>
              <span className="n-k">{t.portes[2][0]}</span><strong>{t.portes[2][1]}</strong>
              <span className="n-formes">
                <span><b style={{ width: 22, height: 30 }} /></span><span><b style={{ width: 36, height: 26 }} /></span><span><b style={{ width: 48, height: 18 }} /></span>
                <span><b style={{ width: 13, height: 20 }} /><b style={{ width: 13, height: 20 }} /><b style={{ width: 13, height: 20 }} /></span>
                <span className="col"><b style={{ width: 18, height: 12 }} /><b style={{ width: 18, height: 12 }} /><b style={{ width: 18, height: 12 }} /></span>
              </span>
              <span className="n-formes-l">{t.formats.map((f) => <i key={f}>{f}</i>)}</span>
              <span className="n-txt">{t.portes[2][2]}</span>
            </a>
            <a className="n-porte" href="#tailles">
              <span className="n-k">{t.portes[3][0]}</span><strong>{t.portes[3][1]}</strong>
              <span className="n-tags">{t.supports.map((x) => <i key={x}>{x}</i>)}</span>
              <span className="n-txt">{t.portes[3][2]}</span>
            </a>
          </div>
        </div>
      </section>

      <section id="tailles" className="wrap n-section n-tailles">
        <div><p className="n-k">{t.taK}</p><h2>{t.taT}</h2><p className="n-lead">{t.taS}</p></div>
        <div className="n-echelle">
          {t.taN.map(([n, d], i) => (
            <figure key={n}>
              <img src={vign.F302} alt="" style={{ height: [120, 160, 200, 280][i] }} />
              <figcaption><strong>{n}</strong><span>{d}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="n-mur-apercu">
        <div className="wrap n-mur-apercu-in">
          <div className="n-mur-texte"><p className="n-k">{t.muK}</p><h2>{t.muT}</h2><p className="n-lead">{t.muS}</p><a className="n-btn" href={`/composer${Q}`}>{t.muB}</a></div>
          <div className="n-mur-scene" aria-hidden="true">
            <div className="n-mur-oeuvres">
              {["F298", "F299", "F302"].map((i) => <img key={i} src={vign[i]} alt="" />)}
            </div>
            <div className="n-canape"><i /><b /><span /></div>
          </div>
        </div>
      </section>

      <section className="n-projets">
        <img src="/ambiance/d71.jpg" alt={lang === "fr" ? "Une personne face à une œuvre de branchages couvrant tout un mur" : "A person facing a branch artwork covering an entire wall"} />
        <div className="n-projets-carte">
          <p className="n-k">{t.prK}</p><h2>{t.prT}</h2><p>{t.prS}</p>
          <a className="n-btn" href={`/projets${Q}`}>{t.prB}</a>
          <span className="n-petit">{t.prC} <a href={`/collection${Q}`}>{t.prL}</a></span>
        </div>
      </section>

      <section className="wrap n-section n-sibcod">
        <img src="/ambiance/d88.jpg" alt={lang === "fr" ? "Chevalet en bois dans la lumière et l'ombre des feuilles" : "A wooden easel in the light and shadow of leaves"} />
        <div><p className="n-k">{t.sbK}</p><h2>{t.sbT}</h2><p className="n-lead">{t.sbS}</p><p className="n-petit">{t.sbM}</p><a className="n-lien" href={`/sibcod${Q}`}>{t.sbL} →</a></div>
      </section>

      <section className="wrap n-etapes">
        {t.steps.map(([a, b]) => <div key={a}><strong>{a}</strong><span>{b}</span></div>)}
      </section>

      <div className="wrap"><Pied lang={lang} /></div>
    </>
  );
}
