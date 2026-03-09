import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";
const PrivateIcon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/private?_a=BAMAOGeA0";
const VerifiedIcon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/verified?_a=BAMAOGeA0";
const SafeIcon = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/safe?_a=BAMAOGeA0";
const Babitha = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/babitha?_a=BAMAOGeA0";
const Basha = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/basha?_a=BAMAOGeA0";
const Divya = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/divya?_a=BAMAOGeA0";
const Srikanth = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/srikanth?_a=BAMAOGeA0";
const Imanuel = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Imanuel?_a=BAMAOGeA0";
const Preethi = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Preethi?_a=BAMAOGeA0";
const Rachel = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Rachel?_a=BAMAOGeA0";
const RohanImg = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Rohan?_a=BAMAOGeA0";
const Saniya = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Saniya?_a=BAMAOGeA0";
const Venkat = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Add/Venkat?_a=BAMAOGeA0";

const testimonials = [
    { name: "Babitha", text: "Bohot pyaara ehsaas hai, safe aur private! ❤️", img: Babitha },
    { name: "Basha", text: "Best way to confess feelings, no awkwardness. ✨", img: Basha },
    { name: "Divya", text: "It's like a digital love letter, so romantic! 🌹", img: Divya },
    { name: "Imanuel", text: "Mujhe bohot pasand aaya, security top notch hai!", img: Imanuel },
    { name: "Preethi", text: "Finally, a safe space for secret admirers! 🥰", img: Preethi },
    { name: "Rachel", text: "Genuine and heartfelt. Truly Indian at heart. ✨", img: Rachel },
    { name: "Rohan", text: "Simple, clean and truly beautiful experience. 💖", img: RohanImg },
    { name: "Saniya", text: "Best platform for expressing real emotions. 🛡️", img: Saniya },
    { name: "Srikanth", text: "Bohot hi unique concept hai, Dil jeet liya! ✨", img: Srikanth },
    { name: "Venkat", text: "Elegant and safe. Just what we needed. ✅", img: Venkat }
];

