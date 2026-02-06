import React from 'react';
import { useNavigate } from 'react-router-dom';
import LetterSampleImg from '../../../assets/Letter_sample.png';

// Import temp images
import bg1 from '../../../assets/temp/letter_04.png';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.png';
import bg4 from '../../../assets/temp/letter_05.png';

const LetterSection = () => {
  const navigate = useNavigate();

  const letterSamples = [
    {
      id: 1,
      title: 'Love Letter',
      cover: bg1,
      prompt: 'Express your deepest love and affection with heartfelt words that will touch their soul'
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
      prompt: 'Mend hearts with sincere words of regret and commitment to change'
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Choose Template',
      description: 'Select from beautifully designed letter templates that match your mood and emotion.'
    },
    {
      number: 2,
      title: 'Write Your Message',
      description: 'Express your feelings with personalized words. Add your unique touch to make it special.'
    },
    {
      number: 3,
      title: 'Customize Style',
      description: 'Choose fonts, colors, and styling to create the perfect presentation for your letter.'
    },
    {
      number: 4,
      title: 'Send & Share',
      description: 'Send your heartfelt message to someone special. Track when they open it.'
    },
  ];

  return (
    <div className="letter-section" style={{
      minHeight: '100vh',
      background: 'transparent',
      padding: '60px 20px'
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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        /* Step Card Styles */
        .step-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 12px 0;
          margin-bottom: 16px;
          transition: transform 0.2s ease;
          display: flex;
          gap: 18px;
          cursor: pointer;
          box-shadow: none;
          position: relative;
          overflow: visible;
        }

        .step-card:hover {
          transform: translateX(6px);
        }

        .step-number {
          min-width: 50px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #EC4899 0%, #A855F7 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #FC7CB1;
        }

        .step-content p {
          margin: 0;
          font-size: 14px;
          color: #e2e8f0;
          line-height: 1.5;
        }

        /* Envelope Styles */
        .envelope-wrapper {
          perspective: 1000px;
          cursor: pointer;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .envelope-wrapper::before {
          content: '';
          position: absolute;
          inset: -35px;
          background: conic-gradient(from 0deg, rgba(233, 30, 99, 0.35), rgba(156, 39, 176, 0.25), rgba(255, 255, 255, 0.4), rgba(233, 30, 99, 0.35));
          border-radius: 50%;
          filter: blur(18px);
          opacity: 0.7;
          z-index: -2;
        }

        .envelope-wrapper::after {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(233, 30, 99, 0.15) 45%, rgba(156, 39, 176, 0.05) 70%, transparent 80%);
          border-radius: 50%;
          filter: blur(10px);
          opacity: 0.9;
          z-index: -1;
        }

        .envelope {
          position: relative;
          width: 100%;
          height: 200px;
          background: #fdfbf7;
          box-shadow: 0 12px 36px -6px rgba(0,0,0,0.35);
          transition: transform 0.3s ease;
          border-radius: 6px;
          overflow: visible;
        }

        .envelope:hover {
          transform: translateY(-5px) rotate(1deg);
        }
        
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: #f2efe9;
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top;
          transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
          z-index: 20;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .envelope.open .envelope-flap {
          transform: rotateX(180deg);
          z-index: 1;
        }
        
        .letter-preview-card {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 86%;
          height: 78%;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          transition: transform 0.8s ease-in-out 0.4s, bottom 0.8s ease-in-out 0.4s;
          z-index: 5;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.12);
        }

        .envelope.open .letter-preview-card {
          transform: translateX(-50%) translateY(-130px) scale(1.08);
          z-index: 30;
        }

        .envelope-pocket {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 130px;
          background: #fff;
          clip-path: polygon(0 0, 50% 42%, 100% 0, 100% 100%, 0 100%);
          z-index: 10;
          background: linear-gradient(180deg, #faf9f6 0%, #f0eeea 100%);
        }
        
        .wax-seal {
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 25;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .envelope.open .wax-seal {
          transform: translate(-50%, -150%) scale(0.5);
          opacity: 0;
        }

        .envelope-title {
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #E91E63;
        }

        .envelope-subtitle {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }

        /* Layout */
        .letter-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: stretch;
        }

        .left-section {
          padding: 8px 0;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .right-section {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          height: 100%;
          padding: 0;
        }

        .right-section .envelope-wrapper {
          max-width: 440px;
          width: 100%;
        }

        .right-section .envelope {
          height: 300px;
        }

        .envelope.auto-open {
          animation: envelope-bob 4s ease-in-out infinite;
        }

        @keyframes envelope-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .envelope.auto-open .envelope-flap {
          animation: flap-open 6s ease-in-out infinite;
        }

        .envelope.auto-open .letter-preview-card {
          animation: letter-slide 6s ease-in-out infinite;
        }

        .envelope.auto-open .wax-seal {
          animation: wax-fade 6s ease-in-out infinite;
        }

        @keyframes flap-open {
          0%, 30% { transform: rotateX(0deg); z-index: 20; }
          40%, 70% { transform: rotateX(180deg); z-index: 1; }
          100% { transform: rotateX(0deg); z-index: 20; }
        }

        @keyframes letter-slide {
          0%, 30% { transform: translateX(-50%) translateY(0) scale(1); }
          40%, 70% { transform: translateX(-50%) translateY(-130px) scale(1.08); }
          100% { transform: translateX(-50%) translateY(0) scale(1); }
        }

        @keyframes wax-fade {
          0%, 30% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          40%, 70% { transform: translate(-50%, -150%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .letter-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .right-section {
            order: 1;
          }

          .left-section {
            order: 2;
          }
        }

        @media (max-width: 768px) {
          .letter-container {
            gap: 30px;
          }

          .step-card {
            padding: 16px;
            gap: 15px;
          }

          .step-card h3 {
            font-size: 16px;
          }

          .step-card p {
            font-size: 13px;
          }

          .right-section {
            padding: 18px;
          }

          .envelope-wrapper {
            max-width: 250px;
          }
        }
      `}</style>

      <div className="text-center mb-16 animate-fadeIn">
        <div className="magazine-header text-center" >
          <h1
            className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
          >
            Customize Letter Now
          </h1>
          <p
            className="text-white !text-white"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}
          >
            We help you express your feelings your way, through thoughtfully crafted and deeply personal experiences.
          </p>
        </div>
        <button
          className="px-8 py-3 rounded-full font-bold text-white transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
            boxShadow: '0 4px 15px rgba(233, 30, 99, 0.4)',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => navigate('/user/letter-izhaar')}
        >
          Start Creating ➜
        </button>
      </div>

      <div className="letter-container">
        {/* LEFT SECTION - Steps */}
        <div className="left-section animate-slideInLeft">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#FC7CB1' }}>How It Works</h2>
          {steps.map((step, index) => (
            <div key={step.number} className="step-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SECTION - Single Envelope Preview */}
        <div className="right-section animate-slideInRight">
          {letterSamples.slice(0, 1).map((letter, index) => (
            <div key={letter.id} style={{ animationDelay: `${index * 0.1}s`, width: '100%' }}>
              <div className="envelope-wrapper">
                <div id={`envelope-${letter.id}`} className="envelope auto-open">
                  {/* Letter Preview */}
                  <div className="letter-preview-card">
                    <div
                      className="w-full h-full p-3 opacity-80 text-center flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${letter.cover})`,
                        backgroundSize: 'cover',
                        fontSize: '11px',
                        color: '#333',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                      }}
                    >
                      {letter.prompt.slice(0, 40)}...
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[#e6e2d8] z-0" />
                  <div className="envelope-pocket"></div>
                  <div className="envelope-flap">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                  </div>
                  <div className="wax-seal">
                    <div className="w-10 h-10 rounded-full bg-red-700 shadow-md border-2 border-red-800 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-red-600/50 flex items-center justify-center bg-red-700">
                        <span className="text-sm">❤️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LetterSection;
