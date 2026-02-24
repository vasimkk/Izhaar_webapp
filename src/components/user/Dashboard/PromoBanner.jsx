import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PromoBanner = ({ isSingleMode }) => {
    const promoSlides = [
        { text: "Today's Offer: Send a beautiful digital letter at just ₹99 (Save ₹100)!", btn: "Grab Offer 💌", path: "/user/letter-izhaar" },
        { text: "Before she goes 'I'm fine 😊' mode... drop a surprise.", btn: "Send Gift", path: "/gifts" },
        { text: "Anonymously confess your heart's secret feelings.", btn: "Confess", path: "/user/secret-crush" },
        { text: "Surprise your partner with a shared game experience.", btn: "Play Game", path: "/user/quiz" }
    ];

    const bannerSliderSettings = {
        dots: false,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        pauseOnHover: false
    };

    return (
        <div
            key={`banner-${isSingleMode}`}
            className="mt-8 relative overflow-hidden bg-white rounded-[2rem] p-8 min-h-[180px] flex items-center justify-between gap-4 shadow-2xl animate-premium-in"
            style={{ animationDelay: '700ms' }}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/50 rounded-full translate-x-8 -translate-y-8 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full -translate-x-12 translate-y-12 blur-2xl"></div>

            <div className="relative z-10">
                <h4 className="text-[22px] font-['Playfair_Display'] font-bold text-[#1e1b4b] leading-[1.2]">
                    Have you <br />
                    <span className="text-[#B72099] italic">{isSingleMode ? "Confessed" : "Celebrated"}</span> today?
                </h4>
                <p className="text-[10px] font-bold text-indigo-900/40 mt-2 uppercase tracking-widest pl-1">
                    IZHAAR EXCLUSIVE ✨
                </p>
            </div>

            <div className="relative z-10 flex-1 max-w-[220px]">
                <Slider {...bannerSliderSettings}>
                    {promoSlides.map((slide, index) => (
                        <div key={index} className="outline-none">
                            <div className="flex flex-col items-end gap-3 text-right">
                                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-[0.2em] leading-tight">
                                    {slide.text}
                                </p>
                                <Link to={slide.path}>
                                    <button className="px-9 py-3 bg-gradient-to-r from-[#B72099] to-[#801369] text-white rounded-full text-[10px] font-black shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
                                        {slide.btn}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default PromoBanner;
