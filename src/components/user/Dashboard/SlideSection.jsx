import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Import new romantic banners
import LetterBanner from "../../../assets/Baners/LetterBanner.png";
import ScreenBanner from "../../../assets/Baners/ScreenBanner.png";
import CrushBanner from "../../../assets/Baners/CrushBanner.png";
import SafeDateBanner from "../../../assets/Baners/SafeDateBanner.png";
import FightBanner from "../../../assets/Baners/FightBanner.png";

// Keep existing desktop banners as fallback or for normal mode if needed
import D5 from "../../../assets/Baners/D5.png"
import D6 from "../../../assets/Baners/D6.png"

export default function SlideSection({ isSingleMode }) {
  const [animate, setAnimate] = useState(false);

  // Trigger Blinkit-style top animation when mode changes or mounts
  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [isSingleMode]);

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
    customPaging: (i) => (
      <div className="slick-dot-inner"></div>
    ),
  };

  const bannerSets = {
    single: [
      {
        image: LetterBanner,
        title: "Romantic Letters",
        subtitle: "Express your heart with a timeless letter",
        link: "/user/letter-izhaar",
        color: "from-pink-500/40"
      },
      {
        image: ScreenBanner,
        title: "Digital Izhaar",
        subtitle: "Share your feelings through music & screens",
        link: "/user/song",
        color: "from-purple-500/40"
      },
      {
        image: CrushBanner,
        title: "Secret Crush",
        subtitle: "Tell them anonymously, safely, and sweetly",
        link: "/user/secret-crush",
        color: "from-indigo-500/40"
      },
      {
        image: SafeDateBanner,
        title: "Safe Date",
        subtitle: "Respectful and memorable experiences",
        link: "/user/coming-soon",
        color: "from-rose-500/40"
      },
      {
        image: FightBanner,
        title: "Making Up",
        subtitle: "Resolve conflicts with a touch of love",
        link: "/user/coming-soon",
        color: "from-blue-500/40"
      },
    ],
    normal: [
      { image: D5, title: "Special Moments", subtitle: "Capture every shared memory", link: "/user/dashboard", color: "from-pink-500/20" },
      { image: D6, title: "Stay Connected", subtitle: "Building bridges through expression", link: "/user/dashboard", color: "from-purple-500/20" },
    ]
  };

  const currentBanners = isSingleMode ? bannerSets.single : bannerSets.normal;

  return (
    <div className={`w-full pt-2 pb-2 transition-all duration-1000 ease-out transform ${animate ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
      <Slider {...settings} className="relative banner-slider">
        {currentBanners.map((banner, index) => (
          <div key={`${isSingleMode ? 's' : 'n'}-${index}`} className="px-1.5 focus:outline-none">
            <Link
              to={banner.link}
              className="group block relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0a0a0c]"
            >
              {/* Image with overlay gradient */}
              <div className="relative w-full h-[200px] md:h-[360px] overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Romantic Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${banner.color} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col justify-end transform transition-transform duration-700 group-hover:translate-y-[-5px]">
                  <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-lg tracking-tight font-serif italic">
                    {banner.title}
                  </h3>
                  <p className="text-sm md:text-lg text-white/90 font-medium max-w-xs md:max-w-md drop-shadow-md leading-tight">
                    {banner.subtitle}
                  </p>

                  {/* Action Button Indicator */}
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-pink-400">Explore Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Glassy Ring Effect */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none group-hover:ring-pink-500/40 transition-all duration-700"></div>
            </Link>
          </div>
        ))}
      </Slider>

      <style>{`
        .banner-slider .slick-dots {
          bottom: 25px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 4px;
        }
        .banner-slider .slick-dots li {
          margin: 0 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .banner-slider .slick-dots li.slick-active .slick-dot-inner {
          width: 20px;
          border-radius: 4px;
          background: #ec4899;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
        }
        .banner-slider .slick-dot-inner {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
