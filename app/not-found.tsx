import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-shell animate-fade-up flex min-h-[calc(100vh-120px)] items-center justify-center py-16">
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-b border-[color:var(--line)] pb-4 mb-8 flex items-center justify-between">
          <span className="section-kicker">Error</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--signal)]">
            404
          </span>
        </div>

        <h1 className="text-[clamp(4rem,14vw,9rem)] font-bold leading-[0.88] tracking-[-0.07em] text-[color:var(--ink)]">
          Not
          <br />
          found<span className="text-[color:var(--signal)]">.</span>
        </h1>

        <div className="mt-8 border-t border-[color:var(--line)] pt-6 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
          <p className="text-sm leading-[1.8] text-[color:var(--muted)] max-w-sm">
            This page doesn&apos;t exist. You may have followed a broken link or
            mistyped the URL.
          </p>
          <Link
            href="/"
            className="button-primary shrink-0 inline-flex items-center gap-2"
          >
            Back home <ArrowUpRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </div>
  );
}
