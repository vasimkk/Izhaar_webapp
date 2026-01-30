import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterSampleImg from '../../../assets/Letter_sample.png';

// Import temp images
import bg1 from '../../../assets/temp/letter_04.png';
import bg2 from '../../../assets/temp/letter_02.png';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_05.png';

const LetterSection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const letterSamples = [
    { 
      id: 1, 
      title: 'Love Letter', 
      cover: bg1, 
      prompt: '💕 Express your deepest love and affection with heartfelt words that will touch their soul' 
    },
    { 
      id: 2, 
      title: 'Romantic Letter', 
      cover: bg2, 
      prompt: 'Ignite the spark with romantic prose that captures the magic of your connection' 
    },
    { 
      id: 3, 
      title: 'Gratitude Letter', 
      cover: bg3, 
      prompt: 'Show appreciation and thank someone special for their kindness and support' 
    },
    { 
      id: 4, 
      title: 'Apology Letter', 
      cover: bg4, 
      prompt: ' Mend hearts with sincere words of regret and commitment to change' 
    },
  ];

  return (
    <div className="letter-section" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      padding: '40px 20px'
    }}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .flip-card {
          perspective: 1000px;
          cursor: pointer;
          height: 350px;
          position: relative;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .flip-card-front {
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .flip-card-back {
          background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%);
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .flip-card-front::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.4));
        }

        .flip-card-content {
          position: relative;
          z-index: 2;
          padding: 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px 10px 0 0;
        }

        .flip-card-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: #E91E63;
        }

        .flip-card-prompt {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .flip-card-button {
          padding: 10px 25px;
          background: white;
          color: #E91E63;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .flip-card-button:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .letter-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 40px 0;
          max-width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .letter-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 20px 0;
          }

          .flip-card {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .letter-gallery-grid {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 20px 0;
          }

          .flip-card {
            height: 280px;
          }

          .flip-card-content {
            padding: 15px;
          }

          .flip-card-content h3 {
            font-size: 16px;
          }

          .flip-card-prompt {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="magazine-header text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3" style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}>Izhaar Letter Samples</h1>
          <p className="text-[#6B5B8E] text-lg mb-6">Express your deepest feelings through beautifully crafted letters</p>
          <button
            className="explore-more-btn pt-5" 
            style={{
               padding: '12px 32px',
               fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(233, 30, 99, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            onClick={() => navigate('/user/letter-izhaar')}
          >
            Create Your Letter ➜
          </button>
        </div>

        {/* Two Column Layout */}
        <div>
          {/* Letter Flip Cards - Full Width */}
          <div className="letter-gallery-grid">
            {letterSamples.map((letter) => (
              <div
                key={letter.id}
                className="flip-card"
                onMouseEnter={() => setHoveredCard(letter.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flip-card-inner">
                  {/* Front Side - Cover Image */}
                  <div 
                    className="flip-card-front"
                    style={{
                      backgroundImage: `url(${letter.cover})`,
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '0'
                    }}
                  >
                    <div style={{
                      background: 'rgba(30, 30, 30, 0.9)',
                      backdropFilter: 'blur(8px)',
                      padding: '18px',
                      width: '100%',
                      borderRadius: '0 0 15px 15px'
                    }}>
                      <h3 style={{
                        margin: '0 0 6px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#fff',
                        letterSpacing: '0.3px'
                      }}>{letter.title}</h3>
                      <p style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: '1.4',
                        margin: '0 0 12px 0',
                        fontWeight: '400'
                      }}>
                        {letter.id === 1 && "Express your heart's deepest affection with every heartfelt word"}
                        {letter.id === 2 && "Ignite the spark of romance with your magical words"}
                        {letter.id === 3 && "Show gratitude to the beautiful souls in your life"}
                        {letter.id === 4 && "Mend broken hearts with sincere and deeply touching words"}
                      </p>
                      
                    </div>
                  </div>

                  {/* Back Side - Prompt */}
                  <div className="flip-card-back">
                    <div className="flip-card-prompt">
                      {letter.prompt}
                    </div>
                    <button 
                      className="flip-card-button"
                      onClick={() => navigate('/user/letter-izhaar')}
                    >
                      Create Letter ➜
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterSection;
