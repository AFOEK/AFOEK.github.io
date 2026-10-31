import { useEffect, useState } from "react";

const FRAME_WIDTH = 192;
const FRAME_HEIGHT = 208;

const SHEET_WIDTH = 1536;
const SHEET_HEIGHT = 1872;

const RUN_RIGHT_ROW = 1;
const RUN_LEFT_ROW = 2;
const FRAME_COUNT = 8;

const SCALE = 0.5;
const FPS = 10;
const RUN_DURATION = 10;

export default function HuTaoPet({ facing = "right" }) {
  const [frame, setFrame] = useState(0);
  const activeRow = facing === "right" ? RUN_RIGHT_ROW : RUN_LEFT_ROW;

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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
      className="pointer-events-none shrink-0 select-none"
      style={{
        width,
        height,
        backgroundImage: 'url("/pets/hutao/spritesheet.webp")',
        backgroundRepeat: "no-repeat",
        backgroundSize: `${SHEET_WIDTH * SCALE}px ${SHEET_HEIGHT * SCALE}px`,
        backgroundPosition: `${-frame * width}px ${-activeRow * height}px`,
        imageRendering: "pixelated",
        filter: "drop-shadow(0 5px 8px rgba(255,110,160,0.16))",
      }}
    />
  );
}
