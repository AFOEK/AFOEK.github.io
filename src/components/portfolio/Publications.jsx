import { useState } from "react";
import { publications } from "@/data/publications";
import { ORBITALS } from "@/data/orbitals";
import PublicationItem from "@/components/portfolio/PublicationItem";
import Carbon12Field from "@/components/portfolio/Carbon12Field";

export default function Publications() {
  const [hoveredPublication, setHoveredPublication] = useState(null);

  const activeOrbital =
    hoveredPublication !== null
      ? ORBITALS[hoveredPublication % ORBITALS.length]
      : null;

  return (
    <section
      id="publications"
      className="page-section snap-start relative overflow-hidden py-28 sm:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, black 38%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.25) 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 38%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.25) 82%, transparent 100%)",
        }}
      >
        <Carbon12Field activePublication={hoveredPublication} />
      </div>

      {activeOrbital && (
        <div
          className={`pointer-events-none absolute bottom-8 right-8 z-[5] font-mono text-[9px] tracking-[0.22em] transition-all duration-500 ${activeOrbital
            ? "translate-y-0 opacity-100 text-quantum-violet/30"
            : "translate-y-1 opacity-0 text-white/0"
            }`}
        >
          ψ : {activeOrbital?.label ?? "—"}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-violet">
            02 / Publications
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Publications & ongoing work
          </h2>

          <p className="mt-5 leading-7 text-white/50">
            Peer-reviewed publications, conference research, manuscripts under review, and ongoing research projects.
          </p>
        </div>

        <div>
          {publications.map((publication, index) => (
            <PublicationItem
              key={publication.title}
              publication={publication}
              onEnter={() => setHoveredPublication(index)}
              onLeave={() => setHoveredPublication(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}