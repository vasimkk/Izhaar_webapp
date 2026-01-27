import React, { useState } from "react";
import { FaPlay, FaHeart, FaArrowRight } from "react-icons/fa";

const QuizLobby = ({ onCreateQuiz, onJoinQuiz, user }) => {
    const [inviteMobile, setInviteMobile] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [activeTab, setActiveTab] = useState("create"); // create, join

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
        <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-6 p-6 sm:p-10 md:p-12 bg-white/70 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-rose-100 shadow-[0_40px_100px_rgba(255,182,193,0.3)] relative overflow-hidden">
            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-rose-200/30 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/30 blur-[100px] rounded-full"></div>

            <div className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-rose-200 transform hover:scale-110 transition-all duration-500 cursor-pointer group">
                    <FaHeart className="text-2xl sm:text-3xl md:text-4xl text-white group-hover:animate-ping" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-rose-600 tracking-tight font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Soulmate Challenge</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Test your connection</p>
                </div>
            </div>

            <div className="w-full space-y-6 relative z-10">
                {/* Tabs */}
                <div className="flex bg-rose-50/50 p-1 rounded-xl border border-rose-100/50 shadow-inner">
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex-1 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === "create" ? "bg-white text-rose-500 shadow-sm border border-rose-100" : "text-rose-300 hover:text-rose-400"}`}
                    >
                        Invite Partner
                    </button>
                    <button
                        onClick={() => setActiveTab("join")}
                        className={`flex-1 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === "join" ? "bg-white text-rose-500 shadow-sm border border-rose-100" : "text-rose-300 hover:text-rose-400"}`}
                    >
                        Join Room
                    </button>
                </div>

                {activeTab === "create" ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] ml-1">Partner's Mobile</label>
                            <div className="relative group">
                                <input
                                    type="tel"
                                    value={inviteMobile}
                                    onChange={(e) => setInviteMobile(e.target.value)}
                                    placeholder="Enter mobile number"
                                    className="w-full bg-white border border-rose-50 rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5 text-slate-800 font-bold placeholder:text-rose-200 focus:outline-none focus:border-rose-300 transition-all text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base uppercase tracking-wider"
                        >
                            <span>Share the Love</span>
                            <FaArrowRight className="text-sm" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] ml-1">Secret Room Code</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    placeholder="e.g. AMOR12"
                                    className="w-full bg-white border border-purple-50 rounded-xl sm:rounded-2xl px-5 py-3 sm:py-3.5 text-purple-600 font-black placeholder:text-purple-100 focus:outline-none focus:border-purple-300 transition-all text-lg sm:text-xl text-center tracking-[0.3em] uppercase"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black py-3 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-purple-100 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base uppercase tracking-wider"
                        >
                            <span>Enter Secret Space</span>
                            <FaPlay className="text-sm" />
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-rose-50 w-full relative z-10">
                <div className="flex items-center justify-center space-x-3 text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping"></div>
                    <span>Heartbeats Synced</span>
                </div>
            </div>
        </div>
    );
};

export default QuizLobby;
