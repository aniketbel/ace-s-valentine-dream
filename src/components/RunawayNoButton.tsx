import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const ESCAPE_MESSAGES = [
  "Nice try 😏",
  "Nope!",
  "Not happening 💅",
  "Think again!",
  "Uh uh!",
  "Keep dreaming 😘",
  "Wrong choice!",
  "Really? 🙄",
];

const DESPERATE_MESSAGES = [
  "Please stop 😭",
  "Just say yes!",
  "I'm tired 😮‍💨",
  "You're persistent!",
  "Fine, I'll shrink!",
];

interface RunawayNoButtonProps {
  onGiveUp?: () => void;
}

const RunawayNoButton = ({ onGiveUp }: RunawayNoButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [escapeCount, setEscapeCount] = useState(0);
  const [isHeartBroken, setIsHeartBroken] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate button scale based on escape count
  const getScale = () => {
    if (escapeCount < 5) return 1;
    if (escapeCount < 10) return 0.85;
    if (escapeCount < 15) return 0.7;
    return 0.55;
  };

  // Get random escape pattern
  const getEscapePattern = () => {
    const patterns = ["jump", "teleport", "circular", "zigzag"];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // Calculate safe position within viewport
  const getSafePosition = useCallback((preferredX: number, preferredY: number) => {
    const padding = 100;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    
    return {
      x: Math.max(padding, Math.min(preferredX, maxX)),
      y: Math.max(padding, Math.min(preferredY, maxY)),
    };
  }, []);

  // Main escape function
  const escape = useCallback(() => {
    const pattern = getEscapePattern();
    const messages = escapeCount > 8 ? DESPERATE_MESSAGES : ESCAPE_MESSAGES;
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setMessage(newMessage);
    setEscapeCount((prev) => prev + 1);

    // Briefly show broken heart on some escapes
    if (Math.random() > 0.7) {
      setIsHeartBroken(true);
      setTimeout(() => setIsHeartBroken(false), 300);
    }

    let newX: number, newY: number;

    switch (pattern) {
      case "teleport":
        // Random teleport with blur effect
        newX = Math.random() * (window.innerWidth - 200);
        newY = Math.random() * (window.innerHeight - 200);
        controls.start({
          scale: [1, 0.5, 0.5, 1],
          opacity: [1, 0, 0, 1],
          transition: { duration: 0.3 },
        });
        break;

      case "circular":
        // Circular dodge
        const angle = Math.random() * Math.PI * 2;
        const radius = 150 + Math.random() * 100;
        newX = position.x + Math.cos(angle) * radius;
        newY = position.y + Math.sin(angle) * radius;
        controls.start({
          rotate: [0, 360],
          transition: { duration: 0.4 },
        });
        break;

      case "zigzag":
        // Zigzag escape
        const direction = Math.random() > 0.5 ? 1 : -1;
        newX = position.x + direction * (200 + Math.random() * 100);
        newY = position.y + (Math.random() - 0.5) * 300;
        break;

      default:
        // Simple jump
        const jumpDirection = Math.random() > 0.5 ? 1 : -1;
        newX = position.x + jumpDirection * (180 + Math.random() * 120);
        newY = position.y + (Math.random() - 0.5) * 200;
    }

    const safePos = getSafePosition(newX, newY);
    setPosition(safePos);

    // Clear message after a delay
    setTimeout(() => setMessage(""), 1500);
  }, [position, escapeCount, controls, getSafePosition]);

  // Handle mouse proximity detection
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
      const escapeRadius = 120;

      if (distance < escapeRadius) {
        escape();
      }
    },
    [escape]
  );

  // Handle touch for mobile
  const handleTouch = useCallback(() => {
    escape();
  }, [escape]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        ref={buttonRef}
        className="btn-no relative select-none cursor-pointer"
        animate={{
          x: position.x,
          y: position.y,
          scale: getScale(),
        }}
        style={{ position: "relative" }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        onTouchStart={handleTouch}
        whileHover={{ scale: getScale() * 0.95 }}
      >
        <motion.span
          animate={controls}
          className="flex items-center gap-2"
        >
          {isHeartBroken ? "💔" : "❌"} No
        </motion.span>
      </motion.button>

      {/* Tooltip message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-100% + ${position.y}px))`,
          }}
        >
          <div className="bg-card px-4 py-2 rounded-full shadow-romantic text-sm font-medium text-foreground border border-primary/20">
            {message}
          </div>
        </motion.div>
      )}

      {/* Escape counter (subtle) */}
      {escapeCount > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
          style={{
            transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
          }}
        >
          {escapeCount} escapes
        </motion.div>
      )}
    </div>
  );
};

export default RunawayNoButton;
