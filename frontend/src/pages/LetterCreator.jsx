import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Upload, X, ArrowLeft, Loader2, Sparkles,
  PenTool, Palette, Type, Image as ImageIcon
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = "/api";

const LETTER_TYPES = [
  { id: "love", label: "Love Letter", emoji: "💕", desc: "Express your deepest feelings" },
  { id: "sorry", label: "Apology Letter", emoji: "🥺", desc: "Make things right again" },
  { id: "proposal", label: "Proposal Letter", emoji: "💍", desc: "Pop the big question" },
  { id: "anniversary", label: "Anniversary", emoji: "🎉", desc: "Celebrate your journey" },
  { id: "miss-you", label: "I Miss You", emoji: "🌙", desc: "When distance feels too much" },
  { id: "first-love", label: "First Love", emoji: "🦋", desc: "Confess your feelings" },
  { id: "long-distance", label: "Long Distance", emoji: "✈️", desc: "Bridge the miles between" },
  { id: "custom", label: "Custom Letter", emoji: "✨", desc: "Write anything you want" },
];

const TONES = [
  { id: "romantic", label: "Romantic", emoji: "🌹" },
  { id: "poetic", label: "Poetic", emoji: "📜" },
  { id: "funny", label: "Funny & Sweet", emoji: "😄" },
  { id: "emotional", label: "Deep & Emotional", emoji: "💧" },
  { id: "casual", label: "Casual & Warm", emoji: "☀️" },
  { id: "dramatic", label: "Dramatic & Grand", emoji: "🎭" },
];

const TEMPLATES = [
  { id: "classic", label: "Classic Elegance", preview: "bg-gradient-to-br from-[#fef9f0] to-[#f5e6d3]", border: "border-[#d4a574]" },
  { id: "modern", label: "Modern Love", preview: "bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0]", border: "border-[#e91e63]" },
  { id: "midnight", label: "Midnight Romance", preview: "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]", border: "border-[#e94560]", dark: true },
  { id: "garden", label: "Secret Garden", preview: "bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]", border: "border-[#4caf50]" },
  { id: "sunset", label: "Golden Sunset", preview: "bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2]", border: "border-[#ff9800]" },
  { id: "royal", label: "Royal Purple", preview: "bg-gradient-to-br from-[#f3e5f5] to-[#e1bee7]", border: "border-[#9c27b0]" },
];

const FONTS = [
  { id: "playfair", label: "Playfair Display", class: "font-playfair" },
  { id: "script", label: "Dancing Script", class: "font-script" },
  { id: "lato", label: "Lato (Clean)", class: "font-lato" },
  { id: "serif", label: "Classic Serif", class: "font-serif" },
];

const COLOR_SCHEMES = [
  { id: "romantic-red", label: "Romantic Red", primary: "#9E2A2B", accent: "#FFD1DC" },
  { id: "blush-pink", label: "Blush Pink", primary: "#E91E63", accent: "#FCE4EC" },
  { id: "ocean-blue", label: "Ocean Blue", primary: "#1565C0", accent: "#E3F2FD" },
  { id: "forest-green", label: "Forest Green", primary: "#2E7D32", accent: "#E8F5E9" },
  { id: "golden-hour", label: "Golden Hour", primary: "#E65100", accent: "#FFF3E0" },
  { id: "royal-purple", label: "Royal Purple", primary: "#6A1B9A", accent: "#F3E5F5" },
  { id: "midnight", label: "Midnight", primary: "#E94560", accent: "#1A1A2E" },
];

const CONTEXT_PROMPTS = {
  love: "Tell us about your relationship, what you love about them, special memories you share, things that make them unique...",
  sorry: "What happened? What was the fight/disagreement about? What do you wish you had done differently? What do you want to promise?",
  proposal: "How did you meet? What's your journey together been like? What made you realize they're the one? Special moments...",
  anniversary: "How long have you been together? Best memories, milestones, how they've changed your life, what you look forward to...",
  "miss-you": "Why are you apart? What do you miss most? Your favorite things to do together, how you picture your reunion...",
  "first-love": "How do you feel around them? What makes your heart race? What do you admire about them? How long have you liked them?",
  "long-distance": "How far apart are you? How long have you been apart? What keeps you going? When do you next see each other?",
  custom: "Describe what you want the letter to be about. Give as much detail as possible about the person, your relationship, and what message you want to convey...",
};

