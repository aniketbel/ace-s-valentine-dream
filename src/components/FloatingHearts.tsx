import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Create initial hearts
    const initialHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 16 + Math.random() * 24,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setHearts(initialHearts);

    // Add new hearts periodically
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart: Heart = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
          duration: 8 + Math.random() * 6,
          size: 16 + Math.random() * 24,
          opacity: 0.3 + Math.random() * 0.4,
        };
        // Keep only last 25 hearts to prevent memory issues
        return [...prev.slice(-24), newHeart];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: "100vh", rotate: 0, scale: 0.8 }}
          animate={{
            y: "-20vh",
            rotate: 360,
            scale: [0.8, 1, 1.2],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
