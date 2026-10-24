import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/date";
import MarkdownArticle from "@/components/blog/MarkdownArticle";
import BackgroundGlow from "@/components/layout/BackgroundGlow";
import Navbar from "@/components/layout/Navbar";

function formatDate(date) {
  if (!date) return null;

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-CA",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export default function BlogPost({ slug }) {
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-white">
        Post not found.
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <BackgroundGlow />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-32 pt-32">
        <a
          href="/#blog"
          className="mb-14 inline-flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Writing
        </a>

        <header className="mb-14">
          {post.date && (
            <time
              dateTime={post.date}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25"
            >
              {formatDate(post.date)}
            </time>
          )}

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/45">
            {post.description}
          </p>

          {post.source === "Medium" && (
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
              Medium archive
            </p>
          )}

          {post.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-quantum-violet/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="border-t border-white/[0.07] pt-10">
          <MarkdownArticle>
            {post.content}
          </MarkdownArticle>
        </div>

        {post.mediumUrl && (
          <div className="mt-16 border-t border-white/[0.07] pt-8">
            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-white/35 transition-colors hover:text-white"
            >
              Original publication on Medium
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}