import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";

export const metadata: Metadata = {
  title: "MuhQuant",
  description: "Quantitative finance research & analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-terminal-bg text-terminal-text font-sans min-h-screen antialiased">
        <Ticker />
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-terminal-border mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <span className="font-mono text-xs text-terminal-muted">
              © {new Date().getFullYear()} MUHQUANT
            </span>
            <span className="font-mono text-xs text-terminal-muted">
              muhquant.com
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
