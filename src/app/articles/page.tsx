import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent" />
        <h1 className="font-mono text-xs uppercase tracking-widest text-terminal-muted">
          Research Archive
        </h1>
        <span className="font-mono text-[10px] text-terminal-muted ml-auto">
          {articles.length} articles
        </span>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      ) : (
        <div className="border border-terminal-border border-dashed rounded p-12 text-center">
          <p className="font-mono text-sm text-terminal-muted mb-2">
            No research published yet.
          </p>
          <p className="font-mono text-xs text-terminal-muted">
            Drop <code className="text-terminal-green">.md</code> files into{" "}
            <code className="text-terminal-green">content/articles/</code> to get started.
          </p>
        </div>
      )}
    </div>
  );
}
