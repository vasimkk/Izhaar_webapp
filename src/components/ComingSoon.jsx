import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
      }}
    >
      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />

        {/* Floating Sparkles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.1,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto relative z-10">
        {/* Icon */}
        <div className="mb-8 flex justify-center" style={{ animation: 'fadeInUp 1s ease-out' }}>
          <div className="p-8 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(236,72,153,0.3)] bg-white/5 animate-float" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="url(#icon-gradient)"
              className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              <defs>
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F472B6" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{
            animation: 'fadeInUp 1s ease-out 0.2s both, textGlow 3s ease-in-out infinite',
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(to right, #F472B6, #fff, #A855F7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px'
          }}
        >
          Coming Soon
        </h1>

        {/* Subheading */}
        <p
          className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-4 font-light leading-relaxed"
          style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
        >
          Something magical is brewing...
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
        >
          We are crafting this feature with love and care. Use the dashboard to explore other amazing features meanwhile!
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate('/user/dashboard')}
          className="px-10 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 inline-flex items-center justify-center gap-2 group border border-white/20 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes textGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
