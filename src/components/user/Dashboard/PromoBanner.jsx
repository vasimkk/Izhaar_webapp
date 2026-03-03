import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from 'framer-motion';

const PromoBanner = ({ isSingleMode }) => {
    const promoSlides = [
        {
            title: "Confessed",
            text: "Today's Offer: Send a beautiful digital letter at just ₹99!",
            btn: "Grab Offer 💌",
            path: "/user/letter-izhaar"
        },
        {
            title: "Surprised",
            text: "Before she goes 'I'm fine 😊' mode... drop a surprise now.",
            btn: "Send Gift",
            path: "/gifts"
        },
        {
            title: "Expressed",
            text: "Anonymously confess your heart's most secret feelings.",
            btn: "Confess",
            path: "/user/secret-crush"
        },
        {
            title: "Connected",
            text: "Surprise your partner with a shared game experience today.",
            btn: "Play Game",
            path: "/user/quiz"
        }
    ];

    const bannerSliderSettings = {
        dots: false,
        infinite: true,
        fade: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        arrows: false,
        pauseOnHover: true
    };

    return (
        <div className="px-4 mt-8 mb-16 relative overflow-visible">
            <motion.div
                key="promo-banner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden p-7 xs:p-8 sm:px-4 sm:py-6"
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

                                        <h4 className="dashboard-head-text text-2xl sm:text-3xl leading-tight">
                                            Have you <span className="italic">{slide.title}</span> today?
                                        </h4>
                                    </div>

                                    <div className="flex-[1.5] flex flex-col items-center sm:items-end gap-5 text-center sm:text-right">
                                        <p className="dashboard-subtext text-sm sm:text-base leading-relaxed">
                                            {slide.text}
                                        </p>
                                        <Link to={slide.path}>
                                            <button className="dashboard-button">
                                                {slide.btn}
                                                <span className="ml-2">➔</span>
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
