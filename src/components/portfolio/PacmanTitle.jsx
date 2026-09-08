import { useEffect, useState } from "react";

const words = [
  { text: "Get", color: "text-quantum-blue" },
  { text: "in", color: "text-quantum-violet" },
  { text: "touch", color: "text-quantum-green" },
];

export default function PacmanTitle({ trigger, onComplete }) {
  const [eating, setEating] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [visible, setVisible] = useState([true, true, true]);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setEating(true);
    setEmpty(false);
    setRegenerating(false);
    setVisible([true, true, true]);

    const timers = [
      setTimeout(() => {
        setEating(false);
        setEmpty(true);
        setVisible([false, false, false]);
      }, 1500),

      setTimeout(() => {
        setEmpty(false);
        setRegenerating(true);
        setVisible([true, false, false]);
      }, 2250),

      setTimeout(() => setVisible([true, true, false]), 2600),
      setTimeout(() => setVisible([true, true, true]), 2950),

      setTimeout(() => setRegenerating(false), 3550),
      setTimeout(() => onComplete?.(), 3850),
    ];

    return () => timers.forEach(clearTimeout);
  }, [trigger, onComplete]);

  return (
    <div className="relative inline-block">
      {!empty && (
        <h2 className={`flex text-3xl font-semibold tracking-tight sm:text-4xl ${eating ? "pacman-eating-text" : ""}`}>
          {words.map((word, index) => (
            <span
              key={word.text}
              className={`inline-block ${
                !eating ? "transition-all duration-500" : ""
              } ${
                visible[index] ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              } ${
                regenerating && visible[index]
                  ? `${word.color} pacman-regenerated`
                  : "text-white"
              } ${
                index < words.length - 1 ? "mr-[0.28em]" : ""
              }`}
            >
              {word.text}
            </span>
          ))}
        </h2>
      )}

      {eating && (
        <div className="pacman-run" aria-hidden="true">
          <div className="pacman-body" />
        </div>
      )}
    </div>
  );
}