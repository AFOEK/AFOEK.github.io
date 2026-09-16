import { useEffect, useRef } from "react";
import { ORBITALS } from "@/data/orbitals";

const TAU = Math.PI * 2;

const CARBONS = [
    {
        x: 0.10,
        y: 0.56,
        nucleusScale: 2.5,
        cloudScale: 4.6,
        opacity: 0.55,
        samples: 1200,
        primary: true,
    },
    {
        x: 0.80,
        y: 0.18,
        nucleusScale: 0.6,
        cloudScale: 1.35,
        opacity: 0.25,
        samples: 240,
    },
    {
        x: 0.76,
        y: 0.74,
        nucleusScale: 0.72,
        cloudScale: 1.55,
        opacity: 0.24,
        samples: 200,
    },
    {
        x: 0.48,
        y: 0.16,
        nucleusScale: 0.55,
        cloudScale: 1.25,
        opacity: 0.20,
        samples: 210,
    },
    {
        x: 0.68,
        y: 0.84,
        nucleusScale: 0.48,
        cloudScale: 1.05,
        opacity: 0.17,
        samples: 180,
    },
];

const rand = (min, max) => Math.random() * (max - min) + min;
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
};
const NUCLEONS = [
    [-8, -7, true],
    [2, -10, false],
    [10, -5, true],
    [-12, 2, false],
    [-3, 0, true],
    [7, 1, false],
    [14, 5, true],
    [-8, 9, true],
    [2, 10, false],
    [10, 12, false],
    [-1, 17, true],
    [-14, 14, false],
];

const EXPLODE_END = 1300;
const EMPTY_END = 1700;
const NUCLEUS_REBUILD_END = 3100;
const ELECTRON_RETURN_END = 5600;
const ANIMATION_END = 6100;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOutCubic = (x) => {
    x = clamp01(x);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
};

