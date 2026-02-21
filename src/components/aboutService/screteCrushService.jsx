import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import crushIcon from '../../assets/services/crush.png';

const SecretCrushService = () => {
    const navigate = useNavigate();
    const [liveMatches, setLiveMatches] = useState([
        { id: 1, city: 'Mumbai', time: 'Just now', type: 'Match Found! 💘' },
        { id: 2, city: 'Delhi', time: '2m ago', type: 'Crush Added 🤫' },
        { id: 3, city: 'Bangalore', time: '5m ago', type: 'Match Found! 💘' },
        { id: 4, city: 'Pune', time: '8m ago', type: 'Nudge Sent 💌' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveMatches(prev => {
                const newMatch = {
                    id: Date.now(),
                    city: ['Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur'][Math.floor(Math.random() * 5)],
                    time: 'Just now',
                    type: Math.random() > 0.5 ? 'Match Found! 💘' : 'Crush Added 🤫'
                };
                return [newMatch, ...prev.slice(0, 3)];
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#020205] text-white font-sans overflow-x-hidden selection:bg-pink-500/30">
            {/* Premium Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            </div>

            {/* Static Header */}
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

            {/* Hero Section */}
            <main className="relative z-10 pt-32 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                            Most Popular Service
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                            Secret <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Crush.</span>
                        </h1>

                        <p className="text-lg text-white/50 max-w-lg font-medium leading-relaxed">
                            Add your crush secretly. If they add you back, it's a match!
                            No one ever knows who you added unless it's mutual. Pure magic, zero risk.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                                Try Secret Crush
                            </button>
                            <div className="flex items-center -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=match${i}`} className="w-10 h-10 rounded-full border-4 border-[#020205]" alt="" />
                                ))}
                                <div className="pl-6 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    +12.4k Matches Joined Today
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-md mx-auto">
                            {/* Glass Card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden group">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl rotate-12"
                                    >
                                        <img src={crushIcon} alt="" className="w-16 h-16 object-contain" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black mb-4">Identity Protected</h3>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        We use end-to-end encryption. Your crush list is 100% private.
                                        Even our team can't see who you've added.
                                    </p>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        </div>
                    </motion.div>
                </div>

                {/* Live Updates Section */}
                <section className="mt-32 pb-32">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-2">Live Activity</h2>
                            <p className="text-white/40 text-sm font-medium">Real-time pulses from the Izhaar ecosystem.</p>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Platform Status: <span className="text-green-400 ml-2">Active</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {liveMatches.map((match) => (
                                <motion.div
                                    key={match.id}
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-pink-500/30 transition-all"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <span className="text-4xl text-pink-500">📍</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{match.time}</span>
                                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                        </div>
                                        <p className="text-lg font-bold mb-1">{match.city}</p>
                                        <p className="text-xs font-medium text-white/40">{match.type}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-32 border-t border-white/5">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">How it Works</h2>
                        <p className="text-white/40 mt-4 max-w-xl mx-auto font-medium">Three simple steps to find your connection.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Add Crush', desc: 'Securely enter your crush\'s details or phone number in your private dashboard.', icon: '🤫' },
                            { title: 'The Nudge', desc: 'We send a subtle, anonymous nudge to them, inviting them to join Izhaar.', icon: '💌' },
                            { title: 'The Match', desc: 'If they add you too, we reveal the identities and open a safe chat room.', icon: '💖' }
                        ].map((step, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center group hover:bg-white/[0.05] transition-all">
                                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">{step.icon}</div>
                                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                                <p className="text-sm text-white/40 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-32">
                    <div className="relative rounded-[3rem] overflow-hidden bg-white p-16 md:p-24 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-[#020205] tracking-tighter mb-8 leading-[0.9]">
                                Stop wondering "What if?" <br />
                                <span className="text-pink-600">Start Knowing.</span>
                            </h2>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-12 py-6 bg-[#020205] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Launch Secret Crush Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 text-center border-t border-white/5 relative z-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    &copy; 2026 Izhaar Platform. Zero-Risk Expression.
                </p>
            </footer>
        </div>
    );
};

export default SecretCrushService;
