import React from 'react';
import { Link } from 'react-router-dom';
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"

const ExpressWithGift = () => {
  const gifts = [
    {
      title: "Send a Song",
      desc: "Let music speak for you",
      icon: songs,
      path: "/user/song",
    },
    {
      title: "Virtual Bouquet",
      desc: "A gesture full of warmth",
      icon: gift,
      path: "/gifts",
    },
    {
      title: "Write a Letter",
      desc: "Say what your heart feels",
      icon: letter,
      path: "/user/letter-izhaar",
    },
    {
      title: "Video Confession",
      desc: "When words need a face",
      icon: teleparty,
      path: "/user/coming-soon",
    }
  ];

  return (
    <div className="relative w-full py-16 px-4 overflow-hidden" style={{
      /* MATCHING THE IMAGE BACKGROUND EXACTLY: Deep dark blue / indigo */
      background: '#1a1c3d',
    }}>
      {/* SHARP VERTICAL STRIPES (LINILINA STYLE) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 flex" style={{ width: '100%', height: '100%' }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="h-full flex-1 border-r border-black/30" style={{
            backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'
          }}></div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-white font-['Playfair_Display'] font-black text-3xl md:text-5xl tracking-tight m-0 drop-shadow-2xl">
            Express with gift
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-10">
          {gifts.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="group relative flex flex-col items-center text-center p-6 md:p-10 transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden rounded-[2.5rem]"
              style={{
                /* SUPER REFINED GLASSMORPHISM */
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* GLASS SHINE REFLECTION (FROM IMAGE) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-1/2 h-full bg-white/5 pointer-events-none" />

              {/* ICON CONTAINER */}
              <div className="relative z-10 w-28 h-28 md:w-44 md:h-44 mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-out">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* TEXT CONTENT */}
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg md:text-2xl mb-1 tracking-tight drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-xs md:text-base font-medium leading-tight px-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.desc}
                </p>
              </div>

              {/* INNER GLOW BEHIND ICON */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>

      {/* ADDITIONAL GLOWS OVER THE ENTIRE SECTION */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ExpressWithGift;