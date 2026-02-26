import React from "react";
import { motion } from "framer-motion";
import { IoWalletOutline, IoPersonOutline, IoCreateOutline, IoColorPaletteOutline, IoPaperPlaneOutline } from "react-icons/io5";

const steps = [
    { id: 1, label: "Pay", icon: IoWalletOutline, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)" },     // Amber/Gold
    { id: 2, label: "Detail", icon: IoPersonOutline, color: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },    // Blue
    { id: 3, label: "Write", icon: IoCreateOutline, color: "#a855f7", glow: "rgba(168, 85, 247, 0.4)" },     // Purple
    { id: 4, label: "Style", icon: IoColorPaletteOutline, color: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" }, // Pink
    { id: 5, label: "Send", icon: IoPaperPlaneOutline, color: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },   // Emerald
];

export default function LetterStepProgress({ currentStep }) {
    return (
        <div className="w-full px-2 sm:px-6 py-6 sm:py-10 relative z-[100] font-sans">
            {/* Main Wrapper */}
            <div className="max-w-xl mx-auto">

                {/* Progress Labels with High-Fidelity Colors */}
                <div className="flex justify-between mb-12 px-1 relative">
                    {/* Progress Connecting Line (Background & Container) */}
                    <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 h-[1.5px] bg-white/[0.08] rounded-full overflow-hidden">
                        {/* Progress Connecting Line (Active) */}
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#fbbf24] via-[#ec4899] to-[#10b981] shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                    </div>

                    {steps.map((step) => {
                        const isCurrent = step.id === currentStep;
                        const isPast = step.id < currentStep;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2.5 transition-all duration-500 relative z-10">
                                {/* Icon Circle with Opaque Background to hide the line behind it */}
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-700 border relative ${isCurrent
                                        ? 'backdrop-blur-xl'
                                        : 'backdrop-blur-md'
                                        }`}
                                    style={{
                                        borderColor: isCurrent ? step.color : (isPast ? `${step.color}88` : 'rgba(255, 255, 255, 0.2)'),
                                        backgroundColor: isCurrent ? `${step.color}22` : (isPast ? '#0c0c0e' : '#0c0c0e'),
                                        boxShadow: isCurrent ? `0 0 25px ${step.glow}` : 'none',
                                        transform: isCurrent ? 'scale(1.1) translateY(-2.5px)' : 'scale(1)',
                                        opacity: isCurrent ? 1 : (isPast ? 0.95 : 0.7)
                                    }}
                                >
                                    <Icon
                                        className="text-sm sm:text-base transition-all duration-500"
                                        style={{ color: step.color }}
                                    />

                                    {/* Subtle internal glow for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="innerGlow"
                                            className="absolute inset-0 rounded-2xl opacity-20"
                                            style={{ backgroundColor: step.color }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.2 }}
                                        />
                                    )}
                                </div>

                                {/* Label Text with White Color by Default */}
                                <span
                                    className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[2px] transition-all duration-500`}
                                    style={{
                                        color: isCurrent ? step.color : 'white',
                                        opacity: isCurrent ? 1 : (isPast ? 0.8 : 0.5),
                                        textShadow: isCurrent ? `0 0 12px ${step.glow}` : 'none'
                                    }}
                                >
                                    {step.label}
                                </span>

                                {isCurrent && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="w-1 h-1 rounded-full mt-[-2px]"
                                        style={{ backgroundColor: step.color, boxShadow: `0 0 8px ${step.color}` }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* The Modern Multi-Color Gradient Bar */}
                <div className="relative h-2.5 sm:h-3 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/10 p-[0.5px] overflow-hidden group shadow-2xl">

                    {/* Background Track Segments */}
                    <div className="absolute inset-0 flex">
                        {steps.map((s) => (
                            <div key={s.id} className="flex-1 border-r border-white/5 last:border-0" />
                        ))}
                    </div>

                    {/* Progress Fill with Passion Pink Gradient */}
                    <motion.div
                        className="h-full rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{
                            background: `linear-gradient(90deg, #FF3F78 0%, #B72099 100%)`,
                            boxShadow: `0 0 15px rgba(236, 72, 153, 0.3)`
                        }}
                    >
                        {/* Shimmering Surface Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        {/* Animated Shine Effect */}
                        <motion.div
                            className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg]"
                            animate={{ x: ["-100%", "500%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                .font-sans { font-family: 'Outfit', sans-serif !important; }
            `}</style>
        </div>
    );
}
