import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Import local assets for swipe cards
import letterImg from "../../../assets/SwapCard/letter.png";
import songImg from "../../../assets/SwapCard/song.png";
import crushImg from "../../../assets/SwapCard/secretcrush.png";
import connectImg from "../../../assets/SwapCard/truecoonect.png";
import dateImg from "../../../assets/SwapCard/safedate.png";
import playImg from "../../../assets/SwapCard/playtogether.png";
import giftImg from "../../../assets/SwapCard/gifts.png";
import watchImg from "../../../assets/SwapCard/watchtogether.png";
import magazineImg from "../../../assets/SwapCard/magazines.png";

const cards = [
    {
        id: 1,
        title: "Letter Confession",
        desc: "Share what your heart feels — we'll help you put it into perfect words.",
        image: letterImg,
        btnText: "Let's IZHAAR",
        path: "/user/letter-izhaar",
        bgColor: "from-sky-400 to-sky-600",
        badge: "PRO"
    },
    {
        id: 2,
        title: "Customize Song",
        desc: "Create a personalized romantic song tailored specifically for your partner.",
        image: songImg,
        btnText: "Compose Now",
        path: "/user/song",
        bgColor: "from-blue-600 to-indigo-800",
        badge: "ARTISTIC"
    },
    {
        id: 3,
        title: "Secret Crush",
        desc: "Wondering if they feel the same? Use our smart AI match to find out.",
        image: crushImg,
        btnText: "Start Discovery",
        path: "/user/secret-crush",
        bgColor: "from-rose-500 to-pink-700",
        badge: "HOT"
    },
    {
        id: 4,
        title: "True Connect",
        desc: "Deep conversations start here. Match with someone who truly resonates.",
        image: connectImg,
        btnText: "Connect Now",
        path: "/user/true-connection",
        bgColor: "from-indigo-600 to-purple-800",
        badge: "PREMIUM"
    },
    {
        id: 5,
        title: "Safe Date",
        desc: "Plan a verified and private meet-up with our premium date planning.",
        image: dateImg,
        btnText: "Plan Date",
        path: "/user/coming-soon",
        bgColor: "from-emerald-500 to-teal-800",
        badge: "SAFE"
    },
    {
        id: 6,
        title: "Ludo Romance",
        desc: "Play the classic game of Ludo with premium romantic features and sounds.",
        image: playImg,
        btnText: "Play Ludo",
        path: "/user/quiz",
        bgColor: "from-orange-500 to-red-700",
        badge: "FUN"
    },
    {
        id: 7,
        title: "Romantic Gifts",
        desc: "Send thoughtful tokens of love that speak louder than words.",
        image: giftImg,
        btnText: "Send Gift",
        path: "/gifts",
        bgColor: "from-pink-500 to-rose-600",
        badge: "CUTE"
    },
    {
        id: 8,
        title: "Watch Together",
        desc: "Cinema dates from anywhere. Watch and chat in real-time sync.",
        image: watchImg,
        btnText: "Start Party",
        path: "/user/watch-party",
        bgColor: "from-sky-600 to-blue-800",
        badge: "COZY"
    },
    {
        id: 9,
        title: "Izhaar Magazine",
        desc: "Feature your love story in a premium digital magazine experience.",
        image: magazineImg,
        btnText: "Create Now",
        path: "/magazine",
        bgColor: "from-amber-400 to-orange-600",
        badge: "GLAM"
    }
];

