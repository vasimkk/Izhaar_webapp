import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

// Import split components
import IntroView from './IntroView';
import FormView from './FormView';
import ListView from './ListView';
import SolveView from './SolveView';

export default function SecretCrush() {
    const navigate = useNavigate();
    const [view, setViewInternal] = useState('intro'); // 'intro', 'form', 'list', 'solve'
    const [activeCrush, setActiveCrush] = useState(null);
    const [crushes, setCrushes] = useState([]);
    const [loading, setLoading] = useState(true); // Start loading
    const [actionLoading, setActionLoading] = useState(false); // For buttons
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const setView = (v, payload = null) => {
        if (v === 'solve') setActiveCrush(payload);
        setViewInternal(v);
    };

    // Form State
    const [crushName, setCrushName] = useState('');
    const [crushMobile, setCrushMobile] = useState('');
    const [hints, setHints] = useState([{ question: '', options: ['', ''], correctOptionIndex: null }]);

    useEffect(() => {
        fetchCrushes();
    }, []);

    const fetchCrushes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/secret-crush/list');
            if (res.data.status === 'success') {
                const data = res.data.data || [];
                setCrushes(data);
                // If they have crushes, default to list view
                if (data.length > 0 && view === 'intro') {
                    setViewInternal('list');
                }
            }
        } catch (error) {
            console.error("Error fetching crushes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCrush = async (e) => {
        if (e) e.preventDefault();

        // Basic validation
        if (!crushName || crushMobile.length !== 10) {
            toast.error(crushMobile.length !== 10 ? "Enter valid 10-digit mobile number" : "Please fill in all details");
            return;
        }

        // Filter out empty hints and find valid ones
        const validHints = hints.map(h => ({
            question: h.question.trim(),
            options: h.options.filter(o => o.trim() !== ''),
            correctOptionIndex: h.correctOptionIndex
        })).filter(h => h.question !== '');

        if (validHints.length === 0) {
            toast.error("Add at least one hint question!");
            return;
        }

        for (const hint of validHints) {
            if (hint.options.length < 2) {
                toast.error(`Question "${hint.question.substring(0, 10)}..." needs at least 2 options!`);
                return;
            }
            if (hint.correctOptionIndex === null || hint.correctOptionIndex >= hint.options.length) {
                toast.error(`Please select the correct answer for: "${hint.question.substring(0, 10)}..."`);
                return;
            }
        }

        setActionLoading(true);
        try {
            // Artificial delay for sending animation "WOW" factor
            await new Promise(resolve => setTimeout(resolve, 3500));

            const formattedMobile = crushMobile.startsWith('+91') ? crushMobile : '+91' + crushMobile;
            const res = await api.post('/secret-crush/add', {
                crushName,
                crushMobile: formattedMobile,
                hints: validHints
            });

            if (res.data.status === 'success') {
                toast.success("Secret Crush added! 🤫");

                if (res.data.isMatch) {
                    toast.success(
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-pink-300 text-base">It's a Match! 💘</span>
                            <span className="text-xs text-gray-200">They liked you back! Check your list.</span>
                        </div>,
                        {
                            icon: "🎉",
                            style: { background: 'rgba(40, 10, 60, 0.95)', border: '1px solid rgba(236, 72, 153, 0.6)', borderRadius: '16px', color: '#fff' },
                            autoClose: 6000
                        }
                    );
                }

                setCrushName('');
                setCrushMobile('');
                setHints([{ question: '', options: ['', ''], correctOptionIndex: null }]);

                // Explicitly switch to list after a short UI break
                setTimeout(async () => {
                    await fetchCrushes();
                    setViewInternal('list');
                }, 500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add crush");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnlock = async () => {
        const confirm = window.confirm("Unlock your matches for ₹99? (Demo: Click OK to Unlock)");
        if (!confirm) return;

        try {
            const res = await api.post('/secret-crush/unlock');
            if (res.data.status === 'success') {
                toast.success("Matches Unlocked! 💖");
                fetchCrushes();
            }
        } catch (error) {
            toast.error("Failed to unlock");
        }
    };

    const filters = ['All', 'Matched', 'Seen', 'Sent', 'New Crush'];

    const filteredCrushes = crushes.filter(c => {
        const matchesSearch = c.crush_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.crush_mobile.includes(searchQuery);
        if (activeFilter === 'All') return matchesSearch;
        if (activeFilter === 'Matched') return matchesSearch && c.is_match;
        if (activeFilter === 'Sent') return matchesSearch && !c.is_received;
        return matchesSearch;
    });

    return (
        <div className="min-h-screen w-full relative text-white overflow-x-hidden" style={{
            background: 'linear-gradient(172deg, #000 0%, #1A0B2E 100%)'
        }}>
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#EC4891]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-[#A928ED]/15 blur-[150px] rounded-full pointer-events-none" />

            {/* Floating Heart Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ y: [-20, 20], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[15%] text-[#EC4891]/20 text-3xl"
                >
                    <FaHeart />
                </motion.div>
                <motion.div
                    animate={{ y: [30, -30], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[30%] left-[10%] text-[#A928ED]/20 text-5xl"
                >
                    <FaHeart />
                </motion.div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>

            <AnimatePresence mode="wait">
                {view === 'intro' && (
                    <IntroView
                        key="intro"
                        setView={setView}
                        navigate={navigate}
                        crushes={crushes}
                    />
                )}
                {view === 'form' && (
                    <FormView
                        key="form"
                        setView={setView}
                        crushName={crushName}
                        setCrushName={setCrushName}
                        crushMobile={crushMobile}
                        setCrushMobile={setCrushMobile}
                        hintQuestion={""}
                        setHintQuestion={() => { }}
                        hints={hints}
                        setHints={setHints}
                        handleAddCrush={handleAddCrush}
                        loading={actionLoading}
                    />
                )}
                {view === 'list' && (
                    <ListView
                        key="list"
                        navigate={navigate}
                        setView={setView}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={['All', 'Matched', 'Seen', 'Sent', 'New Crush']}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        filteredCrushes={crushes.filter(c => {
                            const matchesSearch = (c.crush_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (c.crush_mobile || '').includes(searchQuery) ||
                                (c.sender_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());

                            if (!matchesSearch) return false;
                            if (activeFilter === 'All') return true;
                            if (activeFilter === 'Matched') return c.is_match;
                            if (activeFilter === 'Seen') return c.is_seen && !c.is_solved && !c.is_match;
                            if (activeFilter === 'Sent') return !c.is_received;
                            if (activeFilter === 'New Crush') return c.is_received && !c.is_seen && !c.is_solved && !c.is_match;
                            return true;
                        })}
                    />
                )}
                {view === 'solve' && activeCrush && (
                    <SolveView
                        key="solve"
                        crush={activeCrush}
                        setView={setView}
                        onSolved={fetchCrushes}
                    />
                )}
            </AnimatePresence>

            {loading && (
                <div className="fixed inset-0 z-[200] bg-[#000]/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#1A0B2E]/80 border border-white/10 shadow-2xl">
                        <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                        <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">Checking your secret list...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
