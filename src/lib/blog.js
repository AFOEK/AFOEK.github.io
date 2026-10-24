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
    throw new Error(
      `Missing front matter in ${path}`,
    );
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

export const posts = Object.entries(files)
  .map(([path, source]) =>
    parsePost(source, path),
  )
  .filter((post) => post.draft !== true)
  .sort((a, b) => {
    const aDate = a.date
      ? new Date(a.date).getTime()
      : 0;

    const bDate = b.date
      ? new Date(b.date).getTime()
      : 0;

    return bDate - aDate;
  });

export function getPost(slug) {
  return posts.find(
    (post) => post.slug === slug,
  );
}