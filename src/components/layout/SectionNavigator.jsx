const sections = [
  { id: "home", label: "Home" },
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function SectionNavigator({ activeSection }) {
  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav aria-label="Section navigation" className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <div className="relative flex flex-col items-center gap-5">
        <div className="absolute left-1/2 top-2 -z-10 h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-white/[0.08]" />

        {sections.map(({ id, label }) => {
          const active = activeSection === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              aria-label={`Go to ${label}`}
              className="group relative flex size-6 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  active
                    ? "h-5 w-1.5 bg-quantum-blue shadow-[0_0_12px_rgba(112,150,200,0.45)]"
                    : "size-1.5 bg-white/25 group-hover:bg-white/60"
                }`}
              />

              <span className="pointer-events-none absolute right-8 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-white/0 transition-colors group-hover:text-white/50">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}