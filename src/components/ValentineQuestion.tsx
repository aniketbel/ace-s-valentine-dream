import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import TypewriterText from "./TypewriterText";

const ValentineQuestion = () => {
  const [showLine2, setShowLine2] = useState(false);
  const [showName, setShowName] = useState(false);

  return (
    <motion.div
      className="text-center breathing"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative hearts above */}
      <motion.div
        className="flex justify-center gap-4 mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart
              className={`w-6 h-6 ${
                i === 1 ? "text-primary fill-primary" : "text-rose-light"
              }`}
            />
          </motion.span>
        ))}
      </motion.div>

      {/* Main question with typewriter effect */}
      <h1 className="font-script text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground leading-relaxed mb-4">
        <TypewriterText
          text="Will you be my"
          delay={500}
          speed={80}
          onComplete={() => setShowLine2(true)}
        />
      </h1>

      {showLine2 && (
        <motion.h1
          className="font-script text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-primary glow-text mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TypewriterText
            text="Valentine?"
            delay={0}
            speed={100}
            onComplete={() => setShowName(true)}
          />
        </motion.h1>
      )}

      {/* Name emphasis */}
      {showName && (
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="font-script text-6xl sm:text-7xl md:text-8xl text-primary relative z-10"
            animate={{
              textShadow: [
                "0 0 20px rgba(219, 39, 119, 0.3)",
                "0 0 40px rgba(219, 39, 119, 0.5)",
                "0 0 20px rgba(219, 39, 119, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <TypewriterText text="Ace" delay={0} speed={150} />
          </motion.span>

          {/* Decorative underline */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />

          {/* Sparkles around name */}
          <motion.span
            className="absolute -top-4 -right-6 text-2xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              rotate: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ delay: 0.3, duration: 1.5, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -bottom-4 -left-6 text-xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              rotate: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ delay: 0.6, duration: 1.5, repeat: Infinity }}
          >
            💕
          </motion.span>
        </motion.div>
      )}

      {/* Subtle helper text */}
      {showName && (
        <motion.p
          className="text-muted-foreground text-sm mt-12 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Choose wisely... 💝
        </motion.p>
      )}
    </motion.div>
  );
};

export default ValentineQuestion;
