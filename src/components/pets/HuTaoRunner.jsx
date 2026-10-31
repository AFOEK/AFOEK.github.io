import { useEffect, useRef, useState } from "react";
import HuTaoPet from "@/components/pets/HuTaoPet";

const SPRITE_WIDTH = 192 * 0.5;

export default function HuTaoRunner() {
  const trackRef = useRef(null);
  const [facing, setFacing] = useState("right");
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => {
      setTravel(Math.max(0, track.clientWidth - SPRITE_WIDTH));
    });

    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={trackRef}
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        "--hutao-travel": `${travel}px`,
        "--hutao-duration": "6s",
      }}
    >
      <div
        className="hutao-patrol absolute bottom-0 left-0"
        style={{ width: SPRITE_WIDTH }}
        onAnimationIteration={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.animationName !== "hutao-patrol"
          )
            return;

          setFacing((previous) => (previous === "right" ? "left" : "right"));
        }}
      >
        <HuTaoPet facing={facing} />
      </div>
    </div>
  );
}
