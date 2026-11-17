import "./globals.css";

export const metadata = {
  title: "SIBCOD – Art prints from Martinique",
  description: "Original artworks by Sibcod, printed to order on canvas, metal, acrylic, wood or paper.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
