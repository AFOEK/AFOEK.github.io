import { useState } from "react";
import ResearchEasterEgg from "@/components/portfolio/ResearchEasterEgg";

export default function ResearchCard({ area }) {
  const [run, setRun] = useState(0);
  const Icon = area.icon;

  return (
    <div className="group relative overflow-hidden border-white/[0.07] p-8 transition-colors hover:bg-white/[0.025] md:border-r md:last:border-r-0">
      <ResearchEasterEgg type={area.effect} run={run} />

      <div className="relative z-10">
        <button
          type="button"
          onClick={() => setRun((current) => current + 1)}
          className={`mb-8 inline-flex cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${area.accent}`}
          aria-label={area.title}
        >
          <Icon className="size-6" />
        </button>

        <h3 className="text-lg font-medium text-white">{area.title}</h3>
        <p className="mt-4 text-sm leading-6 text-white/45">{area.description}</p>
      </div>
    </div>
  );
}