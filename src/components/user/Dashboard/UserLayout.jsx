import Header from "./Header";
import BottomNavBar from "./BottomNavBar";

export default function UserLayout({ children, activeRoute, showHeader = true, showBottomNav = true, activeBackground }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{
      background: '#050505',
    }}>
      {/* Animation Styles */}
      <style>{`
        @keyframes blast-pulse {
          0% { transform: scale(0); opacity: 0; }
          40% { opacity: 1; transform: scale(1.2); }
          100% { transform: scale(2.5); opacity: 0; }
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



      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Ambient Base Layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(26, 16, 60, 1) 0%, #050505 100%)
            `
          }}
        />

        {/* Ultra-Wide Dynamic Card Ambient Glow */}
        <div
          className="absolute inset-x-0 top-0 h-screen transition-opacity duration-1000 ease-in-out"
          id="dashboard-ambient-glow"
          style={{
            background: activeBackground
              ? `radial-gradient(circle at 50% 30%, ${activeBackground.includes('#') ? activeBackground.match(/#[a-fA-F0-9]{3,6}/g)[1] || (activeBackground.match(/#[a-fA-F0-9]{3,6}/g)[0] || 'rgba(236, 72, 145, 0.2)') : 'rgba(236, 72, 145, 0.2)'} 0%, transparent 80%)`
              : 'transparent',
            opacity: activeBackground ? 0.3 : 0,
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Header */}
      {showHeader && (
        <div className="relative z-50">
          <Header activeRoute={activeRoute} />
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

