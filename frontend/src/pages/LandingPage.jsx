import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight, PenTool } from "lucide-react";
import { Button } from "../components/ui/button";
import FloatingHearts from "../components/FloatingHearts";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
      <FloatingHearts />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-10 left-10 text-valentine-pink opacity-30"
        >
          <Heart size={60} fill="currentColor" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-20 right-16 text-valentine-rose opacity-30"
        >
          <Heart size={40} fill="currentColor" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mb-8 inline-block"
          >
            <div className="w-24 h-24 rounded-full bg-valentine-primary flex items-center justify-center shadow-lg shadow-valentine-primary/30">
              <Heart size={48} className="text-white" fill="white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-valentine-primary-text mb-6 leading-tight"
          >
            Create Something
            <br />
            <span className="font-script text-valentine-primary text-5xl sm:text-6xl lg:text-7xl">
              Magical
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-lato text-base md:text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Express your love with AI-powered Valentine's cards and beautiful love letters.
            Personalized, heartfelt, and unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              data-testid="hero-cta-button"
              onClick={() => navigate("/create")}
              className="rounded-full px-10 py-6 bg-valentine-primary text-white font-playfair font-bold text-lg tracking-wide shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group w-full sm:w-auto"
            >
              <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Valentine Card
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={() => navigate("/letter/create")}
              className="rounded-full px-10 py-6 bg-gradient-to-r from-[#9E2A2B] to-[#C2185B] text-white font-playfair font-bold text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group w-full sm:w-auto"
            >
              <PenTool className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Love Letter
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            onClick={() => navigate("/create")}
            className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="text-3xl mb-2">💝</div>
            <p className="font-lato text-sm text-valentine-primary-text font-medium">Interactive Cards</p>
            <p className="font-lato text-xs text-gray-500 mt-1">Poems & Scratch Reveals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            onClick={() => navigate("/letter/create")}
            className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="text-3xl mb-2">💌</div>
            <p className="font-lato text-sm text-valentine-primary-text font-medium">Love Letters</p>
            <p className="font-lato text-xs text-gray-500 mt-1">AI-Written & Customizable</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={() => navigate("/letter/create")}
            className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="text-3xl mb-2">🎨</div>
            <p className="font-lato text-sm text-valentine-primary-text font-medium">Custom Designs</p>
            <p className="font-lato text-xs text-gray-500 mt-1">Templates, Fonts & Colors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            onClick={() => navigate("/letter/create")}
            className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer group"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="font-lato text-sm text-valentine-primary-text font-medium">Download PDF</p>
            <p className="font-lato text-xs text-gray-500 mt-1">Share or Print</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-valentine-pink/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default LandingPage;
