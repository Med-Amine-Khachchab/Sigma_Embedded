import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sigma Embedded",
  description: "Plateforme moderniste pour l'embarqué, firmware et RTOS.",
  openGraph: {
    title: "Sigma Embedded",
    description: "Blog, media et équipe dédiés au monde embarqué.",
    url: "https://sigmaembedded.local",
    siteName: "Sigma Embedded",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen pcb-pattern">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
