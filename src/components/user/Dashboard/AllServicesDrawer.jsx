import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';

const AllServicesDrawer = ({ isOpen, onClose, services }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer (Drop Form from back/bottom) */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0A0A0A] border-t border-white/10 rounded-t-[3rem] z-[101] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Decorative Handle */}
                        <div className="w-full flex justify-center pt-4">
                            <div className="w-12 h-1 bg-white/20 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-8 pt-6 pb-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Signature Services
                                </h2>
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">The Complete Boutique Collection</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
                            >
                                <HiX size={28} />
                            </button>
                        </div>

                        {/* Services Grid */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-12">
                                {services.map((service, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link
                                            to={service.path}
                                            onClick={onClose}
                                            className="relative group block h-full"
                                        >
                                            <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/10 hover:border-pink-500/30 hover:shadow-[0_0_30px_rgba(236,72,145,0.1)]">
                                                <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
                                                    <img
                                                        src={service.icon}
                                                        alt={service.title}
                                                        className="w-full h-full object-contain filter brightness-110 saturate-[1.2] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                                                        style={{ mixBlendMode: 'screen' }}
                                                    />
                                                    {service.badge && (
                                                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full tracking-widest shadow-lg">
                                                            {service.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-white font-bold text-sm tracking-wide mb-1 leading-tight">{service.title}</h4>
                                                <p className="text-white/40 text-[9px] leading-relaxed line-clamp-2">{service.desc}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer decorative text */}
                        <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl text-center">
                            <span className="text-white/20 text-[8px] uppercase tracking-[0.5em] font-black">Izhaar • Crafted with Passion</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AllServicesDrawer;