const SwipeCards = () => {
    const [cardsList, setCardsList] = useState(cards);

    const activeIndex = cardsList.length - 1;

    const handleSwipe = (direction) => {
        const newCards = [...cardsList];
        const swipedCard = newCards.pop();
        // Add to front of list to loop infinitely
        newCards.unshift(swipedCard);
        setCardsList(newCards);
    };

    const goToCard = (cardId) => {
        const currentActiveId = cardsList[activeIndex].id;
        if (currentActiveId === cardId) return;

        // Find how many pops we need to make the target card the active one
        let newCards = [...cardsList];
        let found = false;
        let safety = 0;

        while (!found && safety < cards.length) {
            if (newCards[newCards.length - 1].id === cardId) {
                found = true;
            } else {
                const card = newCards.pop();
                newCards.unshift(card);
            }
            safety++;
        }
        setCardsList(newCards);
    };

    return (
        <div className="w-full py-12 px-4 flex flex-col items-center overflow-hidden select-none">
            <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center">
                <AnimatePresence initial={false}>
                    {cardsList.map((card, i) => {
                        const isTop = i === activeIndex;
                        const isSecond = i === activeIndex - 1;
                        const isThird = i === activeIndex - 2;
                        const isFourth = i === activeIndex - 3;

                        // Only render top 4 for performance and clean look
                        if (!isTop && !isSecond && !isThird && !isFourth) return null;

                        return (
                            <SwipeCard
                                key={card.id}
                                card={card}
                                isTop={isTop}
                                index={i}
                                activeIndex={activeIndex}
                                onSwipe={handleSwipe}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination Dots matching active card id */}
            <div className="flex gap-2 mt-12 pb-4">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => goToCard(card.id)}
                        className={`transition-all duration-500 rounded-full cursor-pointer ${cardsList[activeIndex].id === card.id
                            ? "w-5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            : "w-1.5 h-1.5 bg-white/20"}`}
                    />
                ))}
            </div>
        </div>
    );
};

const SwipeCard = ({ card, isTop, index, activeIndex, onSwipe }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Smooth stack effects for lower cards
    const offset = activeIndex - index;
    const scale = 1 - offset * 0.04;
    // Alternate peeking from top and bottom
    const translateY = offset === 0 ? 0 : (offset % 2 === 0 ? 12 : -12) * offset;
    const rotateZ = isTop ? 0 : (offset % 2 === 0 ? 2 : -2) * offset;

    const handleDragEnd = (_, info) => {
        if (Math.abs(info.offset.x) > 100) {
            onSwipe(info.offset.x > 0 ? "right" : "left");
        }
    };

    return (
        <motion.div
            style={{
                x,
                rotate: isTop ? rotate : rotateZ,
                opacity: isTop ? opacity : 1 - offset * 0.2,
                zIndex: index,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: scale - 0.1, opacity: 0, y: translateY + 20 }}
            animate={{
                scale: isTop ? 1 : scale,
                opacity: 1,
                y: isTop ? 0 : translateY,
                transition: { type: "spring", stiffness: 300, damping: 25 }
            }}
            exit={{
                x: x.get() > 0 ? 500 : -500,
                opacity: 0,
                scale: 0.8,
                rotate: x.get() > 0 ? 45 : -45,
                transition: { duration: 0.4, ease: "easeIn" }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
            {/* High-Fidelity Card Body */}
            <div className={`w-full h-full rounded-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-br ${card.bgColor} border ${isTop ? 'border-white/10' : 'border-white/20'}`}>

                {/* Main Visual Asset - Full Cover */}
                <div className="absolute inset-0">
                    <motion.img
                        src={card.image}
                        alt={card.title}
                        animate={isTop ? {
                            scale: [1, 1.05, 1],
                        } : {}}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Top Floating Badge & Heart */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                    <div className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black tracking-[0.2em] rounded-full shadow-[0_8px_20px_rgba(236,72,145,0.3)]">
                        {card.badge}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-xl"
                    >
                        <FaHeart size={18} />
                    </motion.button>
                </div>

                {/* Bottom Content Panel - Refined Styling */}
                <div
                    className="absolute bottom-0 left-0 right-0 p-5 pb-5 z-20"
                    style={{
                        background: 'rgba(0, 0, 0, 0.10)',
                        borderRadius: '24px 24px 0 0',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.h3
                            layoutId={`title-${card.id}`}
                            className="text-xl font-black text-white mb-1 tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {card.title}
                        </motion.h3>
                        <p className="text-white/80 text-[10px] font-medium mb-4 max-w-[240px] leading-tight">
                            {card.desc}
                        </p>
                        <Link
                            to={card.path}
                            className="w-[247px] h-[40px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {card.btnText}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SwipeCards;