import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiSparkles,
    HiOutlineClipboardDocument,
    HiPlus,
    HiOutlineUserCircle,
    HiChevronLeft,
    HiOutlineMicrophone,
    HiOutlinePaperAirplane
} from 'react-icons/hi2';
import { getLoveCoachReply } from '../../utils/aiSuggestionService';
import { useAuth } from '../../context/AuthContext';

/**
 * Izhaar Love Coach - Premium Dark Theme
 * Specialized relationship coaching interface.
 */
function RelationshipGuideAI() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userProfilePic = user?.profile_photo || user?.google_picture;

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Hello! I am your Izhaar Love Coach. 💖 I'm here to help you express your heart, navigate your relationships, and find the perfect words for your special moments. How can I guide your love journey today?"
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

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
                        onClick={() => navigate('/user/dashboard')}
                        className="p-2 text-white/40 hover:text-pink-400 transition-colors"
                    >
                        <HiChevronLeft size={28} />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <HiSparkles className="text-pink-500 text-xl animate-pulse" />
                            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Izhaar Love Coach
                            </h1>
                        </div>
                        <span className="text-[10px] text-white/40 font-medium uppercase tracking-[2px]">Your Heart's Guide</span>
                    </div>

                    <div className="w-10 h-10" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`animate-in fade-in slide-in-from-bottom-2 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'ai' && (
                            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 flex-shrink-0 mr-3 self-end">
                                <HiSparkles className="text-pink-500 text-xl" />
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
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 flex-shrink-0">
                            <HiSparkles className="text-pink-300 text-xl" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/5 text-white/40 text-[13px] italic">
                            Izhaar Coach is reading your heart...
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
                            className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${inputText.trim() ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white/5 text-white/20'}`}
                        >
                            <HiOutlinePaperAirplane size={20} className={inputText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}

export default RelationshipGuideAI;
