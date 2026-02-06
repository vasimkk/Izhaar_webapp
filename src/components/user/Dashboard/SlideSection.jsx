import React from "react";
import Slider from "react-slick";
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

  const banners = [B1, B2, B3, B4];

  return (
    <div>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index}>
            <div className="relative w-full  md:h-[400px] overflow-hidden">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
