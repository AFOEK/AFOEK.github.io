import { useMemo } from "react";
import { BrainCircuit, Cpu } from "lucide-react";

const rand = (min, max) => Math.random() * (max - min) + min;

function BrainEffect({ run }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: rand(35, 68),
        top: rand(25, 70),
        size: rand(3, 9),
        delay: rand(1.15, 1.75),
        x: rand(-45, 45),
        y: rand(-35, 35),
      })),
    [run],
  );

  return (
    <div key={run} className="absolute inset-0 overflow-hidden">
      <div className="boltzmann-brain">
        <BrainCircuit className="size-20 text-quantum-blue" strokeWidth={1.1} />
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.2em] text-quantum-blue/40">
          STATE // FLUCTUATION
        </span>
      </div>

      {bits.map((bit) => (
        <span
          key={bit.id}
          className="brain-glitch-bit"
          style={{
            left: `${bit.left}%`,
            top: `${bit.top}%`,
            width: `${bit.size}px`,
            height: `${bit.size}px`,
            "--delay": `${bit.delay}s`,
            "--gx": `${bit.x}px`,
            "--gy": `${bit.y}px`,
          }}
        />
      ))}
    </div>
  );
}

function HeliumEffect({ run }) {
  const atoms = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = rand(160, 380);

        return {
          id: i,
          isotope: Math.random() > 0.5 ? "³He" : "⁴He",
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          rotation: rand(-360, 360),
          delay: rand(0, 0.18),
          size: rand(26, 42),
        };
      }),
    [run],
  );

  return (
    <div key={run} className="absolute inset-0 overflow-hidden">
      {atoms.map((atom) => (
        <div
          key={atom.id}
          className="helium-particle"
          style={{
            width: `${atom.size}px`,
            height: `${atom.size}px`,
            "--tx": `${atom.tx}px`,
            "--ty": `${atom.ty}px`,
            "--rot": `${atom.rotation}deg`,
            "--delay": `${atom.delay}s`,
          }}
        >
          <span className="helium-orbit" />
          <span className="relative z-10 font-mono text-[9px] text-quantum-violet">
            {atom.isotope}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChipEffect({ run }) {
  const chips = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: rand(0, 95),
        size: rand(13, 34),
        delay: rand(0, 0.75),
        duration: rand(1.3, 2.6),
        rotation: rand(-180, 180),
        drift: rand(-45, 45),
      })),
    [run],
  );

  return (
    <div key={run} className="absolute inset-0 overflow-hidden">
      {chips.map((chip) => (
        <Cpu
          key={chip.id}
          className="chip-rain text-quantum-green"
          style={{
            left: `${chip.left}%`,
            width: `${chip.size}px`,
            height: `${chip.size}px`,
            "--delay": `${chip.delay}s`,
            "--duration": `${chip.duration}s`,
            "--rotation": `${chip.rotation}deg`,
            "--drift": `${chip.drift}px`,
          }}
          strokeWidth={1.1}
        />
      ))}
    </div>
  );
}

export default function ResearchEasterEgg({ type, run }) {
  if (!run) return null;

  if (type === "brain") return <BrainEffect run={run} />;
  if (type === "helium") return <HeliumEffect run={run} />;
  if (type === "chips") return <ChipEffect run={run} />;

  return null;
}