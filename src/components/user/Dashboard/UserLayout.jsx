import Header from "./Header";
import BottomNavBar from "./BottomNavBar";

export default function UserLayout({ children, activeRoute, showHeader = true, showBottomNav = true }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #2e022d 0%, #1a103c 50%, #050505 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Animation Styles */}
      <style>{`
        @keyframes blast-pulse {
          0% { transform: scale(0); opacity: 0; }
          40% { opacity: 1; transform: scale(1.2); }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes background-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 5px gold); }
        }

        .blast-particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(3px);
          z-index: 2;
        }

        .bg-lines {
          position: absolute;
          inset: 0;
          display: flex;
          pointer-events: none;
          opacity: 0.1;
          z-index: 0;
        }
        .bg-line {
          flex: 1;
          height: 100%;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>



      {/* Login Style Background Colors (Animated) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: '#000' }}>
        {/* Animated radial-gradient overlay to match Login.jsx */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'background-float 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* Header */}
      {showHeader && (
        <div className="relative z-50">
          <hr className="border-white/10" />
          <Header activeRoute={activeRoute} />
          <hr className="border-white/10" />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {showBottomNav && (
        <div className="relative z-10">
          <BottomNavBar />
        </div>
      )}
    </div>
  );
}

