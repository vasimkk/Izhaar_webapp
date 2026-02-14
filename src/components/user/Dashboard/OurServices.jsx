import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icons
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
import date from "../../../assets/services/date.png"
import magzine from "../../../assets/services/magazine.png"
import game from "../../../assets/services/game.png"

export const services = [
  { title: 'Secret Crush', imageUrl: crush, path: '/user/secret-crush' },
  { title: 'Write a Letter', imageUrl: letter, path: '/user/letter-izhaar' },
  { title: 'TrueConnect', imageUrl: trueconnect, path: '/user/true-connection' },
  { title: 'Customize song', imageUrl: songs, path: '/user/song' },
  { title: 'Watch Together', imageUrl: teleparty, path: '/user/watch-party' },
  { title: 'Safe Date', imageUrl: date, path: '/user/coming-soon' },
  { title: 'Game', imageUrl: game, path: '/user/quiz' },
  { title: 'Magazine', imageUrl: magzine, path: '/magazine' },
  { title: 'Gifts', imageUrl: gift, path: '/gifts' },
];

const OurServices = () => {
  const [isSingleMode, setIsSingleMode] = useState(true);

  const findService = (title) => services.find(s => s.title.includes(title));

  const safeDate = findService('Safe Date');
  const secretCrush = findService('Secret Crush');
  const watchTogether = findService('Watch Together');
  const gameService = findService('Game');
  const magazine = findService('Magazine');
  const gifts = findService('Gifts');
  const letter = findService('Write a Letter');
  const trueConnect = findService('TrueConnect');
  const song = findService('Customize song');

  const celebrateServices = [
    { title: "Watch Together", icon: watchTogether?.imageUrl, path: "/user/watch-party" },
    { title: "Game", icon: gameService?.imageUrl, path: "/user/quiz" },
    { title: "Magazine", icon: magazine?.imageUrl, path: "/magazine" },
    { title: "Gifts", icon: gifts?.imageUrl, path: "/gifts" }
  ];

  const confessServices = [
    { title: "Write a letter", icon: letter?.imageUrl, path: "/user/letter-izhaar" },
    { title: "True connect", icon: trueConnect?.imageUrl, path: "/user/true-connection" },
    { title: "Customize song", icon: song?.imageUrl, path: "/user/song" },
    { title: "Gifts", icon: gifts?.imageUrl, path: "/gifts" }
  ];

  const mainCard = isSingleMode ? {
    title: "SECRET CRUSH",
    path: "/user/secret-crush",
    icon: secretCrush?.imageUrl
  } : {
    title: "SAFE DATE",
    path: "/user/coming-soon",
    icon: safeDate?.imageUrl
  };

  const currentServices = isSingleMode ? confessServices : celebrateServices;

  const promoSlides = [
    { text: "Valentine Offer: Send a beautiful digital letter at just ₹99 (Save ₹100)!", btn: "Grab Offer 💌", path: "/user/letter-izhaar" },
    { text: "Before she goes 'I'm fine 😊' mode... drop a surprise.", btn: "Send Gift", path: "/gifts" },
    { text: "Anonymously confess your heart's secret feelings.", btn: "Confess", path: "/user/secret-crush" },
    { text: "Surprise your partner with a shared game experience.", btn: "Play Game", path: "/user/quiz" }
  ];

  const bannerSliderSettings = {
    dots: false,
    infinite: true,
    vertical: true,
    verticalSwiping: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false
  };

  return (
    <div className="w-full text-white px-4 overflow-hidden">
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        .animate-premium-in {
          animation: slideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
      <div className="py-6">
        {/* Header with Title and Toggle */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-[22px] font-['Playfair_Display'] font-medium text-white drop-shadow-lg">
            {isSingleMode ? "Confess with Izhaar" : "Celebrate with Izhaar"}
          </h2>

          <div
            onClick={() => setIsSingleMode(!isSingleMode)}
            className={`relative flex items-center h-8 w-24 rounded-full cursor-pointer transition-all duration-300 px-1 ${isSingleMode ? 'bg-indigo-600' : 'bg-white'}`}
          >
            <div className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isSingleMode ? 'left-1 bg-white' : 'left-[calc(100%-1.75rem)] bg-[#1e1b4b]'}`}>
              <span className={`text-[7px] font-extrabold ${isSingleMode ? 'text-indigo-600' : 'text-white'}`}>
                {isSingleMode ? 'ON' : 'OF'}
              </span>
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-tighter w-full text-center select-none ${isSingleMode ? 'pl-6 text-white' : 'pr-6 text-[#1e1b4b]'}`}>
              Single mode
            </span>
          </div>
        </div>



        {/* Dashboard grid centered in translucent container - staggered animations */}
        <div
          key={isSingleMode ? 'confess' : 'celebrate'}
          className="p-3 shadow-3xl"
        >
          <div className="grid grid-cols-6 gap-2 min-h-[14rem]">
            {/* Tall Card */}
            <div className="col-span-2 animate-premium-in relative" style={{ animationDelay: '100ms' }}>
              {isSingleMode && (
                <div className="absolute -top-3 -right-2 z-20 bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-[9px] font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-white/30 animate-bounce tracking-tighter">
                  VALENTINE'S SPECIAL ✨
                </div>
              )}
              <Link to={mainCard.path} className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#B72099] to-[#312E81] shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(183,32,153,0.4)] active:scale-95 border border-pink-500/30">
                {/* Floating Hearts Animation for Special Card */}
                {isSingleMode && (
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-4 left-4 animate-float text-pink-200 text-lg">❤️</div>
                    <div className="absolute bottom-12 right-6 animate-float-delayed text-pink-300 text-xl">💖</div>
                  </div>
                )}
                <div className="relative z-10 p-5 h-full flex flex-col items-center">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 text-center mt-2">{mainCard.title}</h3>

                  <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {isSingleMode ? (
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-700 ring-4 ring-pink-500/20">
                        <img src={mainCard.icon} alt="" className="w-11 h-11 object-contain filter brightness-0 opacity-80" />
                      </div>
                    ) : (
                      <div className="mt-auto w-full flex items-end justify-center">
                        <img src={mainCard.icon} alt="" className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                  </div>
                  {isSingleMode && (
                    <div className="mt-4 text-[10px] font-bold text-pink-200 text-center animate-pulse">
                      Find your match ✨
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Square Grid */}
            <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-2">
              {currentServices.map((service, idx) => {
                const isLetter = service.title.toLowerCase().includes('letter');
                const isWatch = service.title.toLowerCase().includes('watch');
                const isSpecial = isLetter || isWatch;

                return (
                  <Link
                    key={idx}
                    to={service.path}
                    className={`group relative block overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#B72099]/40 to-[#312E81]/60 backdrop-blur-md transition-all duration-500 hover:brightness-110 active:scale-95 shadow-lg animate-premium-in border ${isLetter ? 'border-pink-300 border-2 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : isSpecial ? 'border-pink-400/50 shadow-pink-500/10' : 'border-white/5'}`}
                    style={{ animationDelay: `${200 + idx * 100}ms` }}
                  >
                    {isLetter && (
                      <div className="absolute top-0 right-0 bg-white text-[#B72099] text-[7px] font-black px-2 py-0.5 rounded-bl-lg shadow-md animate-pulse">
                        VALENTINE DEAL: ₹99
                      </div>
                    )}
                    {isSpecial && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899] animate-pulse"></div>
                    )}
                    <div className="relative z-10 p-3 h-full flex flex-col items-center">
                      <h3 className={`text-[10px] font-bold text-white mb-auto uppercase tracking-tighter text-center ${isLetter ? 'text-pink-100 scale-110' : ''}`}>
                        {service.title}
                        {isLetter && (
                          <span className="block text-[8px] text-pink-300 font-black tracking-widest">
                            <span className="line-through opacity-50 mr-1">₹199</span> ₹99
                          </span>
                        )}
                        {!isLetter && isSpecial && <span className="block text-[8px] text-pink-300 font-black">POPULAR</span>}
                      </h3>
                      <div className="flex-1 flex items-center justify-center py-1">
                        <img src={service.icon} alt="" className={`w-10 h-10 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${isLetter ? 'animate-pulse scale-110' : ''}`} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Explore More link in magenta */}
          <div className="mt-4 px-1">
            <Link to="/user/dashboard" className="text-[#B72099] font-bold text-[12px] hover:text-pink-400 transition-colors flex items-center gap-1.5 group">
              Explore more <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Promo Banner - Matching exact typography and splashes */}
        <div
          key={`banner-${isSingleMode}`}
          className="mt-8 relative overflow-hidden bg-white rounded-[2rem] p-8 min-h-[180px] flex items-center justify-between gap-4 shadow-2xl animate-premium-in"
          style={{ animationDelay: '700ms' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/50 rounded-full translate-x-8 -translate-y-8 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full -translate-x-12 translate-y-12 blur-2xl"></div>

          <div className="relative z-10">
            <h4 className="text-[22px] font-['Playfair_Display'] font-bold text-[#1e1b4b] leading-[1.2]">
              Have you <br />
              <span className="text-[#B72099] italic">{isSingleMode ? "Confessed" : "Celebrated"}</span> today?
            </h4>
            <p className="text-[10px] font-bold text-indigo-900/40 mt-2 uppercase tracking-widest pl-1">
              IZHAAR EXCLUSIVE ✨
            </p>
          </div>

          <div className="relative z-10 flex-1 max-w-[220px]">
            <Slider {...bannerSliderSettings}>
              {promoSlides.map((slide, index) => (
                <div key={index} className="outline-none">
                  <div className="flex flex-col items-end gap-3 text-right">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.2em] leading-tight">
                      {slide.text}
                    </p>
                    <Link to={slide.path}>
                      <button className="px-9 py-3 bg-gradient-to-r from-[#B72099] to-[#801369] text-white rounded-full text-[10px] font-black shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                        {slide.btn}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
