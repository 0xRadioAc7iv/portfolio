import type { Metadata } from "next";
import { PostCard } from "../components/blog/post-card";
import { SectionIntro } from "../components/section-intro";
import { getAllBlogPosts } from "../lib/blog";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend, systems, and the occasional side-quest.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Writing — Manav Gadhiya",
    description: "Notes on backend, systems, and the occasional side-quest.",
    url: "https://manavgadhiya.com/blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing — Manav Gadhiya",
    description: "Notes on backend, systems, and the occasional side-quest.",
  },
};

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="page-shell animate-fade-up">
      <section>
        <SectionIntro
          eyebrow="Writing"
          heading="Thoughts I've written down."
          support="Mostly about backend, systems, and the occasional side-quest."
          level="h1"
        />

        {posts.length === 0 ? (
          <p className="empty-state">Nothing here yet — writing in progress.</p>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
