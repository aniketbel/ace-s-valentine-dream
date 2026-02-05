import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursorColor?: string;
}

const TypewriterText = ({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete,
  cursorColor = "primary",
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, speed, onComplete]);

  // Hide cursor after typing is complete
  useEffect(() => {
    if (isComplete) {
      const hideTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 500);
      return () => clearTimeout(hideTimeout);
    }
  }, [isComplete]);

  return (
    <motion.span
      className={`relative inline ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
    >
      {displayedText.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="inline-block"
          style={{ 
            whiteSpace: char === " " ? "pre" : "normal",
            textShadow: "0 0 20px rgba(219, 39, 119, 0.3)"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      
      {/* Cursor */}
      <motion.span
        className={`inline-block w-0.5 h-[1.1em] bg-${cursorColor} ml-0.5 align-middle`}
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{ backgroundColor: "hsl(var(--primary))" }}
      />
    </motion.span>
  );
};

export default TypewriterText;
