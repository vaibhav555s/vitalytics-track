import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const FloatingActionButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/add-reading")}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full gradient-primary shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Plus className="h-8 w-8 text-white" />
    </motion.button>
  );
};
