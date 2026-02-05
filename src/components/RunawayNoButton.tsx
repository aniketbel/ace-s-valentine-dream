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
  scale?: number;
  onCaught?: () => void;
}

const RunawayNoButton = ({ onGiveUp, scale = 1, onCaught }: RunawayNoButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [escapeCount, setEscapeCount] = useState(0);
  const [isHeartBroken, setIsHeartBroken] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const returnTimeoutRef = useRef<NodeJS.Timeout>();
  const lastMousePos = useRef({ x: 0, y: 0 });

  const BUTTON_WIDTH = 120;
  const BUTTON_HEIGHT = 50;
  const PADDING = 20;

  // Clamp position to keep button within viewport
  const clampPosition = useCallback((x: number, y: number) => {
    if (!containerRef.current) return { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const buttonHalfWidth = (BUTTON_WIDTH * scale) / 2;
    const buttonHalfHeight = (BUTTON_HEIGHT * scale) / 2;

    // Calculate max distances from container center to keep button on screen
    const maxX = containerCenterX - buttonHalfWidth - PADDING;
    const maxY = containerCenterY - buttonHalfHeight - PADDING;
    
    // Also check right/bottom edges
    const maxXRight = window.innerWidth - containerCenterX - buttonHalfWidth - PADDING;
    const maxYBottom = window.innerHeight - containerCenterY - buttonHalfHeight - PADDING;

    const clampedX = Math.max(-maxX, Math.min(maxXRight, x));
    const clampedY = Math.max(-maxY, Math.min(maxYBottom, y));

    return { x: clampedX, y: clampedY };
  }, [scale]);

  // Move away from cursor position
  const moveAwayFromCursor = useCallback((mouseX: number, mouseY: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    // Current button position in screen coordinates
    const buttonX = containerCenterX + position.x;
    const buttonY = containerCenterY + position.y;

    // Calculate direction away from mouse
    const dx = buttonX - mouseX;
    const dy = buttonY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    // Normalize and apply escape force
    const escapeForce = 150 + Math.random() * 100;
    const moveX = (dx / distance) * escapeForce;
    const moveY = (dy / distance) * escapeForce;

    // Calculate new position and clamp to screen
    const newPos = clampPosition(position.x + moveX, position.y + moveY);
    
    setPosition(newPos);
    setRotation((prev) => prev + (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 20));
  }, [position, clampPosition]);

  // Show escape message
  const showEscapeMessage = useCallback(() => {
    const messages = escapeCount > 10 ? DESPERATE_MESSAGES : ESCAPE_MESSAGES;
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(newMessage);
    setTimeout(() => setMessage(""), 1200);
  }, [escapeCount]);

  // Run away from cursor
  const runAway = useCallback((mouseX: number, mouseY: number) => {
    setEscapeCount((prev) => prev + 1);
    setIsRunning(true);

    // Briefly show broken heart on some escapes
    if (Math.random() > 0.7) {
      setIsHeartBroken(true);
      setTimeout(() => setIsHeartBroken(false), 300);
    }

    showEscapeMessage();
    moveAwayFromCursor(mouseX, mouseY);

    // Clear any existing return timeout
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
    }

    // Return to center after a delay if not being chased
    returnTimeoutRef.current = setTimeout(() => {
      setIsRunning(false);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }, 3000);
  }, [moveAwayFromCursor, showEscapeMessage]);

  // Handle mouse movement - check proximity and run away
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!buttonRef.current) return;

    lastMousePos.current = { x: e.clientX, y: e.clientY };

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY);
    const escapeRadius = 80;

    if (distance < escapeRadius) {
      // Clear return timeout since we're being chased
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
      runAway(e.clientX, e.clientY);
    }
  }, [runAway]);

  // Handle touch for mobile
  const handleTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      runAway(touch.clientX, touch.clientY);
    }
  }, [runAway]);

  // Handle click attempt - if actually clicked, trigger size change
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Button was actually clicked! Trigger the caught callback
    onCaught?.();
    runAway(e.clientX, e.clientY);
  }, [runAway, onCaught]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (returnTimeoutRef.current) clearTimeout(returnTimeoutRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="relative" 
      style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT }}
    >
      <motion.button
        ref={buttonRef}
        className="btn-no absolute select-none cursor-pointer whitespace-nowrap z-50"
        animate={{
          x: position.x,
          y: position.y,
          scale: scale,
          rotate: rotation,
        }}
        transition={{
          type: "spring",
          stiffness: isRunning ? 400 : 300,
          damping: isRunning ? 25 : 30,
          mass: 0.8,
        }}
        onTouchStart={handleTouch}
        onClick={handleClick}
        whileTap={{ scale: scale * 0.9 }}
        style={{ 
          left: "50%", 
          top: "50%", 
          marginLeft: -(BUTTON_WIDTH / 2) + 5, 
          marginTop: -(BUTTON_HEIGHT / 2) + 3,
          transformOrigin: "center center",
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
          className="fixed z-[100] whitespace-nowrap pointer-events-none"
          style={{
            left: buttonRef.current 
              ? buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 
              : "50%",
            top: buttonRef.current 
              ? buttonRef.current.getBoundingClientRect().top - 40 
              : "50%",
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
          className="fixed z-[100] text-xs text-muted-foreground whitespace-nowrap pointer-events-none"
          style={{
            left: buttonRef.current 
              ? buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 
              : "50%",
            top: buttonRef.current 
              ? buttonRef.current.getBoundingClientRect().bottom + 8 
              : "50%",
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
                marginLeft: -(BUTTON_WIDTH / 2) + 5, 
                marginTop: -(BUTTON_HEIGHT / 2) + 3,
              }}
              animate={{
                x: position.x,
                y: position.y,
                scale: scale * (1 - i * 0.15),
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
