import { motion } from "framer-motion";
import { Heart, Lock } from "lucide-react";

const LoveNoteReveal = ({ note, isRevealed, onReveal, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onReveal}
      className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
        isRevealed ? "bg-valentine-paper" : "bg-valentine-pink hover:bg-valentine-rose"
      }`}
      data-testid={`love-note-${index}`}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Heart Icon */}
        <motion.div
          animate={isRevealed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isRevealed ? "bg-valentine-primary" : "bg-white/50"
          }`}
        >
          {isRevealed ? (
            <Heart size={24} className="text-white" fill="white" />
          ) : (
            <Lock size={20} className="text-valentine-primary-text" />
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          {isRevealed ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-script text-xl text-valentine-primary-text"
            >
              {note}
            </motion.p>
          ) : (
            <div className="space-y-2">
              <div className="h-4 bg-white/30 rounded w-3/4" />
              <div className="h-3 bg-white/20 rounded w-1/2" />
            </div>
          )}
        </div>

        {/* Tap indicator */}
        {!isRevealed && (
          <span className="text-xs font-lato text-valentine-primary-text bg-white/50 px-2 py-1 rounded-full">
            Tap
          </span>
        )}
      </div>

      {/* Confetti particles when revealed */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "50%",
                y: "50%",
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className="absolute w-2 h-2 rounded-full bg-valentine-gold"
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoveNoteReveal;
