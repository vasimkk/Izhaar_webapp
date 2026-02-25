import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';

const PromoBanner = ({ isSingleMode }) => {
    const promoSlides = [
        {
            title: isSingleMode ? "Confessed" : "Celebrated",
            text: "Today's Offer: Send a beautiful digital letter at just ₹99!",
            btn: "Grab Offer 💌",
            path: "/user/letter-izhaar"
        },
        {
            title: isSingleMode ? "Surprised" : "Pampered",
            text: "Before she goes 'I'm fine 😊' mode... drop a surprise now.",
            btn: "Send Gift",
            path: "/gifts"
        },
        {
            title: isSingleMode ? "Expressed" : "Matched",
            text: "Anonymously confess your heart's most secret feelings.",
            btn: "Confess",
            path: "/user/secret-crush"
        },
        {
            title: isSingleMode ? "Played" : "Connected",
            text: "Surprise your partner with a shared game experience today.",
            btn: "Play Game",
            path: "/user/quiz"
        }
    ];

    const bannerSliderSettings = {
        dots: false,
        infinite: true,
        fade: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: false,
        pauseOnHover: true
    };

    return (
        <div className="px-4 mt-8 mb-16 relative overflow-visible">
            <motion.div
                key={`banner-${isSingleMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl rounded-[2.5rem] p-7 xs:p-8 sm:px-12 sm:py-10"
            >
                {/* Decorative Premium Glows */}
                <div className="absolute top-0 right-[-10%] w-[40%] h-[150%] bg-pink-500/10 blur-[80px] rounded-full rotate-12 -z-10 pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-5%] w-[30%] h-[100%] bg-indigo-500/10 blur-[80px] rounded-full -z-10 pointer-events-none"></div>

                <div className="w-full relative z-10">
                    <Slider {...bannerSliderSettings}>
                        {promoSlides.map((slide, index) => (
                            <div key={index} className="outline-none">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12">
                                    <div className="text-center sm:text-left flex-1">
                                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500 shadow-[0_0_10px_#ec4899]"></span>
                                            </span>
                                            <motion.span
                                                animate={{
                                                    opacity: [0.4, 0.7, 0.4],
                                                    textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 8px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="text-[10px] sm:text-[11px] font-black tracking-[0.3em] uppercase text-white/80"
                                            >
                                                Today's Special
                                            </motion.span>
                                        </div>

                                        <h4 className="text-[26px] sm:text-[36px] font-['Playfair_Display'] font-black text-white leading-tight">
                                            Have you <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 italic font-medium">{slide.title}</span> today?
                                        </h4>
                                    </div>

                                    <div className="flex-[1.5] flex flex-col items-center sm:items-end gap-5 text-center sm:text-right">
                                        <p className="text-[14px] sm:text-[17px] font-medium text-white/70 leading-relaxed font-['Poppins']">
                                            {slide.text}
                                        </p>
                                        <Link to={slide.path}>
                                            <button className="px-5 py-2 bg-gradient-to-r from-[#B72099] to-[#801369] text-white rounded-xl text-[10px] font-extrabold shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 mx-auto sm:mx-0">
                                                {slide.btn}
                                                <span className="text-base text-white/80">➔</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </motion.div>
        </div>
    );
};

export default PromoBanner;
