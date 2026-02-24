import React, { useState, useRef } from 'react';
import ValentineLiveFeed from './ValentineLiveFeed';
const SuccessStories = ({ isSingleMode }) => {
    const [showStoryDetail, setShowStoryDetail] = useState(null);
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, offsetWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / offsetWidth);
            setActiveStoryIndex(index);
        }
    };

    const successStories = isSingleMode ? [
        {
            id: 1,
            name: "Pranick.",
            tag: "Secret Crush",
            time: "2h ago",
            story: "I added my college crush silently. She got a hint and added me back!",
            action: "Used Secret Crush",
            steps: [
                "Added her phone number secretly.",
                "She got a nudge from Izhaar.",
                "She added me back & it was a match!"
            ],
            color: "from-[#B72099] to-[#701a5f]"
        },
        {
            id: 2,
            name: "Priya V.",
            tag: "Izhaar Letter",
            time: "5h ago",
            story: "I wrote an honest letter about our memories. He loved the emotional touch!",
            action: "Sent Izhaar Letter",
            steps: [
                "Wrote real feelings & memories.",
                "Letter delivered without my name.",
                "Started a safe chat to reveal identity."
            ],
            color: "from-[#800000] to-[#4B0000]"
        },
        {
            id: 4,
            name: "Riya & Arjun",
            tag: "Join Party",
            time: "2h ago",
            story: "Distance can’t stop connection. We watched, laughed, and shared moments together in real-time with Join Party!",
            action: "Started a Join Party",
            steps: [
                "Picked a movie clip to share.",
                "Invited my friend via mobile.",
                "Watched together in perfect sync.",
                "Reacted and chatted while watching.",
                "Created beautiful memories together."
            ],
            color: "from-orange-600 to-rose-900"
        }
    ] : [
        {
            id: 3,
            name: "Vikram & Soniya",
            tag: "Watch Together",
            time: "Just now",
            story: "We watched a movie synced from different cities. The chat and video support made us feel like we were on the same couch!",
            action: "Hosted Watch Party",
            steps: [
                "Shared partner's number.",
                "She joined the synced room.",
                "Watched movie with video chat."
            ],
            color: "from-indigo-600 to-blue-900"
        },
        {
            id: 4,
            name: "Riya & Arjun",
            tag: "Join Party",
            time: "2h ago",
            story: "Distance can’t stop connection. We watched, laughed, and shared moments together in real-time with Join Party!",
            action: "Started a Join Party",
            steps: [
                "Picked a movie clip to share.",
                "Invited my friend via mobile.",
                "Watched together in perfect sync.",
                "Reacted and chatted while watching.",
                "Created beautiful memories together."
            ],
            color: "from-orange-600 to-rose-900"
        }
    ];

    return (
        <div className="mt-14 mb-10 px-2 animate-premium-in" style={{ animationDelay: '1100ms' }}>
            <div className="flex flex-col mb-8 px-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-10 h-[1px] bg-gradient-to-r from-pink-500 to-transparent"></span>
                    <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">Real Stories</span>
                </div>
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white tracking-wide">
                    Success Stories
                </h3>
            </div>
            <ValentineLiveFeed />
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto pb-6 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth relative"
            >
                {successStories.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setShowStoryDetail(item)}
                        className="flex-shrink-0 w-[85vw] sm:w-80 h-56 rounded-[2.5rem] relative snap-center group shadow-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] border border-white/10 bg-[#1a144e]/40 mt-6"
                    >
                        {/* 1. Top Center Pill Heading (AAA Style) */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 px-5 py-1.5 rounded-full bg-[#1e1b4b] border border-white/10 group-hover:border-pink-500/50 shadow-xl transition-all duration-500">
                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-pink-100 whitespace-nowrap">
                                {item.tag}
                            </span>
                            {/* Pill Glow Effect */}
                            <div className="absolute inset-0 rounded-full bg-pink-500/0 group-hover:bg-pink-500/10 blur-md transition-all duration-500 pointer-events-none" />
                        </div>

                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-100 transition-opacity rounded-[2.5rem] overflow-hidden`}></div>

                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 text-white pt-10">
                            <div className="flex justify-between items-start">
                                <h4 className="text-xl font-['Playfair_Display'] font-bold drop-shadow-md">
                                    {item.name}
                                </h4>
                                <span className="text-[10px] font-bold text-white/40">{item.time}</span>
                            </div>
                            <div className="mt-auto">
                                <p className="text-xs font-medium text-white/90 italic mb-4">
                                    "{item.story}"
                                </p>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                                    Check how it happened ➔
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {successStories.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 transition-all duration-300 rounded-full ${activeStoryIndex === idx ? 'w-6 bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'w-1.5 bg-white/20'
                            }`}
                    ></div>
                ))}
            </div>
            {/* Marquee CTA */}
            <div className="mt-10 -mx-4 overflow-hidden bg-white/5 py-4 border-y border-white/5 backdrop-blur-sm">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-10 px-5">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                                Ready to make your story? <span className="text-pink-500">Confess Now</span>
                            </span>
                            <span className="text-white/20">✦</span>
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-4">
                                Success Stories <span className="text-blue-400">Izhaar</span>
                            </span>
                            <span className="text-white/20">✦</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Detail Modal */}
            {showStoryDetail && (
                <>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowStoryDetail(null)}></div>
                        <div className="relative w-full max-w-sm bg-[#1e1b4b] rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden animate-premium-in">
                            <div className={`h-40 bg-gradient-to-b ${showStoryDetail.color} p-10 flex flex-col justify-end relative`}>
                                <button
                                    onClick={() => setShowStoryDetail(null)}
                                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 backdrop-blur-md border border-white/10 transition-all active:scale-90"
                                >✕</button>
                                <h3 className="text-3xl font-['Playfair_Display'] font-bold text-white">{showStoryDetail.name}</h3>
                            </div>
                            <div className="p-10">
                                <p className="text-base text-white/80 leading-relaxed font-medium italic mb-10">
                                    "{showStoryDetail.story}"
                                </p>
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                                    <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mb-4">
                                        Simple Guide: {showStoryDetail.action}
                                    </h4>
                                    <div className="space-y-3">
                                        {showStoryDetail.steps?.map((step, idx) => (
                                            <div key={idx} className="flex gap-3 items-start">
                                                <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-[11px] font-bold text-white leading-tight pt-1">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowStoryDetail(null)}
                                    className="w-full mt-10 py-5 bg-gradient-to-r from-pink-600 via-[#B72099] to-pink-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-[11px]"
                                >
                                    Close Story
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SuccessStories;
