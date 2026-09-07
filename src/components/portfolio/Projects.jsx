import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-green">03 / Projects</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Selected projects</h2>
            <p className="mt-5 leading-7 text-white/50">Selected software and experimental systems spanning artificial intelligence, systems programming, and quantum computing.</p>
          </div>

          <a href="https://github.com/AFOEK" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm text-white/45 transition-colors hover:text-white">
            View GitHub
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}