// Teintes de mur proposées dans les simulations (Composer un mur, « À l'échelle » sur la fiche œuvre)
export const MURS = [
  { id: "craie", c: "#F7F4EE", fr: "Blanc craie", en: "Chalk white" },
  { id: "blanc", c: "#F2EEE6", fr: "Blanc cassé", en: "Off-white" },
  { id: "greige", c: "#D8CFC2", fr: "Greige", en: "Greige" },
  { id: "lin", c: "#E3D8C6", fr: "Lin", en: "Linen" },
  { id: "rose", c: "#EAD5CB", fr: "Rose poudré", en: "Powder pink" },
  { id: "argile", c: "#D7B49E", fr: "Argile", en: "Clay" },
  { id: "terracotta", c: "#C98D6E", fr: "Terracotta", en: "Terracotta" },
  { id: "paille", c: "#E9DBAA", fr: "Jaune paille", en: "Straw yellow" },
  { id: "ocre", c: "#C99A4E", fr: "Ocre", en: "Ochre" },
  { id: "eau", c: "#CDDFD7", fr: "Vert d'eau", en: "Pale aqua" },
  { id: "sauge", c: "#B9C3AE", fr: "Sauge", en: "Sage" },
  { id: "olive", c: "#7E8462", fr: "Vert olive", en: "Olive green" },
  { id: "ciel", c: "#C4D3DC", fr: "Bleu gris", en: "Grey blue" },
  { id: "canard", c: "#2F5E66", fr: "Bleu canard", en: "Teal" },
  { id: "nuit", c: "#2E3A4A", fr: "Bleu nuit", en: "Midnight blue" },
  { id: "anthracite", c: "#3C3C3E", fr: "Anthracite", en: "Charcoal" },
];
export const estSombre = (hex) => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
};
