
import { useEffect, useState } from "react";

const FRAME_WIDTH = 192;
const FRAME_HEIGHT = 208;
const COLUMNS = 8;
const ROWS = 9;

const SITTING_ROW = 6;
const SITTING_FRAMES = [0, 1, 2, 3, 4, 5];

// Render the character at 62.5% of native size.
const SCALE = 0.625;

const DISPLAY_WIDTH = FRAME_WIDTH * SCALE;
const DISPLAY_HEIGHT = FRAME_HEIGHT * SCALE;

export default function SkirkPet() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setFrame((current) =>
        (current + 1) % SITTING_FRAMES.length
      );
    }, 240);

    return () => window.clearInterval(timer);
  }, []);

  const column = SITTING_FRAMES[frame];

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none absolute
        left-1/2 top-0 z-20
        -translate-x-1/2 -translate-y-[60%]
        select-none
      "
    >
      <div
        style={{
          width: DISPLAY_WIDTH,
          height: DISPLAY_HEIGHT,

          backgroundImage:
            'url("/pets/skirk/spritesheet.webp")',

          backgroundRepeat: "no-repeat",

          backgroundSize: `${
            COLUMNS * DISPLAY_WIDTH
          }px ${ROWS * DISPLAY_HEIGHT}px`,

          backgroundPosition: `${
            -column * DISPLAY_WIDTH
          }px ${
            -SITTING_ROW * DISPLAY_HEIGHT
          }px`,

          filter:
            "drop-shadow(0 5px 9px rgba(110,130,255,0.22))",
        }}
      />
    </div>
  );
}
