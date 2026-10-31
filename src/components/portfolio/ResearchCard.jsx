import { useState } from "react";
import ResearchEasterEgg from "@/components/portfolio/ResearchEasterEgg";
import SkirkPet from "@/components/pets/SkirkPet";
import NahidaPet from "@/components/pets/NahidaPet";

export default function ResearchCard({ area }) {
  const [run, setRun] = useState(0);
  const Icon = area.icon;
  const isQML = area.title === "Quantum Machine Learning";
  const isAI = area.title === "AI, Cybersecurity & Systems";

  return (
    <div className={`group relative overflow-visible border-white/[0.07] px-8 pt-8 transition-colors hover:bg-white/[0.025] md:border-r md:last:border-r-0 ${isAI ? "pb-36" : "pb-8"}`}>
      {/* clipped effect layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ResearchEasterEgg type={area.effect} run={run} />
      </div>

      {/* Skirk only on QML card */}
      {isQML && <SkirkPet />}
      {isAI && <NahidaPet />}

      <div className="relative z-10">
        <button
          type="button"
          onClick={() => setRun((current) => current + 1)}
          className={`mb-8 inline-flex cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${area.accent}`}
          aria-label={area.title}
        >
          <Icon className="size-6" />
        </button>

        <h3 className="text-lg font-medium text-white">
          {area.title}
        </h3>

        <p className="mt-4 text-sm leading-6 text-white/45">
          {area.description}
        </p>
      </div>
    </div>
  );
}