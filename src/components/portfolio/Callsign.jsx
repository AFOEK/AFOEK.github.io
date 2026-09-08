import { useEffect, useRef, useState } from "react";

const CALLSIGN = "VA3FMU";
const PHONETIC = "Victor Alpha Three Foxtrot Mike Uniform";

const MORSE = {
  V: "...-",
  A: ".-",
  3: "...--",
  F: "..-.",
  M: "--",
  U: "..-",
};

const DOT = 65;
const FREQUENCY = 700;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Callsign() {
  const [output, setOutput] = useState("");
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);

  const runRef = useRef(0);
  const audioRef = useRef(null);

  const hasHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const getAudioContext = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!audioRef.current) audioRef.current = new AudioContext();

    if (audioRef.current.state === "suspended") {
      try {
        await audioRef.current.resume();
      } catch {
        return null;
      }
    }

    return audioRef.current;
  };

  useEffect(() => {
    const unlockAudio = async () => {
      await getAudioContext();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const tone = async (duration, run) => {
    if (run !== runRef.current) return;

    const ctx = await getAudioContext();

    if (ctx) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = FREQUENCY;

      const now = ctx.currentTime;
      const end = now + duration / 1000;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
      gain.gain.setValueAtTime(0.08, Math.max(now + 0.005, end - 0.005));
      gain.gain.linearRampToValueAtTime(0, end);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(now);
      oscillator.stop(end);
    }

    await sleep(duration);
  };

  const play = async () => {
    if (playing) return;

    const run = ++runRef.current;

    setHovered(true);
    setPlaying(true);
    setOutput("");

    for (let i = 0; i < CALLSIGN.length; i++) {
      const code = MORSE[CALLSIGN[i]];

      for (const symbol of code) {
        if (run !== runRef.current) return;

        setOutput((current) => current + symbol);

        await tone(symbol === "." ? DOT : DOT * 3, run);

        if (run !== runRef.current) return;
        await sleep(DOT);
      }

      if (i < CALLSIGN.length - 1) {
        if (run !== runRef.current) return;

        setOutput((current) => current + " ");
        await sleep(DOT * 2);
      }
    }

    if (run === runRef.current) setPlaying(false);
  };

  const stop = () => {
    runRef.current++;

    setHovered(false);
    setPlaying(false);
    setOutput("");
  };

  return (
    <div
      className="mt-3 inline-block font-mono text-xs"
      onPointerEnter={() => {
        if (hasHover()) play();
      }}
      onPointerLeave={() => {
        if (hasHover()) stop();
      }}
    >
      <div className="flex min-h-5 items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (!hasHover()) {
              if (playing) stop();
              else play();
            }
          }}
          className="cursor-crosshair tracking-[0.2em] text-white/35 transition-colors hover:text-quantum-green focus:text-quantum-green focus:outline-none"
          aria-label="Amateur radio callsign VA3FMU"
        >
          VA3FMU
        </button>

        {hovered && (
          <span className="tracking-[0.18em] text-quantum-green">
            {output}
            {playing && <span className="morse-cursor ml-1">▌</span>}
          </span>
        )}
      </div>

      {hovered && (
        <p className="mt-1 text-[10px] tracking-[0.12em] text-white/25">
          Victor Alpha Three Foxtrot Mike Uniform
        </p>
      )}
    </div>
  );
}