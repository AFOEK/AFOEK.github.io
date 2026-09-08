import { useEffect, useRef, useState } from "react";

const NEON = "#69FF8F";

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

function generatePath() {
  const side = pick(["left", "right", "top", "bottom"]);

  // Keep routes outside the central text area.
  if (side === "left") {
    const y1 = pick([rand(35, 130), rand(390, 470)]);
    const x1 = rand(70, 180);
    const x2 = rand(190, 265);
    const y2 = Math.max(25, Math.min(475, y1 + rand(-80, 80)));

    return `M 0 ${y1} H ${x1} V ${y2} H ${x2}`;
  }

  if (side === "right") {
    const y1 = pick([rand(35, 130), rand(390, 470)]);
    const x1 = rand(820, 930);
    const x2 = rand(735, 810);
    const y2 = Math.max(25, Math.min(475, y1 + rand(-80, 80)));

    return `M 1000 ${y1} H ${x1} V ${y2} H ${x2}`;
  }

  if (side === "top") {
    const x1 = rand(80, 920);
    const y1 = rand(45, 90);
    const x2 = Math.max(40, Math.min(960, x1 + rand(-100, 100)));
    const y2 = rand(115, 145);

    return `M ${x1} 0 V ${y1} H ${x2} V ${y2}`;
  }

  const x1 = rand(80, 920);
  const y1 = rand(410, 455);
  const x2 = Math.max(40, Math.min(960, x1 + rand(-100, 100)));
  const y2 = rand(365, 395);

  return `M ${x1} 500 V ${y1} H ${x2} V ${y2}`;
}

function CircuitPulse({ pulse, onPulseClick }) {
  const motionRef = useRef(null);
  const pulseFadeRef = useRef(null);
  const pathFadeRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      motionRef.current?.beginElement();
      pulseFadeRef.current?.beginElement();
      pathFadeRef.current?.beginElement();
    });
  }, []);

  return (
    <g>
      <path
        d={pulse.path}
        fill="none"
        stroke={NEON}
        strokeWidth="1.5"
        strokeDasharray="1.5 5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        opacity="0"
      >
        <animate
          ref={pathFadeRef}
          attributeName="opacity"
          values="0;0.16;0.13;0"
          keyTimes="0;0.12;0.78;1"
          begin="indefinite"
          dur={`${pulse.duration}s`}
          fill="remove"
        />
      </path>

      <g opacity="0" filter="url(#contact-circuit-glow)" style={{ pointerEvents: "all", cursor: "crosshair" }} onPointerDown={(event) => {
        event.stopPropagation();
        onPulseClick?.();
      }}>
        <animate
          ref={pulseFadeRef}
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.04;0.86;1"
          begin="indefinite"
          dur={`${pulse.duration}s`}
          fill="remove"
        />

        <animateMotion
          ref={motionRef}
          path={pulse.path}
          begin="indefinite"
          dur={`${pulse.duration}s`}
          calcMode="linear"
          fill="remove"
        />

        <rect
          x="-10"
          y="-10"
          width="20"
          height="20"
          fill="transparent"
          pointerEvents="all"
        />

        <rect
          x={-pulse.size / 2}
          y={-pulse.size / 2}
          width={pulse.size}
          height={pulse.size}
          rx="0.8"
          fill={NEON}
        />

        <rect
          x={-pulse.size}
          y={-pulse.size}
          width={pulse.size * 2}
          height={pulse.size * 2}
          rx="1.5"
          fill={NEON}
          opacity="0.15"
        />
      </g>
    </g>
  );
}

export default function ContactCircuit({ onPulseClick }) {
  const [pulses, setPulses] = useState([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => {
    let mounted = true;
    let spawnTimer;

    const spawn = () => {
      if (!mounted) return;

      const id = nextIdRef.current++;
      const duration = rand(1.25, 2.25);

      const pulse = {
        id,
        path: generatePath(),
        duration,
        size: rand(5, 7),
      };

      setPulses((current) => [...current, pulse]);

      const removeTimer = window.setTimeout(() => {
        setPulses((current) => current.filter((item) => item.id !== id));
      }, duration * 1000 + 50);

      timersRef.current.push(removeTimer);

      spawnTimer = window.setTimeout(spawn, rand(90, 350));
    };

    spawn();

    return () => {
      mounted = false;
      clearTimeout(spawnTimer);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="contact-circuit-glow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <mask id="contact-safe-zone" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1000" height="500" fill="white" />

          <rect
            x="270"
            y="145"
            width="470"
            height="235"
            rx="28"
            fill="black"
          />
        </mask>
      </defs>

      <g mask="url(#contact-safe-zone)">
        {pulses.map((pulse) => (
          <CircuitPulse key={pulse.id} pulse={pulse} onPulseClick={onPulseClick} />
        ))}
      </g>
    </svg>
  );
}