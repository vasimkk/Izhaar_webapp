import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeHeader = ({ setIsMenuOpen }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
                }`}
        >
            <img src={Logo} alt="Izhaar" className="h-8" />
            <button className="text-2xl text-white/80" onClick={() => setIsMenuOpen(true)}>
                <FaBars />
            </button>
        </header>
    );
};

export default HomeHeader;
