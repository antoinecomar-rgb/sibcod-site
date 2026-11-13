export const metadata = { title: "SIBCOD", description: "Les affiches de Sibylle" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "Georgia, serif", margin: 0, background: "#faf8f5", color: "#222" }}>
        {children}
      </body>
    </html>
  );
}
