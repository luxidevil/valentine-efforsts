import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import CardCreator from "./pages/CardCreator";
import ViewCard from "./pages/ViewCard";

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
    </div>
  );
}

export default App;
