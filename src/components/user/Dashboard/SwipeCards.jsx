import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FaHeart, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Import local assets for swipe cards
const letterImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/letter?_a=BAMAOGeA0";
const songImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/song?_a=BAMAOGeA0";
const crushImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/secretcrush?_a=BAMAOGeA0";
const connectImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/truecoonect?_a=BAMAOGeA0";
const dateImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/safedate?_a=BAMAOGeA0";
const playImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/playtogether?_a=BAMAOGeA0";
const giftImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/gifts?_a=BAMAOGeA0";
const watchImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/watchtogether?_a=BAMAOGeA0";
const magazineImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/SwapCard/magazines?_a=BAMAOGeA0";

const cards = [
    {
        id: 1,
        title: "Letter Confession",
        desc: "Share what your heart feels — we'll help you put it into perfect words.",
        image: letterImg,
        btnText: "Let's IZHAAR",
        path: "/user/letter-izhaar",
        background: "linear-gradient(179deg, #A9368F 0.94%, #D63E9A 50.1%, #F24A97 99.26%)",
        badge: "PRO"
    },
    {
        id: 2,
        title: "Customize Song",
        desc: "Create a personalized romantic song tailored specifically for your partner.",
        image: songImg,
        btnText: "Compose Now",
        path: "/user/song",
        background: "linear-gradient(359deg, #2E689A 0.84%, #1F4667 50%, #102334 99.16%)",
        badge: "ARTISTIC"
    },
    {
        id: 3,
        title: "Secret Crush",
        desc: "Wondering if they feel the same? Use our smart AI match to find out.",
        image: crushImg,
        btnText: "Start Discovery",
        path: "/user/secret-crush",
        background: "linear-gradient(359deg, #A835DC 0.84%, #8129A9 50%, #5A1C76 99.16%)",
        badge: "HOT"
    },
    {
        id: 4,
        title: "True Connect",
        desc: "Deep conversations start here. Match with someone who truly resonates.",
        image: connectImg,
        btnText: "Connect Now",
        path: "/user/true-connection",
        background: "linear-gradient(359deg, #4244CC 0.84%, #323399 50%, #212266 99.16%)",
        badge: "PREMIUM"
    },
    {
        id: 5,
        title: "Safe Date",
        desc: "Plan a verified and private meet-up with our premium date planning.",
        image: dateImg,
        btnText: "Plan Date",
        path: "/user/coming-soon",
        background: "linear-gradient(359deg, #F39226 0.84%, #E36B3E 50%, #912735 99.16%)",
        badge: "SAFE"
    },
    {
        id: 6,
        title: "Ludo Romance",
        desc: "Play the classic game of Ludo with premium romantic features and sounds.",
        image: playImg,
        btnText: "Play Ludo",
        path: "/user/quiz",
        background: "linear-gradient(359deg, #08B5CE 0.84%, #06889B 50%, #045B68 99.16%)",
        badge: "FUN"
    },
    {
        id: 7,
        title: "Romantic Gifts",
        desc: "Send thoughtful tokens of love that speak louder than words.",
        image: giftImg,
        btnText: "Send Gift",
        path: "/gifts",
        background: "linear-gradient(359deg, #B62D6B 0.84%, #83204D 50%, #6A1A3E 99.16%)",
        badge: "CUTE"
    },
    {
        id: 8,
        title: "Watch Together",
        desc: "Cinema dates from anywhere. Watch and chat in real-time sync.",
        image: watchImg,
        btnText: "Start Party",
        path: "/user/watch-party",
        background: "linear-gradient(359deg, #18B87C 0.84%, #11855A 50%, #0B5237 99.16%)",
        badge: "COZY"
    },
    {
        id: 9,
        title: "Izhaar Magazine",
        desc: "Feature your love story in a premium digital magazine experience.",
        image: magazineImg,
        btnText: "Create Now",
        path: "/magazine",
        background: "linear-gradient(179deg, #A03C06 0.94%, #B74C3E 50.1%, #C1475D 99.26%)",
        badge: "GLAM"
    }
];

