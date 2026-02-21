import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import songIcon from '../../assets/services/songs.png';

const SongServiceDetail = () => {
    const navigate = useNavigate();
    const [activeComposers, setActiveComposers] = useState(42);

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-lg">💌</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter">IZHAAR</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Login</Link>
                    <button onClick={() => navigate('/register')} className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-lg shadow-white/5">Get Started</button>
                </div>
            </nav>

            <main className="relative z-10 pt-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Professional Production</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-9xl font-black tracking-tighter leading-none"
                    >
                        Custom <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Anthems.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto font-medium"
                    >
                        Your story, your words, our music. We help you create high-fidelity custom songs
                        for your special someone with professional AI-vocals and lush arrangements.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-32">
                    {/* Card 1 */}
                    <div className="p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl flex flex-col justify-between group">
                        <div>
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🎙️</span>
                            </div>
                            <h3 className="text-3xl font-black mb-4">Original Vocals</h3>
                            <p className="text-white/40 leading-relaxed font-medium">
                                Choose the perfect voice for your lyrics. From soulful male baritones
                                to airy female sopranos, our AI vocalists deliver emotional resonance.
                            </p>
                        </div>
                        <div className="mt-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: [-100, 100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-1/2 h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]"
                            />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl flex flex-col justify-between group">
                        <div>
                            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🎸</span>
                            </div>
                            <h3 className="text-3xl font-black mb-4">Genre Fusion</h3>
                            <p className="text-white/40 leading-relaxed font-medium">
                                Whether it's a lo-fi bedroom pop track or a cinematic orchestral ballad,
                                our production team crafts the perfect soundscape for your Izhaar.
                            </p>
                        </div>
                        <div className="mt-12 flex gap-1 items-end h-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 32, 10] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="flex-1 bg-pink-500 rounded-t-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <section className="py-24 border-t border-white/5 text-center">
                    <h2 className="text-3xl font-black mb-12">Live Studios Active</h2>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
                        <span className="text-xl font-bold tracking-widest uppercase">LO-FI ROOM</span>
                        <span className="text-xl font-bold tracking-widest uppercase">ACOUSTIC CABIN</span>
                        <span className="text-xl font-bold tracking-widest uppercase">POP FACTORY</span>
                        <span className="text-xl font-bold tracking-widest uppercase">BALLAD HALL</span>
                    </div>

                    <button onClick={() => navigate('/register')} className="mt-20 px-12 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl">
                        Compose Your Song
                    </button>
                </section>
            </main>

            <footer className="py-20 text-center border-t border-white/5">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    &copy; 2026 Izhaar platform. Your Story in Sound.
                </p>
            </footer>
        </div>
    );
};

export default SongServiceDetail;
