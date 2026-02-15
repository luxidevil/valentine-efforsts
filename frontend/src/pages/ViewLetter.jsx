import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Share2, Copy, Check, Loader2, Download, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import FloatingHearts from "../components/FloatingHearts";

const API = "/api";

const TEMPLATE_STYLES = {
  classic: {
    bg: "bg-gradient-to-br from-[#fef9f0] to-[#f5e6d3]",
    paper: "bg-[#fffdf7]",
    border: "border-[#d4a574]",
    accent: "#8B6914",
    headerBg: "bg-gradient-to-r from-[#d4a574] to-[#c49660]",
  },
  modern: {
    bg: "bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0]",
    paper: "bg-white",
    border: "border-[#e91e63]",
    accent: "#C2185B",
    headerBg: "bg-gradient-to-r from-[#e91e63] to-[#f06292]",
  },
  midnight: {
    bg: "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]",
    paper: "bg-[#0f3460]/80",
    border: "border-[#e94560]",
    accent: "#E94560",
    dark: true,
    headerBg: "bg-gradient-to-r from-[#e94560] to-[#f06292]",
  },
  garden: {
    bg: "bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]",
    paper: "bg-white/90",
    border: "border-[#66bb6a]",
    accent: "#2E7D32",
    headerBg: "bg-gradient-to-r from-[#66bb6a] to-[#81c784]",
  },
  sunset: {
    bg: "bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2]",
    paper: "bg-[#fffaf0]",
    border: "border-[#ff9800]",
    accent: "#E65100",
    headerBg: "bg-gradient-to-r from-[#ff9800] to-[#ffb74d]",
  },
  royal: {
    bg: "bg-gradient-to-br from-[#f3e5f5] to-[#e1bee7]",
    paper: "bg-white/90",
    border: "border-[#ab47bc]",
    accent: "#6A1B9A",
    headerBg: "bg-gradient-to-r from-[#ab47bc] to-[#ce93d8]",
  },
};

const FONT_MAP = {
  playfair: "font-playfair",
  script: "font-script",
  lato: "font-lato",
  serif: "font-serif",
};

const COLOR_MAP = {
  "romantic-red": { primary: "#9E2A2B", accent: "#FFD1DC" },
  "blush-pink": { primary: "#E91E63", accent: "#FCE4EC" },
  "ocean-blue": { primary: "#1565C0", accent: "#E3F2FD" },
  "forest-green": { primary: "#2E7D32", accent: "#E8F5E9" },
  "golden-hour": { primary: "#E65100", accent: "#FFF3E0" },
  "royal-purple": { primary: "#6A1B9A", accent: "#F3E5F5" },
  midnight: { primary: "#E94560", accent: "#1A1A2E" },
};

const TYPE_LABELS = {
  love: "Love Letter",
  sorry: "A Heartfelt Apology",
  proposal: "A Special Question",
  anniversary: "Happy Anniversary",
  "miss-you": "I Miss You",
  "first-love": "A Confession",
  "long-distance": "Across the Miles",
  custom: "A Letter For You",
};

const ViewLetter = () => {
  const { letterId } = useParams();
  const navigate = useNavigate();
  const letterRef = useRef(null);
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    fetchLetter();
  }, [letterId]);

  const fetchLetter = async () => {
    try {
      const response = await axios.get(`${API}/letters/${letterId}`);
      setLetter(response.data);
    } catch (error) {
      console.error("Error fetching letter:", error);
      toast.error("Letter not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied!");
    } catch (error) {
      toast.info(`Share this link: ${window.location.href}`, { duration: 5000 });
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = async () => {
    if (!letterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = 210;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidth, Math.max(pdfHeight, 297)],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`love-letter-to-${letter.recipient_name}.pdf`);
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to download PDF. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Heart className="w-16 h-16 text-valentine-primary" fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!letter) return null;

  const tmpl = TEMPLATE_STYLES[letter.template] || TEMPLATE_STYLES.classic;
  const fontClass = FONT_MAP[letter.font] || "font-playfair";
  const colors = COLOR_MAP[letter.color_scheme] || COLOR_MAP["romantic-red"];
  const typeLabel = TYPE_LABELS[letter.letter_type] || "A Letter For You";

  return (
    <div className={`min-h-screen relative overflow-hidden ${tmpl.bg}`}>
      <FloatingHearts />

      <div className="fixed top-6 left-6 z-50">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Home
        </Button>
      </div>

      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <Button
          onClick={copyLink}
          variant="outline"
          className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Share"}
        </Button>
        <Button
          onClick={downloadPDF}
          disabled={downloading}
          variant="outline"
          className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
        >
          {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          PDF
        </Button>
      </div>

      {!showLetter ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mb-8">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Heart size={64} className="text-white" fill="white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${fontClass} text-3xl md:text-4xl font-bold text-center mb-4`}
            style={{ color: colors.primary }}
          >
            Hey {letter.recipient_name}!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-script text-2xl text-center mb-2"
            style={{ color: colors.primary }}
          >
            {letter.sender_name} wrote you something special
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-lato text-gray-600 text-center mb-10"
          >
            {typeLabel}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <Button
              onClick={() => setShowLetter(true)}
              className="rounded-full px-12 py-6 text-white font-playfair font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              style={{ backgroundColor: colors.primary }}
            >
              <Heart className="mr-2 w-5 h-5" fill="white" />
              Open Your Letter
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen py-20 px-4 relative z-10"
        >
          <div className="max-w-2xl mx-auto">
            <div
              ref={letterRef}
              className={`${tmpl.paper} rounded-2xl shadow-2xl overflow-hidden border-2 ${tmpl.border}`}
            >
              <div className={`${tmpl.headerBg} py-6 px-8 text-center`}>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white">{typeLabel}</h2>
              </div>

              <div className="p-8 md:p-12">
                <p
                  className={`${fontClass} text-xl md:text-2xl mb-8`}
                  style={{ color: colors.primary }}
                >
                  My Dearest {letter.recipient_name},
                </p>

                <div
                  className={`${fontClass} text-base md:text-lg leading-relaxed whitespace-pre-line mb-8 ${
                    tmpl.dark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {letter.content}
                </div>

                {letter.photos && letter.photos.length > 0 && (
                  <div className="my-8">
                    <div
                      className={`grid gap-4 ${
                        letter.photos.length === 1
                          ? "grid-cols-1"
                          : letter.photos.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-2 md:grid-cols-3"
                      }`}
                    >
                      {letter.photos.map((photo, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="rounded-xl overflow-hidden shadow-lg"
                        >
                          <img
                            src={photo}
                            alt={`Memory ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-right mt-8">
                  <p
                    className="font-script text-2xl md:text-3xl mb-2"
                    style={{ color: colors.primary }}
                  >
                    With all my love,
                  </p>
                  <p
                    className={`${fontClass} text-xl md:text-2xl font-bold`}
                    style={{ color: colors.primary }}
                  >
                    {letter.sender_name}
                  </p>
                </div>

                <div className="flex justify-center mt-8">
                  <Heart size={24} fill={colors.primary} style={{ color: colors.primary }} />
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={copyLink}
                variant="outline"
                className="rounded-full px-6 py-3 bg-white/80 backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share This Letter
              </Button>
              <Button
                onClick={downloadPDF}
                disabled={downloading}
                className="rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Download PDF
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ViewLetter;
