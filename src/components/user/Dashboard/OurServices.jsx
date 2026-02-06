import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import game from "../../../assets/services/game.png"
import date from "../../../assets/services/date.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import magzine from "../../../assets/services/magazine.png"
import gift from "../../../assets/services/gift.png"
import songs from "../../../assets/services/songs.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
const services = [

  {
    title: 'Secret Crush',
    imageUrl: crush,
    path: '/user/secret-crush',
  },
  {
    title: 'Write a Letter',
    imageUrl: letter,
    path: '/user/letter-izhaar',
  },
  {
    title: 'TrueConnect',
    imageUrl: trueconnect,
    path: '/user/coming-soon',
  },
  {
    title: 'Customize song',
    imageUrl: songs,
    path: '/user/song',
  },
  {
    title: 'Watch Together',
    imageUrl: teleparty,
    path: '/user/watch-party',
  },

  {
    title: 'Safe Date',
    imageUrl: date,
    path: '/user/coming-soon',
  },
  {
    title: 'Game',
    imageUrl: game,
    path: '/user/quiz',
  },

  {
    title: 'Magazine',
    imageUrl: magzine,
    path: '/magazine',
  },



  {
    title: 'Gifts',
    imageUrl: gift,
    path: '/gifts',
  },


];

const OurServices = () => {
  const scrollContainer = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="my-12 md:my-16">
      <style jsx>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .services-container {
          animation: slideIn 0.8s ease-out;
        }
        .sparkle-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: twinkle 1.5s infinite ease-in-out;
          filter: blur(0.5px);
        }
      `}</style>

      <div className="magazine-header text-center mb-12" >
        <h1
          className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
        >
          Our Services
        </h1>
        <p
          className="text-white !text-white"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}
        >
          We help you express your feelings your way, through thoughtfully crafted and deeply personal experiences.
        </p>
      </div>

      <div className="relative px-1 md:px-4">
        <div
          ref={scrollContainer}
          className="services-container flex overflow-x-auto gap-6 sm:gap-8 md:gap-12 lg:gap-16 hide-scrollbar scroll-smooth pb-2 pt-2 px-2"
        >
          {services.map((service, index) => (
            <Link to={service.path} key={index}>
              <div className="flex-shrink-0 group">
                <div className="flex flex-col items-center cursor-pointer relative">

                  {/* Main circular service icon with detailed scattered sparkles */}
                  <div className="mb-4 md:mb-6 relative">

                    {/* Tiny Sparkles around the icon */}
                    {[...Array(6)].map((_, i) => {
                      // Random positions around the circle
                      const angle = (i * 60) * (Math.PI / 180);
                      const radius = 55; // Slightly larger than the icon radius (approx 40-50px)
                      const top = 50 + radius * Math.sin(angle) + '%';
                      const left = 50 + radius * Math.cos(angle) + '%';

                      return (
                        <div
                          key={i}
                          className="sparkle-dot"
                          style={{
                            top: `${Math.random() * 80 + 10}%`, // Random placement around
                            left: `${Math.random() * 80 + 10}%`,
                            backgroundColor: ['#ff00cc', '#33ccff', '#ffcc00', '#cc00ff'][i % 4],
                            animationDelay: `${Math.random() * 2}s`,
                            transform: `translate(-50%, -50%)`,
                            // Push them slightly outside the main circle if needed, or let them float around
                            marginTop: (Math.random() - 0.5) * 60 + 'px',
                            marginLeft: (Math.random() - 0.5) * 60 + 'px',
                          }}
                        />
                      );
                    })}

                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center overflow-hidden bg-white/5 p-1 sm:p-2 transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                  </div>

                  {/* Service title */}
                  <h3 className="text-center text-xs sm:text-sm md:text-base font-bold text-white transition-all duration-300 whitespace-nowrap px-1 group-hover:text-pink-400">
                    {service.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => scroll(-300)}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 md:p-3 shadow-lg opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        >
          &#8592;
        </button>
        <button
          onClick={() => scroll(300)}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/80 rounded-full p-2 md:p-3 shadow-lg opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default OurServices;
