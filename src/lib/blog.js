import { parse } from "yaml";

const files = import.meta.glob(
  "/src/content/blog/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

function parsePost(source, path) {
  const match = source.match(
    /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/,
  );

  if (!match) {
    throw new Error(`Missing front matter in ${path}`);
  }

  const metadata = parse(match[1]);
  const content = match[2];

  const slug = path
    .split("/")
    .pop()
    .replace(/\.md$/, "");

  return {
    slug,
    content,
    ...metadata,
  };
}

function dateValue(date) {
  if (!date) return 0;

  const timestamp = new Date(date).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

const allPosts = Object.entries(files)
  .map(([path, source]) => parsePost(source, path))
  .filter((post) => post.draft !== true)
  .sort((a, b) => dateValue(b.date) - dateValue(a.date));

export const posts = allPosts.filter(
  (post) => post.hidden !== true,
);

export function getPost(slug) {
  return allPosts.find((post) => post.slug === slug) ?? null;
}
