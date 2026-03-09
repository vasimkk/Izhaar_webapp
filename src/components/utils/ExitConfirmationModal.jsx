import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Exit Confirmation Modal
 * Styled to match Izhaar's brand aesthetics with modern glassmorphism.
 */
const ExitConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative bg-[#1A1025] border border-white/10 w-full max-w-[340px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* Gradient Accent Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4891] via-[#A928ED] to-[#EC4891]" />

                        <div className="p-8 flex flex-col items-center text-center">
                            {/* Animated Icon Container */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EC4891]/20 to-[#A928ED]/20 flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-[#EC4891]/10 animate-ping" />
                                <svg className="w-10 h-10 text-[#EC4891]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>

                            <h3 className="text-[22px] font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Exit Izhaar?
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-8 px-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Are you sure you want to leave? We'll miss you! ❤️
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={onConfirm}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white font-bold text-sm shadow-[0_8px_20px_rgba(236,72,145,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Yes, Exit Now
                                </button>
                                <button
                                    onClick={onCancel}
                                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold text-sm hover:bg-white/10 active:scale-[0.98] transition-all"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    No, Keep Spreading Love
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ExitConfirmationModal;
