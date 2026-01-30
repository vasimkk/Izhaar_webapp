import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import game from "../../../assets/services/game.jpeg"
import date from "../../../assets/services/date.jpeg"
import letter from "../../../assets/services/letter.jpeg"
import teleparty from "../../../assets/services/teleparty.jpeg"
import magzine from "../../../assets/services/magzine.jpeg"
import gift from "../../../assets/services/gift.jpeg"
import songs from "../../../assets/services/songs.jpeg"

const services = [
  {
    title: 'Letter Izhaar',
    imageUrl: letter,
    path: '/user/letter-izhaar',
  },
  {
    title: 'Song Izhaar',
    imageUrl: songs,
    path: '/user/song',
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
    title: 'Safe Date',
    imageUrl: date,
    path: '/user/coming-soon',
  },

  {
    title: 'Gifts',
    imageUrl: gift,
    path: '/gifts',
  },
  {
    title: 'Magazine',
    imageUrl: magzine,
    path: '/magazine',
  },
  {
    title: 'Secret Crush',
    imageUrl: date,
    path: '/user/secret-crush',
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
      <div className="magazine-header" >
        {/* <h1>Our Service</h1> */}
        <h1
          className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',

          }}
        >
          Our Service
        </h1>
        <p
          className="text-white"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}
        >
          We help you express your feelings your way, through thoughtfully crafted and deeply personal experiences.
        </p>

      </div>
      <div className="relative group">
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto space-x-6 md:space-x-8 hide-scrollbar scroll-smooth px-6"
        >
          {services.map((service, index) => (
            <Link to={service.path} key={index}>
              <ServiceCard {...service} />
            </Link>
          ))}
        </div>
        <button
          onClick={() => scroll(-300)}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 md:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          &#8592;
        </button>
        <button
          onClick={() => scroll(300)}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 md:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default OurServices;
