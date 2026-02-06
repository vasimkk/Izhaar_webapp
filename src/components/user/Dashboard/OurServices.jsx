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
const services = [

  {
    title: 'Secret Crush',
    imageUrl: crush,
    path: '/user/secret-crush',
  },
  {
    title: 'Letter Izhaar',
    imageUrl: letter,
    path: '/user/letter-izhaar',
  },
  {
    title: 'Watch Party Together',
    imageUrl: teleparty,
    path: '/user/watch-party',
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
    title: 'Song Izhaar',
    imageUrl: songs,
    path: '/user/song',
  },

  {
    title: 'Safe Date',
    imageUrl: date,
    path: '/user/coming-soon',
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
        .services-container {
          animation: slideIn 0.8s ease-out;
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
              <div className="flex-shrink-0">
                <div className="flex flex-col items-center cursor-pointer">
                  {/* Main circular service icon - Image only */}
                  <div className="mb-4 md:mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center overflow-hidden bg-white/5 p-1 sm:p-2 transform hover:scale-110 transition-transform duration-300">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                  </div>

                  {/* Service title */}
                  <h3 className="text-center text-xs sm:text-sm md:text-base font-bold text-white transition-all duration-300 whitespace-nowrap px-1">
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
