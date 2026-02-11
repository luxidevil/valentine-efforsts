import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ScratchCard = ({ message, onReveal, isRevealed }) => {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with scratch-off layer
    ctx.fillStyle = "#9E2A2B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern/design
    ctx.fillStyle = "#7C1F20";
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 20 + 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text
    ctx.font = "bold 24px 'Playfair Display', serif";
    ctx.fillStyle = "#FFD1DC";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Me!", canvas.width / 2, canvas.height / 2);
  }, []);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const percent = (transparent / (imageData.data.length / 4)) * 100;
    setScratchPercent(percent);

    if (percent > 50 && !isRevealed) {
      onReveal();
    }
  };

  const handleMouseMove = (e) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scratch(x, y);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    scratch(x, y);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Hidden message underneath */}
      <div className="absolute inset-0 bg-valentine-paper rounded-2xl p-8 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0.3 }}
          className="font-script text-2xl md:text-3xl text-valentine-primary text-center leading-relaxed"
        >
          {message}
        </motion.p>
      </div>

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        className={`scratch-canvas relative rounded-2xl w-full h-48 md:h-64 ${
          isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500`}
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseLeave={() => setIsScratching(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={handleTouchMove}
        data-testid="scratch-canvas"
      />

      {/* Progress indicator */}
      {!isRevealed && scratchPercent > 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 rounded-full px-3 py-1">
          <span className="text-xs text-valentine-primary font-lato">
            {Math.round(scratchPercent)}% revealed
          </span>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
