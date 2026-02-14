import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import B1 from "../../../assets/Baners/B1.png"
import B2 from "../../../assets/Baners/B2.png"
import B3 from "../../../assets/Baners/B3.png"
import B4 from "../../../assets/Baners/B4.png"
import D1 from "../../../assets/Baners/D1.png"
import D2 from "../../../assets/Baners/D2.png"
import D3 from "../../../assets/Baners/D3.png"
import D4 from "../../../assets/Baners/D4.png"
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
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const bannerSets = {
    single: [
      { mobile: B1, desktop: D1, link: "/user/letter-izhaar" },
      { mobile: B2, desktop: D2, link: "/user/song" },
      { mobile: B3, desktop: D3, link: "/user/coming-soon" },
      { mobile: B4, desktop: D4, link: "/gifts" },
    ],
    normal: [
      { mobile: D5, desktop: D5, link: "/user/dashboard" },
      { mobile: D6, desktop: D6, link: "/user/dashboard" },
    ]
  };

  const currentBanners = isSingleMode ? bannerSets.single : bannerSets.normal;

  return (
    <div className={`w-full py-2 transition-all duration-700 ease-out transform ${animate ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
      <Slider {...settings}>
        {currentBanners.map((banner, index) => (
          <div key={`${isSingleMode ? 's' : 'n'}-${index}`} className="px-1.5 focus:outline-none">
            <Link
              to={banner.link}
              className="block relative w-full overflow-hidden rounded-2xl border border-white/5 shadow-lg bg-[#0a0a0c]"
            >
              <picture className="block w-full">
                <source media="(min-width: 768px)" srcSet={banner.desktop} />
                <img
                  src={banner.mobile}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-auto min-h-[160px] md:min-h-[300px] object-fit transition-all duration-700 hover:scale-[1.01]"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"></div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
