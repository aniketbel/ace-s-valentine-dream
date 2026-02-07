import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RosePetals from "./RosePetals";
import TypewriterText from "./TypewriterText";
import LoveLetterEnvelope from "./LoveLetterEnvelope";
import { Heart, Infinity as InfinityIcon } from "lucide-react";

interface ProposalModalProps {
  isOpen: boolean;
}

const ProposalModal = ({ isOpen }: ProposalModalProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const messageTimer = setTimeout(() => setShowMessage(true), 1500);
      const secondaryTimer = setTimeout(() => setShowSecondary(true), 5000);
      const buttonsTimer = setTimeout(() => setShowButtons(true), 8000);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(secondaryTimer);
        clearTimeout(buttonsTimer);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 gradient-romantic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, hsl(350 80% 55% / 0.1) 0%, transparent 70%)`,
            }}
          />

          {/* Rose petals */}
          <RosePetals intensity={1.5} audioData={0} />

          {/* Content */}
          <motion.div
            className="relative z-20 text-center px-8 max-w-2xl mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            {/* Decorative hearts */}
            <motion.div
              className="absolute -top-16 left-1/2 -translate-x-1/2"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-12 h-12 text-primary fill-primary" />
            </motion.div>

            {/* Main message */}
            {showMessage && (
              <motion.h1
                className="font-script text-5xl md:text-7xl text-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TypewriterText
                  text="Thank you for accepting my proposal,"
                  speed={60}
                />
                <br />
                <motion.span
                  className="text-primary glow-text inline-block mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.5, duration: 0.5 }}
                >
                  Ace ❤️
                </motion.span>
              </motion.h1>
            )}

            {/* Secondary message */}
            {showSecondary && (
              <motion.p
                className="text-xl md:text-2xl text-foreground/80 font-light mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <TypewriterText
                  text="You just made my heart unbelievably happy."
                  speed={40}
                  delay={500}
                />
              </motion.p>
            )}

            {/* Forever badge */}
            {showButtons && (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full text-primary border border-primary/30 cursor-pointer"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(219, 39, 119, 0.4)",
                      "0 0 20px 5px rgba(219, 39, 119, 0.2)",
                      "0 0 0 0 rgba(219, 39, 119, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLetter(true)}
                >
                  <InfinityIcon className="w-4 h-4" />
                  Forever
                </motion.button>
              </motion.div>
            )}

            {/* Decorative elements */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Love letter envelope */}
          <LoveLetterEnvelope isVisible={showLetter} onClose={() => setShowLetter(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposalModal;
