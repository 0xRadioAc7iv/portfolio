import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { CoverImage } from "../../components/content/cover-image";
import { Toc, TocDisclosure } from "../../components/content/toc";
import { Prose } from "../../components/prose/prose";
import { mdxCompileOptions } from "../../lib/mdx";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  getAllProjects,
  getProjectBySlug,
} from "../../lib/projects";
import { extractToc } from "../../lib/toc";

export const dynamic = "error";
export const dynamicParams = false;

type PageParams = { slug: string };

export async function generateStaticParams(): Promise<PageParams[]> {
  const projects = await getAllProjects();
  return projects.filter((p) => p.hasDetail).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const url = `https://manavgadhiya.com/project/${project.slug}`;
  return {
    title: `${project.title} · Manav`,
    description: project.summary,
    alternates: { canonical: `/project/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      type: "article",
      images:
        project.cover && project.coverAlt
          ? [{ url: project.cover, alt: project.coverAlt }]
          : [],
    },
    twitter: {
      card: project.cover ? "summary_large_image" : "summary",
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : [],
    },
  };
}

type LinkDef = {
  label: string;
  href: string;
  primary?: boolean;
};

function collectLinks(links: Record<string, string | undefined>): LinkDef[] {
  const defs: LinkDef[] = [];
  if (links.code) defs.push({ label: "Code", href: links.code, primary: true });
  if (links.site) defs.push({ label: "Site", href: links.site });
  if (links.demo) defs.push({ label: "Demo", href: links.demo });
  if (links.npm) defs.push({ label: "npm", href: links.npm });
  if (links.goPkg) defs.push({ label: "pkg.go", href: links.goPkg });
  return defs;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const toc = extractToc(project.body);
  const categoryLabel = CATEGORY_LABELS[project.category];
  const statusLabel = STATUS_LABELS[project.status];
  const linkDefs = collectLinks(project.links ?? {});

  return (
    <article className="page-shell animate-fade-up content-page">
      {project.cover && project.coverAlt && (
        <CoverImage src={project.cover} alt={project.coverAlt} />
      )}

      <header className="project-header">
        <p
          className={`project-eyebrow project-status-${project.status}`}
          aria-label={`${categoryLabel}, status ${statusLabel}`}
        >
          <span>{categoryLabel}</span>
          <span aria-hidden="true"> · </span>
          <span className="project-status-label">{statusLabel}</span>
        </p>

        <h1 className="content-title">{project.title}</h1>
        <p className="project-summary">{project.summary}</p>

        {project.status === "archived" && (
          <p className="project-archived-banner">
            This project is archived and no longer maintained.
          </p>
        )}

        <div className="project-meta-row">
          <p className="project-meta">
            <span>{project.role}</span>
            <span aria-hidden="true"> · </span>
            <span>{project.duration}</span>
          </p>
          {linkDefs.length > 0 && (
            <div className="project-links">
              {linkDefs.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    link.primary ? "button-primary" : "button-secondary"
                  }
                >
                  {link.label}
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="project-tech">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="border border-[color:var(--line)] bg-[color:var(--surface)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-subtle)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="content-layout">
        <div className="content-main">
          <TocDisclosure items={toc} />
          <Prose>
            <MDXRemote source={project.body} options={mdxCompileOptions} />
          </Prose>
        </div>
        <aside className="content-aside">
          <Toc items={toc} />
        </aside>
      </div>
    </article>
  );
}
