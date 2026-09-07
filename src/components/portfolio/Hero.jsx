export default function Hero() {
  return (
    <section id="home" className="page-section snap-start relative flex min-h-screen items-center pt-24">
      <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-quantum-blue/5 blur-3xl" />
      <div className="absolute right-[12%] top-[28%] h-80 w-80 rounded-full bg-quantum-violet/5 blur-3xl" />
      <div className="absolute bottom-[12%] left-[45%] h-64 w-64 rounded-full bg-quantum-green/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-6 font-mono text-sm tracking-[0.2em] text-quantum-blue">
            COMPUTER SCIENCE · QUANTUM COMPUTING · AI
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Felix Montalfu
          </h1>

          <h2 className="mt-5 max-w-3xl text-xl font-normal leading-relaxed text-white/70 sm:text-2xl">
            Researcher exploring quantum computing, artificial intelligence, and computational systems.
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Master&apos;s student in Computer Science at Algoma University, working on hybrid quantum-classical machine learning, quantum algorithms, cybersecurity, and systems-oriented research.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="/#research" className="rounded-lg bg-quantum-blue px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
              Explore Research
            </a>

            <a href="/#publications" className="rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white">
              Publications
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}