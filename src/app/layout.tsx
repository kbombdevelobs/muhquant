import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import StatusBar from "@/components/StatusBar";

export const metadata: Metadata = {
  title: "Muh Quant",
  description: "Quantitative finance research",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Top bar */}
        <header className="h-11 shrink-0 bg-surface border-b border-border flex items-center px-6 gap-8 sticky top-0 z-40 backdrop-blur-sm bg-surface/95">
          <Link
            href="/"
            className="font-mono text-[15px] uppercase tracking-[0.15em] text-accent"
            style={{ textShadow: "0 0 12px rgba(255,140,0,0.3)" }}
          >
            Muh Quant
          </Link>
          <nav className="flex gap-6 ml-8">
            <Link href="/" className="font-mono text-[12px] uppercase tracking-wider text-muted hover:text-text transition-colors">
              Home
            </Link>
            <Link href="/articles" className="font-mono text-[12px] uppercase tracking-wider text-muted hover:text-text transition-colors">
              Research
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-block w-[6px] h-[6px] bg-accent" style={{ boxShadow: "0 0 8px var(--color-accent)" }} />
            <span className="text-[11px] text-muted font-mono">Online</span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>

        <StatusBar />
      </body>
    </html>
  );
}
