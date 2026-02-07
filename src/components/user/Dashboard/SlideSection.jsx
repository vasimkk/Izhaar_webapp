import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import B1 from "../../../assets/Baners/B1.png"
import B2 from "../../../assets/Baners/B2.png"
import B3 from "../../../assets/Baners/B3.png"
import B4 from "../../../assets/Baners/B4.png"

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
    { img: B1, link: "/user/letter-izhaar" },
    { img: B2, link: "/user/song" },
    { img: B3, link: "/user/coming-soon" },
    { img: B4, link: "/gifts" },
  ];

  return (
    <div>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index}>
            <Link to={banner.link} className="block relative w-full md:h-[400px] overflow-hidden">
              <img
                src={banner.img}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
