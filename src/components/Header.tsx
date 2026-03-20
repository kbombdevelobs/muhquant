import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-terminal-border bg-terminal-surface/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2 h-2 rounded-full bg-terminal-accent glow-accent" />
          <span className="font-mono font-bold text-lg tracking-tight text-terminal-accent glow-accent">
            MUHQUANT
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-terminal-muted hover:text-terminal-text transition-colors"
          >
            Terminal
          </Link>
          <Link
            href="/articles"
            className="font-mono text-xs uppercase tracking-widest text-terminal-muted hover:text-terminal-text transition-colors"
          >
            Research
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-terminal-green">●</span>
          <span className="font-mono text-[10px] text-terminal-muted">LIVE</span>
        </div>
      </div>
    </header>
  );
}
