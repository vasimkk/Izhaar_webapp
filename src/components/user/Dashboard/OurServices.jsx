import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import game from "../../../assets/services/game.png"
import date from "../../../assets/services/date.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.jpeg"
import magzine from "../../../assets/services/magzine.png"
import gift from "../../../assets/services/gift.png"
import songs from "../../../assets/services/songs.png"

const services = [
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
    title: 'Letter Izhaar',
    imageUrl: letter,
    path: '/user/letter-izhaar',
  },
  {
    title: 'Safe Date',
    imageUrl: date,
    path: '/safe-date',
  },
  {
    title: 'Song Izhaar',
    imageUrl: songs,
    path: '/user/song',
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
        <h1>Our Service</h1>
        <p>Premium custom-designed magazines that turned your beautiful moments into timeless stories.</p>
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
