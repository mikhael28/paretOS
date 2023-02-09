import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Float32BufferAttribute, PointLight, PointsMaterial } from "three";

const COUNT = 5000,
    SEPARATION = 0.2,
    AMOUNTX = 500,
    AMOUNTY = 500;

export const angleVector = (angle: number, distance: number) => {
    const angleRadians = (angle * Math.PI) / 180 + (90 * Math.PI) / 180;
    return {
        x: distance * Math.cos(angleRadians),
        y: distance * Math.sin(angleRadians)
    };
};

export const ParticlesBG = () => {
    const mesh = useRef();
    const light = useRef<PointLight | null>(null);
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const particlesGeometry = new BufferGeometry();
    const particlesMaterial = new PointsMaterial({ color: "white", size: 0.4 });

    const particlesPositions = [];
    const particleOptions: { speed: number }[] = [];

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            const x = ix * ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
            const z = iy * iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
            particlesPositions.push(z, 0, x);
            particleOptions.push({
                speed: 0.2 + (0.2 - Math.random() * 10) / 10000
            });
        }
    }

    particlesGeometry.setAttribute(
        "position",
        new Float32BufferAttribute(particlesPositions, 3)
    );

    let count = 0;
    useFrame((state, delta) => {
        const particles = (particlesGeometry.attributes.position as BufferAttribute).array as Array<number>;
        const elapsedTime = state.clock.getElapsedTime();

        particleOptions.forEach((p, i) => {
            const i3 = i * 3;
            const particle = {
                x: i3,
                y: i3 + 1,
                z: i3 + 2
            };

            // particle[particle.x] = (Math.sin((particle.x + 1) * 0.3) + 1) * 4 + (Math.sin((particle.y + 1) * 0.5) + 1) * 4;
            particles[particle.y] = Math.sin(elapsedTime * 5);
            // particles[particle.z] = Math.random() * 2;
        });

        particlesGeometry.attributes.position.needsUpdate = true;
    });
    return (
        <>
            <pointLight ref={light} distance={140} intensity={8} color="white" />

            <points
                args={[particlesGeometry, particlesMaterial]}
                position={[0, 0, 0]}
            />
        </>
    );
};
