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
  "Catch me! 🏃‍♀️",
  "Too slow!",
];

const DESPERATE_MESSAGES = [
  "Please stop 😭",
  "Just say yes!",
  "I'm tired 😮‍💨",
  "You're persistent!",
  "Fine, I'll shrink!",
  "HELPPP! 🆘",
  "Why me?! 😫",
];

interface RunawayNoButtonProps {
  onGiveUp?: () => void;
}

const RunawayNoButton = ({ onGiveUp }: RunawayNoButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [escapeCount, setEscapeCount] = useState(0);
  const [isHeartBroken, setIsHeartBroken] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const returnTimeoutRef = useRef<NodeJS.Timeout>();
  const runIntervalRef = useRef<NodeJS.Timeout>();

  // Calculate button scale based on escape count
  const getScale = () => {
    if (escapeCount < 5) return 1;
    if (escapeCount < 10) return 0.85;
    if (escapeCount < 15) return 0.7;
    if (escapeCount < 20) return 0.6;
    return 0.5;
  };

  // Get safe position within viewport
  const getSafePosition = useCallback(() => {
    const padding = 120;
    const maxX = window.innerWidth - padding * 2;
    const maxY = window.innerHeight - padding * 2;
    
    return {
      x: -maxX / 2 + Math.random() * maxX,
      y: -maxY / 2 + Math.random() * maxY,
    };
  }, []);

  // Return to original position smoothly
  const returnToCenter = useCallback(() => {
    setIsRunning(false);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Run around the screen frantically
  const runAround = useCallback(() => {
    const messages = escapeCount > 10 ? DESPERATE_MESSAGES : ESCAPE_MESSAGES;
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setMessage(newMessage);
    setEscapeCount((prev) => prev + 1);
    setIsRunning(true);

    // Briefly show broken heart on some escapes
    if (Math.random() > 0.6) {
      setIsHeartBroken(true);
      setTimeout(() => setIsHeartBroken(false), 200);
    }

    // Random position
    const newPos = getSafePosition();
    
    // Add some rotation for fun
    setRotation((prev) => prev + (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 30));
    
    setPosition(newPos);

    // Clear message after a delay
    setTimeout(() => setMessage(""), 1200);

    // Clear any existing return timeout
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
    }

    // Return to center after a delay (if not being chased)
    returnTimeoutRef.current = setTimeout(() => {
      returnToCenter();
    }, 2500);
  }, [escapeCount, getSafePosition, returnToCenter]);

  // Continuous running when being chased
  const startRunning = useCallback(() => {
    if (runIntervalRef.current) return;
    
    runAround();
    
    // Keep running if cursor stays close
    runIntervalRef.current = setInterval(() => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      // Check if we should keep running (simulated by continuing to move)
      const newPos = getSafePosition();
      setPosition(newPos);
      setRotation((prev) => prev + (Math.random() > 0.5 ? 10 : -10));
    }, 400);

    // Stop running after a bit
    setTimeout(() => {
      if (runIntervalRef.current) {
        clearInterval(runIntervalRef.current);
        runIntervalRef.current = undefined;
      }
    }, 1500);
  }, [runAround, getSafePosition]);

  // Handle mouse proximity detection
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
      const escapeRadius = 100;
      const chaseRadius = 150;

      if (distance < escapeRadius) {
        // Clear return timeout since we're being chased
        if (returnTimeoutRef.current) {
          clearTimeout(returnTimeoutRef.current);
        }
        runAround();
      } else if (distance < chaseRadius && isRunning) {
        // Keep running if cursor is nearby and we're already running
        startRunning();
      }
    },
    [runAround, startRunning, isRunning]
  );

  // Handle touch for mobile
  const handleTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    runAround();
  }, [runAround]);

  // Handle click attempt
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    runAround();
  }, [runAround]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (returnTimeoutRef.current) clearTimeout(returnTimeoutRef.current);
      if (runIntervalRef.current) clearInterval(runIntervalRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div className="relative" style={{ width: 120, height: 50 }}>
      <motion.button
        ref={buttonRef}
        className="btn-no absolute select-none cursor-pointer whitespace-nowrap"
        animate={{
          x: position.x,
          y: position.y,
          scale: getScale(),
          rotate: rotation,
        }}
        transition={{
          type: "spring",
          stiffness: isRunning ? 500 : 300,
          damping: isRunning ? 20 : 25,
          mass: 0.8,
        }}
        onTouchStart={handleTouch}
        onClick={handleClick}
        whileTap={{ scale: getScale() * 0.9 }}
        style={{ 
          left: "50%", 
          top: "50%", 
          marginLeft: -55, 
          marginTop: -22,
        }}
      >
        <motion.span
          animate={controls}
          className="flex items-center gap-2"
        >
          {isHeartBroken ? "💔" : isRunning ? "😱" : "❌"} No
        </motion.span>
        
        {/* Speed lines when running */}
        {isRunning && (
          <motion.div
            className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, repeat: 2 }}
          >
            <div className="w-3 h-0.5 bg-primary/40 rounded-full" />
            <div className="w-4 h-0.5 bg-primary/30 rounded-full" />
            <div className="w-2 h-0.5 bg-primary/40 rounded-full" />
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 whitespace-nowrap pointer-events-none"
          style={{
            left: `calc(50% + ${position.x}px)`,
            top: `calc(50% + ${position.y}px - 50px)`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-card px-4 py-2 rounded-full shadow-romantic text-sm font-medium text-foreground border border-primary/20">
            {message}
          </div>
        </motion.div>
      )}

      {/* Escape counter */}
      {escapeCount > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="absolute z-50 text-xs text-muted-foreground whitespace-nowrap pointer-events-none"
          style={{
            left: `calc(50% + ${position.x}px)`,
            top: `calc(50% + ${position.y}px + 35px)`,
            transform: "translateX(-50%)",
          }}
        >
          Escaped {escapeCount}x 🏃
        </motion.div>
      )}

      {/* Trail effect when running fast */}
      {isRunning && escapeCount > 5 && (
        <>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute btn-no opacity-20 pointer-events-none"
              style={{ 
                left: "50%", 
                top: "50%", 
                marginLeft: -55, 
                marginTop: -22,
              }}
              animate={{
                x: position.x,
                y: position.y,
                scale: getScale() * (1 - i * 0.15),
                opacity: [0.3 - i * 0.08, 0],
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
              }}
            >
              <span className="flex items-center gap-2">❌ No</span>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default RunawayNoButton;
