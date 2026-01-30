import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f5f1f8] via-[#f0e8f8] to-[#e8dff5]">
      

      {/* Gradient Background - Light Theme */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      >
        {/* Animated gradient overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.06) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* Coming Soon Content */}
      <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        {/* Icon */}
        <div className="mb-8" style={{ animation: 'fadeInUp 1s ease-out' }}>
          <div className="inline-block p-6 rounded-full backdrop-blur-md" style={{
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(212, 197, 232, 0.3)',
            boxShadow: '0 8px 32px rgba(233, 30, 99, 0.2)'
          }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-16 h-16 md:w-20 md:h-20"
              style={{
                stroke: 'url(#gradient)',
              }}
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E91E63" />
                  <stop offset="100%" stopColor="#9C27B0" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text"
          style={{ 
            animation: 'fadeInUp 1s ease-out 0.2s both, textGlow 3s ease-in-out infinite',
            fontStyle: 'italic',
            fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
            letterSpacing: '1px'
          }}
        >
          Coming Soon
        </h1>

        {/* Subheading */}
        <p 
          className="text-xl sm:text-2xl md:text-3xl text-[#6B5B8E] mb-4 font-medium leading-relaxed"
          style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
        >
          This feature is currently under development
        </p>

        {/* Description */}
        <p 
          className="text-base sm:text-lg md:text-xl text-[#6B5B8E] mb-8 leading-relaxed max-w-2xl mx-auto"
          style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
        >
          We're working hard to bring you something amazing. This feature will be released soon!
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate('/user/dashboard')}
          className="px-8 py-4 rounded-2xl font-semibold text-base md:text-lg transition-all shadow-lg text-white hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2 group"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
            boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
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
          Go Back
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
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
          0%, 100% { text-shadow: 0 0 20px rgba(233, 30, 99, 0.3), 0 0 40px rgba(156, 39, 176, 0.2); }
          50% { text-shadow: 0 0 30px rgba(233, 30, 99, 0.5), 0 0 60px rgba(156, 39, 176, 0.3); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
