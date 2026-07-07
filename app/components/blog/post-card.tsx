import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "../../lib/blog";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function PostCard({ post }: { post: BlogPost }) {
  const dateLabel = DATE_FMT.format(post.date);
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-labelledby={`post-${post.slug}-title`}
      className="post-card row-hover"
    >
      <div className="post-card-body">
        <h3 id={`post-${post.slug}-title`} className="post-card-title">
          <span className="inline-flex items-center gap-1.5">
            {post.title}
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </span>
        </h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <p className="post-card-meta">
          <span>{dateLabel}</span>
          <span aria-hidden="true"> · </span>
          <span>{post.readingMinutes} min read</span>
        </p>
      </div>
    </Link>
  );
}
