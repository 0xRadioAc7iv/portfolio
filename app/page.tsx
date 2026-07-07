import { ArrowUpRight } from "lucide-react";
import { OtherAccordion } from "./components/other-accordion";
import { ProjectsAccordion } from "./components/projects-accordion";
import { SectionIntro } from "./components/section-intro";
import { TechStackSection } from "./components/tech-stack-section";
import { formatDateRange } from "./lib/date";
import { getAllProjects, groupProjectsByCategory } from "./lib/projects";

const PROJECT_CATEGORY_COPY: Record<string, string> = {
  "Systems & Infra":
    "Low-level experiments where latency, ownership, and reliability matter.",
  "Protocols & Storage":
    "Projects built to understand persistence, auth guarantees, and the parts usually hidden behind abstractions.",
  Products:
    "Developer-facing tools and product ideas pushed far enough to feel real.",
  Libraries:
    "Smaller reusable pieces solving one problem cleanly without extra ceremony.",
};

const EXPERIENCE = [
  {
    company: "SendIN",
    role: "Full Stack Developer",
    from: "Jul 2025",
    to: "Jun 2026",
    link: "https://sendin.app",
    description:
      "Building across React/TanStack, NestJS, Stellar wallet flows, Redis-backed caching, AWS messaging, and CI/CD.",
  },
  {
    company: "Predictify",
    role: "Freelancer",
    from: "Jun 2025",
    to: "Oct 2025",
    link: "https://t.me/Predictify_bot",
    description:
      "Shipped a Telegram trading bot for Polymarket with real-time orders, copy trading, stop-loss / take-profit logic, and multilingual support.",
  },
];

const SNAPSHOT = [
  { label: "Status", value: "Open for roles", signal: true },
  { label: "Focus", value: "Systems, infra, databases" },
  { label: "Approach", value: "Clean + performance-aware" },
  { label: "Outside code", value: "Cricket, Games and Astronomy" },
];

async function getStarMap(): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      "https://api.github.com/users/0xRadioAc7iv/repos?per_page=100",
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return {};
    const repos: Array<{ name: string; stargazers_count: number }> =
      await response.json();
    return Object.fromEntries(
      repos.map((repo) => [repo.name.toLowerCase(), repo.stargazers_count]),
    );
  } catch {
    return {};
  }
}

export default async function Page() {
  const [stars, projects] = await Promise.all([getStarMap(), getAllProjects()]);
  const groupedProjects = groupProjectsByCategory(projects);

  return (
    <div id="top" className="page-shell animate-fade-up">
      <section id="about">
        <SectionIntro
          eyebrow="About"
          heading="I build systems that stay up."
          level="h1"
        />
        <div className="hero-body">
          <div className="hero-bio flex flex-col gap-2">
            <p className="hero-copy">
              I&apos;m a backend engineer who likes to understand how things
              work at a low level: game servers, protocols, storage engines,
              distributed systems. When something catches my curiosity, I build
              it to figure it out.
            </p>
            <p className="hero-copy">
              I care about performance and correctness. Not prematurely, but
              deliberately. Systems that are easy to reason about and hard to
              break.
            </p>
          </div>
          <div className="hero-snapshot">
            <div className="info-list">
              {SNAPSHOT.map((item) => (
                <div key={item.label} className="info-row">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">
                    {item.signal && (
                      <span
                        className="status-dot mr-2 align-middle"
                        aria-hidden="true"
                      />
                    )}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-stack">
          <p className="section-kicker shrink-0">Core stack</p>
          <TechStackSection />
        </div>
      </section>

      <section id="experience" className="section-zone">
        <SectionIntro
          eyebrow="Experience"
          heading="Where I shipped product work."
          support="Startup and freelance work spanning product, backend, infrastructure, and real delivery pressure."
        />

        <div className="panel">
          {EXPERIENCE.map((entry, index) => (
            <a
              key={entry.company}
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${entry.company} — opens in new tab`}
              className={`row-hover block px-5 py-5 sm:px-6 no-underline ${
                index !== EXPERIENCE.length - 1
                  ? "border-b border-[color:var(--line)]"
                  : ""
              }`}
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-lg font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
                      {entry.company}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="border border-[color:var(--line)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]">
                      {entry.role}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--fg-muted)]">
                    {entry.description}
                  </p>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)] md:text-right">
                  {formatDateRange(entry.from, entry.to)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="projects" className="section-zone">
        <SectionIntro
          eyebrow="Selected work"
          heading="Projects that reflect how I think."
          support="Systems-level experiments, developer tools, and products pushed far enough to feel real."
        />

        <ProjectsAccordion
          projects={groupedProjects}
          stars={stars}
          descriptions={PROJECT_CATEGORY_COPY}
        />
      </section>

      <section id="offline" className="section-zone">
        <SectionIntro
          eyebrow="Offline"
          heading="What I do outside of work."
          support="The things I reach for when I'm not building."
        />

        <OtherAccordion />
      </section>
    </div>
  );
}
