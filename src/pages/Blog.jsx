import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { posts, formatPostDate, getPostTimestamp } from "@/lib/blog";

import Navbar from "@/components/layout/Navbar";
import BackgroundGlow from "@/components/layout/BackgroundGlow";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sort, setSort] = useState("newest");

  // Dynamically collect all tags
  const availableTags = useMemo(() => {
    const tags = new Map();

    posts.forEach((post) => {
      (post.tags ?? []).forEach((tag) => {
        tags.set(tag.toLowerCase(), tag);
      });
    });

    return [...tags.values()].sort((a, b) =>
      a.localeCompare(b)
    );
  }, []);

  // Dynamically collect publication years
  const availableYears = useMemo(() => {
    return [
      ...new Set(
        posts
          .map((post) => {
            const timestamp = getPostTimestamp(post.date);

            return timestamp
              ? new Date(timestamp).getUTCFullYear()
              : null;
          })
          .filter(Boolean)
      ),
    ].sort((a, b) => b - a);
  }, []);

  // Search, filter and sort
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts
      .filter((post) => {
        const searchableText = [
          post.title,
          post.description,
          post.source,
          ...(post.tags ?? []),
        ].filter(Boolean).join(" ").toLowerCase();

        const matchesSearch =
          searchableText.includes(query);

        const matchesTag =
          selectedTag === "all" ||
          (post.tags ?? []).some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          );

        const timestamp = getPostTimestamp(post.date);
        const year = timestamp ? new Date(timestamp).getUTCFullYear() : null;
        const matchesYear = selectedYear === "all" || year === Number(selectedYear);

        return ( matchesSearch && matchesTag && matchesYear);
      }).sort((a, b) => {
        if (sort === "title") {
          return a.title.localeCompare(b.title);
        }

        const aDate = getPostTimestamp(a.date);
        const bDate = getPostTimestamp(b.date);

        // Keep undated articles at the bottom
        if (!aDate && bDate) return 1;
        if (aDate && !bDate) return -1;

        return sort === "oldest" ? aDate - bDate : bDate - aDate;
      });
  }, [search, selectedTag, selectedYear, sort]);

  const hasFilters = search !== "" || selectedTag !== "all" || selectedYear !== "all" || sort !== "newest";
  const resetFilters = () => {
    setSearch("");
    setSelectedTag("all");
    setSelectedYear("all");
    setSort("newest");
  };

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <BackgroundGlow />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-8">

        {/* Header */}

        <header className="mb-14 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-blue">
            Notes / Thoughts
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Writing
          </h1>

          <p className="mt-6 leading-7 text-white/70">
            Notes on quantum computing, artificial intelligence,
            systems, research, and things I find interesting.
          </p>
        </header>

        {/* Search and filters */}

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr_1fr]">

          {/* Search */}

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="
              min-w-0 rounded-lg border border-white/15
              bg-white/[0.03] px-4 py-3
              text-sm text-white placeholder:text-white/40
              outline-none transition-colors
              focus:border-quantum-blue/60
            "
          />

          {/* Tags */}

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            aria-label="Filter by tag"
            className="
              min-w-0 rounded-lg border border-white/15
              bg-[#0b0e16] px-4 py-3
              text-sm text-white/80 outline-none
              focus:border-quantum-blue/60
            "
          >
            <option value="all">All tags</option>

            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Year */}

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Filter by year"
            className="
              min-w-0 rounded-lg border border-white/15
              bg-[#0b0e16] px-4 py-3
              text-sm text-white/80 outline-none
              focus:border-quantum-blue/60
            "
          >
            <option value="all">All years</option>

            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Sorting */}

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort articles"
            className="
              min-w-0 rounded-lg border border-white/15
              bg-[#0b0e16] px-4 py-3
              text-sm text-white/80 outline-none
              focus:border-quantum-blue/60
            "
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>

        {/* Results information */}

        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="
                text-xs text-white/55 transition-colors
                hover:text-quantum-blue
              "
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Article list */}

        {posts.length === 0 ? (
          <p className="py-12 text-sm text-white/55">
            No writing published yet.
          </p>
        ) : filteredPosts.length === 0 ? (
          <div className="border-y border-white/[0.08] py-16 text-center">
            <p className="text-base text-white/75">
              No articles found.
            </p>

            <p className="mt-2 text-sm text-white/45">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 text-sm text-quantum-blue hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="border-y border-white/[0.09]">
            {filteredPosts.map((post) => {
              const timestamp = getPostTimestamp(post.date);

              const dateTime = timestamp
                ? new Date(timestamp)
                    .toISOString()
                    .slice(0, 10)
                : undefined;

              return (
                <a
                  key={post.slug}
                  href={`/#blog/${post.slug}`}
                  className="
                    group grid gap-5
                    border-b border-white/[0.09]
                    py-8 last:border-b-0
                    transition-colors
                    hover:bg-white/[0.015]
                    md:grid-cols-[140px_1fr_auto]
                  "
                >
                  {/* Date and source */}

                  <div>
                    {post.date && (
                      <time
                        dateTime={dateTime}
                        className="
                          font-mono text-[10px]
                          uppercase tracking-[0.15em]
                          text-white/55
                        "
                      >
                        {formatPostDate(post.date)}
                      </time>
                    )}

                    {post.source === "Medium" && (
                      <p className="
                        mt-2 font-mono text-[9px]
                        uppercase tracking-[0.14em]
                        text-white/45
                      ">
                        Medium archive
                      </p>
                    )}
                  </div>

                  {/* Article information */}

                  <div>
                    <h2 className="
                      text-lg font-medium text-white/95
                      transition-colors
                      group-hover:text-quantum-blue
                    ">
                      {post.title}
                    </h2>

                    <p className="
                      mt-3 max-w-2xl
                      text-sm leading-7 text-white/70
                    ">
                      {post.description}
                    </p>

                    {post.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="
                              font-mono text-[10px]
                              uppercase tracking-[0.12em]
                              text-quantum-violet/80
                            "
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* External indicator */}

                  <div className="flex items-start justify-end">
                    <ArrowUpRight
                      className="
                        size-4 text-white/35
                        transition-all duration-300
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:text-white
                      "
                    />
                  </div>
                </a>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
