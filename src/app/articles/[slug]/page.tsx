import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/articles"
        className="inline-flex items-center gap-1 font-mono text-[10px] text-terminal-muted hover:text-terminal-accent uppercase tracking-widest mb-8 transition-colors"
      >
        ← Back to Research
      </Link>

      {/* Article header */}
      <header className="mb-8 pb-6 border-b border-terminal-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[10px] text-terminal-muted">{article.date}</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] px-1.5 py-0.5 bg-terminal-bg text-terminal-accent rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-mono text-xl md:text-2xl font-bold text-terminal-accent glow-accent mb-2">
          {article.title}
        </h1>
        {article.author && (
          <p className="font-mono text-xs text-terminal-muted">By {article.author}</p>
        )}
      </header>

      {/* Article content */}
      <div
        className="prose-terminal"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
}
