import React from "react";
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

export default function SlideSection() {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,         // ❌ remove left/right buttons
    speed: 500,
    slidesToShow: 1, // Show only one slide at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1, // Adjust for medium screens
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Adjust for small screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  const banners = [
    { mobile: B1, desktop: D1, link: "/user/letter-izhaar" },
    { mobile: B2, desktop: D2, link: "/user/song" },
    { mobile: B3, desktop: D3, link: "/user/coming-soon" },
    { mobile: B4, desktop: D4, link: "/gifts" },
  ];

  return (
    <div className="px-0 py-2">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="px-0">
            <Link to={banner.link} className="block relative h-64 sm:h-[450px] overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-[#1a1c3d] mx-2">
              {/* usage of picture element for responsive art direction */}
              <picture className="block w-full h-full">
                <source media="(min-width: 768px)" srcSet={banner.desktop} />
                <img
                  src={banner.mobile}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                />
              </picture>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
