// Libellés partagés (FR/EN) : palettes, thèmes, formats, ambiances.
export const q = (lang) => (lang === "fr" ? "?lang=fr" : "");
export const qa = (lang) => (lang === "fr" ? "&lang=fr" : "");

export const PALETTES = [
  { id: "lagon", c: "#7FC4CF", fr: "Bleu lagon", en: "Lagoon blue", img: "/ambiance/d68.jpg",
    tfr: "Des horizons calmes, pour respirer. Une chambre, un bureau, un coin lecture.",
    ten: "Calm horizons, room to breathe. A bedroom, a study, a reading corner." },
  { id: "vegetal", c: "#8FA77E", fr: "Vert végétal", en: "Leafy green", img: "/ambiance/d56.jpg",
    tfr: "La fraîcheur d'un jardin à l'intérieur. Un salon, une entrée, une salle de bain.",
    ten: "The freshness of a garden, indoors. A living room, a hallway, a bathroom." },
  { id: "corail", c: "#D9735E", fr: "Corail et couleurs vives", en: "Coral and vivid tones", img: "/ambiance/d36.jpg",
    tfr: "Un éclat de soleil, même un jour gris. Une cuisine, une entrée, un mur à réveiller.",
    ten: "A burst of sunlight, even on a grey day. A kitchen, an entrance, a wall to wake up." },
  { id: "sable", c: "#D8CBB5", fr: "Sable et tons poudrés", en: "Sand and powder tones", img: "/ambiance/d80.jpg",
    tfr: "La douceur d'une lumière dorée. Une chambre, un salon aux tons naturels.",
    ten: "The softness of golden light. A bedroom, a living room in natural tones." },
];

export const THEMES = [
  { id: "mer", fr: "Horizons marins", en: "Seascapes", img: "/ambiance/d33.jpg",
    tfr: "Barques, îlets, vagues et ciels : faire entrer le large dans une pièce.",
    ten: "Boats, islets, waves and skies: bring the open sea into a room." },
  { id: "vegetal", fr: "Végétal", en: "Greenery", img: "/ambiance/d13.jpg",
    tfr: "Jungles, palmes et feuillages : une pièce qui respire comme un jardin.",
    ten: "Jungles, palms and foliage: a room that breathes like a garden." },
  { id: "botanique", fr: "Botanique", en: "Botanical", img: "/ambiance/d18.jpg",
    tfr: "Fleurs, fruits et planches botaniques : la douceur du détail.",
    ten: "Flowers, fruit and botanical plates: the charm of detail." },
  { id: "maisons", fr: "Architecture et intérieurs", en: "Architecture and interiors", img: "/ambiance/d77.jpg",
    tfr: "Cases, balcons, persiennes, objets : l'architecture et la lumière.",
    ten: "Creole houses, balconies, shutters, objects: architecture and light." },
  { id: "paysages", fr: "Paysages", en: "Landscapes", img: "/ambiance/d64.jpg",
    tfr: "Mornes, champs de cannes, volcan : de grands espaces à contempler.",
    ten: "Hills, sugarcane fields, the volcano: wide spaces to contemplate." },
  { id: "graphique", fr: "Graphique et pop", en: "Graphic and pop", img: "/ambiance/d71.jpg",
    tfr: "Taches, lignes et couleurs franches : un mur qui affirme.",
    ten: "Spots, lines and bold colours: a wall that makes a statement." },
];

export const FORMATS = [
  { id: "portrait", fr: "Portrait", en: "Portrait" },
  { id: "paysage", fr: "Paysage", en: "Landscape" },
  { id: "panorama", fr: "Panorama", en: "Panorama" },
  { id: "carre", fr: "Carré", en: "Square" },
];

export const nom = (liste, id, lang) => liste.find((x) => x.id === id)?.[lang] || "";
export const cm = (po) => Math.round(po * 2.54);
export const taille = (po, lang) => (lang === "fr" ? `jusqu'à ${cm(po)} cm` : `up to ${po} in`);
