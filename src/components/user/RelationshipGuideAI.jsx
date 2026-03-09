import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiSparkles,
    HiOutlineClipboardDocument,
    HiPlus,
    HiOutlineUserCircle,
    HiChevronLeft,
    HiOutlineMicrophone,
    HiOutlinePaperAirplane,
    HiEllipsisVertical,
    HiOutlineTrash,
    HiOutlineInformationCircle
} from 'react-icons/hi2';
import { getLoveCoachReply } from '../../utils/aiSuggestionService';
import { useAuth } from '../../context/AuthContext';
const monaAvatar = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/mona_love_coach?_a=BAMAOGeA0";
const vankyAvatar = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/vanky_love_coach?_a=BAMAOGeA0";
const monaAlt = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/mona_alt?_a=BAMAOGeA0";
const vankyAlt = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/vanky_alt?_a=BAMAOGeA0";

const COACHES = {
    vanky: {
        name: "Vanky",
        title: "Love Coach",
        avatar: vankyAvatar,
        intro: "Hello! I am Vanky, your Love Coach. 💖 I'm here to help you navigate your heart's journey.",
        color: "from-blue-400 to-indigo-400",
        bio: "Specializing in emotional intelligence & meaningful connections.",
        exp: "10+ Years Exp.",
        isPro: true
    },
    kabir: {
        name: "Kabir",
        title: "Love Coach",
        avatar: vankyAlt,
        intro: "Hi, I'm Kabir. 🌟 Let's find the perfect words for your special moments together.",
        color: "from-indigo-400 to-blue-500",
        bio: "Expert in deep communication & bond building.",
        exp: "8+ Years Exp."
    },
    mona: {
        name: "Mona",
        title: "Love Coach",
        avatar: monaAvatar,
        intro: "Hello! I am Mona, your Love Coach. 💖 I'm here to help you express your heart beautifully.",
        color: "from-pink-400 to-purple-400",
        bio: "Expert in relationship dynamics & self-love empowerment.",
        exp: "12+ Years Exp.",
        isPro: true
    },
    zara: {
        name: "Zara",
        title: "Love Coach",
        avatar: monaAlt,
        intro: "Hi! I'm Zara. ✨ I'm here to guide your heart and help your love bloom.",
        color: "from-purple-400 to-pink-500",
        bio: "Specializing in romantic harmony & heart-to-heart connections.",
        exp: "7+ Years Exp."
    }
};

/**
 * Izhaar Love Coach - Premium Dark Theme
 * Specialized relationship coaching interface.
 */
