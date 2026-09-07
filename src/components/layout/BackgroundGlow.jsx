import { useEffect, useMemo, useRef } from "react";

const spots = [
  { x: "5%", y: "8%", size: "34rem", color: "rgba(112,150,200,0.28)", drift: "14s", life: "8s", delay: "0s" },
  { x: "68%", y: "12%", size: "38rem", color: "rgba(154,140,194,0.25)", drift: "17s", life: "10s", delay: "-3s" },
  { x: "28%", y: "55%", size: "30rem", color: "rgba(127,166,146,0.22)", drift: "13s", life: "9s", delay: "-5s" },
  { x: "72%", y: "62%", size: "32rem", color: "rgba(112,150,200,0.20)", drift: "18s", life: "11s", delay: "-7s" },
  { x: "45%", y: "25%", size: "26rem", color: "rgba(154,140,194,0.18)", drift: "12s", life: "7s", delay: "-2s" },
];

export default function BackgroundGlow() {
  const glowRef = useRef(null);

  const stars = useMemo(
    () =>
        Array.from({ length: 45 }, (_, i) => ({
        id: i,
        left: `${(i * 37.7) % 100}%`,
        top: `${(i * 61.3) % 100}%`,
        size: `${1 + (i % 3) * 0.45}px`,
        delay: `${-(i % 11) * 0.7}s`,
        duration: `${4 + (i % 7)}s`,
        opacity: 0.12 + (i % 5) * 0.04,
        color:
            i % 11 === 0
            ? "rgba(112,150,200,0.9)"
            : i % 17 === 0
                ? "rgba(154,140,194,0.9)"
                : i % 23 === 0
                ? "rgba(127,166,146,0.9)"
                : "rgba(220,230,245,0.8)",
        })),
    [],
    );

  useEffect(() => {
    let timeout;
    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const speed = Math.min(Math.abs(y - lastY) / 30, 1);
      lastY = y;

      if (glowRef.current) {
        glowRef.current.style.filter = `brightness(${1.1 + speed * 0.55})`;
        glowRef.current.style.transform = `translate3d(0, ${Math.min(y * 0.012, 36)}px, 0)`;
      }

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (glowRef.current) glowRef.current.style.filter = "brightness(1.1)";
      }, 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="ambient-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              backgroundColor: star.color,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div ref={glowRef} className="absolute inset-0 transition-[filter,transform] duration-700 ease-out">
        {spots.map((spot, index) => (
          <div
            key={index}
            className="lightspot"
            style={{
              left: spot.x,
              top: spot.y,
              width: spot.size,
              height: spot.size,
              background: `radial-gradient(circle, ${spot.color} 0%, transparent 68%)`,
              "--drift-duration": spot.drift,
              "--life-duration": spot.life,
              "--delay": spot.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}