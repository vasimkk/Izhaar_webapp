import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import letterImg from "../../../assets/services/AddLetter.png";
import crushImg from "../../../assets/services/crush.png";

const ValentineAd = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [adIndex, setAdIndex] = useState(0);

    const ads = [
        {
            id: 'letter',
            title: "Confess with the",
            highlight: "Izhaar Letter",
            description: "The most romantic way to share your secret feelings. We help you craft the perfect words for your special someone.",
            priceOrg: "₹199",
            priceNew: "₹99",
            label: "Valentine's Exclusive",
            buttonText: "Grab Offer 💌",
            link: "/user/letter-izhaar",
            image: letterImg,
            badge: "SAVE ₹100",
            type: "offer"
        },
        {
            id: 'crush',
            title: "Find your",
            highlight: "Secret Crush",
            description: "Wondering if they like you back? Add them to your secret list and we'll let you know if there's a match! Anonymously.",
            priceOrg: null,
            priceNew: "FREE",
            label: "Find Your Match",
            buttonText: "Add Crush 🤫",
            link: "/user/secret-crush",
            image: crushImg,
            badge: "SECRET",
            type: "feature"
        }
    ];

    // Rotate ads every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % ads.length);
        }, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [ads.length]);

    // Automatically show the ad again after 1 minute if it was closed
    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 60000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    const currentAd = ads[adIndex];

    return (
        <div className={`w-full px-4 relative transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 h-auto mb-8 pointer-events-auto' : 'opacity-0 translate-y-10 h-0 mb-0 overflow-hidden pointer-events-none'}`}>
            <div className={`relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#B72099]/20 to-[#312E81]/40 backdrop-blur-2xl border border-[#B72099]/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 ${isVisible ? 'animate-premium-in' : ''} hover:border-[#B72099]/60 hover:shadow-[0_0_40px_rgba(183,32,153,0.15)]`}>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-5 right-5 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/40 hover:text-white hover:bg-[#B72099]/30 hover:border-[#B72099]/40 transition-all active:scale-90"
                >
                    <div className="relative w-4 h-4">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white rotate-45 rounded-full shadow-[0_0_8px_white]"></div>
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -rotate-45 rounded-full shadow-[0_0_8px_white]"></div>
                    </div>
                </button>

                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#B72099]/10 via-transparent to-[#312E81]/10 opacity-60"></div>
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#B72099]/15 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#312E81]/20 rounded-full blur-[100px] animate-pulse"></div>

                {/* Ad Label */}
                <div className="absolute top-6 left-8 z-20">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#B72099] rounded-full animate-ping"></span>
                        <span className="px-3 py-1 bg-[#B72099]/10 backdrop-blur-md rounded-full text-[9px] font-black text-white tracking-[0.3em] uppercase border border-[#B72099]/20">
                            {currentAd.label}
                        </span>
                    </div>
                </div>

                <div key={adIndex} className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-14 gap-8 animate-active-ad">
                    {/* Content Side */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-5 leading-[1.1]">
                            {currentAd.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B72099] to-[#FF45BB] drop-shadow-sm">{currentAd.highlight}</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-base mb-10 max-w-md leading-relaxed h-12">
                            {currentAd.description}
                        </p>

                        <div className="flex flex-col md:flex-row items-center gap-8 justify-center md:justify-start">
                            {/* Pricing Section */}
                            <div className="relative flex items-center gap-6">
                                {currentAd.priceOrg && (
                                    <div className="relative px-3 py-1">
                                        <span className="text-3xl md:text-4xl text-white/20 font-black italic tracking-tighter">{currentAd.priceOrg}</span>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="absolute w-full h-[4px] bg-[#B72099] rotate-[-20deg] shadow-[0_0_15px_#B72099] rounded-full"></div>
                                            <div className="absolute w-full h-[4px] bg-[#B72099] rotate-[20deg] shadow-[0_0_15px_#B72099] rounded-full"></div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col items-start leading-none relative">
                                    <div className="absolute -top-6 -right-4 transform rotate-12">
                                        <span className="text-[8px] bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full font-black animate-bounce shadow-xl border border-white/20 uppercase">
                                            {currentAd.id === 'letter' ? 'VALENTINE OFFER' : 'LIMITED TIME'}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-[#B72099] font-black uppercase tracking-widest mb-2 opacity-80">
                                        {currentAd.id === 'letter' ? 'Limited Price' : 'Try for free'}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(183,32,153,0.5)] tracking-tighter">{currentAd.priceNew}</span>
                                        {currentAd.id === 'letter' && <span className="text-sm text-white/30 font-bold uppercase tracking-widest">Only</span>}
                                    </div>
                                </div>
                            </div>

                            <Link to={currentAd.link}>
                                <button className="relative px-12 py-5 bg-gradient-to-r from-[#B72099] to-[#801369] text-white rounded-full text-sm font-black shadow-[0_10px_40px_rgba(183,32,153,0.4)] hover:scale-105 hover:shadow-[0_15px_50px_rgba(183,32,153,0.6)] active:scale-95 transition-all uppercase tracking-[0.25em]">
                                    {currentAd.buttonText}
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#B72099]/20 rounded-full blur-[60px] animate-pulse"></div>
                        <img
                            src={currentAd.image}
                            alt={currentAd.highlight}
                            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-float"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-[#B72099] to-transparent rounded-full opacity-20 blur-2xl animate-spin-slow"></div>
                        {/* Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-[10px] font-black w-16 h-16 rounded-full flex flex-col items-center justify-center rotate-12 shadow-xl border-2 border-black/5 animate-bounce z-20">
                            <span className="text-[8px] uppercase">{currentAd.id === 'letter' ? 'SAVE' : 'NEW'}</span>
                            <span className="text-lg">{currentAd.badge}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(5deg) scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeAd {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-premium-in { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-active-ad { animation: fadeAd 0.6s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default ValentineAd;
