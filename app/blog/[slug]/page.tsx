import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Meta } from "../../components/content/meta";
import { Toc, TocDisclosure } from "../../components/content/toc";
import { Prose } from "../../components/prose/prose";
import { getAllBlogPosts, getBlogPostBySlug } from "../../lib/blog";
import { mdxCompileOptions } from "../../lib/mdx";
import { extractToc } from "../../lib/toc";

export const dynamic = "error";
export const dynamicParams = false;

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type PageParams = { slug: string };

export async function generateStaticParams(): Promise<PageParams[]> {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `https://manavgadhiya.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date.toISOString(),
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.body);
  const dateLabel = DATE_FMT.format(post.date);

  return (
    <article className="page-shell animate-fade-up content-page">
      <header className="content-header">
        <h1 className="content-title">{post.title}</h1>
        <Meta
          items={[
            { value: dateLabel },
            { value: `${post.readingMinutes} min read` },
          ]}
        />
      </header>

      <div className="content-layout">
        <div className="content-main">
          <TocDisclosure items={toc} />
          <Prose>
            <MDXRemote source={post.body} options={mdxCompileOptions} />
          </Prose>
        </div>
        <aside className="content-aside">
          <Toc items={toc} />
        </aside>
      </div>
    </article>
  );
}
