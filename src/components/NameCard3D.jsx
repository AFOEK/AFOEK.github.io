import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox, useTexture } from "@react-three/drei";
import { AdditiveBlending, DoubleSide, MathUtils, SRGBColorSpace } from "three";
import { X, RotateCcw } from "lucide-react";

function CardAura() {
    const auraRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!auraRef.current) return;

        auraRef.current.rotation.z = Math.sin(t * 0.35) * 0.08;
        auraRef.current.position.y = Math.sin(t * 0.8) * 0.015;
    });

    return (
        <group ref={auraRef}>
            <mesh position={[0, 0, -0.11]} scale={[2.3, 1.3, 1]}>
                <circleGeometry args={[1, 64]} />
                <meshBasicMaterial
                    color="#79dcff"
                    transparent
                    opacity={0.05}
                    blending={AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh
                position={[0.05, 0.02, -0.105]}
                rotation={[0, 0, 0.15]}
                scale={[2.15, 1.22, 1]}
            >
                <circleGeometry args={[1, 64]} />
                <meshBasicMaterial
                    color="#c68cff"
                    transparent
                    opacity={0.04}
                    blending={AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh
                position={[-0.04, -0.025, -0.1]}
                rotation={[0, 0, -0.12]}
                scale={[1.95, 1.12, 1]}
            >
                <circleGeometry args={[1, 64]} />
                <meshBasicMaterial
                    color="#ffb676"
                    transparent
                    opacity={0.03}
                    blending={AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

function CardModel({ flipped }) {
    const group = useRef();

    const front = useTexture("/namecard/front.png");
    const back = useTexture("/namecard/back.png");
    const viewport = useThree((state) => state.viewport);
    const cardScale = Math.min(1, viewport.width / 4.5, viewport.height / 2.8,);

    useEffect(() => {
        front.colorSpace = SRGBColorSpace;
        back.colorSpace = SRGBColorSpace;

        front.anisotropy = 8;
        back.anisotropy = 8;
    }, [front, back]);

    useFrame(({ clock }, delta) => {
        if (!group.current) return;

        const t = clock.getElapsedTime();
        const targetY = flipped ? Math.PI : 0;

        // front/back flip
        group.current.rotation.y = MathUtils.damp(
            group.current.rotation.y,
            targetY,
            5,
            delta
        );

        // floating animation
        group.current.position.y = Math.sin(t * 1.2) * 0.06;

        // subtle idle tilt
        group.current.rotation.x = MathUtils.damp(
            group.current.rotation.x,
            0.08 + Math.sin(t * 0.9) * 0.03,
            3,
            delta
        );

        group.current.rotation.z = MathUtils.damp(
            group.current.rotation.z,
            Math.cos(t * 0.7) * 0.02,
            3,
            delta
        );
    });

    return (
        <group ref={group} scale={cardScale}>
            {/* holographic glow behind the card */}
            {/* <CardAura /> */}

            {/* outer holographic shell */}
            <RoundedBox args={[3.56, 2.06, 0.045]}
                radius={0.019}
                smoothness={12}>
                <meshPhysicalMaterial
                    transparent
                    opacity={0.1}
                    roughness={0.22}
                    metalness={0.08}
                    transmission={0.5}
                    thickness={0.16}
                    ior={1.22}
                    clearcoat={1}
                    clearcoatRoughness={0.12}
                    iridescence={1}
                    iridescenceIOR={1.25}
                    iridescenceThicknessRange={[180, 700]}
                    emissive="#8bdcff"
                    emissiveIntensity={0.015}
                    side={DoubleSide}
                    depthWrite={false}
                />
            </RoundedBox>

            {/* main physical card body */}
            <RoundedBox
                args={[3.5, 2, 0.035]}
                radius={0.015}
                smoothness={12}
                castShadow
                receiveShadow
            >
                <meshPhysicalMaterial
                    color="#ebe1e8"
                    roughness={0.74}
                    metalness={0.04}
                    clearcoat={0.45}
                    clearcoatRoughness={0.28}
                />
            </RoundedBox>

            {/* Front */}
            <mesh position={[0, 0, 0.019]}>
                <planeGeometry args={[3.42, 1.92]} />
                <meshBasicMaterial map={front} toneMapped={false} />
            </mesh>

            {/* Back */}
            <mesh position={[0, 0, -0.019]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[3.42, 1.92]} />
                <meshBasicMaterial map={back} toneMapped={false} />
            </mesh>
        </group>
    );
}

export default function NameCard3D({ onClose }) {
    const [flipped, setFlipped] = useState(false);
    useEffect(() => {
        const handleKey = (event) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-6" onClick={onClose}>
            <section role="dialog" aria-modal="true" aria-label="Interactive 3D business card" onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0e16]/95 p-3 shadow-2xl sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-quantum-blue">
                            Personal Identity
                        </p>

                        <h2 className="mt-2 text-lg font-medium text-white">
                            Business Card
                        </h2>
                    </div>

                    <button onClick={onClose} aria-label="Close business card" className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white">
                        <X className="size-5" />
                    </button>
                </div>

                {/* 3D Canvas */}

                <div className="mt-3 h-[min(42dvh,300px)] w-full sm:mt-4 sm:h-[min(55dvh,520px)]">
                    <Canvas
                        camera={{ position: [0, 0, 5.4], fov: 35 }}
                        dpr={[1, 1.75]}
                        gl={{ antialias: true, alpha: true }}
                        shadows
                    >
                        <ambientLight intensity={0.95} />

                        <directionalLight
                            position={[4, 5, 6]}
                            intensity={1.4}
                            castShadow
                        />

                        <pointLight
                            position={[-3.5, 1.5, 3]}
                            color="#78dfff"
                            intensity={10}
                            distance={10}
                        />

                        <pointLight
                            position={[3, -1.5, 3]}
                            color="#cb8cff"
                            intensity={8}
                            distance={9}
                        />

                        <pointLight
                            position={[0, 2, -2]}
                            color="#ffc57f"
                            intensity={5}
                            distance={8}
                        />

                        <Suspense fallback={null}>
                            <CardModel flipped={flipped} />
                        </Suspense>

                        <OrbitControls
                            enablePan={false}
                            enableZoom={false}
                            rotateSpeed={0.65}
                            minPolarAngle={Math.PI / 2 - 0.65}
                            maxPolarAngle={Math.PI / 2 + 0.65}
                        />
                    </Canvas>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <p className="text-xs text-white/50">
                        Drag to rotate · Explore both sides
                    </p>

                    <button
                        onClick={() => setFlipped((value) => !value)}
                        className=" inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors hover:border-quantum-blue/50 hover:text-white">
                        <RotateCcw className="size-4" />
                        Flip Card
                    </button>

                </div>
            </section>
        </div>
    );
}
