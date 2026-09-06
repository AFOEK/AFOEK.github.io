import { ArrowUpRight } from "lucide-react";

export default function ResearchItem({ item, accent }) {
  const content = (
    <div className="group border-t border-white/[0.07] py-7">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-4xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/40">
            <span>{item.year}</span>
            <span>·</span>
            <span>{item.type}</span>
          </div>
          <h3 className="text-lg font-medium leading-snug text-white transition-colors group-hover:text-[var(--item-accent)] sm:text-xl">{item.title}</h3>
          <p className="mt-2 text-sm text-white/50">{item.venue}</p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/45 sm:text-base">{item.description}</p>
        </div>
        {item.href && <ArrowUpRight className="mt-1 size-5 shrink-0 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />}
      </div>
    </div>
  );

  if (!item.href) return <div style={{ "--item-accent": accent }}>{content}</div>;

  return <a href={item.href} target="_blank" rel="noreferrer" style={{ "--item-accent": accent }} className="block">{content}</a>;
}