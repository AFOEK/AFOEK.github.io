import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">Portfolio</p>
        <h1 className="text-5xl font-semibold tracking-tight">Felix Montalfu</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Computer Science · Quantum Computing · Artificial Intelligence</p>
        <Button className="mt-8">Explore Research</Button>
      </div>
    </main>
  );
}

export default App;