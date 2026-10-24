import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownArticle({
  children,
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mb-8 mt-12 text-4xl font-semibold tracking-tight text-white">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="mb-5 mt-12 text-2xl font-semibold tracking-tight text-white">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="mb-4 mt-9 text-xl font-medium text-white">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="my-5 leading-8 text-white/60">
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className="font-semibold text-white/90">
            {children}
          </strong>
        ),

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-quantum-blue underline decoration-quantum-blue/30 underline-offset-4 transition-colors hover:text-white"
          >
            {children}
          </a>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-2 border-quantum-violet/50 pl-6 italic text-white/50">
            {children}
          </blockquote>
        ),

        ul: ({ children }) => (
          <ul className="my-5 list-disc space-y-2 pl-6 text-white/60">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="my-5 list-decimal space-y-2 pl-6 text-white/60">
            {children}
          </ol>
        ),

        code: ({ children }) => (
          <code className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.9em] text-quantum-green">
            {children}
          </code>
        ),

        pre: ({ children }) => (
          <pre className="my-8 overflow-x-auto border border-white/[0.07] bg-white/[0.02] p-5 font-mono text-sm leading-6 text-white/70">
            {children}
          </pre>
        ),

        hr: () => (
          <hr className="my-12 border-white/[0.07]" />
        ),

        img: ({ src, alt }) => (
          <figure className="my-10">
            <img
              src={src}
              alt={alt ?? ""}
              className="w-full"
              loading="lazy"
            />
          </figure>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}