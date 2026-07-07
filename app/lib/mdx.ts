import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { SerializeOptions } from "next-mdx-remote/dist/types";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function walk(node: HastNode | undefined): void {
  if (!node) return;
  if (
    node.type === "element" &&
    node.tagName === "a" &&
    node.properties &&
    typeof node.properties.href === "string" &&
    /^https?:\/\//.test(node.properties.href)
  ) {
    node.properties.rel = node.properties.rel ?? "noopener noreferrer";
    node.properties.target = node.properties.target ?? "_blank";
    const already =
      node.children?.some(
        (child) =>
          child.type === "element" &&
          child.tagName === "span" &&
          Array.isArray(child.properties?.className) &&
          (child.properties?.className as string[]).includes("sr-only"),
      ) ?? false;
    if (!already) {
      node.children = [
        ...(node.children ?? []),
        {
          type: "element",
          tagName: "span",
          properties: {
            "aria-hidden": "true",
            className: ["external-link-glyph"],
          },
          children: [{ type: "text", value: "\u2197" }],
        },
        {
          type: "element",
          tagName: "span",
          properties: { className: ["sr-only"] },
          children: [{ type: "text", value: " (opens in new tab)" }],
        },
      ];
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child);
  }
}

export function rehypeExternalLinks() {
  return (tree: HastNode) => walk(tree);
}

export const mdxCompileOptions: SerializeOptions = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [
        rehypePrettyCode,
        {
          theme: { light: "min-light", dark: "vesper" },
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
      rehypeExternalLinks,
    ],
  },
};
