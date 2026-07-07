"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLinkIcon } from "./external-link-icon";
import ThemeToggle from "./theme-toggle";

const SECTION_LINKS = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Offline", id: "offline" },
];

const EXTERNAL_LINKS = [
  { label: "GitHub", href: "https://github.com/0xRadioAc7iv" },
  { label: "Resume", href: "/my_resume.pdf" },
];

function useActiveSection(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const sections = SECTION_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Thin band around the upper-middle of the viewport: the section
      // crossing it is the one considered "in view".
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(onHome);
  const blogsActive = pathname === "/blogs" || pathname.startsWith("/blog/");

  const sectionLinkClass = (id: string) =>
    `${onHome && activeSection === id ? "nav-item-active " : ""}` +
    "font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)] transition-colors duration-150 hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink)]";

  const actionLinkClass = (active: boolean) =>
    `${active ? "nav-item-active " : ""}` +
    "font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--ink-soft)] transition-all duration-150 hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink)]";

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--nav-bg)] backdrop-blur-[18px]">
      <div className="mx-auto max-w-6xl">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-stretch justify-between">
            <Link href="/" className="flex items-stretch">
              <span className="flex items-center border-r border-[color:var(--line)] px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.png"
                  alt=""
                  className="h-8 w-8 object-cover"
                />
              </span>
              <span className="flex items-center px-4 text-lg font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
                Manav Gadhiya
                <span className="text-[color:var(--signal)]">.</span>
              </span>
            </Link>
            <ThemeToggle className="flex items-center px-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--ink-soft)] transition-all duration-150 hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink)]" />
          </div>

          <nav aria-label="Primary" className="border-t border-[color:var(--line)]">
            <div className="grid grid-cols-4">
              {SECTION_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={`/#${link.id}`}
                  aria-current={
                    onHome && activeSection === link.id ? "true" : undefined
                  }
                  className={`border-r border-[color:var(--line)] px-2 py-2.5 text-center last:border-r-0 ${sectionLinkClass(link.id)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-3 border-t border-[color:var(--line)]">
              <Link
                href="/blogs"
                aria-current={blogsActive ? "page" : undefined}
                className={`border-r border-[color:var(--line)] px-2 py-2.5 text-center ${actionLinkClass(blogsActive)}`}
              >
                Blogs
              </Link>
              {EXTERNAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border-r border-[color:var(--line)] px-2 py-2.5 text-center last:border-r-0 ${actionLinkClass(false)}`}
                >
                  {label}
                  <ExternalLinkIcon />
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between px-6 py-0">
          <Link href="/" className="flex items-center self-stretch">
            <div className="flex h-full items-center border-r border-[color:var(--line)] pr-4 mr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatar.png"
                alt=""
                className="h-9 w-9 object-cover"
              />
            </div>
            <p className="py-3 text-lg font-semibold tracking-[-0.04em] text-[color:var(--ink)]">
              Manav Gadhiya
              <span className="text-[color:var(--signal)]">.</span>
            </p>
          </Link>

          <nav aria-label="Primary" className="flex items-center">
            {SECTION_LINKS.map((link) => (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                aria-current={
                  onHome && activeSection === link.id ? "true" : undefined
                }
                className={`border-l border-[color:var(--line)] px-4 py-4 ${sectionLinkClass(link.id)}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blogs"
              aria-current={blogsActive ? "page" : undefined}
              className={`border-l border-[color:var(--line)] px-4 py-4 ${actionLinkClass(blogsActive)}`}
            >
              Blogs
            </Link>
            {EXTERNAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`border-l border-[color:var(--line)] px-4 py-4 ${actionLinkClass(false)}`}
              >
                {label}
                <ExternalLinkIcon />
              </a>
            ))}
            <ThemeToggle className="border-l border-[color:var(--line)] px-4 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--ink-soft)] transition-all duration-150 hover:bg-[color:var(--hover-bg)] hover:text-[color:var(--ink)]" />
          </nav>
        </div>
      </div>
    </header>
  );
}
