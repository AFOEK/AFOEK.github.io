import { Atom, BrainCircuit, Cpu } from "lucide-react";

export const researchAreas = [
  {
    title: "Quantum Machine Learning",
    description: "Hybrid quantum–classical learning architectures for sequence modeling, computer vision, cybersecurity, and representation learning using variational quantum circuits and quantum neural networks.",
    icon: BrainCircuit,
    accent: "text-quantum-blue",
    effect: "brain",
  },
  {
    title: "Quantum Computing & Algorithms",
    description: "Quantum algorithms, transform methods, quantum signal and image processing, circuit-based computation, and practical experimentation with near-term quantum systems.",
    icon: Atom,
    accent: "text-quantum-violet",
    effect: "helium",
  },
  {
    title: "AI, Cybersecurity & Systems",
    description: "Applied machine learning, retrieval-augmented generation, cybersecurity, systems programming, and computational infrastructure for research-oriented software systems.",
    icon: Cpu,
    accent: "text-quantum-green",
    effect: "chips",
  },
];