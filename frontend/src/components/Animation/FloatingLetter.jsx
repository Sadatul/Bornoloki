import { motion } from "motion/react";

export const FloatingLetter = ({ children, x, y, delay = 0 }) => {
  return (
    <motion.div
      className="absolute text-3xl font-bold text-fuchsia-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        textShadow:
          "0 0 10px rgba(217, 70, 239, 0.6), 0 0 20px rgba(217, 70, 239, 0.4)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};
