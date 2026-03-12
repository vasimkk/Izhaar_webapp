import React from "react";

const StatsSection = () => {
    return (
        <section className="px-6 py-24 text-center border-t border-white/10 flex flex-col items-center gap-16">
            <div className="space-y-2">
                <h2 className="text-7xl font-black tracking-tighter">10000+</h2>
                <h3 className="text-xl font-bold text-white/50 uppercase tracking-widest">People on Izhaar</h3>
            </div>

            <div className="w-[1px] h-20 bg-white/20 border-l border-dashed border-white/40" />

            <div className="space-y-2">
                <h2 className="text-7xl font-black tracking-tighter">5000+</h2>
                <h3 className="text-xl font-bold text-white/50 uppercase tracking-widest">Matches made</h3>
            </div>
        </section>
    );
};

export default StatsSection;
