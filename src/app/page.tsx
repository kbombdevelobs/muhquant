import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import WarMap from "@/components/WarMap";
import ActivityFeed from "@/components/ActivityFeed";

export default function Home() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <div>
      {/* Hero: Globe + Activity side by side, full bleed */}
      <div className="flex border-b border-border" style={{ height: "420px" }}>
        <div className="flex-[3] min-w-0">
          <WarMap articles={articles.map((a) => ({ slug: a.slug, title: a.title, date: a.date, location: a.location }))} />
        </div>
        <div className="flex-1 min-w-[240px] max-w-[320px] border-l border-border">
          <ActivityFeed />
        </div>
      </div>

      {/* Articles section */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-mono text-[13px] uppercase tracking-widest text-muted">Latest Research</h2>
          <Link href="/articles" className="font-mono text-[12px] text-accent-dim hover:text-accent transition-colors uppercase tracking-wider">
            View All &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="block group">
              <article className="border border-border bg-surface p-6 transition-all hover:border-accent-dim hover:bg-[#0f1420]">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-[16px] text-text group-hover:text-accent transition-colors mb-2">
                      {a.title}
                    </h3>
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
          ))}
        </div>
      </div>
    </div>
  );
}
