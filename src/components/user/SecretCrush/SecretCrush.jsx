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

export default function SecretCrush() {
    const navigate = useNavigate();
    const [view, setView] = useState('intro'); // 'intro', 'form', 'list'
    const [crushes, setCrushes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Form State
    const [crushName, setCrushName] = useState('');
    const [crushMobile, setCrushMobile] = useState('');
    const [clues, setClues] = useState(['', '', '', '']);

    useEffect(() => {
        fetchCrushes();
    }, []);

    const fetchCrushes = async () => {
        try {
            const res = await api.get('/secret-crush/list');
            if (res.data.status === 'success') {
                setCrushes(res.data.data);
                // If they have crushes, default to list view
                if (res.data.data.length > 0 && view === 'intro') {
                    setView('list');
                }
            }
        } catch (error) {
            console.error("Error fetching crushes", error);
        }
    };

    const handleAddCrush = async (e) => {
        if (e) e.preventDefault();
        if (!crushName || !crushMobile) {
            toast.error("Please fill in target details");
            return;
        }

        setLoading(true);
        try {
            const formattedMobile = crushMobile.startsWith('+91') ? crushMobile : '+91' + crushMobile;
            const res = await api.post('/secret-crush/add', {
                crushName,
                crushMobile: formattedMobile,
                clues: clues.filter(c => c.trim() !== '')
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
                setClues(['', '', '', '']);
                fetchCrushes();
                setView('list');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add crush");
        } finally {
            setLoading(false);
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

    const filters = ['All', 'Sent', 'Received', 'Matched', 'Delivered'];

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
                        clues={clues}
                        setClues={setClues}
                        handleAddCrush={handleAddCrush}
                        loading={loading}
                    />
                )}
                {view === 'list' && (
                    <ListView
                        key="list"
                        navigate={navigate}
                        setView={setView}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={filters}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        filteredCrushes={filteredCrushes}
                        handleUnlock={handleUnlock}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
