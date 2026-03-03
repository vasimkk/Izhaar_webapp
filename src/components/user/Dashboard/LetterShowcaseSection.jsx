import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RiMailSendLine } from 'react-icons/ri';

// Import all 16 new letter templates
import n1 from '../../../assets/New/1.png';
import n2 from '../../../assets/New/2.png';
import n3 from '../../../assets/New/3.png';
import n4 from '../../../assets/New/4.jpeg';
import n5 from '../../../assets/New/5.png';
import n6 from '../../../assets/New/6.png';
import n7 from '../../../assets/New/7.png';
import n8 from '../../../assets/New/8.png';
import n9 from '../../../assets/New/9.png';
import n10 from '../../../assets/New/10.png';
import n11 from '../../../assets/New/11.png';
import n12 from '../../../assets/New/12.png';
import n13 from '../../../assets/New/13.png';
import n14 from '../../../assets/New/14.png';
import n15 from '../../../assets/New/15.png';
import n16 from '../../../assets/New/16.png';

const LetterShowcaseSection = () => {
    const navigate = useNavigate();

    const templates = [
        { id: 1, title: 'Eternal Flame', img: n1, tag: 'TRENDING', isPro: true },
        { id: 2, title: 'Midnight Muse', img: n2, tag: 'NEW' },
        { id: 3, title: 'Rose Velvet', img: n3, tag: 'POPULAR', isPro: true },
        { id: 4, title: 'Golden Hour', img: n4, tag: 'CLASSIC' },
        { id: 5, title: 'Ocean Deep', img: n5, tag: 'INTENSE', isPro: true },
        { id: 6, title: 'Wild Heart', img: n6, tag: 'FRESH' },
        { id: 7, title: 'Soft Whisper', img: n7, tag: 'MINIMAL' },
        { id: 8, title: 'Royal Bloom', img: n8, tag: 'PREMIUM', isPro: true },
        { id: 9, title: 'Vintage Love', img: n9, tag: 'BOUTIQUE' },
        { id: 10, title: 'Shadow Soul', img: n10, tag: 'MYSTERY', isPro: true },
        { id: 11, title: 'Pure Grace', img: n11, tag: 'ELEGANT' },
        { id: 12, title: 'Glow Drift', img: n12, tag: 'VIBRANT', isPro: true },
        { id: 13, title: 'Distant Star', img: n13, tag: 'DREAMY' },
        { id: 14, title: 'Urban Echo', img: n14, tag: 'MODERN', isPro: true },
        { id: 15, title: 'Silent Charm', img: n15, tag: 'SWEET' },
        { id: 16, title: 'Timeless', img: n16, tag: 'LEGACY', isPro: true },
    ];

    // Double the templates for seamless looping
    const loopedTemplates = [...templates, ...templates];

    return (
        <div className="w-full mt-12 mb-16 overflow-hidden">
            {/* Heading */}
            <div className="flex items-center justify-between mb-6 px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <RiMailSendLine className="text-pink-500 text-xl drop-shadow-[0_0_8px_rgba(236,72,145,0.6)]" />
                    <h2
                        className="text-white tracking-[0.1em]"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px' }}
                    >
                        Letter Templates
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/user/letter-izhaar')}
                    className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                    View Gallery
                </button>
            </div>

            {/* Infinite Marquee Container */}
            <div className="relative flex items-center">
                <motion.div
                    className="flex gap-5 whitespace-nowrap py-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ width: "max-content" }}
                >
                    {loopedTemplates.map((letter, index) => (
                        <motion.div
                            key={`${letter.id}-${index}`}
                            whileHover={{ y: -8 }}
                            onClick={() => navigate('/user/letter-izhaar')}
                            className="w-[150px] md:w-[200px] relative group cursor-pointer inline-block"
                        >
                            {/* Letter Card */}
                            <div className="relative aspect-[1/1.4] overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl rounded-2xl">
                                <img
                                    src={letter.img}
                                    alt={letter.title}
                                    className="w-full h-full object-cover object-top transition-all duration-700 opacity-90 group-hover:opacity-100"
                                />

                                {/* PRO Badge */}
                                {letter.isPro && (
                                    <div className="absolute top-2 right-2 z-20">
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20">
                                            <span>PRO</span>
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                    <span className="text-[7px] font-black text-pink-500 uppercase tracking-widest mb-1 drop-shadow-lg">{letter.tag}</span>
                                    <h3
                                        className="text-white text-[10px] md:text-xs font-bold whitespace-normal"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        {letter.title}
                                    </h3>
                                    <div className="h-[1px] w-0 group-hover:w-full bg-pink-500 mt-1.5 transition-all duration-500" />
                                </div>
                            </div>

                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/20 group-hover:to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Left & Right Fades for seamless marquee look */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#000] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#000] to-transparent pointer-events-none z-10" />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 px-4 md:px-8">
                <div className="h-[1px] w-8 bg-white/10" />
                <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">Auto-Scrolling Premium Collection</p>
                <div className="h-[1px] w-8 bg-white/10" />
            </div>
        </div>
    );
};

export default LetterShowcaseSection;
