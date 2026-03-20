import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { MarketOverview, RecentActivity, QuickStats } from "@/components/DataWidget";

export default function Home() {
  const articles = getAllArticles().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="border border-terminal-border bg-terminal-surface rounded p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-terminal-accent animate-pulse" />
          <span className="font-mono text-[10px] text-terminal-muted uppercase tracking-widest">
            Terminal Active
          </span>
        </div>
        <h1 className="font-mono text-2xl font-bold text-terminal-accent glow-accent mb-2">
          MUHQUANT
        </h1>
        <p className="font-sans text-sm text-terminal-muted max-w-lg">
          Quantitative finance research, market analysis, and systematic trading insights.
        </p>
      </div>

      {/* Data widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MarketOverview />
        <QuickStats />
        <RecentActivity />
      </div>

      {/* Latest research */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-terminal-muted">
            Latest Research
          </h2>
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        ) : (
          <div className="border border-terminal-border border-dashed rounded p-8 text-center">
            <p className="font-mono text-sm text-terminal-muted">
              No articles yet. Add <code className="text-terminal-green">.md</code> files to{" "}
              <code className="text-terminal-green">content/articles/</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
