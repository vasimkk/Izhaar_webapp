import React from "react";
import { motion } from "framer-motion";
import {
    IoWalletOutline,
    IoMusicalNotesOutline,
    IoCloudDownloadOutline,
    IoPersonCircleOutline,
    IoPaperPlaneOutline
} from "react-icons/io5";

const steps = [
    { id: 1, label: "CREATE", icon: IoMusicalNotesOutline, color: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)" },    // Blue
    { id: 2, label: "PAYMENT", icon: IoWalletOutline, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)" },     // Gold
    { id: 3, label: "GET SONG", icon: IoCloudDownloadOutline, color: "#a855f7", glow: "rgba(168, 85, 247, 0.4)" }, // Purple
    { id: 4, label: "RECEIVER", icon: IoPersonCircleOutline, color: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" }, // Pink
    { id: 5, label: "SEND", icon: IoPaperPlaneOutline, color: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },   // Emerald
];

export default function SongStepProgress({ currentStep }) {
    return (
        <div className="w-full px-2 py-4 relative z-[100] font-sans">
            <div className="max-w-xl mx-auto">
                <div className="flex justify-between items-start px-1 relative">

                    {/* Premium Progress Connecting Line */}
                    <div className="absolute top-[20px] sm:top-[28px] left-[10%] right-[10%] h-[1px] overflow-hidden pointer-events-none">
                        {/* Background Track */}
                        <div className="absolute inset-0 bg-white/5 shadow-inner" />

                        {/* Active Glow Track */}
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#fbbf24] via-[#ec4899] to-[#10b981] opacity-60"
                            initial={{ width: 0 }}
                            animate={{ width: currentStep <= 1 ? "0%" : `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                        {/* Moving Sparkle on Line */}
                        {currentStep > 1 && (
                            <motion.div
                                animate={{ x: ["0%", "1000%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            />
                        )}
                    </div>

                    {steps.map((step, index) => {
                        const isCurrent = step.id === currentStep;
                        const isPast = step.id < currentStep;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 group relative z-10 w-[20%]">
                                {/* Icon Container */}
                                <motion.div
                                    animate={isCurrent ? {
                                        y: [0, -3, 0],
                                        boxShadow: [`0 0 10px ${step.glow}`, `0 0 25px ${step.glow}`, `0 0 10px ${step.glow}`]
                                    } : {}}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[20px] flex items-center justify-center transition-all duration-700 border ${isCurrent
                                        ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                                        : 'bg-black/30 border-white/5'
                                        } backdrop-blur-xl relative`}
                                    style={{
                                        borderColor: isCurrent ? step.color : `${step.color}33`,
                                        boxShadow: isCurrent ? `0 0 20px ${step.glow}` : `0 0 10px ${step.glow}22`
                                    }}
                                >
                                    {/* Double Pulsing Outer Glows for Current Step */}
                                    {isCurrent && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                                                className="absolute inset-0 rounded-2xl border border-white/10"
                                                style={{ borderColor: step.color }}
                                            />
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1.8, opacity: [0, 0.15, 0] }}
                                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                                                className="absolute inset-0 rounded-2xl border border-white/5"
                                                style={{ borderColor: step.color }}
                                            />
                                        </>
                                    )}

                                    <Icon
                                        className={`text-base sm:text-2xl transition-all duration-500 ${isCurrent ? 'scale-110' : 'scale-100'}`}
                                        style={{
                                            color: step.color,
                                            opacity: isCurrent ? 1 : 0.7,
                                            filter: isCurrent ? `drop-shadow(0 0 8px ${step.glow})` : 'none'
                                        }}
                                    />

                                    {/* Refined Shine Overlay */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <span
                                    className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-[1px] mt-1 transition-all duration-500`}
                                    style={{
                                        color: isCurrent ? step.color : 'white',
                                        opacity: isCurrent ? 1 : 0.5,
                                        textShadow: isCurrent ? `0 0 10px ${step.glow}` : 'none'
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
