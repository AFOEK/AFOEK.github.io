import { publications } from "@/data/publications";
import PublicationItem from "@/components/portfolio/PublicationItem";

export default function Publications() {
  return (
    <section id="publications" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-violet">02 / Publications</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Publications & ongoing work</h2>
          <p className="mt-5 leading-7 text-white/50">Peer-reviewed publications, conference research, manuscripts under review, and ongoing research projects.</p>
        </div>

        <div>
          {publications.map((publication) => (
            <PublicationItem key={publication.title} publication={publication} />
          ))}
        </div>
      </div>
    </section>
  );
}