
import { useEffect, useState } from "react";

const FRAME_WIDTH = 192;
const FRAME_HEIGHT = 208;

const SHEET_WIDTH = 1536;
const SHEET_HEIGHT = 1872;

const RUN_RIGHT_ROW = 1;
const FRAME_COUNT = 8;

const SCALE = 0.5;
const FPS = 10;
const RUN_DURATION = 12;

export default function HuTaoPet() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % FRAME_COUNT);
    }, 1000 / FPS);

    return () => window.clearInterval(timer);
  }, []);

  const width = FRAME_WIDTH * SCALE;
  const height = FRAME_HEIGHT * SCALE;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <div
        className="hutao-runner absolute bottom-0"
        style={{
          "--hutao-width": `${width}px`,
          "--hutao-duration": `${RUN_DURATION}s`,
        }}
      >
        <div
          className="select-none"
          style={{
            width,
            height,

            backgroundImage:
              'url("/pets/hutao/spritesheet.webp")',

            backgroundRepeat: "no-repeat",

            backgroundSize:
              `${SHEET_WIDTH * SCALE}px ${SHEET_HEIGHT * SCALE}px`,

            backgroundPosition:
              `${-frame * width}px ${-RUN_RIGHT_ROW * height}px`,

            imageRendering: "pixelated",

            filter:
              "drop-shadow(0 5px 8px rgba(255,110,160,0.16))",
          }}
        />
      </div>
    </div>
  );
}