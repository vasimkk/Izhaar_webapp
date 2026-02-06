import React, { useState, useEffect } from "react";
import { FaGamepad, FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizInviteModal = ({ invite, onAccept, onDecline }) => {
    if (!invite) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-[2rem] shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-white/10 relative">
                {/* Decorative Glows */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[60px] rounded-full -z-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full -z-10"></div>

                <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-6 text-white relative border-b border-white/10">
                    <button
                        onClick={onDecline}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <FaGamepad className="text-2xl animate-bounce text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">Quiz Challenge!</h3>
                            <p className="text-white/60 text-sm">Battle is calling...</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-white/80 font-medium">
                            <span className="font-bold text-pink-400">{invite.senderName}</span> has invited you to a real-time Quiz Battle!
                        </p>
                        <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full border border-white/10 mt-3">
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/40">Room ID: {invite.roomId}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onDecline}
                            className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white/60 font-bold hover:bg-white/5 hover:text-white transition-all active:scale-95"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={() => onAccept(invite.roomId)}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center space-x-2 border border-white/10"
                        >
                            <FaCheck />
                            <span>Accept & Join</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizInviteModal;
