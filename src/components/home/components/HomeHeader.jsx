import React, { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeHeader = ({ setIsMenuOpen }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Logic: 
            // 1. If at the very top, always show and keep background transparent
            if (currentScrollY <= 20) {
                setIsVisible(true);
                setIsScrolled(false);
            } else {
                // 2. If scrolled down, show background
                setIsScrolled(true);

                // 3. Hide when scrolling down, show when scrolling up
                if (currentScrollY > lastScrollRef.current + 5) {
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollRef.current - 5) {
                    setIsVisible(true);
                }
            }
            lastScrollRef.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check on mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 transition-all duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                } ${isScrolled ? "bg-black/80 backdrop-blur-lg" : "bg-transparent"}`}
        >
            <div className="flex items-center gap-2">
                <img src={Logo} alt="Izhaar" className="h-8" />
                <span className="text-[18px] font-bold font-['Outfit'] text-white flex items-center leading-none pointer-events-none select-none">
                    Izhaar<span className="text-[#EC4891] ml-1 relative top-[1px]">Love</span>
                </span>
            </div>
            <button className="text-2xl text-white/80" onClick={() => setIsMenuOpen(true)}>
                <FaBars />
            </button>
        </header>
    );
};

export default HomeHeader;
