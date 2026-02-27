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
        <div className="w-full px-2 sm:px-6 py-1 sm:py-4 relative z-[100] font-sans">
            {/* Main Wrapper */}
            <div className="max-w-xl mx-auto">

                {/* Progress Labels with High-Fidelity Colors */}
                <div className="flex justify-between mb-0 px-1 relative">
                    {/* Progress Connecting Line (Background & Container) */}
                    <div className="absolute top-5 sm:top-7 left-5 sm:left-7 right-5 sm:right-7 h-[1.5px] bg-white/[0.08] rounded-full overflow-hidden">
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
                            <div key={step.id} className="flex flex-col items-center gap-2 sm:gap-4 transition-all duration-500 relative z-10">
                                {/* Icon Circle */}
                                <motion.div
                                    animate={isCurrent ? {
                                        y: [0, -4, 0],
                                        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                    } : {}}
                                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border relative ${isCurrent
                                        ? 'backdrop-blur-xl'
                                        : 'backdrop-blur-md'
                                        }`}
                                    style={{
                                        borderColor: isCurrent ? step.color : (isPast ? `${step.color}88` : 'rgba(255, 255, 255, 0.2)'),
                                        backgroundColor: isCurrent ? `${step.color}22` : (isPast ? '#0c0c0e' : '#0c0c0e'),
                                        boxShadow: isCurrent ? `0 0 30px ${step.glow}` : 'none',
                                    }}
                                >
                                    {/* Pulsing Rings for Current Step */}
                                    {isCurrent && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0.5 }}
                                                animate={{ scale: 1.4, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                                className="absolute inset-0 rounded-2xl border border-[1px]"
                                                style={{ borderColor: step.color }}
                                            />
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0.5 }}
                                                animate={{ scale: 1.8, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                                className="absolute inset-0 rounded-2xl border border-[1px]"
                                                style={{ borderColor: step.color }}
                                            />
                                        </>
                                    )}

                                    <Icon
                                        className="text-base sm:text-2xl transition-all duration-500"
                                        style={{ color: step.color }}
                                    />

                                    {/* Subtle internal glow */}
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="innerGlow"
                                            className="absolute inset-0 rounded-2xl opacity-20"
                                            style={{ backgroundColor: step.color }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.2 }}
                                        />
                                    )}
                                </motion.div>

                                {/* Label Text */}
                                <span
                                    className={`text-[8px] sm:text-[11px] font-bold uppercase tracking-[2px] mt-1 transition-all duration-500`}
                                    style={{
                                        color: isCurrent ? step.color : 'white',
                                        opacity: isCurrent ? 1 : (isPast ? 0.9 : 0.4),
                                        textShadow: isCurrent ? `0 0 12px ${step.glow}` : 'none'
                                    }}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>


            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                .font-sans { font-family: 'Outfit', sans-serif !important; }
            `}</style>
        </div>
    );
}
