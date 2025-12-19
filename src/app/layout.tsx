import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HistoryProvider } from "@/context/HistoryContext";
import HistorySidebar from "@/components/layout/HistorySidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAVEMI.IO - Professional Online Tools",
  description: "Free online tools for PDF, Image, Calculators, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <HistoryProvider>
          <Header />
          <HistorySidebar />
          <main className="pt-32 min-h-screen">
            {children}
          </main>
          <Footer />
        </HistoryProvider>
      </body>
    </html>
  );
}
