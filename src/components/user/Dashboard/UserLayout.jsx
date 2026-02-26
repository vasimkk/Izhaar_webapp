import Header from "./Header";
import BottomNavBar from "./BottomNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef } from "react";

export default function UserLayout({ children, activeRoute, showHeader = true, showBottomNav = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Tab routes in order - added dashboard to the list
  const tabs = [
    '/user/dashboard',
    '/user/confession',
    '/user/reels',
    '/user/chat-interface',
    '/user/profile'
  ];

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    const threshold = 50; // Lower threshold for better sensitivity

    // Only trigger if horizontal movement is significantly larger than vertical
    if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > threshold) {
      const currentIndex = tabs.findIndex(route => location.pathname.startsWith(route));

      if (currentIndex !== -1) {
        if (diffX > 0) {
          // Swipe Left -> Next Tab
          if (currentIndex < tabs.length - 1) {
            navigate(tabs[currentIndex + 1]);
          }
        } else {
          // Swipe Right -> Previous Tab
          if (currentIndex > 0) {
            navigate(tabs[currentIndex - 1]);
          }
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
        backgroundAttachment: 'fixed'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Vertical Stripes Background (Kept but subtler) */}
      <div className="bg-lines">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-line" style={{
            backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
          }} />
        ))}
      </div>

      {/* Re-restored Animated Background Elements */}
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

        {/* Tiny Twinkling Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white z-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              clipPath: 'polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%)',
              animation: `sparkle ${Math.random() * 4 + 3}s ease-in-out infinite -${Math.random() * 5}s`
            }}
          />
        ))}
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


