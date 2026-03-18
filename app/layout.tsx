import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "⚓ DS Warship Defender",
  description: "Learn Data Science. Defend the galaxy.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Clear all game data on every page load/reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            var keys = Object.keys(localStorage);
            keys.forEach(function(k) {
              if (k.startsWith('ds_')) localStorage.removeItem(k);
            });
          })();
        `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
