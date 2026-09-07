import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const accents = {
  blue: {
    text: "text-quantum-blue",
    border: "group-hover:border-quantum-blue/25",
  },
  violet: {
    text: "text-quantum-violet",
    border: "group-hover:border-quantum-violet/25",
  },
  green: {
    text: "text-quantum-green",
    border: "group-hover:border-quantum-green/25",
  },
};

export default function ProjectCard({ project }) {
  const accent = accents[project.accent];
  return (
    <article className={`group flex h-full flex-col border border-white/[0.07] bg-white/[0.015] p-7 transition-colors hover:bg-white/[0.025] ${accent.border}`}>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className={`font-mono text-xs uppercase tracking-[0.15em] ${accent.text}`}>{project.category}</p>
            {project.archived && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/25">Archived</span>}
          </div>
          <h3 className="mt-3 text-xl font-medium tracking-tight text-white">{project.title}</h3>
          <p className="mt-1 text-sm text-white/35">{project.subtitle}</p>
        </div>
        <FaGithub className="size-5 shrink-0 text-white/25" />
      </div>

      <p className="text-sm leading-6 text-white/50">{project.description}</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {project.stack.map((technology) => (
          <span key={technology} className="rounded-md border border-white/[0.07] px-2.5 py-1 font-mono text-[11px] text-white/40">
            {technology}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-8">
        <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white">
          View repository
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </article>
  );
}