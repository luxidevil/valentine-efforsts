import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, ArrowRight, PenTool } from "lucide-react";
import FloatingHearts from "../components/FloatingHearts";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFF0F5] to-valentine-bg">
      <FloatingHearts />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute top-10 left-10 text-valentine-pink opacity-30">
          <Heart size={60} fill="currentColor" />
        </div>
        
        <div className="absolute top-20 right-16 text-valentine-rose opacity-30">
          <Heart size={40} fill="currentColor" />
        </div>

        <div className="text-center max-w-3xl">
          <div className="mb-8 inline-block animate-pulse">
            <div className="w-24 h-24 rounded-full bg-valentine-primary flex items-center justify-center shadow-lg shadow-valentine-primary/30">
              <Heart size={48} className="text-white" fill="white" />
            </div>
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-valentine-primary-text mb-6 leading-tight">
            Create Something
            <br />
            <span className="font-script text-valentine-primary text-5xl sm:text-6xl lg:text-7xl">
              Magical
            </span>
          </h1>

          <p className="font-lato text-base md:text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
            Express your love with AI-powered Valentine's cards and beautiful love letters.
            Personalized, heartfelt, and unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              data-testid="hero-cta-button"
              onClick={() => navigate("/create")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                padding: '16px 40px',
                backgroundColor: '#9E2A2B',
                color: 'white',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 'bold',
                fontSize: '18px',
                letterSpacing: '0.025em',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minWidth: '220px',
              }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
            >
              <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Valentine Card
              <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
            </button>

            <button
              onClick={() => navigate("/letter/create")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                padding: '16px 40px',
                background: 'linear-gradient(to right, #9E2A2B, #C2185B)',
                color: 'white',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 'bold',
                fontSize: '18px',
                letterSpacing: '0.025em',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minWidth: '220px',
              }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
            >
              <PenTool style={{ marginRight: '8px', width: '20px', height: '20px' }} />
              Love Letter
              <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          <div
            onClick={() => navigate("/create")}
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>💝</div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#4A1A2E', fontWeight: '500' }}>Interactive Cards</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Poems & Scratch Reveals</p>
          </div>

          <div
            onClick={() => navigate("/letter/create")}
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>💌</div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#4A1A2E', fontWeight: '500' }}>Love Letters</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>AI-Written & Customizable</p>
          </div>

          <div
            onClick={() => navigate("/letter/create")}
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>🎨</div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#4A1A2E', fontWeight: '500' }}>Custom Designs</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Templates, Fonts & Colors</p>
          </div>

          <div
            onClick={() => navigate("/letter/create")}
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>📄</div>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#4A1A2E', fontWeight: '500' }}>Download PDF</p>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Share or Print</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-valentine-pink/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default LandingPage;
