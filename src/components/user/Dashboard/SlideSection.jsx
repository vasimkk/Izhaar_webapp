import React from "react";
import Slider from "react-slick";
import bg1 from "../../../assets/video/bg1.mp4";

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

  const VideoSlide = ({ index }) => (
    <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
      <video
        src={bg1}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onCanPlay={() => console.log(`Video ${index} ready`)}
        onError={(e) =>
          console.error(`Video ${index} error`, e.target.error)
        }
      />
    </div>
  );

  return (
    <div >
      <Slider {...settings}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} >
            <div className="">
              <VideoSlide index={i} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
