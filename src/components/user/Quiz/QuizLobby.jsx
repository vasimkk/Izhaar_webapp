import React, { useState } from "react";
import { FaPlay, FaUserFriends, FaArrowRight } from "react-icons/fa";

const QuizLobby = ({ onCreateQuiz, user }) => {
    const [inviteMobile, setInviteMobile] = useState("");

    const handleStart = () => {
        if (!inviteMobile) {
            alert("Please enter a friend's mobile number to invite them.");
            return;
        }
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        onCreateQuiz(roomId, inviteMobile);
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 p-10 bg-black/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <FaUserFriends className="text-5xl text-white" />
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Multiplayer Quiz</h2>
                <p className="text-blue-200/60 max-w-md text-lg">Challenge a friend to a real-time quiz and see who rules the leaderboard!</p>
            </div>

            <div className="w-full space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-blue-400 uppercase tracking-widest ml-1">Friend's Mobile Number</label>
                    <div className="relative group">
                        <input
                            type="tel"
                            value={inviteMobile}
                            onChange={(e) => setInviteMobile(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-5 text-black font-bold placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-lg shadow-inner"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-3 transition-all hover:scale-[1.03] active:scale-[0.97] text-xl uppercase tracking-tighter"
                >
                    <span>Send Invite & Play</span>
                    <FaArrowRight className="text-2xl" />
                </button>
            </div>

            <div className="pt-6 border-t border-white/5 w-full">
                <div className="flex items-center justify-center space-x-3 text-base text-white/50 font-semibold italic">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.8)]"></div>
                    <span>System Online • Waiting for Challenge</span>
                </div>
            </div>
        </div>
    );
};

export default QuizLobby;
