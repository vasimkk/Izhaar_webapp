import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterSampleImg from '../../../assets/Letter_sample.png';

const LetterSection = () => {
  const navigate = useNavigate();
  return (
    <div className="letter-section" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      padding: '40px 20px'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="magazine-header" >
          <h1>Izhaar Letter Samples</h1>
          <p>Premium custom-designed magazines that turned your beautiful moments into timeless stories.</p>
          <button
            className="explore-more-btn"
            style={{
              marginTop: '20px',
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
            onClick={() => window.scrollTo({ top: document.querySelector('.magazine-gallery').offsetTop - 100, behavior: 'smooth' })}
          >
            Explore More ➜
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT SIDE - Content & Templates */}
          <div className="space-y-6">

            <div className="  p-8 text-center relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="relative z-10">


                <p className="text-[#6B5B8E] leading-relaxed text-lg mb-8 max-w-lg mx-auto">
                  Express your deepest feelings through a beautifully crafted letter. Whether it's <span className="font-semibold text-pink-600">love</span>, <span className="font-semibold text-purple-600">gratitude</span>, or <span className="font-semibold text-blue-600">apology</span>, let Izhaar help you convey your emotions perfectly.
                </p>

                {/* 3 Steps with Enhanced Design */}
                <div className="space-y-5 text-left max-w-lg mx-auto mb-8">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#2D1B4E] text-lg mb-1">Choose Your Template</h3>
                        <p className="text-sm text-[#6B5B8E]">Select from our heartfelt letter templates designed for every emotion</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#2D1B4E] text-lg mb-1">Personalize Your Message</h3>
                        <p className="text-sm text-[#6B5B8E]">Add your personal touch, emotions, and make it uniquely yours</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#2D1B4E] text-lg mb-1">Send Your Feelings</h3>
                        <p className="text-sm text-[#6B5B8E]">Deliver your letter with confidence through Izhaar's secure platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - Form & Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="">

              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={LetterSampleImg}
                  alt="Letter Sample"
                  className="w-full h-auto aspect-[3/4] object-contain"
                  style={{

                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="mt-6 text-center">


              </div>
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default LetterSection;
