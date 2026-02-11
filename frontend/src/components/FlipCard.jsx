import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const FlipCard = ({ photo, message, isFlipped, onFlip, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onFlip}
      className="flip-card cursor-pointer"
      style={{ perspective: "1000px" }}
      data-testid={`flip-card-${index}`}
    >
      <div
        className={`flip-card-inner relative w-full aspect-square ${
          isFlipped ? "flipped" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Photo */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={photo}
            alt={`Memory ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-valentine-primary/30 to-transparent" />
          <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1.5">
            <Heart size={14} className="text-valentine-primary" fill="currentColor" />
          </div>
          {!isFlipped && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-lato text-valentine-primary-text shadow">
                Tap me!
              </span>
            </div>
          )}
        </div>

        {/* Back - Message */}
        <div
          className="absolute inset-0 rounded-xl bg-valentine-primary flex items-center justify-center p-4 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <Heart size={24} className="text-valentine-pink mx-auto mb-3" fill="currentColor" />
            <p className="font-script text-lg md:text-xl text-white leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlipCard;
