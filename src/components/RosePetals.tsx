import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  color: "red" | "pink" | "white";
  swayAmount: number;
}

interface RosePetalsProps {
  intensity?: number;
  audioData?: number;
}

const PETAL_COLORS = {
  red: "from-rose-deep to-primary",
  pink: "from-rose-light to-primary/80",
  white: "from-cream to-secondary",
};

const RosePetals = ({ intensity = 1, audioData = 0 }: RosePetalsProps) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const petalIdRef = useRef(0);

  // Create petal
  const createPetal = (): Petal => {
    const colors: Array<"red" | "pink" | "white"> = ["red", "red", "pink", "pink", "white"];
    return {
      id: petalIdRef.current++,
      x: Math.random() * 100,
      size: 20 + Math.random() * 30,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 0.5,
      rotateStart: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      swayAmount: 50 + Math.random() * 100,
    };
  };

  // Spawn petals based on intensity and audio
  useEffect(() => {
    const baseSpawnRate = 200 / intensity;
    const audioBoost = audioData > 0.7 ? 0.3 : audioData > 0.5 ? 0.6 : 1;
    const spawnRate = baseSpawnRate * audioBoost;

    const interval = setInterval(() => {
      setPetals((prev) => {
        // Burst mode when audio peaks
        const burstCount = audioData > 0.8 ? 5 : audioData > 0.6 ? 3 : 1;
        const newPetals = Array.from({ length: burstCount }, createPetal);
        
        // Keep only last 50 petals
        return [...prev.slice(-49), ...newPetals];
      });
    }, spawnRate);

    return () => clearInterval(interval);
  }, [intensity, audioData]);

  // Remove old petals
  useEffect(() => {
    const cleanup = setInterval(() => {
      setPetals((prev) => prev.filter((p) => petalIdRef.current - p.id < 60));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className={`petal bg-gradient-to-br ${PETAL_COLORS[petal.color]} rounded-full`}
          style={{
            left: `${petal.x}%`,
            width: petal.size,
            height: petal.size * 0.6,
            borderRadius: "50% 0 50% 50%",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
          initial={{
            y: -50,
            x: 0,
            rotate: petal.rotateStart,
            opacity: 0.9,
          }}
          animate={{
            y: "110vh",
            x: [0, petal.swayAmount, -petal.swayAmount, petal.swayAmount / 2, 0],
            rotate: petal.rotateStart + 720,
            opacity: [0.9, 1, 1, 0.8],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            ease: "linear",
            x: {
              duration: petal.duration,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
};

export default RosePetals;
