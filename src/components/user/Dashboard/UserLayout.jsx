import Header from "./Header";
import BottomNavBar from "./BottomNavBar";

export default function UserLayout({ children, activeRoute, showHeader = true, showBottomNav = true }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
      backgroundAttachment: 'fixed'
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



      {/* Login Style Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: '#000' }}>
        {/* Animated gradient overlay for depth - matching login.jsx */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />

        {/* Keeping subtler versions of existing elements for extra depth */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(15)].map((_, i) => (
            <div
              key={`blast-${i}`}
              className="blast-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: ['#EC4891', '#A855F7', '#F472B6'][Math.floor(Math.random() * 3)],
                animation: `blast-pulse ${Math.random() * 5 + 3}s ease-out infinite -${Math.random() * 5}s`,
                boxShadow: `0 0 10px currentColor`
              }}
            />
          ))}
        </div>
        {/* Vertical Stripes Background */}
        <div className="bg-lines">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-line" style={{
              backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
            }} />
          ))}
        </div>
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

