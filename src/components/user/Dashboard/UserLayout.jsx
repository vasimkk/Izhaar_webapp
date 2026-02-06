import Header from "./Header";
import BottomNavBar from "./BottomNavBar";

export default function UserLayout({ children, activeRoute, showHeader = true }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Animation Styles */}
      <style>{`
        @keyframes blast-pulse {
          0% { transform: scale(0); opacity: 0; }
          40% { opacity: 1; transform: scale(1.2); }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes petal-fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }
          100% { transform: translateY(110vh) translateX(-20px) rotate(360deg); opacity: 0; }
        }

        .blast-particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(3px);
          z-index: 2;
        }
        .petal {
          position: absolute;
          background: linear-gradient(45deg, #fda4af, #e11d48);
          border-radius: 100% 0% 100% 0%;
          filter: drop-shadow(0 0 5px rgba(225, 29, 72, 0.3));
          z-index: 1;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

        {/* Multi-colored Sparks/Blasts */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`blast-${i}`}
            className="blast-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 5 + 3}px`,
              height: `${Math.random() * 5 + 3}px`,
              backgroundColor: ['#EC4899', '#A855F7', '#60A5FA', '#F472B6', '#34D399'][Math.floor(Math.random() * 5)],
              animation: `blast-pulse ${Math.random() * 3 + 2}s ease-out infinite -${Math.random() * 5}s`,
              boxShadow: `0 0 ${Math.random() * 20 + 5}px currentColor`
            }}
          />
        ))}

        {/* Falling Rose Petals */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 10}px`, // 10px to 20px
              height: `${Math.random() * 10 + 10}px`,
              animation: `petal-fall ${Math.random() * 10 + 8}s linear infinite -${Math.random() * 10}s`,
              opacity: Math.random() * 0.5 + 0.5,
              background: i % 3 === 0
                ? 'linear-gradient(45deg, #fda4af, #be123c)' // Dark Rose
                : i % 3 === 1
                  ? 'linear-gradient(45deg, #f9a8d4, #db2777)' // Pink
                  : 'linear-gradient(45deg, #fecdd3, #fb7185)' // Light Rose
            }}
          />
        ))}

        {/* Tiny Twinkling Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `sparkle-blink ${Math.random() * 4 + 3}s ease-in-out infinite -${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      {showHeader && (
        <div className="relative z-10">
          <hr className="border-white/10" />
          <Header activeRoute={activeRoute} />
          <hr className="border-white/10" />
        </div>
      )}

      {/* Main Content */}
      <div className="pt-2"></div>
      <main className="relative z-10 flex-1">
        {children}
      </main>

      <div className="relative z-10">
        <BottomNavBar />
      </div>
    </div>
  );
}