const IzhaarMoment = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = React.useState(100);
    const [activeSlide, setActiveSlide] = React.useState(0);

    React.useEffect(() => {
        // Testimonials Auto-play
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % (testimonials.length / 2));
        }, 4000);

        // Dynamic Counter Animation
        const target = 50000;
        const duration = 2000; // 2 seconds
        const stepTime = 20; // 20ms
        const totalSteps = duration / stepTime;
        const increment = (target - 100) / totalSteps;

        let current = 100;
        const counterTimer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setUserCount(target);
                clearInterval(counterTimer);
            } else {
                setUserCount(Math.floor(current));
            }
        }, stepTime);

        return () => {
            clearInterval(timer);
            clearInterval(counterTimer);
        };
    }, []);

    return (
        <div className="min-h-[100dvh] bg-[#12001C] text-white font-sans overflow-y-auto relative flex flex-col items-center no-scrollbar">
            {/* Premium Background Layers - Custom Gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(169deg, #12001C 0%, #2E004F 44.91%, #7B0248 99.8%)' }}
                />
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-[radial-gradient(circle_at_50%_50%,#2D005A_0%,transparent_70%)] opacity-60" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] bg-[radial-gradient(circle_at_50%_100%,#B7209922_0%,transparent_60%)] opacity-30" />
            </div>

            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[430px] px-4 xs:px-6 min-h-[100dvh] flex flex-col items-center justify-start py-8 xs:py-12 text-center"
            >
                {/* 1. Header Logo - Compact Scaling */}
                <div className="mb-2 xs:mb-3">
                    <img
                        src={Logo}
                        alt="Izhaar Logo"
                        className="h-16 xs:h-22 w-auto drop-shadow-[0_0_40px_rgba(183,32,153,0.5)]"
                    />
                </div>

                {/* 2. Welcome Messaging - Ultra Compact */}
                <div className="mb-4 xs:mb-8">
                    <h2 className="text-[28px] xs:text-[32px] leading-none font-playball font-normal text-white/90 tracking-wide">
                        Welcome to Izhaar
                    </h2>
                    <h1 className="text-[34px] xs:text-[40px] leading-tight font-playball font-normal text-white mt-[53px] mb-[24px]">
                        Someone Secretly has a  <br />
                        <span className="italic font-normal">
                            Crush on You…<motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block transform translate-y-1 text-2xl xs:text-3xl not-italic"
                            >
                                🤫
                            </motion.span>
                        </span>
                    </h1>
                    <p className="text-white/70 text-[14px] leading-[1.4] max-w-[280px] mx-auto font-poppins font-normal">
                        A special person used <span className="text-white font-bold">Izhaar</span> to express their feelings safely <span className="text-yellow-400">✨</span>
                    </p>
                </div>

                {/* 3. Status Pills - Custom Asset Icons */}
                <div className="flex flex-wrap justify-center gap-1.5 xs:gap-2.5 mb-5 xs:mb-7">
                    {[
                        { icon: PrivateIcon, label: "Private", color: "bg-[#10B981]/10 border-white/20 text-white" },
                        { icon: VerifiedIcon, label: "Verified", color: "bg-[#B72099]/10 border-white/20 text-white" },
                        { icon: SafeIcon, label: "Safe", color: "bg-[#F59E0B]/10 border-white/20 text-white" }
                    ].map((pill, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${pill.color} text-[10px] xs:text-[12px] font-bold tracking-wider backdrop-blur-md`}
                        >
                            <img src={pill.icon} alt="" className="w-3.5 h-3.5 xs:w-4 xs:h-4 object-contain" />
                            <span>{pill.label}</span>
                        </div>
                    ))}
                </div>

                {/* 4. Courage Text - Minimal */}
                {/* 4. Courage Text - Pill Styled */}
                <div className="w-[258px] h-[48px] mx-auto mb-6 xs:mb-8 flex flex-col items-center justify-center gap-1">
                    <p className="text-white text-[14px] font-poppins font-normal leading-none text-center">
                        It takes Courage to express feelings.
                    </p>
                    <p className="text-white/60 text-[14px] font-poppins font-normal leading-none text-center">
                        Someone gathered that courage for you.
                    </p>
                </div>

                {/* 5. Unified Action & Notice Container - User Friendly Interaction */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-[92%] xs:w-[90%] mx-auto mb-10 relative group"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-x-4 -top-4 -bottom-4 bg-pink-500/10 blur-[50px] rounded-full z-0 opacity-50" />

                    <div className="relative z-10 bg-[#1A0510]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 xs:p-7 shadow-2xl overflow-hidden">
                        {/* 1. The Notice - Positioned First for Context */}
                        <div className="flex flex-col items-center text-center gap-3 mb-8">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">Important Note</span>
                            </div>

                            <p className="text-white/80 text-[14px] xs:text-[15px] leading-relaxed font-poppins font-medium max-w-[280px]">
                                Use the <span className="text-white font-black underline decoration-pink-500/50 underline-offset-4 decoration-2">same phone number</span> that received the notification to log in and view your Izhaar message 💌
                            </p>
                        </div>

                        {/* 2. The Button - Final Action */}
                        <div className="relative w-full group/btn">
                            {/* Rotating Border Animation */}
                            <div className="absolute -inset-[1.5px] rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,#FED700_320deg,transparent_360deg)] opacity-80"
                                />
                            </div>

                            <button
                                onClick={() => navigate('/entry')}
                                className="group relative w-full py-3.5 xs:py-4.5 rounded-full border border-[#FED700]/40 bg-[#12001C] text-white text-[16px] xs:text-[18px] font-bold tracking-wide shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] active:scale-95 transition-all overflow-hidden z-10"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2.5">
                                    <span>View Crush</span>
                                    <motion.span
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-[20px]"
                                    >
                                        ❤️
                                    </motion.span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-50" />
                            </button>
                        </div>

                        {/* Decorative Bottom Glow */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full" />
                    </div>
                </motion.div>
                {/* 6. Testimonials Card - Compressed for Small Mobiles */}
                <div className="w-full mb-5 xs:mb-7">
                    <div className="bg-[#1A0510]/40 backdrop-blur-xl rounded-[1.5rem] xs:rounded-[2.5rem] border border-white/10 p-3 xs:p-5 shadow-2xl">
                        <h4 className="text-[14px] font-poppins font-semibold text-white mb-3 xs:mb-5 leading-none text-center">
                            What people say...
                        </h4>

                        <div className="overflow-hidden relative h-[105px] xs:h-[135px]">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 gap-2 xs:gap-4"
                            >
                                {testimonials.slice(activeSlide * 2, (activeSlide * 2) + 2).map((user, i) => (
                                    <div key={i} className="flex flex-col items-center text-center gap-1 xs:gap-2">
                                        <img
                                            src={user.img}
                                            className="w-10 h-10 xs:w-14 xs:h-14 rounded-full border border-white/20 object-cover"
                                            alt=""
                                        />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] xs:text-[12px] font-bold text-white leading-none line-clamp-1">{user.name}</p>
                                            <div className="flex justify-center gap-0.5 text-yellow-500 text-[6px] xs:text-[7px]">
                                                {[1, 2, 3, 4, 5].map(s => <span key={s}>⭐</span>)}
                                            </div>
                                            <p className="text-[8px] text-white/50 leading-none font-poppins font-normal line-clamp-2 px-1">
                                                "{user.text}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex items-center gap-1 justify-center mt-3 xs:mt-5">
                            {[0, 1, 2, 3, 4].map((dot) => (
                                <div
                                    key={dot}
                                    onClick={() => setActiveSlide(dot)}
                                    className={`h-0.5 xs:h-1 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === dot ? 'w-3 xs:w-4 bg-white' : 'w-1 xs:w-1.5 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 7. Social Proof Footer - Scaled Down */}
                <div className="flex items-center justify-center gap-2 text-white/60 text-[16px] font-poppins font-normal leading-none">
                    <span>Loved by <span className="text-white">{userCount.toLocaleString()}+</span> users across India</span>
                    <img
                        src="https://flagcdn.com/w40/in.webp"
                        alt="India"
                        className="h-4 w-auto rounded-[1px] shadow-sm"
                    />
                </div>
            </motion.main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playball&family=Playfair+Display:ital,wght@0,900;1,900&family=Poppins:wght@400;600&display=swap');
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-playball { font-family: 'Playball', cursive; }
                .font-poppins { font-family: 'Poppins', sans-serif; }
                
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                body {
                    background-color: #12001C;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </div>
    );
};

export default IzhaarMoment;