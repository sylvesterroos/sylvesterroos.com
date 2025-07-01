import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root as HastRoot, Element as HastElement } from "hast";

/**
 * Converts a Markdown string to HTML using remark-rehype and GFM support.
 * @param markdown The Markdown string to convert.
 * @returns A Promise resolving to the HTML string.
 */
/**
 * rehype plugin to add daisyUI/Tailwind classes to <a>, <ul>, <ol>, and <li> tags
 */
function rehypeAddDaisyUiClasses() {
  return (tree: HastRoot) => {
    visitElements(tree);
  };

  function addClass(node: any, classes: string[]) {
    if (!node.properties) node.properties = {};
    const existing = node.properties.className || [];
    node.properties.className = Array.from(
      new Set([...(Array.isArray(existing) ? existing : [existing]), ...classes]),
    );
  }

  function visitElements(node: any) {
    if (node.type === "element") {
      if (node.tagName === "a") {
        addClass(node, ["link", "link-primary"]);
      }
      if (node.tagName === "ul") {
        addClass(node, ["list-disc", "pl-6", "mb-2"]);
      }
      if (node.tagName === "ol") {
        addClass(node, ["list-decimal", "pl-6", "mb-2"]);
      }
      if (node.tagName === "li") {
        addClass(node, ["mb-1"]);
      }
    }
    if (node.children) {
      for (const child of node.children) {
        visitElements(child);
      }
    }
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  // Remove leading/trailing whitespace and normalize indentation for multiline template strings
  const normalized = markdown
    .replace(/^\s*\n/, "") // Remove leading newline
    .replace(/^[ \t]+/gm, "") // Remove leading indentation from each line
    .trim();

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeAddDaisyUiClasses)
    .use(rehypeStringify)
    .process(normalized);
  return String(file);
}
