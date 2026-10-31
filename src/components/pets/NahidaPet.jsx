
import { useEffect, useState } from "react";

const FRAME_WIDTH = 192;
const FRAME_HEIGHT = 208;

const SHEET_WIDTH = 1536;
const SHEET_HEIGHT = 1872;

// Review animation: last row, 6 frames
const REVIEW_ROW = 8;
const REVIEW_FRAMES = [0, 1, 2, 3, 4, 5];

const SCALE = 0.55;
const FPS = 6;

export default function NahidaPet() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setFrame((current) =>
        (current + 1) % REVIEW_FRAMES.length
      );
    }, 1000 / FPS);

    return () => window.clearInterval(timer);
  }, []);

  const column = REVIEW_FRAMES[frame];

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none absolute
        bottom-2 right-3 z-20
        select-none
      "
      style={{
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,

        backgroundImage:
          'url("/pets/nahida/spritesheet.webp")',

        backgroundRepeat: "no-repeat",

        backgroundSize: `${
          SHEET_WIDTH * SCALE
        }px ${SHEET_HEIGHT * SCALE}px`,

        backgroundPosition: `${
          -column * FRAME_WIDTH * SCALE
        }px ${
          -REVIEW_ROW * FRAME_HEIGHT * SCALE
        }px`,

        filter:
          "drop-shadow(0 5px 10px rgba(120,220,150,0.20))",
      }}
    />
  );
}
