import React, { useState } from "react";
import { FaPlay, FaHeart, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizLobby = ({ onCreateQuiz, onJoinQuiz, user }) => {
    const [inviteMobile, setInviteMobile] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [activeTab, setActiveTab] = useState("create"); // create, join
    const navigate = useNavigate();

    const handleStart = () => {
        if (!inviteMobile) {
            alert("Please enter your partner's mobile number.");
            return;
        }
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        onCreateQuiz(roomId, inviteMobile);
    };

    const handleJoin = () => {
        if (!joinRoomId) {
            alert("Please enter the secret room code.");
            return;
        }
        onJoinQuiz(joinRoomId.toUpperCase());
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 md:p-12 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.2)] relative overflow-hidden">
            {/* Mobile Back Button */}
            <button
                onClick={() => navigate("/user/dashboard")}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 text-white bg-white/10 border border-white/10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20 transform hover:scale-110 transition-all duration-500 cursor-pointer group">
                    <FaHeart className="text-2xl sm:text-3xl md:text-4xl text-white group-hover:animate-ping" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight font-serif italic drop-shadow-sm">Soulmate Challenge</h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Test your connection</p>
                </div>
            </div>

            <div className="w-full space-y-6 relative z-10">
                {/* Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex-1 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === "create" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg" : "text-white/40 hover:text-white/70"}`}
                    >
                        Invite Partner
                    </button>
                    <button
                        onClick={() => setActiveTab("join")}
                        className={`flex-1 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === "join" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg" : "text-white/40 hover:text-white/70"}`}
                    >
                        Join Room
                    </button>
                </div>

                {activeTab === "create" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-pink-300 uppercase tracking-[0.2em] ml-1">Partner's Mobile</label>
                            <div className="relative group">
                                <input
                                    type="tel"
                                    value={inviteMobile}
                                    onChange={(e) => setInviteMobile(e.target.value)}
                                    placeholder="Enter mobile number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 transition-all text-sm sm:text-base focus:bg-white/10"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base uppercase tracking-wider border border-white/20"
                        >
                            <span>Share the Love</span>
                            <FaArrowRight className="text-sm" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-purple-300 uppercase tracking-[0.2em] ml-1">Secret Room Code</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    placeholder="e.g. AMOR12"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5 text-purple-300 font-black placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-lg sm:text-xl text-center tracking-[0.3em] uppercase focus:bg-white/10"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all text-sm sm:text-base uppercase tracking-wider border border-white/20"
                        >
                            <span>Enter Secret Space</span>
                            <FaPlay className="text-sm" />
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-white/10 w-full relative z-10">
                <div className="flex items-center justify-center space-x-3 text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></div>
                    <span>Heartbeats Synced</span>
                </div>
            </div>
        </div>
    );
};

export default QuizLobby;