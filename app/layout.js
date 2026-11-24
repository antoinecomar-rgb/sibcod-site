import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import Consentement from "./Consentement";

export const metadata = {
  metadataBase: new URL("https://www.sibcod.com"),
  title: "SIBCOD – Art prints from Martinique",
  description: "Original Sibcod creations, printed to order on canvas, metal, acrylic, wood or paper.",
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
