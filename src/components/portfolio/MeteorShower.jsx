
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
        const scrollRoot = canvas.closest(".portfolio-scroll");
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

        const randomCometAngle = () => {
            const r = Math.random();

            // 25% shallow: passes through without impact
            if (r < 0.25) {
                return rand(Math.PI * 0.95, Math.PI * 0.99);
            }

            // 30% moderate
            if (r < 0.55) {
                return rand(Math.PI * 0.80, Math.PI * 0.94);
            }

            // 45% steep: more likely to hit the bottom
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
            x: isComet ? width + rand(5, 35) : initial ? rand(0, width) : width + rand(30, 130),
            y: isComet ? rand(height * 0.08, height * 0.45) : rand(-60, height * 0.75),
            speed: isComet ? rand(210, 260) : rand(130, 320),
            length: isComet ? rand(300, 420) : rand(45, 130),
            size: isComet ? rand(2.0, 2.7) : rand(0.8, 1.7),
            alpha: isComet ? rand(0.7, 0.8) : Math.random() < 0.15 ? rand(0.30, 0.45) : rand(0.15, 0.25),
            angle: isComet ? randomCometAngle() : randomAngle(),
            cometVariant: isComet ? pickCometVariant() : null,
            delay: isComet ? initial ? rand(0.5, 1.5) : rand(8, 15) : rand(0, 2),
        });


        // One dedicated comet slot.
        const meteors = Array.from({ length: 32 }, (_, index) => makeMeteor(true, index === 0),);
        const resetMeteor = (meteor) => { Object.assign(meteor, makeMeteor(false, meteor.isComet),); };
        const impacts = [];
        const createImpact = (x, y, variant) => {
            const colors = variant === "gold" ? ["#fff5d2", "#ffe084", "#ffbe57", "#f08b38"] : ["#c2f7ff", "#65d9ff", "#719dff", "#b68af5"];
            const fragmentShapes = ["triangle", "square", "diamond", "pentagon", "shard",];
            const particles = Array.from({ length: 80 }, (_, i) => {
                const fragment = i >= 60;
                const angle = rand(-Math.PI + 0.12, -0.12);
                const speed = fragment ? rand(95, 235) : rand(38, 140);
                const shape = fragment ? fragmentShapes[Math.floor(Math.random() * fragmentShapes.length)] : "dust";
                return {
                    x: x + rand(-3, 3),
                    y: y - rand(2, 6),
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    // Independent sizes.
                    size: fragment ? rand(2.2, 6.5) : rand(1.1, 2.8),
                    shape,
                    rotation: rand(0, TAU),
                    spin: rand(-7, 7),
                    age: 0,
                    life: fragment ? rand(0.8, 1.6) : rand(0.9, 1.8),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    fragment,
                };
            });
            impacts.push({ x, y, age: 0, particles });
        };

        const drawImpacts = (dt, viewportBottomY) => {
            if (impacts.length === 0) return;
            ctx.save();

            // Keep impact rendering above the visible bottom edge.
            ctx.beginPath();
            ctx.rect(0, 0, width, Math.max(0, viewportBottomY));
            ctx.clip();

            ctx.globalCompositeOperation = "screen";

            for (let i = impacts.length - 1; i >= 0; i--) {
                const impact = impacts[i];
                impact.age += dt;

                // A short horizontal impact wave.
                if (impact.age < 0.5) {
                    const t = impact.age / 0.5;
                    ctx.beginPath();
                    ctx.ellipse(impact.x, impact.y - 1, 8 + t * 55, 2 + t * 8, 0, Math.PI, TAU,);
                    ctx.strokeStyle = `rgba(170,205,255,${0.38 * (1 - t)})`;
                    ctx.lineWidth = 1.4;
                    ctx.stroke();
                }

                for (const p of impact.particles) {
                    p.age += dt;
                    if (p.age >= p.life) continue;
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.vy += (p.fragment ? 170 : 90) * dt;
                    p.rotation += p.spin * dt;
                    const fade = Math.pow(1 - p.age / p.life, 1.5);
                    ctx.globalAlpha = fade * (p.fragment ? 0.85 : 0.65);
                    ctx.fillStyle = p.color;
                    if (p.fragment) {
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        const s = p.size;
                        ctx.beginPath();
                        switch (p.shape) {
                            case "triangle":
                                ctx.moveTo(0, -s * 1.5);
                                ctx.lineTo(s, s);
                                ctx.lineTo(-s, s);
                                break;

                            case "square":
                                ctx.rect(
                                    -s * 0.8,
                                    -s * 0.8,
                                    s * 1.6,
                                    s * 1.6,
                                );
                                break;

                            case "diamond":
                                ctx.moveTo(0, -s * 1.5);
                                ctx.lineTo(s * 0.8, 0);
                                ctx.lineTo(0, s * 1.5);
                                ctx.lineTo(-s * 0.8, 0);
                                break;

                            case "pentagon":
                                for (let i = 0; i < 5; i++) {
                                    const a = (i / 5) * TAU - Math.PI / 2;
                                    const px = Math.cos(a) * s;
                                    const py = Math.sin(a) * s;

                                    if (i === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                break;

                            case "shard":
                                ctx.moveTo(-s * 0.3, -s * 1.5);
                                ctx.lineTo(s * 0.8, -s * 0.4);
                                ctx.lineTo(s * 0.35, s * 1.2);
                                ctx.lineTo(-s * 0.9, s * 0.6);
                                ctx.lineTo(-s * 0.5, -s * 0.3);
                                break;
                        }
                        ctx.closePath();
                        ctx.fill();
                        // Subtle reflective edge.
                        ctx.strokeStyle = "rgba(255,255,255,0.3)";
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                        ctx.restore();
                    } else {
                        // Dust particles remain round.
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, TAU);
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = 1;
                if (impact.age > 1.85) {
                    impacts.splice(i, 1);
                }
            }
            ctx.restore();
        };

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
            const canvasRect = canvas.getBoundingClientRect();
            const scrollRect = scrollRoot?.getBoundingClientRect();
            const viewportBottom = Math.min(scrollRect?.bottom ?? window.innerHeight, window.innerHeight,);
            const viewportTop = Math.max(scrollRect?.top ?? 0, 0);
            const impactY = viewportBottom - canvasRect.top;
            const canImpact = canvasRect.top < viewportBottom && canvasRect.bottom > viewportTop && canvasRect.bottom >= viewportBottom && impactY > 0 && impactY <= height;
            for (const meteor of meteors) {
                if (meteor.delay > 0) {
                    meteor.delay -= dt;
                    continue;
                }

                const previousX = meteor.x;
                const previousY = meteor.y;

                meteor.x += Math.cos(meteor.angle) * meteor.speed * dt;
                meteor.y += Math.sin(meteor.angle) * meteor.speed * dt;

                // Comets only: check whether the head crosses the bottom.
                if (meteor.isComet && canImpact) {
                    const crossedBottom = previousY < impactY && meteor.y >= impactY;
                    const alreadyBelow = previousY >= impactY;

                    if (crossedBottom) {
                        const t = (impactY - previousY) / (meteor.y - previousY);
                        const hitX = previousX + (meteor.x - previousX) * t;
                        if (hitX >= 0 && hitX <= width) {
                            createImpact(hitX, impactY, meteor.cometVariant);
                        }

                        // Reset even if it crossed outside the screen.
                        resetMeteor(meteor);
                        continue;
                    }
                    // Recover comets that crossed while collision
                    // detection was temporarily unavailable.
                    if (alreadyBelow) {
                        resetMeteor(meteor);
                        continue;
                    }
                }

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
            drawImpacts(dt, canImpact ? impactY : 0);
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