const LetterCreator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    letter_type: "",
    recipient_name: "",
    sender_name: "",
    context: "",
    custom_prompt: "",
    tone: "romantic",
    photos: [],
    template: "classic",
    font: "playfair",
    color_scheme: "romantic-red",
  });

  const totalSteps = 5;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, e.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.recipient_name || !formData.sender_name) {
      toast.error("Please fill in both names");
      return;
    }
    if (!formData.context) {
      toast.error("Please add some details");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/letters`, formData);
      toast.success("Your letter has been created!");
      navigate(`/letter/${response.data.id}`);
    } catch (error) {
      console.error("Error creating letter:", error);
      toast.error("Failed to create letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.letter_type) {
      toast.error("Please choose a letter type");
      return;
    }
    if (step === 2 && (!formData.recipient_name || !formData.sender_name)) {
      toast.error("Please enter both names");
      return;
    }
    if (step === 3 && !formData.context) {
      toast.error("Please tell us the details");
      return;
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const selectedType = LETTER_TYPES.find((t) => t.id === formData.letter_type);
  const selectedTemplate = TEMPLATES.find((t) => t.id === formData.template);
  const selectedFont = FONTS.find((f) => f.id === formData.font);
  const selectedColor = COLOR_SCHEMES.find((c) => c.id === formData.color_scheme);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] to-valentine-bg py-8 px-4">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => (step > 1 ? prevStep() : navigate("/"))}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-valentine-primary hover:text-valentine-primary-hover transition-colors font-lato"
      >
        <ArrowLeft size={20} />
        <span className="hidden md:inline">Back</span>
      </motion.button>

      <div className="max-w-md mx-auto mb-8 mt-4">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? "bg-valentine-primary w-8" : s < step ? "bg-valentine-rose w-4" : "bg-valentine-pink w-4"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-2 font-lato">
          Step {step} of {totalSteps}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <PenTool className="w-12 h-12 text-valentine-primary mx-auto mb-4" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  What Kind of Letter?
                </h2>
                <p className="font-lato text-gray-600">Choose the type that fits your heart</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LETTER_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormData((prev) => ({ ...prev, letter_type: type.id }))}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      formData.letter_type === type.id
                        ? "border-valentine-primary bg-valentine-pink/30 shadow-md"
                        : "border-transparent bg-white/60 hover:bg-white/80"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{type.emoji}</span>
                    <span className="font-playfair font-bold text-sm text-valentine-primary-text block">{type.label}</span>
                    <span className="font-lato text-xs text-gray-500">{type.desc}</span>
                  </motion.button>
                ))}
              </div>

              <Button onClick={nextStep} className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover transition-all">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Heart className="w-12 h-12 text-valentine-primary mx-auto mb-4" fill="currentColor" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Who Is This For?
                </h2>
                <p className="font-lato text-gray-600">The names that matter most</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-lato text-sm text-valentine-primary-text mb-2">Their Name</label>
                  <Input
                    placeholder="Enter their name..."
                    value={formData.recipient_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, recipient_name: e.target.value }))}
                    className="border-valentine-gold-accent focus:ring-valentine-pink text-center font-playfair text-lg"
                  />
                </div>
                <div>
                  <label className="block font-lato text-sm text-valentine-primary-text mb-2">Your Name</label>
                  <Input
                    placeholder="Enter your name..."
                    value={formData.sender_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sender_name: e.target.value }))}
                    className="border-valentine-gold-accent focus:ring-valentine-pink text-center font-playfair text-lg"
                  />
                </div>

                <div>
                  <label className="block font-lato text-sm text-valentine-primary-text mb-3">Choose the Tone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setFormData((prev) => ({ ...prev, tone: tone.id }))}
                        className={`p-3 rounded-lg text-center transition-all border-2 ${
                          formData.tone === tone.id
                            ? "border-valentine-primary bg-valentine-pink/30"
                            : "border-transparent bg-white/60 hover:bg-white/80"
                        }`}
                      >
                        <span className="text-lg block">{tone.emoji}</span>
                        <span className="font-lato text-xs text-valentine-primary-text">{tone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={nextStep} className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover transition-all">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-valentine-gold mx-auto mb-4" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  {selectedType?.id === "sorry" ? "What Happened?" : "Tell Us Everything"}
                </h2>
                <p className="font-lato text-gray-600">
                  {selectedType?.id === "sorry"
                    ? "The more honest you are, the more heartfelt the letter"
                    : "The more details, the more personal the letter"}
                </p>
              </div>

              <Textarea
                placeholder={CONTEXT_PROMPTS[formData.letter_type] || CONTEXT_PROMPTS.love}
                value={formData.context}
                onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
                className="min-h-[180px] border-valentine-gold-accent focus:ring-valentine-pink font-lato resize-none"
              />
              <p className="text-right text-sm text-gray-500 mt-2">{formData.context.length} characters</p>

              {formData.letter_type === "custom" && (
                <div className="mt-4">
                  <label className="block font-lato text-sm text-valentine-primary-text mb-2">
                    Special Instructions (optional)
                  </label>
                  <Textarea
                    placeholder="Any specific things you want mentioned? Style preferences? Special phrases to include?"
                    value={formData.custom_prompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, custom_prompt: e.target.value }))}
                    className="min-h-[100px] border-valentine-gold-accent focus:ring-valentine-pink font-lato resize-none"
                  />
                </div>
              )}

              <div className="mt-6">
                <label className="block font-lato text-sm text-valentine-primary-text mb-3">
                  Add Photos (optional, max 6)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-valentine-gold-accent rounded-xl p-6 text-center cursor-pointer hover:border-valentine-primary hover:bg-valentine-pink/10 transition-all"
                >
                  <ImageIcon className="w-8 h-8 text-valentine-rose mx-auto mb-2" />
                  <p className="font-lato text-sm text-valentine-primary-text">Click to upload images</p>
                  <p className="font-lato text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {formData.photos.map((photo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded-lg shadow-md" />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-valentine-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={nextStep} className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover transition-all">
                Choose Your Design
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Palette className="w-12 h-12 text-valentine-primary mx-auto mb-4" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Design Your Letter
                </h2>
                <p className="font-lato text-gray-600">Make it uniquely yours</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-lato text-sm font-medium text-valentine-primary-text mb-3">
                    <Palette size={14} className="inline mr-1" /> Template
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setFormData((prev) => ({ ...prev, template: tmpl.id }))}
                        className={`rounded-xl overflow-hidden transition-all border-2 ${
                          formData.template === tmpl.id ? "border-valentine-primary shadow-lg scale-105" : "border-transparent"
                        }`}
                      >
                        <div className={`h-16 ${tmpl.preview}`} />
                        <p className="font-lato text-xs py-2 text-valentine-primary-text">{tmpl.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-lato text-sm font-medium text-valentine-primary-text mb-3">
                    <Type size={14} className="inline mr-1" /> Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {FONTS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFormData((prev) => ({ ...prev, font: font.id }))}
                        className={`p-3 rounded-xl transition-all border-2 ${
                          formData.font === font.id
                            ? "border-valentine-primary bg-valentine-pink/30"
                            : "border-transparent bg-white/60 hover:bg-white/80"
                        }`}
                      >
                        <span className={`${font.class} text-lg text-valentine-primary-text`}>Aa Bb Cc</span>
                        <p className="font-lato text-xs text-gray-500 mt-1">{font.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-lato text-sm font-medium text-valentine-primary-text mb-3">
                    Color Scheme
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_SCHEMES.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setFormData((prev) => ({ ...prev, color_scheme: color.id }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border-2 ${
                          formData.color_scheme === color.id
                            ? "border-valentine-primary shadow-md"
                            : "border-transparent bg-white/60"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.primary }} />
                        <span className="font-lato text-xs">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={nextStep} className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover transition-all">
                Preview & Create
              </Button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Heart className="w-12 h-12 text-valentine-primary mx-auto mb-4 heart-pulse" fill="currentColor" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Ready to Create?
                </h2>
                <p className="font-lato text-gray-600">Review your letter details</p>
              </div>

              <div className={`rounded-xl p-6 shadow-inner mb-6 border-2 ${selectedTemplate?.preview} ${selectedTemplate?.border}`}>
                <div className="text-center mb-4">
                  <span className="text-3xl">{selectedType?.emoji}</span>
                  <h3 className={`${selectedFont?.class || "font-playfair"} text-xl font-bold mt-2`} style={{ color: selectedColor?.primary }}>
                    {selectedType?.label}
                  </h3>
                </div>
                <div className="space-y-2 text-sm font-lato">
                  <p><span className="font-bold">To:</span> {formData.recipient_name}</p>
                  <p><span className="font-bold">From:</span> {formData.sender_name}</p>
                  <p><span className="font-bold">Tone:</span> {TONES.find((t) => t.id === formData.tone)?.label}</p>
                  <p><span className="font-bold">Template:</span> {selectedTemplate?.label}</p>
                  <p><span className="font-bold">Font:</span> {selectedFont?.label}</p>
                  <p><span className="font-bold">Colors:</span> {selectedColor?.label}</p>
                  {formData.photos.length > 0 && (
                    <p><span className="font-bold">Photos:</span> {formData.photos.length} attached</p>
                  )}
                </div>
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.photos.slice(0, 3).map((photo, i) => (
                      <img key={i} src={photo} alt="" className="w-full h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
                <p className={`${selectedFont?.class || "font-lato"} text-sm mt-4 line-clamp-3`} style={{ color: selectedColor?.primary }}>
                  "{formData.context.substring(0, 150)}{formData.context.length > 150 ? "..." : ""}"
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Writing Your Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-5 h-5" />
                    Generate My Letter
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LetterCreator;