const SwipeCards = ({ onActiveCardChange }) => {
    const [cardsList, setCardsList] = useState(cards);
    const activeIndex = cardsList.length - 1;

    const handleSwipe = (direction) => {
        const swipedCardId = cardsList[activeIndex].id;

        // Remove the card first to trigger exit animation
        setCardsList(prev => prev.slice(0, -1));

        // After a delay that matches exit animation, add it back to the bottom
        setTimeout(() => {
            const swipedCard = cards.find(c => c.id === swipedCardId);
            setCardsList(prev => {
                const newList = [swipedCard, ...prev];
                return newList;
            });

            // Notify of new background outside the functional state update
            const nextTopCard = cardsList[activeIndex - 1]; // Current top - 1 will be next top before the state sets the swiped one at the bottom
            // Actually, cardsList.length will be -1, but newList will be correct. 
            // It's safer to just find the card that will be at the top now.
            const newTop = cardsList[activeIndex - 1];
            if (onActiveCardChange && newTop) {
                onActiveCardChange(newTop.background);
            }
        }, 400);
    };

    const goToCard = (cardId) => {
        // Logic to shuffle until target card is at top
        const targetIndex = cardsList.findIndex(c => c.id === cardId);
        if (targetIndex === -1 || targetIndex === activeIndex) return;

        const newCards = [...cardsList];
        const cardsToMove = newCards.splice(0, targetIndex + 1);
        const finalCards = [...newCards, ...cardsToMove];
        setCardsList(finalCards);

        // Notify of background change
        if (onActiveCardChange && finalCards[finalCards.length - 1]) {
            onActiveCardChange(finalCards[finalCards.length - 1].background);
        }
    };

    return (
        <div className="w-full pt-2 pb-12 px-4 flex flex-col items-center overflow-visible select-none relative z-10">
            <div className="relative w-full max-w-[280px] aspect-[4/5] flex items-center justify-center">
                <AnimatePresence initial={false}>
                    {cardsList.map((card, i) => {
                        const isTop = i === activeIndex;
                        const isSecond = i === activeIndex - 1;
                        const isThird = i === activeIndex - 2;
                        const isFourth = i === activeIndex - 3;
                        const isFifth = i === activeIndex - 4;
                        const isSixth = i === activeIndex - 5;
                        const isSeventh = i === activeIndex - 6;
                        const isEighth = i === activeIndex - 7;

                        // Render top 8 for a dense "stacked lines" effect
                        if (!isTop && !isSecond && !isThird && !isFourth && !isFifth && !isSixth && !isSeventh && !isEighth) return null;

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
    const [exitX, setExitX] = useState(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const offset = activeIndex - index;
    const stackScale = 1 - offset * 0.03;
    const stackY = offset * -12; // Adjusted for smaller cards

    const handleDragEnd = (_, info) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            setExitX(600);
            onSwipe("right");
        } else if (info.offset.x < -threshold) {
            setExitX(-600);
            onSwipe("left");
        }
    };

    return (
        <motion.div
            key={card.id}
            style={{
                x,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : 1,
                zIndex: index,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{
                scale: isTop ? 1 : stackScale,
                opacity: 1 - offset * 0.1,
                y: isTop ? 0 : stackY,
                transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 0.8
                }
            }}
            exit={{
                x: exitX,
                rotate: exitX > 0 ? 45 : -45,
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.4, ease: "easeIn" }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >


            {/* Decorative Background Shapes (Blobs) */}
            <div className="absolute inset-[-15%] pointer-events-none overflow-visible">
                {/* Blob 1: Top Right */}
                <motion.div
                    animate={isTop ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-0 -right-4 w-[60%] h-[60%] blur-[40px] rounded-full opacity-40 z-0"
                    style={{ background: card.background }}
                />
                {/* Blob 2: Bottom Left */}
                <motion.div
                    animate={isTop ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-4 w-[60%] h-[60%] blur-[40px] rounded-full opacity-40 z-0"
                    style={{ background: card.background }}
                />
            </div>

            {/* High-Fidelity Card Body */}
            <div
                className={`w-full h-full rounded-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border ${isTop ? 'border-white/10' : 'border-white/20'} z-10`}
                style={{ background: card.background }}
            >

                {/* Main Visual Asset - Full Cover */}
                <div className="absolute inset-0">
                    <motion.img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        decoding="async"
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

                <div
                    className="absolute bottom-0 left-0 right-0 p-3 pb-4 z-20"
                    style={{
                        background: 'rgba(0, 0, 0, 0.10)',
                        borderRadius: '24px 24px 0 0',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.h3
                            layoutId={`title-${card.id}`}
                            className="dashboard-head-text mb-1 tracking-tight text-[15px]"
                        >
                            {card.title}
                        </motion.h3>
                        <p className="dashboard-subtext mb-3 max-w-[260px] leading-snug text-white/80 text-[11px]">
                            {card.desc}
                        </p>
                        <Link
                            to={card.path}
                            className="w-[180px] h-[32px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-[9px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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