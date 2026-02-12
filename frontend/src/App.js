import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Heart } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import CardCreator from "./pages/CardCreator";
import ViewCard from "./pages/ViewCard";

const CustomBadge = () => (
  <a
    href="https://www.linkedin.com/in/kushal-gupta-77949118a/"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 z-[10000] flex items-center gap-2 px-4 py-2 rounded-full bg-valentine-primary text-white font-lato text-sm shadow-lg hover:bg-valentine-primary-hover hover:scale-105 transition-all cursor-pointer"
    style={{ zIndex: 10000 }}
  >
    <span>made by</span>
    <span className="font-bold">luxuriousdevil</span>
    <span>with</span>
    <Heart size={14} fill="currentColor" className="text-valentine-pink" />
  </a>
);

function App() {
  return (
    <div className="App min-h-screen bg-valentine-bg">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CardCreator />} />
          <Route path="/card/:cardId" element={<ViewCard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
      <CustomBadge />
    </div>
  );
}

export default App;
