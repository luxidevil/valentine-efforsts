import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Upload, X, ArrowLeft, Loader2, Sparkles, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API = "/api";

const CardCreator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    girlfriend_name: "",
    sender_name: "",
    description: "",
    photos: [],
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    files.forEach((file) => {
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
    if (!formData.girlfriend_name || !formData.sender_name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/cards`, formData);
      toast.success("Valentine's card created!");
      navigate(`/card/${response.data.id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("Failed to create card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.girlfriend_name || !formData.sender_name)) {
      toast.error("Please enter both names");
      return;
    }
    if (step === 2 && formData.photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    if (step === 3 && !formData.description) {
      toast.error("Please write something about her");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] to-valentine-bg py-8 px-4">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => (step > 1 ? prevStep() : navigate("/"))}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-valentine-primary hover:text-valentine-primary-hover transition-colors font-lato"
        data-testid="back-button"
      >
        <ArrowLeft size={20} />
        <span className="hidden md:inline">Back</span>
      </motion.button>

      {/* Progress Indicator */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                s === step
                  ? "bg-valentine-primary scale-125"
                  : s < step
                  ? "bg-valentine-rose"
                  : "bg-valentine-pink"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Names */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Heart className="w-12 h-12 text-valentine-primary mx-auto mb-4 heart-pulse" fill="currentColor" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Who's the Lucky One?
                </h2>
                <p className="font-lato text-gray-600">Let's start with the basics</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-lato text-sm text-valentine-primary-text mb-2">
                    Her Name
                  </label>
                  <Input
                    data-testid="girlfriend-name-input"
                    placeholder="Enter her name..."
                    value={formData.girlfriend_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, girlfriend_name: e.target.value }))}
                    className="border-valentine-gold-accent focus:ring-valentine-pink text-center font-playfair text-lg"
                  />
                </div>

                <div>
                  <label className="block font-lato text-sm text-valentine-primary-text mb-2">
                    Your Name
                  </label>
                  <Input
                    data-testid="sender-name-input"
                    placeholder="Enter your name..."
                    value={formData.sender_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sender_name: e.target.value }))}
                    className="border-valentine-gold-accent focus:ring-valentine-pink text-center font-playfair text-lg"
                  />
                </div>
              </div>

              <Button
                data-testid="step1-next-button"
                onClick={nextStep}
                className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl transition-all"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Camera className="w-12 h-12 text-valentine-primary mx-auto mb-4" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Your Favorite Memories
                </h2>
                <p className="font-lato text-gray-600">Upload photos of you two together (max 5)</p>
              </div>

              {/* Photo Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-valentine-gold-accent rounded-xl p-8 text-center cursor-pointer hover:border-valentine-primary hover:bg-valentine-pink/10 transition-all"
                data-testid="photo-upload-area"
              >
                <Upload className="w-12 h-12 text-valentine-rose mx-auto mb-4" />
                <p className="font-lato text-valentine-primary-text">
                  Click to upload photos
                </p>
                <p className="font-lato text-sm text-gray-500 mt-1">
                  PNG, JPG up to 10MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  data-testid="photo-upload-input"
                />
              </div>

              {/* Photo Preview */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {formData.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-valentine-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`remove-photo-${index}`}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              <Button
                data-testid="step2-next-button"
                onClick={nextStep}
                className="w-full mt-8 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl transition-all"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-valentine-gold mx-auto mb-4" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Tell Us About Her
                </h2>
                <p className="font-lato text-gray-600">
                  Our AI will create a personalized poem based on this
                </p>
              </div>

              <Textarea
                data-testid="description-textarea"
                placeholder={`What makes ${formData.girlfriend_name || "her"} special? What do you love about her? Share your favorite memories together...`}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[200px] border-valentine-gold-accent focus:ring-valentine-pink font-lato resize-none"
              />

              <p className="text-right text-sm text-gray-500 mt-2">
                {formData.description.length} characters
              </p>

              <Button
                data-testid="step3-next-button"
                onClick={nextStep}
                className="w-full mt-6 rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl transition-all"
              >
                Preview & Create
              </Button>
            </motion.div>
          )}

          {/* Step 4: Preview & Submit */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <Heart className="w-12 h-12 text-valentine-primary mx-auto mb-4 heart-pulse" fill="currentColor" />
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-valentine-primary-text mb-2">
                  Ready to Create Magic?
                </h2>
                <p className="font-lato text-gray-600">Review your card details</p>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-xl p-6 shadow-inner mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-valentine-pink">
                    {formData.photos[0] && (
                      <img
                        src={formData.photos[0]}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-valentine-primary-text">
                      For {formData.girlfriend_name}
                    </h3>
                    <p className="font-lato text-sm text-gray-500">
                      From {formData.sender_name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {formData.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-12 object-cover rounded"
                    />
                  ))}
                </div>

                <p className="font-lato text-sm text-gray-600 line-clamp-3">
                  {formData.description}
                </p>
              </div>

              <Button
                data-testid="create-card-button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-full py-6 bg-valentine-primary text-white font-playfair font-bold shadow-lg hover:bg-valentine-primary-hover hover:shadow-xl transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-5 h-5" />
                    Create Valentine's Card
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

export default CardCreator;
