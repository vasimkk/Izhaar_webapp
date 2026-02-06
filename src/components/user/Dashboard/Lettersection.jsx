import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      prompt: "My Dearest,\n\nFrom the moment I met you, my world became brighter. Your smile is my daily inspiration, and your voice is my favorite melody.\n\nI cherish every moment we share and look forward to creating a lifetime of memories together. You are my everything.\n\nForever yours,"
    }
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 5px gold); }
        }
        
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.4); }
            50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.7); magic: true; }
        }

        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }

        /* Step Card Styles */
        .step-card {
          background: transparent;
          border: none;
          padding: 12px 0;
          margin-bottom: 16px;
          transition: transform 0.2s ease;
          display: flex;
          gap: 18px;
          cursor: pointer;
          position: relative;
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
          box-shadow: 0 4px 10px rgba(236, 72, 153, 0.3);
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

        /* PREMIUM ENVELOPE STYLES */
        .envelope-wrapper {
          perspective: 1000px;
          cursor: pointer;
          width: 100%;
          max-width: 340px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Glow effects behind envelope */
        .envelope-wrapper::before {
          content: '';
          position: absolute;
          inset: -40px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(20px);
          z-index: -1;
          animation: pulse-glow 3s infinite;
        }

        .envelope {
          position: relative;
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          box-shadow: 0 0 40px rgba(236, 72, 153, 0.4);
          transition: transform 0.3s ease;
          border-radius: 4px;
        }
        
        /* Flap */
        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 110px;
          background: linear-gradient(to bottom, #ffdde1, #ee9ca7);
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          transform-origin: top;
          transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
          z-index: 20;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* Sparkle on Flap */
        .envelope-flap::after {
            content: '';
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 2s infinite ease-in-out;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }

        /* Front Pocket */
        .envelope-pocket {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 130px;
            background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
            clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
            z-index: 10;
            border-top: 1px solid rgba(255,255,255,0.4);
        }
        
        /* Pocket Sparkles */
        .envelope-pocket::before {
            content: '';
            position: absolute;
            bottom: 25px;
            left: 35px;
            width: 10px;
            height: 10px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 3s infinite ease-in-out 1s;
        }
        .envelope-pocket::after {
            content: '';
            position: absolute;
            bottom: 45px;
            right: 35px;
            width: 12px;
            height: 12px;
            background: #fff;
            clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
            animation: sparkle 2.5s infinite ease-in-out 0.5s;
        }

        /* Letter Inside */
        .letter-preview-card {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          height: 96%;
          background: white;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.8s ease-in-out 0.4s, bottom 0.8s ease-in-out 0.4s;
          z-index: 5;
          box-shadow: 0 -2px 12px rgba(0,0,0,0.1);
        }

        /* Wax Seal */
        .wax-seal {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 25;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }

        /* AUTO ANIMATION LOGIC */
        .envelope.auto-open {
          animation: envelope-bob 5s ease-in-out infinite;
        }

        @keyframes envelope-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .envelope.auto-open .envelope-flap {
          animation: flap-open 5s ease-in-out infinite;
        }

        .envelope.auto-open .letter-preview-card {
          animation: letter-slide 5s ease-in-out infinite;
        }

        .envelope.auto-open .wax-seal {
          animation: wax-fade 5s ease-in-out infinite;
        }

        @keyframes flap-open {
          0%, 35% { transform: rotateX(0deg); z-index: 20; }
          45%, 75% { transform: rotateX(180deg); z-index: 1; }
          100% { transform: rotateX(0deg); z-index: 20; }
        }

        @keyframes letter-slide {
          0%, 35% { transform: translateX(-50%) translateY(0) scale(1); }
          45%, 75% { transform: translateX(-50%) translateY(-130px) scale(1.05); }
          100% { transform: translateX(-50%) translateY(0) scale(1); }
        }

        @keyframes wax-fade {
          0%, 35% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          45%, 75% { transform: translate(-50%, -150%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        /* Layout */
        .letter-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .left-section {
          padding: 8px 0;
        }

        .right-section {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        @media (max-width: 1024px) {
          .letter-container { grid-template-columns: 1fr; gap: 40px; }
          .right-section { order: 1; }
          .left-section { order: 2; }
        }
        
         @media (max-width: 640px) {
            .envelope-wrapper { max-width: 280px; }
            .envelope { height: 190px; }
         }
      `}</style>

      <div className="text-center mb-16 animate-fadeIn">
        <div className="magazine-header text-center" >
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
            Customize Letter Now
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            We help you express your feelings your way, through thoughtfully crafted and deeply personal experiences.
          </p>
        </div>
        <button
          className="mt-6 px-8 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
          onClick={() => navigate('/user/letter-izhaar')}
        >
          Start Creating ➜
        </button>
      </div>

      <div className="letter-container">
        {/* LEFT SECTION - Steps */}
        <div className="left-section animate-slideInLeft">
          <h2 className="text-2xl font-bold mb-8 text-pink-300">How It Works</h2>
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
            <div key={letter.id} style={{ animationDelay: `${index * 0.1}s`, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className="envelope-wrapper">
                <div className="envelope auto-open">
                  {/* Letter Preview */}
                  <div className="letter-preview-card">
                    <div
                      className="w-full h-full p-3 opacity-90 text-center flex items-center justify-center p-4"
                      style={{
                        backgroundImage: `url(${letter.cover})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        fontSize: '10px',
                        color: '#333',
                        overflow: 'hidden',
                        lineHeight: '1.4',
                        fontFamily: "'Playfair Display', serif"
                      }}
                    >
                      {letter.prompt.slice(0, 150)}...
                    </div>
                  </div>

                  {/* Interior Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-50 z-0" />

                  {/* Pocket */}
                  <div className="envelope-pocket"></div>

                  {/* Flap */}
                  <div className="envelope-flap">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                  </div>

                  {/* Wax Seal */}
                  <div className="wax-seal">
                    <div className="w-12 h-12 rounded-full bg-red-700 shadow-md border-2 border-red-800 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-red-600/50 flex items-center justify-center bg-red-700">
                        <span className="text-lg filter drop-shadow-sm">❤️</span>
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
