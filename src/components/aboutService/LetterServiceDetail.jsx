import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import letterIcon from '../../assets/services/letter.png';

const LetterServiceDetail = () => {
    const navigate = useNavigate();
    const [recentLetters, setRecentLetters] = useState([
        { id: 1, type: 'Vintage Scroll', status: 'Delivered', time: 'Just now' },
        { id: 2, type: 'Modern Minimal', status: 'Opened 👁️', time: '5m ago' },
        { id: 3, type: 'Eternal Heart', status: 'Delivered', time: '12m ago' },
        { id: 4, type: 'Starlight Theme', status: 'Delivered', time: '18m ago' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRecentLetters(prev => {
                const newLetter = {
                    id: Date.now(),
                    type: ['Royal Parchment', 'Ocean Breeze', 'Midnight Love', 'Golden Feather'][Math.floor(Math.random() * 4)],
                    status: Math.random() > 0.3 ? 'Delivered' : 'Opened 👁️',
                    time: 'Just now'
                };
                return [newLetter, ...prev.slice(0, 3)];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-pink-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
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
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            Emotional Masterpiece
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                            The Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Letter.</span>
                        </h1>

                        <p className="text-lg text-white/50 max-w-lg font-medium leading-relaxed">
                            When text messages aren't enough, send a masterpiece.
                            Our AI-assisted letters help you pour your heart out into beautiful,
                            thematic digital scrolls delivered with class.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                                Write Your Letter
                            </button>
                            <div className="flex items-center -space-x-4">
                                {[5, 6, 7, 8].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=letter${i}`} className="w-10 h-10 rounded-full border-4 border-[#050505]" alt="" />
                                ))}
                                <div className="pl-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    +4.2k Letters Sent Recently
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] max-w-md mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/20 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden group">
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[url('https://res.cloudinary.com/df5jbm55b/image/upload/v1739958316/scroll_texture_jzzq1r.png')] bg-cover opacity-80">
                                    <motion.div
                                        animate={{ rotate: [-2, 2, -2] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
                                    >
                                        <img src={letterIcon} alt="" className="w-12 h-12 object-contain filter brightness-0 invert" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black mb-4 text-blue-100">Timeless Expression</h3>
                                    <div className="w-12 h-0.5 bg-blue-500/40 mb-6" />
                                    <p className="text-sm text-blue-100/60 leading-relaxed font-serif italic">
                                        "Every word is encrypted, every emotion preserved.
                                        Choose from 10+ premium themes to match your vibe."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Live Tracking */}
                <section className="mt-32 pb-32">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Delivery Pulse</h2>
                            <p className="text-white/40 text-sm font-medium">Real-time delivery status across the platform.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {recentLetters.map((letter) => (
                                <motion.div
                                    key={letter.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl group hover:bg-white/[0.08] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{letter.time}</span>
                                        <span className="text-xs">✉️</span>
                                    </div>
                                    <p className="text-lg font-bold mb-1">{letter.type}</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${letter.status.includes('Opened') ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`} />
                                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{letter.status}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 py-32 border-t border-white/5">
                    {[
                        { title: 'AI Writer', desc: 'Struggling for words? Our empathy-tuned AI helps you express complex emotions with grace.', icon: '🧠' },
                        { title: 'Premium Themes', desc: 'From vintage scrolls to futuristic glows, select a look that reflects your relationship.', icon: '✨' },
                        { title: 'Safe Delivery', desc: 'Securely delivered via link, WhatsApp or Email. We notify you the second it\'s opened.', icon: '🛡️' }
                    ].map((f, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all">
                            <div className="text-4xl mb-6">{f.icon}</div>
                            <h4 className="text-lg font-bold mb-3">{f.title}</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="py-20 text-center border-t border-white/5">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    &copy; 2026 Izhaar Platform. Letters for the Soul.
                </p>
            </footer>
        </div>
    );
};

export default LetterServiceDetail;
