import React, { useState, useEffect } from 'react';

const ValentineLiveFeed = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const activities = [
        { name: "Rahul", action: "added a Secret Crush", time: "just now", emoji: "🤫" },
        { name: "Priya", action: "sent an Izhaar Letter", time: "2 mins ago", emoji: "💌" },
        { name: "Siddharth", action: "joined the Watch Party", time: "5 mins ago", emoji: "🍿" },
        { name: "Ananya", action: "confessed her feelings", time: "8 mins ago", emoji: "💖" },
        { name: "Vikram", action: "unlocked a Premium Letter", time: "12 mins ago", emoji: "✨" },
        { name: "Ishani", action: "found her Secret Match", time: "15 mins ago", emoji: "🎯" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activities.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [activities.length]);

    return (
        <div className="w-full px-4 mb-8">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 overflow-hidden relative group">
                <div className="flex items-center gap-4">
                    {/* Pulse Indicator */}
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        Live Valentine Activity
                    </span>
                </div>

                <div className="mt-4 relative h-12 overflow-hidden">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex items-center justify-between transition-all duration-700 ease-in-out ${index === currentIndex
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B72099] to-[#312E81] flex items-center justify-center text-lg shadow-lg">
                                    {activity.emoji}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        <span className="text-[#B72099]">{activity.name}</span> {activity.action}
                                    </h4>
                                    <p className="text-[10px] text-white/30 font-medium">{activity.time}</p>
                                </div>
                            </div>

                            <div className="hidden sm:block">
                                <span className="px-3 py-1 bg-[#B72099]/10 border border-[#B72099]/20 rounded-full text-[9px] font-bold text-[#B72099] uppercase tracking-wider">
                                    Valentine's Mode
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
        </div>
    );
};

export default ValentineLiveFeed;
