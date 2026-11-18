import "./globals.css";
import Consentement from "./Consentement";

export const metadata = {
  metadataBase: new URL("https://www.sibcod.com"),
  title: "SIBCOD – Art prints from Martinique",
  description: "Original artworks by Sibcod, printed to order on canvas, metal, acrylic, wood or paper.",
  openGraph: { siteName: "SIBCOD", type: "website", images: ["/hero/hero-1.jpg"] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}<Consentement /></body>
    </html>
  );
}
