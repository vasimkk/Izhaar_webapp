import React, { useState } from "react";
import { FaPlay, FaHeart, FaArrowRight, FaUserFriends, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import kabirProfile from "../../../assets/images/kabir.png";
import zaraProfile from "../../../assets/images/zara.png";

const QuizLobby = ({ onCreateQuiz, onJoinQuiz, onSoloPlay, onLocalPlay, user }) => {
    const [inviteMobile, setInviteMobile] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");
    const [activeTab, setActiveTab] = useState("create"); // create, join
    const [selectedGame, setSelectedGame] = useState(null); // TIC_TAC_TOE, LUDO, QUIZ, SNAKE
    const navigate = useNavigate();

    const games = [
        {
            id: "TIC_TAC_TOE",
            name: "ShadowX Tic-Tac-Toe",
            description: "Classical connection game",
            icon: <FaHeart className="text-2xl" />,
            color: "from-pink-500 to-purple-600"
        },
        {
            id: "LUDO",
            name: "Ludo Battle",
            description: "Epic dice journey for two",
            icon: <div className="text-2xl font-black">🎲</div>,
            color: "from-blue-500 to-cyan-600"
        },
        {
            id: "SNAKE",
            name: "Snake & Ladders",
            description: "Luck & Love encounter",
            icon: <div className="text-2xl font-black">🐍</div>,
            color: "from-green-500 to-emerald-600"
        },
        {
            id: "QUIZ",
            name: "Heartfelt Quiz",
            description: "How well do you know them?",
            icon: <div className="text-2xl font-black">❓</div>,
            color: "from-amber-500 to-orange-600"
        }
    ];

    const handleStart = () => {
        if (!inviteMobile) {
            alert("Please enter your partner's mobile number.");
            return;
        }
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        onCreateQuiz(roomId, inviteMobile, selectedGame);
    };

    const handleJoin = () => {
        if (!joinRoomId) {
            alert("Please enter the secret room code.");
            return;
        }
        onJoinQuiz(joinRoomId.toUpperCase());
    };

    if (!selectedGame) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-8 p-6 relative overflow-hidden animate-in fade-in duration-700">
                <button
                    onClick={() => navigate("/user/dashboard")}
                    className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 text-white bg-white/10 border border-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <div className="text-center space-y-2 relative z-10">
                    <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white italic font-serif">Game Hub</h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Choose your adventure</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full max-w-[320px] sm:max-w-2xl relative z-10 px-2">
                    {games.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => setSelectedGame(game.id)}
                            className="group relative overflow-hidden rounded-2xl p-3 sm:p-6 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col items-center sm:items-start text-center sm:text-left"
                        >
                            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${game.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>

                            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 relative z-10 w-full">
                                <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-2 sm:mb-0`}>
                                    <div className="scale-[0.65] sm:scale-100">{game.icon}</div>
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-[9px] sm:text-lg font-black text-white leading-tight uppercase sm:capitalize tracking-widest sm:tracking-normal">{game.name}</h3>
                                    <p className="text-white/20 text-[6px] sm:text-xs hidden sm:block">{game.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/10 w-full max-w-md text-center opacity-50">
                    <div className="flex items-center justify-center space-x-3 text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></div>
                        <span>Epic Moments Await</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center space-y-6 p-6 relative overflow-hidden animate-in fade-in duration-700">
            {/* Back to Hub button */}
            <button
                onClick={() => setSelectedGame(null)}
                className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 text-white bg-white/10 border border-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Soft Romantic Gradients */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full"></div>

            <div className="text-center space-y-4 relative z-10">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br ${games.find(g => g.id === selectedGame)?.color} rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto shadow-lg transform hover:scale-110 transition-all duration-500 cursor-pointer group`}>
                    {games.find(g => g.id === selectedGame)?.icon}
                </div>
                <div className="space-y-1">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight font-serif italic drop-shadow-sm">
                        {games.find(g => g.id === selectedGame)?.name}
                    </h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">The mystery of your connection</p>
                </div>
            </div>

            <div className="w-full max-w-md space-y-6 relative z-10">
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

            <div className="w-full max-w-md space-y-3 relative z-10">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        onClick={() => onSoloPlay(selectedGame, 'KABIR')}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 rounded-full border-2 border-pink-500/30 overflow-hidden mb-2 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
                            <img src={kabirProfile} alt="Kabir" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60 group-hover:text-white transition-colors relative z-10">Play with Kabir</span>
                    </button>
                    <button
                        onClick={() => onSoloPlay(selectedGame, 'ZARA')}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 overflow-hidden mb-2 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
                            <img src={zaraProfile} alt="Zara" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60 group-hover:text-white transition-colors relative z-10">Play with Zara</span>
                    </button>
                </div>

                <button
                    onClick={() => onLocalPlay(selectedGame)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden flex items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FaUserFriends className="text-white text-lg" />
                    </div>
                    <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white">N to n Play</span>
                        <span className="block text-[7px] text-white/30 uppercase tracking-[0.1em]">Play with partner locally</span>
                    </div>
                </button>
            </div>

            <div className="pt-6 border-t border-white/10 w-full max-w-md relative z-10 text-center">
                <div className="flex items-center justify-center space-x-3 text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></div>
                    <span>Adventure Awaits</span>
                </div>
            </div>
        </div>
    );
};

export default QuizLobby;