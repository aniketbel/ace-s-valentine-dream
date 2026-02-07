import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LoveLetterEnvelopeProps {
  isVisible: boolean;
  onClose: () => void;
}

const letterLines = [
  "Hey Ace,",
  "",
  "Thank you for saying yes, Ace",
  "",
  "I was nervous, not gonna lie. A bit.",
  "And now I'm smiling like an idiot.",
  "",
  "I can't explain how much I love you but I wanna say that you have made my world a whole lot better by being with me.",
  "",
  "I hope I have the same presence in your life. Wishing you lots of love and missing you lots.",
  "",
  "I don't promise perfection.",
  "I promise honesty, effort, and choosing you even on hard days.",
  "Thank you for being you.",
  "",
  "Love,",
  "",
  "Your Garfield. 💌",
];

const LoveLetterEnvelope = ({ isVisible, onClose }: LoveLetterEnvelopeProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const openTimer = setTimeout(() => setIsOpened(true), 1500);
      const letterTimer = setTimeout(() => setShowLetter(true), 2500);
      return () => {
        clearTimeout(openTimer);
        clearTimeout(letterTimer);
      };
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[90vw] max-w-md flex items-center justify-center"
            initial={{ scale: 0.3, opacity: 0, y: 80 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
          >
            {/* Envelope glow */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 20px 5px hsla(350, 80%, 60%, 0.3), 0 0 60px 10px hsla(350, 80%, 60%, 0.15)",
                  "0 0 30px 10px hsla(350, 80%, 60%, 0.5), 0 0 80px 20px hsla(350, 80%, 60%, 0.25)",
                  "0 0 20px 5px hsla(350, 80%, 60%, 0.3), 0 0 60px 10px hsla(350, 80%, 60%, 0.15)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Envelope body */}
            <div className="relative w-full">
              {/* Back of envelope */}
              <div className="bg-[hsl(350,60%,85%)] rounded-xl shadow-2xl aspect-[4/3] relative overflow-hidden border border-[hsl(350,50%,75%)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[hsl(350,65%,90%)] to-[hsl(350,55%,80%)]" />

                {/* Heart seal */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  animate={isOpened ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
                  transition={isOpened ? { duration: 0.3 } : { duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Heart className="w-7 h-7 text-primary-foreground fill-primary-foreground" />
                  </div>
                </motion.div>
              </div>

              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top"
                animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ perspective: 800, transformStyle: "preserve-3d" }}
              >
                <svg viewBox="0 0 400 150" className="w-full drop-shadow-md">
                  <path
                    d="M0,0 L200,130 L400,0 Z"
                    fill="hsl(350, 50%, 78%)"
                    stroke="hsl(350, 40%, 70%)"
                    strokeWidth="1"
                  />
                  <defs>
                    <linearGradient id="flapGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(350, 60%, 86%)" />
                      <stop offset="100%" stopColor="hsl(350, 50%, 78%)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L200,130 L400,0 Z"
                    fill="url(#flapGradient)"
                  />
                </svg>
              </motion.div>

              {/* Letter rising out - centered */}
              <AnimatePresence>
                {isOpened && (
                  <motion.div
                    className="absolute inset-x-3 top-1/2 -translate-y-1/2"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: "-85%", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="bg-white rounded-lg shadow-xl p-6 max-h-[55vh] overflow-y-auto border border-[hsl(350,30%,90%)] relative">
                      <button
                        onClick={onClose}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                      >
                        ✕
                      </button>
                      {/* Letter header decoration */}
                      <div className="flex justify-center mb-4">
                        <motion.div
                          className="flex gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                            >
                              💕
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>

                      {/* Letter content - line by line fade in */}
                      {showLetter &&
                        letterLines.map((line, index) => (
                          <motion.p
                            key={index}
                            className={`font-serif text-sm md:text-base leading-relaxed ${
                              line === "" ? "h-3" : ""
                            } ${
                              line === "Hey Ace," || line === "Love," || line === "Your Garfield. 💌"
                                ? "font-semibold italic text-primary"
                                : "text-foreground/80"
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.35,
                              duration: 0.5,
                              ease: "easeOut",
                            }}
                          >
                            {line || "\u00A0"}
                          </motion.p>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoveLetterEnvelope;
