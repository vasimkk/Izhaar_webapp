import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';



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

const OurServices = ({ isSingleMode: propMode, onModeChange }) => {
  const [localMode, setLocalMode] = useState(true);

  const isSingleMode = propMode !== undefined ? propMode : localMode;
  const setIsSingleMode = (val) => {
    if (onModeChange) onModeChange(val);
    setLocalMode(val);
  };

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

  return (
    <div className="w-full text-white px-4 overflow-hidden">
      <div className="py-6">
        {/* Header with Title and Toggle */}
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-[22px] font-['Playfair_Display'] font-medium text-white drop-shadow-lg">
            {isSingleMode ? "Confess with Izhaar" : "Celebrate with Izhaar"}
          </h2>

          <div
            onClick={() => setIsSingleMode(!isSingleMode)}
            className={`relative flex items-center h-13 w-36 rounded-full cursor-pointer transition-all duration-500 p-1 ${isSingleMode
              ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 shadow-xl shadow-orange-500/20'
              : 'bg-transparent border-2 border-transparent'
              }`}
            style={!isSingleMode ? {
              background: 'linear-gradient(#1e1b4b, #1e1b4b) padding-box, linear-gradient(to right, #fbbf24, #f59e0b, #ea580c) border-box',
              border: '2px solid transparent'
            } : {}}
          >
            {/* The Knob */}
            <div className={`absolute w-10.5 h-10.5 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-lg ${isSingleMode
              ? 'left-[calc(100%-2.85rem)] bg-black'
              : 'left-1 bg-gradient-to-r from-yellow-400 to-orange-600'
              }`}
              style={{ width: '2.625rem', height: '2.625rem' }}>
              <div className="h-6 overflow-hidden relative w-full">
                <div className={`flex flex-col animate-knob-text transition-colors duration-500 ${isSingleMode ? 'text-white' : 'text-black font-black'}`}>
                  <span className="h-6 flex items-center justify-center text-[13px] font-black tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {isSingleMode ? 'ON' : 'OFF'}
                  </span>
                  <span className="h-6 flex items-center justify-center text-[16px] font-black tracking-[-0.2em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {isSingleMode ? '>>' : '<<'}
                  </span>
                  <span className="h-6 flex items-center justify-center text-[16px] font-black tracking-[-0.2em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {isSingleMode ? '>>' : '<<'}
                  </span>
                  <span className="h-6 flex items-center justify-center text-[13px] font-black tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {isSingleMode ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* The Stacked Label */}
            <div className={`w-full flex flex-col items-center justify-center leading-[0.9] transition-all duration-500 select-none ${isSingleMode ? 'pr-11' : 'pl-11'
              }`}>
              <div className={`flex flex-col items-center justify-center ${isSingleMode
                ? 'text-black'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'
                }`}>
                <span className="text-[12px] font-black uppercase tracking-wider">Single</span>
                <span className="text-[12px] font-black uppercase tracking-wider">Mode</span>
              </div>
            </div>
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

              <Link to={mainCard.path} className="group relative block h-full overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#B72099] to-[#312E81] shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(183,32,153,0.4)] active:scale-95 border border-pink-500/30">
                {/* Floating Hearts Animation for Special Card */}

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

                    <div className="relative z-10 p-3 h-full flex flex-col items-center">
                      <h3 className={`text-[10px] font-bold text-white mb-auto uppercase tracking-tighter text-center ${isLetter ? 'text-pink-100 scale-110' : ''}`}>
                        {service.title}

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
      </div>
    </div >
  );
};

export default OurServices;