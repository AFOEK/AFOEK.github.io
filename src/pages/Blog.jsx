import { ArrowUpRight } from "lucide-react";
import { posts } from "@/lib/blog";
import { formatPostDate } from "@/lib/date";
import Navbar from "@/components/layout/Navbar";
import BackgroundGlow from "@/components/layout/BackgroundGlow";

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

export default function Blog() {
  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <BackgroundGlow />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-blue">
            Notes / Thoughts
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Writing
          </h1>

          <p className="mt-6 leading-7 text-white/50">
            Notes on quantum computing, artificial intelligence,
            systems, research, and things I find interesting.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-sm text-white/30">
            No writing published yet.
          </p>
        ) : (
          <div className="border-y border-white/[0.07]">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/#blog/${post.slug}`}
                className="group grid gap-5 border-b border-white/[0.07] py-8 last:border-b-0 md:grid-cols-[140px_1fr_auto]"
              >
                <div>
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25"
                    >
                      {formatDate(post.date)}
                    </time>
                  )}

                  {post.source === "Medium" && (
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/15">
                      Medium archive
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-medium text-white transition-colors group-hover:text-quantum-blue">
                    {post.title}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                    {post.description}
                  </p>

                  {post.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/25"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ArrowUpRight className="size-4 text-white/20 transition-colors group-hover:text-white/60" />
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}