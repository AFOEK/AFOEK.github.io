
import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp01 = (x) => Math.max(0, Math.min(1, x));

export default function MeteorShower() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let frame = 0;
        let last = performance.now();

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = rect.width;
            height = rect.height;

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const randomAngle = () => {
            const r = Math.random();

            // 25%: shallow trajectory (2–9° downward)
            if (r < 0.25) {
                return rand(Math.PI * 0.95, Math.PI * 0.99);
            }

            // 45%: moderate diagonal (11–36°)
            if (r < 0.70) {
                return rand(Math.PI * 0.80, Math.PI * 0.94);
            }

            // 30%: steep diagonal (38–67°)
            return rand(Math.PI * 0.63, Math.PI * 0.79);
        };

        const pickCometVariant = () => {
            // Rare golden comet: 18%
            return Math.random() < 0.18 ? "gold" : "aurora";
        };

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        resize();

        const makeMeteor = (initial = false, isComet = false) => ({
            isComet,
            x: initial && !isComet ? rand(0, width) : width + rand(30, 130),
            y: isComet ? rand(height * 0.08, height * 0.45) : rand(-60, height * 0.75),
            speed: isComet ? rand(210, 260) : rand(130, 320),
            length: isComet ? rand(300, 420) : rand(45, 130),
            size: isComet ? rand(2.0, 2.7) : rand(0.8, 1.7),
            alpha: isComet ? rand(0.7, 0.8) : Math.random() < 0.15 ? rand(0.30, 0.45) : rand(0.15, 0.25),
            angle: randomAngle(),
            cometVariant: isComet ? pickCometVariant() : null,
            delay: isComet ? initial ? rand(0.5, 1.5) : rand(8, 15) : rand(0, 2),
        });


        // One dedicated comet slot.
        const meteors = Array.from({ length: 32 }, (_, index) => makeMeteor(true, index === 0),);
        const resetMeteor = (meteor) => { Object.assign(meteor, makeMeteor(false, meteor.isComet),); };
        const drawMeteor = (meteor, alpha = meteor.alpha) => {
            const dx = Math.cos(meteor.angle) * meteor.length;
            const dy = Math.sin(meteor.angle) * meteor.length;
            const gradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - dx, meteor.y - dy,);
            gradient.addColorStop(0, `rgba(220,235,255,${alpha})`,);
            gradient.addColorStop(0.3, `rgba(145,185,245,${alpha * 0.8})`,);
            gradient.addColorStop(1, "rgba(120,165,225,0)",);
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x - dx, meteor.y - dy);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = meteor.size;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, meteor.size, 0, TAU,);

            ctx.fillStyle = `rgba(235,245,255,${Math.min(1, alpha * 1.2)})`;
            ctx.fill();
        };

        const drawComet = (comet, time, visibility) => {
            if (visibility <= 0) return;

            const ux = Math.cos(comet.angle);
            const uy = Math.sin(comet.angle);

            const tailX = comet.x - ux * comet.length;
            const tailY = comet.y - uy * comet.length;
            const palette = comet.cometVariant === "gold"
                ? {
                    headHue: 48,
                    midHue: 38,
                    tailHue: 24,
                    glow: "rgba(255,190,90,0.35)",
                    coreStart: "rgba(255,250,235,0.98)",
                    coreMid: "rgba(255,220,110,0.75)",
                    coreEnd: "rgba(255,170,70,0)",
                } : {
                    headHue: 188,
                    midHue: 255,
                    tailHue: 310,
                    glow: "rgba(145,125,255,0.35)",
                    coreStart: "rgba(245,255,255,0.95)",
                    coreMid: "rgba(120,230,255,0.65)",
                    coreEnd: "rgba(120,190,255,0)",
                };

            // Slowly shifting RGB gradient.
            const hueShift = Math.sin(time * 0.001) * 12;
            const makeGradient = (opacity = 1) => {
                const gradient = ctx.createLinearGradient(comet.x, comet.y, tailX, tailY,);
                if (comet.cometVariant === "gold") {
                    gradient.addColorStop(0, `hsla(${palette.headHue + hueShift * 0.2},100%,92%,${opacity})`,);
                    gradient.addColorStop(0.22, `hsla(${palette.headHue + hueShift * 0.2},100%,72%,${opacity * 0.96})`,);
                    gradient.addColorStop(0.48, `hsla(${palette.midHue + hueShift * 0.15},100%,62%,${opacity * 0.82})`,);
                    gradient.addColorStop(0.73, `hsla(${palette.tailHue + hueShift * 0.1},100%,58%,${opacity * 0.58})`,);
                    gradient.addColorStop(1, `hsla(${palette.tailHue},100%,55%,0)`,);
                } else {
                    gradient.addColorStop(0, `hsla(${palette.headHue + hueShift},100%,85%,${opacity})`,);
                    gradient.addColorStop(0.22, `hsla(${210 + hueShift},100%,70%,${opacity * 0.95})`,);
                    gradient.addColorStop(0.48, `hsla(${palette.midHue + hueShift},95%,72%,${opacity * 0.8})`,);
                    gradient.addColorStop(0.73, `hsla(${palette.tailHue + hueShift},100%,70%,${opacity * 0.55})`,);
                    gradient.addColorStop(1, `hsla(${330 + hueShift},100%,65%,0)`,);
                }
                return gradient;
            };

            ctx.save();
            ctx.globalAlpha = visibility * comet.alpha;
            ctx.globalCompositeOperation = "screen";
            ctx.lineCap = "round";

            // Layer 1: soft outer RGB glow.
            ctx.beginPath();
            ctx.moveTo(comet.x, comet.y);
            ctx.lineTo(tailX, tailY);

            ctx.strokeStyle = makeGradient(0.22);
            ctx.lineWidth = 9;
            ctx.shadowBlur = 10;
            ctx.shadowColor = palette.glow;
            ctx.stroke();

            // Layer 2: narrow colorful main tail.
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.moveTo(comet.x, comet.y);
            ctx.lineTo(tailX, tailY);

            ctx.strokeStyle = makeGradient(0.9);
            ctx.lineWidth = 3;
            ctx.stroke();

            // Layer 3: short bright center near the head.
            const coreLength = comet.length * 0.28;

            const coreGradient = ctx.createLinearGradient(
                comet.x,
                comet.y,
                comet.x - ux * coreLength,
                comet.y - uy * coreLength,
            );

            coreGradient.addColorStop(0, palette.coreStart);
            coreGradient.addColorStop(0.45, palette.coreMid);
            coreGradient.addColorStop(1, palette.coreEnd);

            ctx.beginPath();
            ctx.moveTo(comet.x, comet.y);
            ctx.lineTo(comet.x - ux * coreLength, comet.y - uy * coreLength,);

            ctx.strokeStyle = coreGradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Compact radial glow around the comet head.
            const glow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 10,);
            if (comet.cometVariant === "gold") {
                glow.addColorStop(0, "rgba(255,250,235,0.98)");
                glow.addColorStop(0.3, "rgba(255,215,95,0.70)");
                glow.addColorStop(1, "rgba(255,155,55,0)");
            } else {
                glow.addColorStop(0, "rgba(240,255,255,0.95)");
                glow.addColorStop(0.3, "rgba(90,215,255,0.65)");
                glow.addColorStop(1, "rgba(70,120,255,0)");
            }

            ctx.beginPath();
            ctx.arc(comet.x, comet.y, 10, 0, TAU);
            ctx.fillStyle = glow;
            ctx.fill();

            // Small white-cyan comet head.
            ctx.beginPath();
            ctx.arc(comet.x, comet.y, 2.2, 0, TAU);
            ctx.fillStyle = comet.cometVariant === "gold" ? "rgba(255,248,235,0.98)" : "rgba(240,255,255,0.95)";
            ctx.fill();

            ctx.restore();
        };


        const render = (time) => {
            const dt = Math.min((time - last) / 1000, 0.05);
            last = time;

            ctx.clearRect(0, 0, width, height);

            for (const meteor of meteors) {
                if (meteor.delay > 0) {
                    meteor.delay -= dt;
                    continue;
                }

                meteor.x += Math.cos(meteor.angle) * meteor.speed * dt;
                meteor.y += Math.sin(meteor.angle) * meteor.speed * dt;
                if (meteor.isComet) {
                    // Starts changing after crossing 85% of viewport width.
                    // Fully transforms by 70%.
                    const morph = clamp01((width * 0.92 - meteor.x) / Math.max(width * 0.18, 130),);

                    // Normal meteor fades away as RGB comet emerges.
                    if (morph < 1) {
                        ctx.save();
                        ctx.globalAlpha = 1 - morph;
                        drawMeteor(meteor, 0.2);
                        ctx.restore();
                    }
                    drawComet(meteor, time, morph);
                } else {
                    drawMeteor(meteor);
                }

                if (meteor.x < -meteor.length - 120 || meteor.y > height + 150
                ) {
                    resetMeteor(meteor);
                }
            }

            frame = requestAnimationFrame(render);
        };

        frame = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
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
