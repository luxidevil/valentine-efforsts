import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Copy, Check, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import confetti from "canvas-confetti";
import FloatingHearts from "../components/FloatingHearts";
import ScratchCard from "../components/ScratchCard";
import FlipCard from "../components/FlipCard";
import LoveNoteReveal from "../components/LoveNoteReveal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ViewCard = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [copied, setCopied] = useState(false);
  const [revealedNotes, setRevealedNotes] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [scratchRevealed, setScratchRevealed] = useState(false);

  useEffect(() => {
    fetchCard();
  }, [cardId]);

  const fetchCard = async () => {
    try {
      const response = await axios.get(`${API}/cards/${cardId}`);
      setCard(response.data);
    } catch (error) {
      console.error("Error fetching card:", error);
      toast.error("Card not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#9E2A2B", "#FFD1DC", "#E5989B", "#D4AF37"],
    });
  };

  const triggerHeartBurst = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      shapes: ["circle"],
      colors: ["#9E2A2B", "#FFD1DC", "#E5989B"],
    });
  };

  const handleStartExperience = () => {
    setShowIntro(false);
    triggerConfetti();
  };

  const handleNoteReveal = (index) => {
    if (!revealedNotes.includes(index)) {
      setRevealedNotes([...revealedNotes, index]);
      triggerHeartBurst({ currentTarget: document.body });
    }
  };

  const handleFlipCard = (index) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const handleScratchReveal = () => {
    if (!scratchRevealed) {
      setScratchRevealed(true);
      triggerConfetti();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const goToNextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
      triggerConfetti();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Heart className="w-16 h-16 text-valentine-primary" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
      <FloatingHearts />

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-6 right-6 z-50"
      >
        <Button
          data-testid="share-button"
          onClick={copyLink}
          variant="outline"
          className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm border-valentine-pink hover:bg-valentine-pink/20 transition-all"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Share"}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Intro Screen */}
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-8"
            >
              <div className="w-32 h-32 rounded-full bg-valentine-primary flex items-center justify-center shadow-2xl shadow-valentine-primary/40">
                <Heart size={64} className="text-white" fill="white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-playfair text-3xl md:text-4xl font-bold text-valentine-primary-text text-center mb-4"
            >
              Hey {card.girlfriend_name}!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-script text-2xl md:text-3xl text-valentine-primary text-center mb-2"
            >
              Someone special made this for you
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-lato text-gray-600 text-center mb-10"
            >
              Tap below to discover their love
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                data-testid="start-experience-button"
                onClick={handleStartExperience}
                className="rounded-full px-12 py-6 bg-valentine-primary text-white font-playfair font-bold text-lg shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                <Heart className="mr-2 w-5 h-5" fill="white" />
                Open Your Valentine
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Main Card Experience */}
        {!showIntro && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen py-12 px-4 relative z-10"
          >
            <div className="max-w-2xl mx-auto">
              {/* Section Navigation */}
              <div className="flex justify-center gap-2 mb-8">
                {["💌", "📸", "💝", "✨"].map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSection(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                      currentSection === index
                        ? "bg-valentine-primary scale-110 shadow-lg"
                        : "bg-white/80 hover:bg-valentine-pink/30"
                    }`}
                    data-testid={`section-nav-${index}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Section 0: Poem */}
                {currentSection === 0 && (
                  <motion.div
                    key="poem"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="glass rounded-2xl p-8 shadow-xl text-center"
                    data-testid="poem-section"
                  >
                    <h2 className="font-playfair text-2xl font-bold text-valentine-primary-text mb-6">
                      A Poem Just For You
                    </h2>
                    <div className="bg-valentine-paper rounded-xl p-6 shadow-inner mb-6">
                      <p className="font-script text-2xl md:text-3xl text-valentine-primary leading-relaxed whitespace-pre-line">
                        {card.poem}
                      </p>
                    </div>
                    <p className="font-accent italic text-valentine-primary-text">
                      — With all my love, {card.sender_name}
                    </p>
                    
                    <Button
                      data-testid="next-section-button-0"
                      onClick={goToNextSection}
                      className="mt-8 rounded-full px-8 py-4 bg-valentine-pink text-valentine-primary-text font-playfair hover:bg-valentine-rose transition-all"
                    >
                      See Our Memories →
                    </Button>
                  </motion.div>
                )}

                {/* Section 1: Photos (Flip Cards) */}
                {currentSection === 1 && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="glass rounded-2xl p-8 shadow-xl"
                    data-testid="photos-section"
                  >
                    <h2 className="font-playfair text-2xl font-bold text-valentine-primary-text mb-2 text-center">
                      Our Memories Together
                    </h2>
                    <p className="font-lato text-gray-600 text-center mb-6">
                      Tap each photo to reveal a sweet message
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {card.photos.map((photo, index) => (
                        <FlipCard
                          key={index}
                          photo={photo}
                          message={card.love_notes[index % card.love_notes.length]}
                          isFlipped={flippedCards.includes(index)}
                          onFlip={() => handleFlipCard(index)}
                          index={index}
                        />
                      ))}
                    </div>

                    <Button
                      data-testid="next-section-button-1"
                      onClick={goToNextSection}
                      className="w-full mt-8 rounded-full px-8 py-4 bg-valentine-pink text-valentine-primary-text font-playfair hover:bg-valentine-rose transition-all"
                    >
                      Discover Love Notes →
                    </Button>
                  </motion.div>
                )}

                {/* Section 2: Love Notes */}
                {currentSection === 2 && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="glass rounded-2xl p-8 shadow-xl"
                    data-testid="notes-section"
                  >
                    <h2 className="font-playfair text-2xl font-bold text-valentine-primary-text mb-2 text-center">
                      Hidden Love Notes
                    </h2>
                    <p className="font-lato text-gray-600 text-center mb-6">
                      Tap each heart to reveal a secret message
                    </p>

                    <div className="space-y-4">
                      {card.love_notes.map((note, index) => (
                        <LoveNoteReveal
                          key={index}
                          note={note}
                          isRevealed={revealedNotes.includes(index)}
                          onReveal={() => handleNoteReveal(index)}
                          index={index}
                        />
                      ))}
                    </div>

                    <Button
                      data-testid="next-section-button-2"
                      onClick={goToNextSection}
                      className="w-full mt-8 rounded-full px-8 py-4 bg-valentine-pink text-valentine-primary-text font-playfair hover:bg-valentine-rose transition-all"
                    >
                      Final Surprise →
                    </Button>
                  </motion.div>
                )}

                {/* Section 3: Scratch Card */}
                {currentSection === 3 && (
                  <motion.div
                    key="scratch"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="glass rounded-2xl p-8 shadow-xl text-center"
                    data-testid="scratch-section"
                  >
                    <h2 className="font-playfair text-2xl font-bold text-valentine-primary-text mb-2">
                      A Special Surprise
                    </h2>
                    <p className="font-lato text-gray-600 mb-6">
                      Scratch below to reveal your final message
                    </p>

                    <ScratchCard
                      message={card.scratch_message}
                      onReveal={handleScratchReveal}
                      isRevealed={scratchRevealed}
                    />

                    {scratchRevealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8"
                      >
                        <p className="font-script text-3xl text-valentine-primary mb-4">
                          Happy Valentine's Day!
                        </p>
                        <p className="font-accent italic text-valentine-primary-text">
                          Forever yours, {card.sender_name}
                        </p>
                        
                        <div className="flex gap-4 justify-center mt-8">
                          <Button
                            data-testid="view-again-button"
                            onClick={() => setCurrentSection(0)}
                            variant="outline"
                            className="rounded-full px-6 py-3 border-valentine-primary text-valentine-primary hover:bg-valentine-pink/20"
                          >
                            View Again
                          </Button>
                          <Button
                            data-testid="share-final-button"
                            onClick={copyLink}
                            className="rounded-full px-6 py-3 bg-valentine-primary text-white hover:bg-valentine-primary-hover"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Love
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewCard;
