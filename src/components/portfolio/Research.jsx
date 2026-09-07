import { researchAreas } from "@/data/research";

export default function Research() {
  return (
    <section id="research" className="page-section snap-start py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-blue">01 / Research</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Research interests</h2>
          <p className="mt-5 text-base leading-7 text-white/50">My research focuses on the intersection of quantum computing, artificial intelligence, and computational systems, with an emphasis on hybrid quantum–classical approaches.</p>
        </div>

        <div className="grid border-y border-white/[0.07] md:grid-cols-3">
          {researchAreas.map(({ title, description, icon: Icon, accent }) => (
            <div key={title} className="group border-white/[0.07] p-8 transition-colors hover:bg-white/[0.025] md:border-r md:last:border-r-0">
              <Icon className={`mb-8 size-6 ${accent}`} />
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/45">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}