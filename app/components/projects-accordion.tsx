"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "../lib/projects";

type Props = {
  projects: Record<string, Project[]>;
  stars: Record<string, number>;
  descriptions?: Record<string, string>;
};

type ProjectActionLink = {
  label: string;
  href: string;
  primary?: boolean;
};

function getGithubRepoName(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/^https?:\/\/github\.com\/[^/]+\/([^/]+?)\/?$/);
  return match ? match[1].toLowerCase() : null;
}

function getProjectActionLinks(project: Project): ProjectActionLink[] {
  const links: ProjectActionLink[] = [];
  if (project.links?.code) {
    links.push({ label: "Code", href: project.links.code, primary: true });
  }
  if (project.links?.site) {
    links.push({ label: "Site", href: project.links.site });
  }
  if (project.links?.npm) {
    links.push({ label: "npm", href: project.links.npm });
  }
  if (project.links?.goPkg) {
    links.push({ label: "pkg.go", href: project.links.goPkg });
  }
  return links;
}

export function ProjectsAccordion({
  projects,
  stars,
  descriptions = {},
}: Props) {
  const categories = Object.keys(projects);
  const [active, setActive] = useState(() => categories[0] ?? "");
  const items = projects[active] ?? [];

  if (categories.length === 0) {
    return (
      <div className="panel px-5 py-6 sm:px-6">
        <p className="text-sm leading-7 text-[color:var(--fg-muted)]">
          No projects to show right now.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="tab-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`tab-btn${active === category ? " tab-active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      {descriptions[active] && (
        <div className="border-b border-[color:var(--line)] px-5 py-2.5">
          <p className="text-[11px] leading-relaxed text-[color:var(--fg-muted)]">
            {descriptions[active]}
          </p>
        </div>
      )}

      {items.map((project, index) => {
        const repoName = getGithubRepoName(project.links?.code);
        const starCount = repoName ? (stars[repoName] ?? 0) : 0;
        const detailHref = `/project/${project.slug}`;
        const actionLinks = getProjectActionLinks(project);

        const CardInner = (
          <>
            <div className="flex h-full items-start border-r border-[color:var(--line)] py-5 pl-5">
              <span className="row-index font-mono text-[10px] text-[color:var(--fg-subtle)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
                  <span className="inline-flex items-center gap-1.5">
                    {project.title}
                    {project.hasDetail && (
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </h3>
                {starCount > 0 && (
                  <span className="border border-[color:var(--line)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--fg-subtle)]">
                    {"\u2605"} {starCount}
                  </span>
                )}
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-[1.7] text-[color:var(--fg-muted)]">
                {project.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[color:var(--line)] bg-[color:var(--surface)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--fg-subtle)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        );

        return (
          <article
            key={project.slug}
            className={`row-hover ${
              index !== items.length - 1
                ? "border-b border-[color:var(--line)]"
                : ""
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start">
              {project.hasDetail ? (
                <Link
                  href={detailHref}
                  aria-label={`${project.title} — view case study`}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] no-underline hover:opacity-90"
                >
                  {CardInner}
                </Link>
              ) : (
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                  {CardInner}
                </div>
              )}

              <div className="hidden w-[8rem] flex-col items-stretch gap-1.5 border-l border-[color:var(--line)] px-4 py-5 sm:flex">
                {actionLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.primary ? "button-primary" : "button-secondary"} flex justify-center`}
                  >
                    {link.label} <ArrowUpRight size={18} strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t border-[color:var(--line)] px-5 py-3 sm:hidden">
              {actionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.primary ? "button-primary" : "button-secondary"}
                >
                  {link.label} <ArrowUpRight size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
