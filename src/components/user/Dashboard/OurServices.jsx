import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Icons
import songs from "../../../assets/services/songs.png"
import gift from "../../../assets/services/gift.png"
import letter from "../../../assets/services/letter.png"
import teleparty from "../../../assets/services/teleparty.png"
import crush from "../../../assets/services/crush.png"
import trueconnect from "../../../assets/services/trueconnect.png"
import date from "../../../assets/services/date.png"
import game from "../../../assets/services/game.png"
import magazine from "../../../assets/services/magazine.png"

const OurServices = () => {
  const services = [
    { title: "Izhaar Letter", path: "/user/letter-izhaar", icon: letter, color: "#EC4891" },
    { title: "Secret Crush", path: "/user/secret-crush", icon: crush, color: "#A928ED" },
    { title: "AI Music", path: "/user/song", icon: songs, color: "#6366F1" },
    { title: "True Match", path: "/user/true-connection", icon: trueconnect, color: "#10B981" },
    { title: "Safe Date", path: "/user/coming-soon", icon: date, color: "#F59E0B" },
    { title: "Teleparty", path: "/user/watch-party", icon: teleparty, color: "#3B82F6" },
    { title: "Quiz & Play", path: "/user/quiz", icon: game, color: "#EF4444" },
    { title: "Send Gifts", path: "/gifts", icon: gift, color: "#F43F5E" },
    { title: "Magazine", path: "/magazine", icon: magazine, color: "#F59E0B" }
  ];

  return (
    <div className="w-full px-4 mb-20 relative pt-4">
      {/* High-Density Hub Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center"
          >
            <Link
              to={service.path}
              className="group relative flex flex-col items-center w-full"
            >
              {/* Simple Icon Container */}
              <div className="relative w-full aspect-square max-w-[72px] sm:max-w-[85px] mb-2 flex items-center justify-center">
                {/* Static Icon */}
                <div className="relative z-10 p-1.5 sm:p-2">
                  {/* Persistent Subtle Shade behind icon */}
                  <div
                    className="absolute inset-0 opacity-[0.08] blur-[22px] rounded-full -z-10"
                    style={{ background: service.color }}
                  />

                  {/* Specific Top Shader for Magazine */}
                  {service.title === "Magazine" && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-[#EC4891]/30 to-transparent blur-xl -z-20 pointer-events-none" />
                  )}

                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                  />
                  {/* Enhanced Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[30px] rounded-full -z-10"
                    style={{ background: service.color }}
                  />
                </div>

                {/* Hot Tag for select items (optional) */}
                {idx === 0 && (
                  <div className="absolute top-0 right-0 z-20">
                    <span className="flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EC4891]"></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Minimal Text Label */}
              <h3 className="text-[10px] sm:text-[12px] font-black text-white/50 group-hover:text-white transition-colors text-center uppercase tracking-widest leading-tight px-1">
                {service.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      {/* Modern Center Bar */}
      <div className="mt-12 flex justify-center">
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#EC4891]/20 to-transparent" />
      </div>
    </div>
  );
};

export default OurServices;