import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRIMUS TECHNOLOGIES | Enterprise Digital Infrastructure",
  description: "Africa's leading enterprise digital infrastructure provider. Cybersecurity, Cloud Infrastructure, Managed IT Services, and International Remote Technology Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
