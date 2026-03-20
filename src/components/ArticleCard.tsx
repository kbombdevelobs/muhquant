import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export default function ArticleCard({
  slug,
  title,
  date,
  excerpt,
  tags = [],
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="block group">
      <article className="border border-terminal-border bg-terminal-surface rounded p-4 hover:border-terminal-accent/40 transition-all duration-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-terminal-muted">{date}</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] px-1.5 py-0.5 bg-terminal-bg text-terminal-accent rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-mono text-sm font-semibold text-terminal-text group-hover:text-terminal-accent transition-colors mb-1.5">
          {title}
        </h3>
        <p className="font-sans text-xs text-terminal-muted leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        <div className="mt-3 font-mono text-[10px] text-terminal-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Read →
        </div>
      </article>
    </Link>
  );
}
