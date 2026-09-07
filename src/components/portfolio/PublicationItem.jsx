import { ArrowUpRight } from "lucide-react";

const statusColor = {
  Published: "text-quantum-blue",
  Presented: "text-quantum-blue",
  "Under Review": "text-quantum-violet",
  "In Progress": "text-quantum-green",
};

export default function PublicationItem({ publication }) {
  const content = (
    <article className="group border-t border-white/[0.07] py-8">
      <div className="grid gap-5 md:grid-cols-[120px_1fr_auto] md:gap-8">
        <div>
          <p className="font-mono text-xs text-white/35">{publication.year}</p>
          <p className={`mt-2 font-mono text-xs uppercase tracking-wide ${statusColor[publication.status]}`}>{publication.status}</p>
        </div>

        <div className="max-w-4xl">
          <h3 className="text-lg font-medium leading-snug text-white transition-colors group-hover:text-quantum-blue sm:text-xl">{publication.title}</h3>
          <p className="mt-2 text-sm text-white/45">{publication.venue} · {publication.type}</p>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/50 sm:text-base">{publication.description}</p>
        </div>

        {publication.href && <ArrowUpRight className="size-5 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />}
      </div>
    </article>
  );

  if (!publication.href) return content;

  return <a href={publication.href} target="_blank" rel="noreferrer" className="block">{content}</a>;
}