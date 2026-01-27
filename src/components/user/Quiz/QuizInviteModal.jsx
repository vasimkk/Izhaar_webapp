import React, { useState, useEffect } from "react";
import { FaGamepad, FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizInviteModal = ({ invite, onAccept, onDecline }) => {
    if (!invite) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white relative">
                    <button
                        onClick={onDecline}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <FaGamepad className="text-2xl animate-bounce" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Quiz Challenge!</h3>
                            <p className="text-white/80 text-sm">Battle is calling...</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-slate-600 font-medium">
                            <span className="font-bold text-purple-600">{invite.senderName}</span> has invited you to a real-time Quiz Battle!
                        </p>
                        <div className="inline-block px-4 py-1 bg-purple-50 rounded-full border border-purple-100 mt-2">
                            <span className="text-[10px] uppercase tracking-widest font-black text-purple-400">Room ID: {invite.roomId}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onDecline}
                            className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={() => onAccept(invite.roomId)}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95 flex items-center justify-center space-x-2"
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
