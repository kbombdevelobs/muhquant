import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author?: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "Unknown",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        author: data.author,
      };
    });

  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  return fs
    .readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(gfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    date: data.date || "Unknown",
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    author: data.author,
    contentHtml,
  };
}