function gaussian() {
    const u = Math.max(Math.random(), 1e-9);
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

function sample1s() {
    const angle = rand(0, TAU);
    const radius = Math.abs(gaussian()) * 25;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function sample2s() {
    const angle = rand(0, TAU);
    const outer = Math.random() > 0.32;
    const radius = outer ? 42 + Math.abs(gaussian()) * 18 : Math.abs(gaussian()) * 13;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function sample2p(rotation = 0) {
    const sign = Math.random() > 0.5 ? 1 : -1;
    const longitudinal = sign * (28 + Math.abs(gaussian()) * 25);
    const transverse = gaussian() * 11;

    const x = longitudinal * Math.cos(rotation) - transverse * Math.sin(rotation);
    const y = longitudinal * Math.sin(rotation) + transverse * Math.cos(rotation);

    return { x, y };
}

function sampleOrbital(type) {
    if (type === "1s") return sample1s();
    if (type === "2s") return sample2s();
    if (type === "2px") return sample2p(0);
    if (type === "2py") return sample2p(Math.PI / 2);
    return sample2p(Math.PI / 4);
}

function makeElectron(index) {
    return {
        seed: Math.random() * 1000,
        phase: Math.random() * TAU,
        speed: rand(1.8, 5.5),
        radius: rand(18, 72),
        eccentricity: rand(0.35, 1),
        size: Math.random() < 0.04 ? rand(1.2, 1.8) : rand(0.3, 0.9),
        alpha: rand(0.12, 0.58),
        shell: index % 6,
    };
}

function makeDensity(type, count) {
    return Array.from({ length: count }, () => sampleOrbital(type));
}

export default function Carbon12Field({ activePublication = null }) {
    const canvasRef = useRef(null);
    const activeRef = useRef(activePublication);
    const stateRef = useRef({
        electrons: Array.from({ length: 2200 }, (_, i) => makeElectron(i)),
        animations: {},
        densityFrom: [],
        densityTo: [],
        orbital: null,
        transition: 0,
        orbitalTransition: 1,
    });

    useEffect(() => {
        activeRef.current = activePublication;
        if (activePublication === null) return;
        const state = stateRef.current;
        const orbital = ORBITALS[activePublication % ORBITALS.length];
        const nextDensity = makeDensity(orbital.key, state.electrons.length,);

        if (state.densityTo.length === 0) {
            state.densityFrom = nextDensity;
            state.densityTo = nextDensity;
            state.orbitalTransition = 1;
        } else {
            const currentT = smoothstep(state.orbitalTransition);
            state.densityFrom = state.densityTo.map((point, i) => {
                const previous = state.densityFrom[i] ?? point;

                return {
                    x: lerp(previous.x, point.x, currentT),
                    y: lerp(previous.y, point.y, currentT),
                };
            });

            state.densityTo = nextDensity;
            state.orbitalTransition = 0;
        }

        state.orbital = orbital.key;
    }, [activePublication]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        let frame = 0;
        let last = performance.now();

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = rect.width;
            height = rect.height;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        resize();

        const drawNucleon = (
            px,
            py,
            radius,
            proton,
            opacity,
        ) => {
            if (opacity <= 0) return;

            const gradient = ctx.createRadialGradient(
                px - radius * 0.3,
                py - radius * 0.3,
                0,
                px,
                py,
                radius,
            );

            if (proton) {
                gradient.addColorStop(
                    0,
                    `rgba(154,140,194,${Math.min(1, opacity * 1.8)})`,
                );

                gradient.addColorStop(
                    1,
                    `rgba(96,79,136,${Math.min(1, opacity)})`,
                );
            } else {
                gradient.addColorStop(
                    0,
                    `rgba(112,150,200,${Math.min(1, opacity * 1.7)})`,
                );

                gradient.addColorStop(
                    1,
                    `rgba(52,92,145,${Math.min(1, opacity)})`,
                );
            }

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, TAU);
            ctx.fillStyle = gradient;
            ctx.fill();
        };

        const drawNucleus = (
            cx,
            cy,
            scale,
            opacity,
            time,
            animation = null,
            elapsed = 0,
        ) => {
            NUCLEONS.forEach(([x, y, proton], i) => {
                const vibrationX = Math.sin(time * 0.002 + i * 2.7) * 0.8;
                const vibrationY = Math.cos(time * 0.0023 + i * 1.9) * 0.8;
                const baseX = cx + (x + vibrationX) * scale;
                const baseY = cy + (y + vibrationY) * scale;

                let px = baseX;
                let py = baseY;
                let particleOpacity = opacity;

                if (animation) {
                    const particle = animation.nucleons[i];

                    if (elapsed < EXPLODE_END) {
                        const t = easeOutCubic(elapsed / EXPLODE_END,);
                        px = baseX + particle.dx * t;
                        py = baseY + particle.dy * t;
                        particleOpacity = opacity * (1 - t * 0.75);
                    }

                    else if (elapsed < EMPTY_END) {
                        particleOpacity = 0;
                    }

                    else if (
                        elapsed < NUCLEUS_REBUILD_END
                    ) {
                        const localStart = EMPTY_END + particle.delay;
                        const available = NUCLEUS_REBUILD_END - localStart;
                        const t = easeInOutCubic((elapsed - localStart) / Math.max(1, available),);
                        px = lerp(particle.returnX, baseX, t,);
                        py = lerp(particle.returnY, baseY, t,);
                        particleOpacity = opacity * t;
                    }
                }

                drawNucleon(px, py, 5.2 * scale, proton, particleOpacity,);
            });
        };

        const randomOutsidePoint = (margin = 100) => {
            const side = Math.floor(Math.random() * 4);

            if (side === 0) {
                return {
                    x: rand(-margin, width + margin),
                    y: -margin,
                };
            }

            if (side === 1) {
                return {
                    x: width + margin,
                    y: rand(-margin, height + margin),
                };
            }

            if (side === 2) {
                return {
                    x: rand(-margin, width + margin),
                    y: height + margin,
                };
            }

            return {
                x: -margin,
                y: rand(-margin, height + margin),
            };
        };

        const triggerDisintegration = (carbonIndex) => {
            const state = stateRef.current;
            if (state.animations[carbonIndex]) return;
            const carbon = CARBONS[carbonIndex];
            const cloudCount = Math.min(
                carbon.samples ?? 120,
                state.electrons.length,
            );

            const travelDistance = Math.max(width, height);
            const electrons = Array.from({ length: cloudCount }, () => {
                const angle = rand(0, TAU);
                const distance = rand(
                    travelDistance * 0.45,
                    travelDistance * 1.15,
                );

                const returnPoint = randomOutsidePoint(rand(80, 220));
                return {
                    dx: Math.cos(angle) * distance,
                    dy: Math.sin(angle) * distance,
                    returnX: returnPoint.x,
                    returnY: returnPoint.y,
                    returnDelay: rand(0, 650),
                    returnDuration: rand(1300, 1900),
                };
            });

            const nucleons = NUCLEONS.map(() => {
                const angle = rand(0, TAU);
                const distance = rand(
                    travelDistance * 0.35,
                    travelDistance * 0.85,
                );

                const returnPoint = randomOutsidePoint(rand(100, 260));
                return {
                    dx: Math.cos(angle) * distance,
                    dy: Math.sin(angle) * distance,
                    returnX: returnPoint.x,
                    returnY: returnPoint.y,
                    delay: rand(0, 180),
                };
            });

            state.animations[carbonIndex] = {
                startTime: performance.now(),
                electrons,
                nucleons,
            };
        };

        const drawElectron = (x, y, size, alpha) => {
            ctx.shadowBlur = 6;
            ctx.shadowColor = "rgba(170, 205, 255, 0.18)";
            ctx.beginPath();
            ctx.arc(x, y, size, 0, TAU);
            ctx.fillStyle = `rgba(210,230,255,${alpha})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
        };

        const handlePointerDown = (event) => {
            const target = event.target;

            if (
                target instanceof Element &&
                target.closest("a, button")
            ) {
                return;
            }

            const rect = canvas.getBoundingClientRect();

            const pointerX = event.clientX - rect.left;
            const pointerY = event.clientY - rect.top;

            if (
                pointerX < 0 ||
                pointerY < 0 ||
                pointerX > rect.width ||
                pointerY > rect.height
            ) {
                return;
            }

            for (let i = 0; i < CARBONS.length; i++) {
                const carbon = CARBONS[i];

                const cx = width * carbon.x;
                const cy = height * carbon.y;

                const dx = pointerX - cx;
                const dy = pointerY - cy;

                const distance = Math.sqrt(dx * dx + dy * dy);

                const hitRadius =
                    24 * carbon.nucleusScale + 12;

                if (distance <= hitRadius) {
                    triggerDisintegration(i);
                    break;
                }
            }
        };

        window.addEventListener(
            "pointerdown",
            handlePointerDown,
        );

        const render = (time) => {
            const dt = Math.min((time - last) / 1000, 0.05);
            last = time;
            ctx.clearRect(0, 0, width, height);
            const state = stateRef.current;
            const frozen = activeRef.current !== null;
            const target = frozen ? 1 : 0;
            state.transition += (target - state.transition) * Math.min(dt * 2.5, 1);

            if (state.orbitalTransition < 1) {
                state.orbitalTransition = Math.min(
                    state.orbitalTransition + dt / 1.4,
                    1,
                );
            }

            CARBONS.forEach((carbon, carbonIndex) => {
                const cx = width * carbon.x;
                const cy = height * carbon.y;

                const nucleusScale = carbon.nucleusScale;
                const cloudScale = carbon.cloudScale;
                const baseOpacity = carbon.opacity;

                const isPrimary = carbon.primary === true;

                const cloudCount = Math.min(
                    carbon.samples ?? 120,
                    state.electrons.length,
                );

                for (let i = 0; i < cloudCount; i++) {
                    const electron = state.electrons[i % state.electrons.length];
                    const wobble = Math.sin(time * 0.001 * electron.speed + electron.seed,) * 8;
                    const angle = electron.phase + time * 0.0015 * electron.speed + carbonIndex * 0.7;
                    const radius = electron.radius + wobble;
                    const noiseX = Math.sin(time * 0.008 + electron.seed * 7.1) * 7 + Math.sin(time * 0.013 + electron.seed * 2.3) * 3;
                    const noiseY = Math.cos(time * 0.009 + electron.seed * 5.7) * 7 + Math.cos(time * 0.015 + electron.seed * 3.9) * 3;
                    const movingX = Math.cos(angle) * radius * electron.eccentricity * cloudScale + noiseX * cloudScale;
                    const movingY = Math.sin(angle * 1.13) * radius * cloudScale + noiseY * cloudScale;

                    let targetX = movingX;
                    let targetY = movingY;

                    if (
                        frozen &&
                        state.densityFrom.length &&
                        state.densityTo.length
                    ) {
                        const from = state.densityFrom[i % state.densityFrom.length];
                        const to = state.densityTo[i % state.densityTo.length];
                        const orbitalT = smoothstep(state.orbitalTransition);
                        targetX =lerp(from.x, to.x, orbitalT) * cloudScale;
                        targetY =lerp(from.y, to.y, orbitalT) * cloudScale;
                        if (!isPrimary) {
                            targetX *= 0.65;
                            targetY *= 0.65;
                        }
                    }

                    let x = cx + movingX * (1 - state.transition) + targetX * state.transition;
                    let y = cy + movingY * (1 - state.transition) + targetY * state.transition;
                    let alpha = electron.alpha * baseOpacity * (isPrimary ? 1.25 : 0.8);
                    const animation = state.animations[carbonIndex];
                    if (animation) {
                        const elapsed = time - animation.startTime;
                        const particle = animation.electrons[i % animation.electrons.length];

                        if (elapsed < EXPLODE_END) {
                            const t = easeOutCubic(elapsed / EXPLODE_END,);
                            x += particle.dx * t;
                            y += particle.dy * t;
                            alpha *= 1 - t * 0.8;
                        }

                        else if (
                            elapsed < NUCLEUS_REBUILD_END
                        ) {
                            alpha = 0;
                        }

                        else if (
                            elapsed < ELECTRON_RETURN_END
                        ) {
                            const start = NUCLEUS_REBUILD_END + particle.returnDelay;
                            const t = easeInOutCubic((elapsed - start) / particle.returnDuration,);
                            x = lerp(particle.returnX, x, t,);
                            y = lerp(particle.returnY, y, t,);
                            alpha *= t;
                        }
                    }
                    const electronScale = Math.max(0.6, Math.min(1.5, cloudScale * 0.35),);
                    drawElectron(x, y, electron.size * electronScale, alpha,);
                }
                let atomAnimation = state.animations[carbonIndex];
                if (atomAnimation) {
                    const elapsed = time - atomAnimation.startTime;
                    if (elapsed >= ANIMATION_END) {
                        delete state.animations[carbonIndex];
                        atomAnimation = null;
                    }
                }
                drawNucleus(cx, cy, nucleusScale, baseOpacity, time, atomAnimation, atomAnimation ? time - atomAnimation.startTime : 0,);
            });
            frame = requestAnimationFrame(render);
        };

        frame = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("pointerdown", handlePointerDown,);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        />
    );
}