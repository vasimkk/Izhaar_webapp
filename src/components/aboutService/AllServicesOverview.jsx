import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AllServicesOverview = () => {
    const navigate = useNavigate();
    const [livePulse, setLivePulse] = useState([
        { id: 1, text: "Someone in Mumbai sent a Secret Crush 🤫", time: "Just now", icon: "💘" },
        { id: 2, text: "A Vintage Letter was opened in Delhi 👁️", time: "2m ago", icon: "📜" },
        { id: 3, text: "Custom Song 'Our Melody' created in Bangalore 🎵", time: "5m ago", icon: "🎸" },
        { id: 4, text: "TrueConnect soul match found in Pune ✨", time: "10m ago", icon: "🔗" },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLivePulse(prev => {
                const events = [
                    "New Secret Crush added! 🤫",
                    "Digital Letter delivered ✉️",
                    "Song preview generated 🎙️",
                    "Teleparty room created 🍿",
                    "Quiz score shared 🏆"
                ];
                const newEvent = {
                    id: Date.now(),
                    text: events[Math.floor(Math.random() * events.length)],
                    time: "Just now",
                    icon: ["💖", "💌", "🎶", "🍿", "✨"][Math.floor(Math.random() * 5)]
                };
                return [newEvent, ...prev.slice(0, 3)];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const serviceCategories = [
        { title: 'Secret Crush', path: '/services/secret-crush', color: 'from-pink-500 to-rose-600', icon: '🤫' },
        { title: 'Letters', path: '/services/letters', color: 'from-blue-500 to-indigo-600', icon: '✉️' },
        { title: 'Custom Songs', path: '/services/songs', color: 'from-indigo-600 to-purple-700', icon: '🎶' },
        { title: 'TrueConnect', path: '/user/dashboard', color: 'from-purple-500 to-fuchsia-600', icon: '🔗' },
        { title: 'Watch Together', path: '/user/dashboard', color: 'from-orange-500 to-rose-500', icon: '🍿' },
        { title: 'Gifts', path: '/user/dashboard', color: 'from-emerald-500 to-teal-600', icon: '🎁' },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-pink-500/30">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-pink-900/10 via-purple-900/5 to-blue-900/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex justify-between items-center backdrop-blur-xl border-b border-white/5">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-pink-500/10">
                        <span className="text-xl">💌</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter">IZHAAR</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/register" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Join Now</Link>
                    <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Sign In</button>
                </div>
            </nav>

            <main className="relative z-10 pt-40 px-6 max-w-7xl mx-auto">
                <section className="text-center mb-32 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Live Updates Active</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
                    >
                        Explore the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">Revolution.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/40 max-w-2xl mx-auto font-medium"
                    >
                        Izhaar is more than an app—it's a sanctuary for expression.
                        Discover our world-class services and see live updates from our community.
                    </motion.p>
                </section>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Live Activity Side */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
                        <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                                <span className="text-pink-500">⚡</span> Global Pulse
                            </h3>

                            <div className="space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {livePulse.map(pulse => (
                                        <motion.div
                                            key={pulse.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                {pulse.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white/80 leading-tight mb-1">{pulse.text}</p>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{pulse.time}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Active Users</span>
                                    <span className="text-xs font-bold text-green-400">12,482 LIVE</span>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-8 h-8 rounded-full border-2 border-black" alt="" />
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-white text-black text-[8px] font-black flex items-center justify-center border-2 border-black">+34</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid md:grid-cols-2 gap-6 pb-32">
                            {serviceCategories.map((service, idx) => (
                                <Link
                                    key={service.title}
                                    to={service.path}
                                    className="group relative h-[350px] overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all duration-500 p-12 flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight">{service.title}</h3>
                                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-2">{service.title === 'Letters' ? 'MASTERPIECE' : 'PREMIUM'}</p>
                                    </div>

                                    <div className="relative z-10 text-center">
                                        <p className="text-sm text-white/40 font-medium leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            Discover why thousands trust {service.title} for their most precious moments of expression.
                                        </p>
                                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-all">
                                            View Details ➔
                                        </div>
                                    </div>

                                    {/* Corner Accent */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-24 text-center border-t border-white/5 relative z-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">IZHAAR ECOSYSTEM</p>
                <div className="flex justify-center gap-8 mb-12">
                    <Link to="/about-us" className="text-xs font-bold text-white/40 hover:text-white transition-colors">About Us</Link>
                    <Link to="/privacy_policy" className="text-xs font-bold text-white/40 hover:text-white transition-colors">Privacy</Link>
                    <Link to="/contact_us" className="text-xs font-bold text-white/40 hover:text-white transition-colors">Connect</Link>
                </div>
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                    &copy; 2026 Izhaar platform. Handcrafted for love.
                </p>
            </footer>
        </div>
    );
};

export default AllServicesOverview;
