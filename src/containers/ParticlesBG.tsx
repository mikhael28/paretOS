import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Float32BufferAttribute, PointLight, PointsMaterial } from "three";

const SEPARATION = 0.2;
const AMOUNTX = 500;
const AMOUNTY = 500;

export const angleVector = (angle: number, distance: number) => {
    const angleRadians = (angle * Math.PI) / 180 + (90 * Math.PI) / 180;
    return {
        x: distance * Math.cos(angleRadians),
        y: distance * Math.sin(angleRadians)
    };
};

export const ParticlesBG = () => {
    const light = useRef<PointLight | null>(null);

    const particlesGeometry = new BufferGeometry();
    const particlesMaterial = new PointsMaterial({ color: "white", size: 0.4 });

    const particlesPositions = [];
    const particleOptions: { speed: number }[] = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            const xCoord = ix * ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
            const zCoord = iy * iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
            particlesPositions.push(zCoord, 0, xCoord);
            particleOptions.push({
                speed: 0.2 + (0.2 - Math.random() * 10) / 10000
            });
        }
    }

    particlesGeometry.setAttribute(
        "position",
        new Float32BufferAttribute(particlesPositions, 3)
    );

    useFrame((state) => {
        const particles = (particlesGeometry.attributes.position as BufferAttribute).array as Array<number>;
        const elapsedTime = state.clock.getElapsedTime();

        particleOptions.forEach((_, index) => {
            const i3 = index * 3;
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
            <pointLight
                ref={light}
                distance={140} // skipcq JS-0455
                intensity={8} // skipcq JS-0455
                color="white"
            />  

            <points
                args={[particlesGeometry, particlesMaterial]} // skipcq JS-0455
                position={[0, 0, 0]}  // skipcq JS-0455
            />
        </>
    );
};
