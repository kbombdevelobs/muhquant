import { getAllArticles } from "@/lib/articles";
import Link from "next/link";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-mono text-[18px] uppercase tracking-widest text-accent">Research</h1>
        <span className="font-mono text-[13px] text-muted">{articles.length} articles</span>
      </div>

      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="block group">
              <article className="border border-border bg-surface p-6 transition-all hover:border-accent-dim hover:bg-[#0f1420]">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-mono text-[16px] text-text group-hover:text-accent transition-colors mb-2">
                      {a.title}
                    </h2>
                    {a.excerpt && (
                      <p className="text-[14px] text-muted leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {a.excerpt}
                      </p>
                    )}
                    {a.tags.length > 0 && (
                      <div className="flex gap-3 mt-3">
                        {a.tags.map((tag) => (
                          <span key={tag} className="font-mono text-[10px] text-accent-dim uppercase tracking-widest border border-border px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[12px] text-muted shrink-0 mt-1">{a.date}</span>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <p className="text-[14px] text-muted">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
