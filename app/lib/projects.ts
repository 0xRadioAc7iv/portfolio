import { z } from "zod";
import { loadCollection } from "./content";

const categorySchema = z.enum([
  "systems-infra",
  "protocols-storage",
  "products",
  "libraries",
]);

const statusSchema = z.enum(["active", "shipped", "archived"]);

const linksSchema = z
  .object({
    code: z.string().url().optional(),
    demo: z.union([z.string().url(), z.literal("")]).optional(),
    site: z.string().url().optional(),
    npm: z.string().url().optional(),
    goPkg: z.string().url().optional(),
  })
  .default({});

const projectSchema = z
  .object({
    title: z.string().min(1).max(80),
    category: categorySchema,
    summary: z.string().min(40).max(240),
    status: statusSchema,
    role: z.string().min(1),
    duration: z.string().min(1),
    tech: z.array(z.string().min(1)).min(1).max(6),
    links: linksSchema,
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    order: z.number().int().default(999),
    draft: z.boolean().default(false),
  })
  .refine(
    (data) => !data.cover || (data.coverAlt && data.coverAlt.length > 0),
    { message: "coverAlt is required when cover is set", path: ["coverAlt"] },
  );

type ProjectFrontmatter = z.infer<typeof projectSchema>;

export type ProjectCategory = z.infer<typeof categorySchema>;
export type ProjectStatus = z.infer<typeof statusSchema>;

export type Project = ProjectFrontmatter & {
  slug: string;
  body: string;
  sourceFile: string;
  hasDetail: boolean;
};

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "systems-infra": "Systems & Infra",
  "protocols-storage": "Protocols & Storage",
  products: "Products",
  libraries: "Libraries",
};

export const CATEGORY_ORDER: ProjectCategory[] = [
  "systems-infra",
  "protocols-storage",
  "products",
  "libraries",
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  shipped: "Shipped",
  archived: "Archived",
};

type StubProject = Omit<Project, "body" | "sourceFile" | "hasDetail">;

const PROJECT_STUBS: StubProject[] = [
  {
    slug: "load-balancer",
    title: "Load Balancer",
    category: "systems-infra",
    summary:
      "Layer 7 reverse proxy with balancing strategies, response caching, rate limiting, and active health checks.",
    status: "shipped",
    role: "Solo",
    duration: "2024",
    tech: ["Node.js", "Infra", "Networking"],
    links: { code: "https://github.com/0xRadioAc7iv/load-balancer-nodejs" },
    order: 2,
    draft: false,
  },
  {
    slug: "totp-service",
    title: "TOTP Service",
    category: "protocols-storage",
    summary:
      "Standalone 2FA service implementing RFC 6238 with AWS KMS envelope encryption and replay protection.",
    status: "shipped",
    role: "Solo",
    duration: "2025",
    tech: ["Go", "Security", "RFC 6238"],
    links: { code: "https://github.com/0xRadioAc7iv/totp-service" },
    order: 3,
    draft: false,
  },
  {
    slug: "write-ahead-log",
    title: "Write-Ahead Log",
    category: "protocols-storage",
    summary:
      "WAL implementation in Go built to understand durability guarantees, sequential writes, and recovery paths.",
    status: "shipped",
    role: "Solo",
    duration: "2025",
    tech: ["Go", "Durability"],
    links: { code: "https://github.com/0xRadioAc7iv/wal" },
    order: 2,
    draft: false,
  },
  {
    slug: "solrpc",
    title: "SolRPC",
    category: "products",
    summary:
      "RPC aggregator for Solana nodes focused on request routing, reliability, and a smoother developer surface.",
    status: "shipped",
    role: "Solo",
    duration: "2025",
    tech: ["Node.js", "Solana"],
    links: {
      code: "https://github.com/0xRadioAc7iv/solrpc",
      site: "https://solrpc.vercel.app/",
    },
    order: 2,
    draft: false,
  },
  {
    slug: "rate-limiter",
    title: "Rate Limiter",
    category: "libraries",
    summary:
      "Fixed-window rate limiting library for Express, Fastify, and NestJS with multiple backing stores.",
    status: "shipped",
    role: "Solo",
    duration: "2024 – 2025",
    tech: ["Node.js", "OSS"],
    links: {
      code: "https://github.com/0xRadioAc7iv/rate-limiter",
      npm: "https://www.npmjs.com/package/@radioac7iv/rate-limiter",
      site: "https://rate-limiter.0xradioactiv.xyz/",
    },
    order: 1,
    draft: false,
  },
  {
    slug: "resp-codec",
    title: "RESP Codec Library",
    category: "libraries",
    summary:
      "A go library for encoding and decoding the Redis Serialization Protocol.",
    status: "shipped",
    role: "Solo",
    duration: "2026",
    tech: ["Go", "OSS"],
    links: {
      code: "https://github.com/0xRadioAc7iv/resp-codec",
      goPkg: "https://pkg.go.dev/github.com/0xRadioAc7iv/resp-codec",
    },
    order: 2,
    draft: false,
  },
];

export async function getAllProjects(): Promise<Project[]> {
  const items = await loadCollection("projects", projectSchema);
  const isProd = process.env.NODE_ENV === "production";
  const mdxProjects: Project[] = items
    .filter((project) => (isProd ? !project.draft : true))
    .map((item) => ({ ...item, hasDetail: true }));
  const stubs: Project[] = PROJECT_STUBS.filter((s) =>
    isProd ? !s.draft : true,
  ).map((s) => ({ ...s, body: "", sourceFile: "", hasDetail: false }));
  return [...mdxProjects, ...stubs].sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export function groupProjectsByCategory(
  projects: Project[],
): Record<string, Project[]> {
  const grouped: Record<string, Project[]> = {};
  for (const category of CATEGORY_ORDER) {
    const label = CATEGORY_LABELS[category];
    const entries = projects.filter((p) => p.category === category);
    if (entries.length > 0) grouped[label] = entries;
  }
  return grouped;
}
