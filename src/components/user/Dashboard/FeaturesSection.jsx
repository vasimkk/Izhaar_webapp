import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Premium 3D High-Fidelity Icons
const songs = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/services/songs?_a=BAMAOGeA0"
const gift = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/services/gift?_a=BAMAOGeA0"
const letter = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/services/letter?_a=BAMAOGeA0"
const teleparty = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/services/teleparty?_a=BAMAOGeA0"

const ExpressWithGift = () => {
  const gifts = [
    {
      title: "Send a Song",
      desc: "Neural Symphony",
      icon: songs,
      path: "/user/song",
      code: "SG-01"
    },
    {
      title: "Virtual Boutique",
      desc: "Floral Elegance",
      icon: gift,
      path: "/gifts",
      code: "VB-02"
    },
    {
      title: "Write a Letter",
      desc: "Signature Soul",
      icon: letter,
      path: "/user/letter-izhaar",
      code: "WL-03"
    },
    {
      title: "Confession",
      desc: "Direct Video",
      icon: teleparty,
      path: "/user/coming-soon",
      code: "VC-04"
    }
  ];

  return (
    <div className="relative w-full py-32 px-6 overflow-hidden bg-transparent border-t border-white/[0.03]">
      {/* Editorial Label */}
      <div className="flex flex-col items-center mb-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          className="h-[1px] bg-pink-500 mb-6"
        />
        <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.8em] mb-4">Gifting Suite</span>
        <h2 className="dashboard-head-text text-4xl md:text-6xl leading-tight tracking-tighter uppercase italic">
          Art of <span className="italic uppercase">Izhaar</span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          {gifts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col items-center"
            >
              {/* DIRECT VECTOR - Frameless & Stunning */}
              <Link to={item.path} className="flex flex-col items-center group">
                <div className="relative z-10 w-36 h-36 md:w-56 md:h-56 mb-10 transform group-hover:-translate-y-8 group-hover:scale-110 transition-all duration-1000 ease-out">
                  {/* Atmospheric Glow on Hover */}
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-pink-500/0 group-hover:bg-pink-500/50 transition-all duration-700" />

                  <img
                    src={item.icon}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-[0_45px_100px_rgba(0,0,0,0.9)] brightness-110 group-hover:brightness-125"
                    style={{ mixBlendMode: 'screen' }}
                  />

                  {/* Designer Index */}
                  <span className="absolute -top-4 -left-4 text-[9px] font-black text-white/20 group-hover:text-pink-500 transition-colors tracking-widest">
                    {item.code}
                  </span>
                </div>

                {/* Editorial Typography */}
                <div className="text-center group">
                  <h3 className="dashboard-head-text text-xl md:text-2xl tracking-widest uppercase mb-1 transition-all duration-700">
                    {item.title}
                  </h3>
                  <p className="dashboard-subtext text-[10px] uppercase tracking-[0.3em] group-hover:text-pink-400 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Industrial Texture Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-20 opacity-30">
        <div className="absolute left-[20%] top-0 w-[1px] h-full bg-white/[0.02]" />
        <div className="absolute right-[20%] top-0 w-[1px] h-full bg-white/[0.02]" />
      </div>
    </div>
  );
};

export default ExpressWithGift;