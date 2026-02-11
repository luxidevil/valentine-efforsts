import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import FloatingHearts from "../components/FloatingHearts";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
      <FloatingHearts />
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Decorative elements */}
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

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          {/* Logo/Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mb-8 inline-block"
          >
            <div className="w-24 h-24 rounded-full bg-valentine-primary flex items-center justify-center shadow-lg shadow-valentine-primary/30">
              <Heart size={48} className="text-white" fill="white" />
            </div>
          </motion.div>

          {/* Title */}
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

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-lato text-base md:text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Surprise your special someone with an interactive Valentine's card 
            filled with your memories, love notes, and AI-crafted poetry just for her.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Button
              data-testid="hero-cta-button"
              onClick={() => navigate("/create")}
              className="rounded-full px-10 py-6 bg-valentine-primary text-white font-playfair font-bold text-lg tracking-wide shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
            >
              <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              Create Her Valentine
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
        >
          {[
            { icon: "💝", text: "Love Notes" },
            { icon: "✨", text: "Animations" },
            { icon: "📸", text: "Photo Gallery" },
            { icon: "💌", text: "AI Poetry" },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <p className="font-lato text-sm text-valentine-primary-text font-medium">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-valentine-pink/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default LandingPage;
