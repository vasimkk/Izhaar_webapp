import React, { useState, useRef } from 'react';
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

const OurServices = ({ isSingleMode: propMode, onModeChange }) => {
  const [localMode, setLocalMode] = useState(true);
  const [showStoryDetail, setShowStoryDetail] = useState(null);

  const isSingleMode = propMode !== undefined ? propMode : localMode;
  const setIsSingleMode = (val) => {
    if (onModeChange) onModeChange(val);
    setLocalMode(val);
  };

  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, offsetWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setActiveStoryIndex(index);
    }
  };

  const successStories = isSingleMode ? [
    {
      id: 1,
      name: "Pranick.",
      tag: "Secret Crush",
      time: "2h ago",
      story: "I added my college crush silently. She got a hint and added me back!",
      action: "Used Secret Crush",
      steps: [
        "Added her phone number secretly.",
        "She got a nudge from Izhaar.",
        "She added me back & it was a match!"
      ],
      color: "from-[#B72099] to-[#701a5f]"
    },
    {
      id: 2,
      name: "Priya V.",
      tag: "Izhaar Letter",
      time: "5h ago",
      story: "I wrote an honest letter about our memories. He loved the emotional touch!",
      action: "Sent Izhaar Letter",
      steps: [
        "Wrote real feelings & memories.",
        "Letter delivered without my name.",
        "Started a safe chat to reveal identity."
      ],
      color: "from-[#800000] to-[#4B0000]"
    },
    {
      id: 4,
      name: "Riya & Arjun",
      tag: "Join Party",
      time: "2h ago",
      story: "Distance can’t stop connection. We watched, laughed, and shared moments together in real-time with Join Party!",
      action: "Started a Join Party",
      steps: [
        "Picked a movie clip to share.",
        "Invited my friend via mobile.",
        "Watched together in perfect sync.",
        "Reacted and chatted while watching.",
        "Created beautiful memories together."
      ],
      color: "from-orange-600 to-rose-900"
    }
  ] : [
    {
      id: 3,
      name: "Vikram & Soniya",
      tag: "Watch Together",
      time: "Just now",
      story: "We watched a movie synced from different cities. The chat and video support made us feel like we were on the same couch!",
      action: "Hosted Watch Party",
      steps: [
        "Shared partner's number.",
        "She joined the synced room.",
        "Watched movie with video chat."
      ],
      color: "from-indigo-600 to-blue-900"
    },
    {
      id: 4,
      name: "Riya & Arjun",
      tag: "Join Party",
      time: "2h ago",
      story: "Distance can’t stop connection. We watched, laughed, and shared moments together in real-time with Join Party!",
      action: "Started a Join Party",
      steps: [
        "Picked a movie clip to share.",
        "Invited my friend via mobile.",
        "Watched together in perfect sync.",
        "Reacted and chatted while watching.",
        "Created beautiful memories together."
      ],
      color: "from-orange-600 to-rose-900"
    }
  ];


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
        @keyframes textLoop {
          0%, 20% { transform: translateY(0); }
          25%, 45% { transform: translateY(-25%); }
          50%, 70% { transform: translateY(-50%); }
          75%, 95% { transform: translateY(-75%); }
          100% { transform: translateY(0); }
        }
        @keyframes labelLoop {
          0%, 40% { transform: translateY(0); }
          50%, 90% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-knob-text {
          animation: textLoop 4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        .animate-label-text {
          animation: labelLoop 3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
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



        {/* Success Stories Section */}
        <div className="mt-14 mb-10 px-2 animate-premium-in" style={{ animationDelay: '1100ms' }}>
          <div className="flex flex-col mb-8 px-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-10 h-[1px] bg-gradient-to-r from-pink-500 to-transparent"></span>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">Real Stories</span>
            </div>
            <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white tracking-wide">
              Success Stories
            </h3>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-6 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth relative"
          >
            {successStories.map((item) => (
              <div
                key={item.id}
                onClick={() => setShowStoryDetail(item)}
                className="flex-shrink-0 w-[85vw] sm:w-80 h-56 rounded-[2.5rem] relative overflow-hidden snap-center group shadow-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] border border-white/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-85 group-hover:opacity-100 transition-opacity`}></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 w-fit mb-3">
                        {item.tag}
                      </span>
                      <h4 className="text-xl font-['Playfair_Display'] font-bold drop-shadow-md">
                        {item.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-white/40">{item.time}</span>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs font-medium text-white/90 line-clamp-2 italic mb-4 text-simple">
                      "{item.story}"
                    </p>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                      Check how it happened ➔
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {successStories.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full ${activeStoryIndex === idx ? 'w-6 bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'w-1.5 bg-white/20'
                  }`}
              ></div>
            ))}
          </div>
          {/* Marquee CTA */}
          <div className="mt-10 -mx-4 overflow-hidden bg-white/5 py-4 border-y border-white/5 backdrop-blur-sm">
            <div className="flex whitespace-nowrap animate-marquee">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-10 px-5">
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                    Ready to make your story? <span className="text-pink-500">Confess Now</span>
                  </span>
                  <span className="text-white/20">✦</span>
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                    Success Stories <span className="text-blue-400">Izhaar</span>
                  </span>
                  <span className="text-white/20">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Detail Modal */}
        {showStoryDetail && (
          <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowStoryDetail(null)}></div>
              <div className="relative w-full max-w-sm bg-[#1e1b4b] rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden animate-premium-in">
                <div className={`h-40 bg-gradient-to-b ${showStoryDetail.color} p-10 flex flex-col justify-end relative`}>
                  <button
                    onClick={() => setShowStoryDetail(null)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 backdrop-blur-md border border-white/10 transition-all active:scale-90"
                  >✕</button>
                  <h3 className="text-3xl font-['Playfair_Display'] font-bold text-white">{showStoryDetail.name}</h3>
                </div>
                <div className="p-10">
                  <p className="text-base text-white/80 leading-relaxed font-medium italic mb-10">
                    "{showStoryDetail.story}"
                  </p>
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                    <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mb-4">
                      Simple Guide: {showStoryDetail.action}
                    </h4>
                    <div className="space-y-3">
                      {showStoryDetail.steps?.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-[11px] font-bold text-white leading-tight pt-1">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStoryDetail(null)}
                    className="w-full mt-10 py-5 bg-gradient-to-r from-pink-600 via-[#B72099] to-pink-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-[11px]"
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OurServices;