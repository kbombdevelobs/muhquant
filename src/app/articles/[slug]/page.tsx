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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/articles"
        className="font-mono text-[12px] text-muted hover:text-accent transition-colors uppercase tracking-wider inline-flex items-center gap-1 mb-8"
      >
        &larr; Back to Research
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[12px] text-muted">{article.date}</span>
            {article.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] text-accent-dim uppercase tracking-widest border border-border px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          <h1
            className="font-mono text-[22px] text-accent leading-tight mb-2"
            style={{ textShadow: "0 0 12px rgba(255,140,0,0.2)" }}
          >
            {article.title}
          </h1>
          {article.author && (
            <p className="text-[13px] text-muted" style={{ fontFamily: "var(--font-body)" }}>
              {article.author}
            </p>
          )}
        </header>

        {/* Body */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>
    </div>
  );
}