function RelationshipGuideAI() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userProfilePic = user?.profile_photo || user?.google_picture;

    const [selectedCoachKey, setSelectedCoachKey] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showCoachInfo, setShowCoachInfo] = useState(false);
    const messagesEndRef = useRef(null);

    const coach = selectedCoachKey ? COACHES[selectedCoachKey] : null;

    const selectCoach = (key) => {
        setSelectedCoachKey(key);
        setShowMenu(false);
        setShowCoachInfo(false);
        setMessages([
            {
                id: 1,
                type: 'ai',
                text: COACHES[key].intro
            }
        ]);
    };

    const clearChat = () => {
        setMessages([
            {
                id: Date.now(),
                type: 'ai',
                text: coach.intro
            }
        ]);
        setShowMenu(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: inputText,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            // Use specialized Love Coach response
            const reply = await getLoveCoachReply(inputText, messages.slice(-5));

            const aiResponse = {
                id: Date.now() + 1,
                type: 'ai',
                text: reply || "I'm listening with my whole heart. Tell me more about what's on your mind."
            };

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("AI Error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    if (!selectedCoachKey) {
        return (
            <div className="flex flex-col h-[100dvh] relative overflow-hidden text-white font-sans"
                style={{
                    background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
                }}
            >
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
                </div>

                {/* Mobile Back Button */}
                <div className="absolute top-6 left-4 z-20">
                    <button
                        onClick={() => navigate('/user/dashboard')}
                        className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                        <HiChevronLeft size={24} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 py-6 max-h-screen">
                    <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col items-center justify-center gap-3 mb-4">
                            <div className="flex items-center gap-6 mb-1">
                                <HiSparkles className="text-pink-400 text-lg animate-pulse" />
                                <span className="text-xl animate-[heartBeat_1.5s_infinite] drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">❤️</span>
                                <HiSparkles className="text-blue-400 text-lg animate-pulse delay-500" />
                            </div>
                            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent text-center leading-tight">
                                Available Coaches on Izhaar
                            </h1>
                        </div>
                        <p className="text-white/50 text-[11px] font-medium leading-relaxed max-w-[280px] mx-auto">
                            Our expert guides are here to help you navigate relationships, find love guidance, and express your heart's true feelings.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm overflow-y-auto no-scrollbar pr-1 pb-4">
                        {Object.entries(COACHES).map(([key, c]) => (
                            <button
                                key={key}
                                onClick={() => selectCoach(key)}
                                className={`group relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl transition-all hover:bg-white/10 hover:scale-[1.02] hover:border-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-500/50 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${c.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 border-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-500/20 mr-3 flex-shrink-0 group-hover:border-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-500/50 transition-all shadow-md`}>
                                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-bold text-white">{c.name}</h2>
                                            {c.isPro && (
                                                <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-[8px] font-black px-1.5 py-0.5 rounded-md text-[#1a103c] shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse">
                                                    PRO
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full bg-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-500/10 text-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-400 border border-${key === 'mona' || key === 'zara' ? 'pink' : 'blue'}-500/20`}>{c.exp}</span>
                                    </div>
                                    <p className="text-white/40 text-[10px] leading-snug line-clamp-2 pr-2">{c.bio}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-1.5 opacity-40">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-bold uppercase tracking-[1px] text-white">End-to-End Encrypted</p>
                        </div>
                        <p className="text-[10px] text-white/80 font-medium">Your information will always be kept private & secure</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] relative overflow-hidden text-white font-sans"
            style={{
                background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
            }}
        >
            {/* Background Animated Overlays */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700" />
            </div>

            {/* Header - Compact */}
            <div className="bg-black/20 backdrop-blur-xl sticky top-0 z-20 px-4 pt-4 pb-2 border-b border-white/10">
                <div className="flex items-center justify-between relative">
                    <button
                        onClick={() => setSelectedCoachKey(null)}
                        className="p-2 text-white/40 hover:text-pink-400 transition-colors"
                        title="Change Coach"
                    >
                        <HiChevronLeft size={28} />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 relative shadow-lg">
                                <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                            </div>
                            <h1 className={`text-lg font-bold tracking-tight bg-gradient-to-r ${coach.color} bg-clip-text text-transparent`}>
                                {coach.name} - Love Coach
                            </h1>
                        </div>
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-[1px] animate-pulse">Online</span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <HiEllipsisVertical size={24} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#1a103c]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setShowCoachInfo(true); setShowMenu(false); }}
                                    className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-white/80 hover:bg-white/5 flex items-center gap-3"
                                >
                                    <HiOutlineInformationCircle size={18} className="text-blue-400" />
                                    Coach Info
                                </button>
                                <button
                                    onClick={clearChat}
                                    className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-white/80 hover:bg-white/5 flex items-center gap-3"
                                >
                                    <HiOutlineTrash size={18} className="text-pink-400" />
                                    Clear Chat
                                </button>
                                <button
                                    onClick={() => setSelectedCoachKey(null)}
                                    className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-white/80 hover:bg-white/5 flex items-center gap-3 border-t border-white/5 mt-1 pt-3"
                                >
                                    <HiChevronLeft size={18} className="text-purple-400" />
                                    Change Coach
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coach Info Overlay */}
            {showCoachInfo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#1a103c] border border-white/10 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className={`h-24 bg-gradient-to-r ${coach.color} opacity-20`} />
                        <div className="px-6 pb-8 -mt-12 text-center">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#1a103c] mx-auto shadow-xl mb-4">
                                <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{coach.name}</h2>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-80 text-transparent bg-clip-text bg-gradient-to-r ${coach.color}`}>
                                {coach.exp} Expertise
                            </p>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                {coach.bio}
                            </p>
                            <button
                                onClick={() => setShowCoachInfo(false)}
                                className={`w-full py-4 rounded-2xl bg-gradient-to-r ${coach.color} text-white font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all`}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`animate-in fade-in slide-in-from-bottom-2 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'ai' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 mr-3 self-end shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className={`relative max-w-[80%] ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                            <div className={`backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-sm ${msg.type === 'user'
                                ? 'bg-white/10 text-white/90'
                                : 'bg-white/5 text-white/80 shadow-[0_4px_20px_rgba(236,72,153,0.05)]'
                                }`}>
                                {msg.text}
                            </div>

                            {msg.type === 'user' && (
                                <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full overflow-hidden border border-white/20 shadow-sm z-10">
                                    {userProfilePic ? (
                                        <img src={userProfilePic} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-pink-500/20 backdrop-blur-md flex items-center justify-center text-[10px]">🔥</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 animate-pulse">
                            <img
                                src={coach.avatar}
                                alt={coach.name}
                                className="w-full h-full object-cover grayscale-[0.3]"
                            />
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/5 flex items-center gap-4 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                            <div className="flex gap-1">
                                <span className={`${selectedCoachKey === 'mona' || selectedCoachKey === 'zara' ? 'text-pink-500' : 'text-blue-500'} animate-[heartBeat_1.5s_infinite] text-lg`}>❤️</span>
                                <div className="flex gap-1 items-end pb-1.5">
                                    <div className={`w-1.5 h-1.5 ${selectedCoachKey === 'mona' || selectedCoachKey === 'zara' ? 'bg-pink-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '0s' }} />
                                    <div className={`w-1.5 h-1.5 ${selectedCoachKey === 'mona' || selectedCoachKey === 'zara' ? 'bg-pink-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
                                    <div className={`w-1.5 h-1.5 ${selectedCoachKey === 'mona' || selectedCoachKey === 'zara' ? 'bg-pink-400' : 'bg-blue-400'} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                            <div className="text-white/50 text-[13px] font-medium tracking-wide animate-pulse">
                                <span className={`bg-gradient-to-r ${coach.color} bg-clip-text text-transparent italic`}>
                                    {coach.name} is reading your heart...
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="w-full px-4 py-3 pb-6 bg-transparent relative z-10">
                <div className="w-full flex items-center gap-2 bg-white/10 backdrop-blur-3xl rounded-[30px] p-1.5 px-4 border border-white/10 shadow-2xl">
                    <input
                        type="text"
                        placeholder="Type your heart out..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 min-w-0 bg-transparent py-3 outline-none text-white text-[15px] placeholder-white/30"
                    />
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <HiOutlineMicrophone size={22} className="text-white/40 cursor-pointer hover:text-pink-500 transition-colors" />
                        <button
                            onClick={handleSendMessage}
                            className={`
                                w-10 h-10 rounded-full transition-all flex items-center justify-center
                                ${inputText.trim()
                                    ? `${selectedCoachKey === 'mona' || selectedCoachKey === 'zara' ? 'bg-pink-600 shadow-pink-500/30' : 'bg-blue-600 shadow-blue-500/30'} text-white shadow-lg`
                                    : 'bg-white/5 text-white/20'
                                }
                            `}
                        >
                            <HiOutlinePaperAirplane size={20} className={inputText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes heartBeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        }
      `}</style>
        </div>
    );
}

export default RelationshipGuideAI;
