import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import ValentineQuestion from "@/components/ValentineQuestion";
import YesButton from "@/components/YesButton";
import RunawayNoButton from "@/components/RunawayNoButton";
import ProposalModal from "@/components/ProposalModal";

const Index = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);

  const handleYesClick = useCallback(() => {
    setShowQuestion(false);
    setTimeout(() => setIsAccepted(true), 500);
  }, []);

  const handleReplay = useCallback(() => {
    setIsAccepted(false);
    setShowQuestion(true);
    setYesScale(1);
    setNoScale(1);
  }, []);

  const handleNoCaught = useCallback(() => {
    // Reduce No button by 5%, increase Yes button by 5%
    setNoScale((prev) => Math.max(0.3, prev - 0.05));
    setYesScale((prev) => Math.min(2, prev + 0.05));
  }, []);

  return (
    <div className="min-h-screen gradient-romantic overflow-hidden relative">
      {/* Background floating hearts */}
      <FloatingHearts />

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-light/20 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {showQuestion && !isAccepted && (
          <motion.div
            key="question"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Question section */}
            <ValentineQuestion />

            {/* Buttons section */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <YesButton onClick={handleYesClick} scale={yesScale} />
              <RunawayNoButton scale={noScale} onCaught={handleNoCaught} />
            </motion.div>

            {/* Bottom decoration */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <span className="text-sm">Made with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.span>
              <span className="text-sm">for Ace</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration modal */}
      <ProposalModal isOpen={isAccepted} onReplay={handleReplay} />
    </div>
  );
};

export default Index;
