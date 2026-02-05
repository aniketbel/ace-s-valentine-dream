import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface YesButtonProps {
  onClick: () => void;
  scale?: number;
}

const YesButton = ({ onClick, scale = 1 }: YesButtonProps) => {
  return (
    <motion.button
      className="btn-yes flex items-center gap-3 group"
      onClick={onClick}
      style={{ scale }}
      whileHover={{ scale: scale * 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-6 h-6 fill-current" />
      </motion.span>
      <span>Yes</span>
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(219, 39, 119, 0.4)",
            "0 0 0 20px rgba(219, 39, 119, 0)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.button>
  );
};

export default YesButton;
