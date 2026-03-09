import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDice, FaHeart, FaBars, FaRedo, FaTimes, FaLongArrowAltRight, FaLongArrowAltDown, FaLongArrowAltLeft, FaLongArrowAltUp, FaUser, FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaStepForward, FaMusic, FaQuoteLeft, FaCommentDots, FaHeartbeat } from "react-icons/fa";
const kabirProfile = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/kabir?_a=BAMAOGeA0";
const zaraProfile = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/zara?_a=BAMAOGeA0";
const defaultProfile = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/images/profile?_a=BAMAOGeA0";

const COLORS = {
    // Richer, more "Dark Romantic" palette as requested
    RED: "#9D174D", // Deep Pink/Red
    GREEN: "#065F46", // Deep Emerald
    BLUE: "#1E40AF", // Deep Blue
    YELLOW: "#78350F", // Deep Amber
    BOARD_BG: "#FFFFFF",
    GRID_LINE: "rgba(0,0,0,0.4)",
    ROMANCE_START: "#020202",
    ROMANCE_MID: "#1a103c",
    ROMANCE_END: "#2e022d",
    ACCENT_PINK: "#EC4891",
    ACCENT_PURPLE: "#A928ED"
};

const MAIN_PATH = [
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
    [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
    [7, 14], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
    [14, 7], [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0]
];

const SAFE_NODES = [1, 9, 14, 22, 27, 35, 40, 48];

const Ludo = ({ socket, roomId, user, gameMode, opponentPersona, onCancel }) => {
    const [players, setPlayers] = useState([
        {
            id: 'pink', name: user?.profile?.name || user?.name || 'You', color: COLORS.ACCENT_PINK, start: 40,
            profile: user?.profile?.profile_image || user?.profile_image || defaultProfile,
            homePath: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]],
            pieces: [-1, -1, -1, -1],
            // Math-perfect alignment for 4 coins in the 4x4 inner white box
            basePoints: [[10.5, 1.5], [10.5, 3.5], [12.5, 1.5], [12.5, 3.5]]
        },
        {
            id: 'purple',
            name: gameMode === 'LOCAL' ? 'Partner' : (opponentPersona === 'ZARA' ? 'Zara' : 'Kabir'),
            color: COLORS.ACCENT_PURPLE,
            start: 14,
            profile: gameMode === 'LOCAL' ? defaultProfile : (opponentPersona === 'ZARA' ? zaraProfile : kabirProfile),
            homePath: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
            pieces: [-1, -1, -1, -1],
            basePoints: [[1.5, 10.5], [1.5, 12.5], [3.5, 10.5], [3.5, 12.5]]
        },
    ]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [turnStage, setTurnStage] = useState('ROLL');
    const [showConfirm, setShowConfirm] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [valentineMode, setValentineMode] = useState(true);
    const [activeExpression, setActiveExpression] = useState({ p0: null, p1: null });
    const [showChat, setShowChat] = useState(false);
    const [floatingEffects, setFloatingEffects] = useState([]);

    const addFloatingEffect = (content, pIdx) => {
        const id = Date.now();
        if (content.includes("Kiss")) {
            const hearts = Array(10).fill(0).map((_, i) => ({
                id: id + i,
                content: "❤️",
                pIdx,
                delay: i * 0.1,
                offset: (Math.random() - 0.5) * 40
            }));
            setFloatingEffects(prev => [...prev, ...hearts]);
            setTimeout(() => setFloatingEffects(prev => prev.filter(e => !hearts.find(h => h.id === e.id))), 6000);
        } else {
            setFloatingEffects(prev => [...prev, { id, content, pIdx, delay: 0, offset: 0 }]);
            setTimeout(() => setFloatingEffects(prev => prev.filter(e => e.id !== id)), 6000);
        }
    };

    const ROMANTIC_QUOTES = [
        "Love is just a game, but with you, I've already won.",
        "Every move I make is towards your heart.",
        "You captured my piece, but I'll capture your soul.",
        "In this game of Ludo, you're my only prize."
    ];

    const CHAT_MESSAGES = ["Love you! ❤️", "So cute! 😊", "My turn, baby! 😘", "Oops! Sorry! 😜", "You're winning! 💖"];

    // Theme Engine
    const THEMES = [
        { id: 'dark', label: 'Midnight', start: '#020202', mid: '#1a103c', end: '#2e022d' },
        { id: 'warm', label: 'Sunset', start: '#451a03', mid: '#7c2d12', end: '#991b1b' },
        { id: 'teal', label: 'Ocean', start: '#042f2e', mid: '#0d9488', end: '#115e59' },
        { id: 'cyber', label: 'Cyber', start: '#000000', mid: '#1e1b4b', end: '#4c1d95' }
    ];
    const [currentTheme, setCurrentTheme] = useState(THEMES[0]);

    // Music Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(0);
    const audioRef = useRef(new Audio());

    const playlist = [
        { name: "Romantic Chill", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "Sweet Love", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { name: "Deep Connection", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ];

    useEffect(() => {
        const audio = audioRef.current;
        audio.src = playlist[currentSong].url;
        if (isPlaying) audio.play().catch(() => setIsPlaying(false));

        return () => {
            audio.pause();
        };
    }, [currentSong]);

    useEffect(() => {
        if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
        else audioRef.current.pause();
    }, [isPlaying]);

    // Optimized Persistent Sound Engine for Mobile
    const audioContextRef = useRef(null);

    const playLocalSfx = (type) => {
        if (!soundEnabled) return;

        try {
            // Initialize or resume AudioContext
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            if (type === 'roll') {
                for (let i = 0; i < 12; i++) {
                    const time = ctx.currentTime + (i * 0.05);
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'square';
                    o.frequency.setValueAtTime(150 + (Math.random() * 200), time);
                    g.gain.setValueAtTime(0.08, time);
                    g.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(time);
                    o.stop(time + 0.04);
                }
            } else if (type === 'move') {
                for (let i = 0; i < 4; i++) {
                    const time = ctx.currentTime + (i * 0.04);
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'sine';
                    o.frequency.setValueAtTime(800 + (i * 300), time);
                    g.gain.setValueAtTime(0.08, time);
                    g.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(time);
                    o.stop(time + 0.15);
                }
            } else if (type === 'capture') {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(400, ctx.currentTime);
                o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
                g.gain.setValueAtTime(0.1, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                o.connect(g);
                g.connect(ctx.destination);
                o.start();
                o.stop(ctx.currentTime + 0.4);
            } else if (type === 'win') {
                [440, 554, 659, 880].forEach((freq, i) => {
                    const time = ctx.currentTime + (i * 0.15);
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.frequency.setValueAtTime(freq, time);
                    g.gain.setValueAtTime(0.15, time);
                    g.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start(time);
                    o.stop(time + 0.3);
                });
            }
        } catch (e) {
            console.error("Local SFX Error:", e);
        }
    };

    // Expression Handler (Emoji/Text)
    const sendExpression = useCallback((content, pIdx = currentPlayer) => {
        const pKey = `p${pIdx}`;
        setActiveExpression(prev => ({ ...prev, [pKey]: content }));
        setShowChat(false);
        addFloatingEffect(content, pIdx);

        if (socket && gameMode === 'ONLINE') {
            socket.emit("game-move", {
                roomId,
                userId: user.id,
                gameType: 'LUDO',
                moveData: { type: 'EXPRESSION', content, pIdx }
            });
        }
        setTimeout(() => setActiveExpression(prev => ({ ...prev, [pKey]: null })), 4000);
    }, [currentPlayer, socket, roomId, user, gameMode]);

    // Enhanced Socket listener
    useEffect(() => {
        if (socket && gameMode === 'ONLINE') {
            const handleMove = (data) => {
                if (data.gameType === 'LUDO' && data.moveData.type === 'EXPRESSION') {
                    const pKey = `p${data.moveData.pIdx}`;
                    setActiveExpression(prev => ({ ...prev, [pKey]: data.moveData.content }));
                    addFloatingEffect(data.moveData.content, data.moveData.pIdx);
                    setTimeout(() => setActiveExpression(prev => ({ ...prev, [pKey]: null })), 4000);
                }
            };
            socket.on("opponent-move", handleMove);
            return () => socket.off("opponent-move", handleMove);
        }
    }, [socket, gameMode]);

    const nextTurn = useCallback(() => {
        const nextPlayer = currentPlayer === 0 ? 1 : 0;
        setCurrentPlayer(nextPlayer);
        setTurnStage('ROLL');
    }, [currentPlayer]);

    const rollDice = useCallback(() => {
        if (isRolling || turnStage !== 'ROLL') return;
        setIsRolling(true);
        playLocalSfx('roll');

        setTimeout(() => {
            const val = Math.floor(Math.random() * 6) + 1;
            setDiceValue(val);
            setIsRolling(false);
            setTurnStage('MOVE');

            const p = players[currentPlayer];
            const canMove = p.pieces.some(pos => (pos === -1 && val === 6) || (pos !== -1 && pos + val <= 56));
            if (!canMove) {
                setTimeout(() => {
                    nextTurn();
                }, 1000);
            }
        }, 800);
    }, [isRolling, turnStage, currentPlayer, players, nextTurn]);

    const handlePieceClick = useCallback(async (idx) => {
        if (turnStage !== 'MOVE' || isMoving) return;
        const p = players[currentPlayer];
        let currentPos = p.pieces[idx];
        let targetPos = currentPos;

        if (currentPos === -1) {
            if (diceValue === 6) targetPos = 0;
            else return;
        } else if (currentPos + diceValue > 56) return;
        else targetPos += diceValue;

        setIsMoving(true);

        const animateMove = async () => {
            let tempPos = currentPos;

            // Special case: Getting out of base
            if (currentPos === -1 && diceValue === 6) {
                tempPos = 0;
                setPlayers(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next[currentPlayer].pieces[idx] = 0;
                    return next;
                });
                playLocalSfx('move');
                await new Promise(r => setTimeout(r, 350));
            } else {
                // Step-by-step movement (Increased delay for better visibility)
                for (let i = 0; i < diceValue; i++) {
                    tempPos++;
                    setPlayers(prev => {
                        const next = JSON.parse(JSON.stringify(prev));
                        next[currentPlayer].pieces[idx] = tempPos;
                        return next;
                    });
                    playLocalSfx('move');
                    await new Promise(r => setTimeout(r, 350));
                }
            }

            // After animation, check for capture and turn management
            const finalPos = tempPos;
            const newPlayers = JSON.parse(JSON.stringify(players));
            newPlayers[currentPlayer].pieces[idx] = finalPos;

            if (finalPos < 51) {
                const absPos = (finalPos + p.start) % 52;
                const oppIdx = currentPlayer === 0 ? 1 : 0;
                if (!SAFE_NODES.includes(absPos)) {
                    let captured = false;
                    newPlayers[oppIdx].pieces = newPlayers[oppIdx].pieces.map(oppPos => {
                        if (oppPos !== -1 && oppPos <= 50 && (oppPos + newPlayers[oppIdx].start) % 52 === absPos) {
                            playLocalSfx('capture');
                            captured = true;
                            return -1;
                        }
                        return oppPos;
                    });
                    if (captured) {
                        setPlayers(newPlayers);
                        setIsMoving(false);
                        if (diceValue === 6) setTurnStage('ROLL');
                        else nextTurn();
                        return;
                    }
                }
            }

            setPlayers(newPlayers);
            setIsMoving(false);
            if (diceValue === 6) setTurnStage('ROLL');
            else nextTurn();
        };

        animateMove();
    }, [turnStage, isMoving, diceValue, currentPlayer, players, nextTurn]);

    useEffect(() => {
        if (currentPlayer === 1 && gameMode === 'SOLO' && !isRolling) {
            if (turnStage === 'ROLL') setTimeout(rollDice, 1500);
            else if (turnStage === 'MOVE') {
                const moves = players[1].pieces.map((p, i) => ((p === -1 && diceValue === 6) || (p !== -1 && p + diceValue <= 56)) ? i : -1).filter(i => i !== -1);
                if (moves.length > 0) {
                    const bestMove = moves.find(m => players[1].pieces[m] !== -1) ?? moves[0];
                    setTimeout(() => handlePieceClick(bestMove), 1000);
                }
            }
        }
    }, [currentPlayer, turnStage, isRolling, diceValue, gameMode, players, rollDice, handlePieceClick]);

    const getCoord = (pIdx, prog, pcIdx) => {
        const p = players[pIdx];
        if (prog === -1) return p.basePoints[pcIdx];
        if (prog < 51) return MAIN_PATH[(prog + p.start) % 52];
        return p.homePath[prog - 51];
    };

    return (
        <div className="w-full min-h-screen relative flex flex-col items-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${currentTheme.start} 0%, ${currentTheme.mid} 50%, ${currentTheme.end} 100%)` }}>

            {/* Background Hearts & Romantic Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
                <AnimatePresence>
                    {floatingEffects.map(eff => (
                        <motion.div
                            key={eff.id}
                            initial={{ x: eff.pIdx === 0 ? "15vw" : "75vw", y: "85vh", opacity: 0, scale: 0 }}
                            animate={{
                                x: eff.pIdx === 0
                                    ? [`15vw`, `${25 + eff.offset}vw`, `${10 + eff.offset}vw`, `${30 + eff.offset}vw`]
                                    : [`75vw`, `${65 + eff.offset}vw`, `${85 + eff.offset}vw`, `${70 + eff.offset}vw`],
                                y: "-10vh",
                                opacity: [0, 1, 1, 0],
                                scale: [0.5, 1.2, 1, 0.8],
                                rotate: [0, 45, -45, 0]
                            }}
                            transition={{ duration: 5 + (Math.random() * 2), ease: "easeOut", delay: eff.delay }}
                            className="absolute drop-shadow-[0_0_15px_rgba(236,72,145,0.5)]"
                        >
                            <div className={eff.content === "❤️" ? "text-3xl" : "bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border-2 border-pink-500/30 text-[10px] font-black italic uppercase tracking-widest text-pink-600 shadow-2xl"}>
                                {eff.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {[...Array(valentineMode ? 15 : 6)].map((_, i) => (
                    <div key={i} className="absolute bottom-[-50px] text-pink-500/30 animate-float-heart"
                        style={{ left: `${Math.random() * 100}%`, fontSize: `${15 + Math.random() * 40}px`, animationDelay: `${i * 1.5}s`, animationDuration: `${10 + Math.random() * 10}s` }}>
                        {i % 2 === 0 ? '❤️' : '💖'}
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="w-full flex flex-col gap-3 p-4 z-50">
                <div className="w-full flex justify-between items-center">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all shadow-lg bg-white/10 hover:bg-white/20">
                        <FaBars />
                    </button>
                    <div className="px-6 bg-black/40 backdrop-blur-xl rounded-full flex items-center border border-pink-500/30 h-11 shadow-[0_0_40px_rgba(236,72,145,0.4)]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-[14px] uppercase font-black tracking-[0.2em] italic" style={{ fontFamily: "'Playfair Display', serif" }}>Ludo Romance</span>
                    </div>
                    <button onClick={() => setShowConfirm(true)} className="w-10 h-10 bg-red-600/80 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-md border border-white/20 active:scale-90 transition-all"><FaTimes /></button>
                </div>
            </div>

            {/* Board Container */}
            <div className="relative w-[96vw] aspect-square max-w-[440px]  p-3 z-10 mx-auto  mt-6">
                <div className="w-full h-full bg-white relative overflow-hidden rounded-xl shadow-2xl" style={{ border: '2px solid black' }}>

                    {/* Seamless Grid Construction */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gridTemplateRows: 'repeat(15, 1fr)', width: '100%', height: '100%' }}>
                        {Array(225).fill(0).map((_, i) => {
                            const r = Math.floor(i / 15);
                            const c = i % 15;

                            // Bases (6x6) - Darker "Midnight" shades
                            if (r < 6 && c < 6) return <div key={i} className="" style={{ backgroundColor: "#31000d", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (r < 6 && c > 8) return <div key={i} className="" style={{ backgroundColor: "#021c16", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (r > 8 && c < 6) return <div key={i} className="" style={{ backgroundColor: "#081330", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (r > 8 && c > 8) return <div key={i} className="" style={{ backgroundColor: "#271201", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;

                            // Home Paths - Dark Glass/Cyber look
                            if (c === 7 && r > 0 && r < 6) return <div key={i} className="" style={{ backgroundColor: "#064e40", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (c === 7 && r > 8 && r < 14) return <div key={i} className="" style={{ backgroundColor: "#1e3a8a", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (r === 7 && c > 0 && c < 6) return <div key={i} className="" style={{ backgroundColor: "#701a3d", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;
                            if (r === 7 && c > 8 && c < 14) return <div key={i} className="" style={{ backgroundColor: "#78350f", border: `0.1px solid ${COLORS.GRID_LINE}` }}></div>;

                            if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return <div key={i} className="bg-white"></div>;

                            const absIdx = MAIN_PATH.findIndex(p => p[0] === r && p[1] === c);
                            return <div key={i} className="bg-white" style={{ border: `1px solid ${COLORS.GRID_LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {SAFE_NODES.includes(absIdx) && <FaHeart className="text-pink-400 opacity-20 text-[8px] animate-pulse" />}
                            </div>;
                        })}
                    </div>

                    {/* The "4 Box" Bases with White Inner Square as shown in user reference */}
                    <BaseBox r={0} c={0} color={COLORS.RED} label="" corner="TL" />
                    <BaseBox r={0} c={9} color={COLORS.GREEN} label={players[1].name} corner="TR" />
                    <BaseBox r={9} c={0} color={COLORS.BLUE} label={players[0].name} corner="BL" />
                    <BaseBox r={9} c={9} color={COLORS.YELLOW} label="" corner="BR" />

                    {/* Center Unit */}
                    <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] z-[5] overflow-hidden border border-black bg-white shadow-lg">
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)', background: '#064e40' }}></div>
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)', background: '#78350f' }}></div>
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)', background: '#1e3a8a' }}></div>
                        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)', background: '#701a3d' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <FaHeart className="text-white text-2xl animate-pulse shadow-glow" />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <FaLongArrowAltRight className="absolute top-[41%] left-[2%] text-[#EC4899] text-xs opacity-50" />
                    <FaLongArrowAltDown className="absolute top-[2%] left-[54.5%] text-[#10B981] text-xs opacity-50" />
                    <FaLongArrowAltUp className="absolute bottom-[2%] left-[41.5%] text-[#3B82F6] text-xs opacity-50" />
                    <FaLongArrowAltLeft className="absolute top-[54.5%] right-[2%] text-[#F59E0B] text-xs opacity-50" />

                    {/* Heart Pieces (Coins) Resized and aligned for the new Box layout */}
                    {players.map((p, pIdx) => p.pieces.map((prog, pcIdx) => {
                        const [row, col] = getCoord(pIdx, prog, pcIdx);
                        const canMove = currentPlayer === pIdx && turnStage === 'MOVE' && ((prog === -1 && diceValue === 6) || (prog !== -1 && prog + diceValue <= 56));
                        return (
                            <button key={`${pIdx}-${pcIdx}`} onClick={() => pIdx === currentPlayer && handlePieceClick(pcIdx)}
                                className={`absolute w-[6.66%] h-[6.66%] z-30 transition-all duration-300 flex items-center justify-center 
                                           ${canMove && !isMoving ? 'animate-bounce cursor-pointer' : 'pointer-events-none'}`}
                                style={{ top: `${(row / 15) * 100}%`, left: `${(col / 15) * 100}%` }}>
                                <div className="relative w-full h-full flex flex-col items-center justify-center">
                                    <div className="absolute bottom-0 w-[80%] h-[15%] bg-black/30 rounded-full blur-[2px]"></div>
                                    <div className="relative flex items-center justify-center w-full h-full drop-shadow-lg scale-[0.85]">
                                        <FaHeart className="w-full h-full filter brightness-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ color: p.color }} />
                                        <div className="absolute top-[15%] left-[20%] w-[30%] h-[25%] bg-white/40 rounded-full blur-[1px]"></div>
                                    </div>
                                </div>
                            </button>
                        );
                    }))}
                </div>
            </div>

            {/* Bottom Panel - Reduced Height & Separated Boxes */}
            <div className="fixed bottom-0 left-0 right-0 h-36 bg-black/60 backdrop-blur-3xl border-t border-white/10 flex items-center justify-center px-4 z-50">
                <div className="w-full max-w-lg flex items-center justify-between gap-2 sm:gap-4">

                    {/* Left: User Profile Box */}
                    <div className={`relative flex flex-col items-center justify-center w-[28%] h-20 rounded-2xl transition-all duration-500 border border-white/10 bg-white/5 ${currentPlayer === 0 ? 'ring-2 ring-pink-500 shadow-[0_0_15px_rgba(236,72,145,0.4)] scale-105' : 'opacity-40'}`}>
                        <AnimatePresence>
                            {activeExpression.p0 && (
                                <motion.div
                                    initial={{ scale: 0, y: 0, opacity: 0 }}
                                    animate={{ scale: 1, y: -70, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute z-[100] bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xl border-2 border-pink-500"
                                >
                                    {activeExpression.p0}
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-pink-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-pink-500 overflow-hidden shadow-lg">
                                <img src={players[0].profile} alt="You" className="w-full h-full object-cover" onError={(e) => { e.target.src = defaultProfile; }} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#22C55E] border border-black rounded-full animate-pulse shadow-green-500/40"></div>
                        </div>
                        <span className="text-white text-[9px] font-black uppercase tracking-tighter mt-1 truncate w-full text-center px-1">{players[0].name}</span>
                        {currentPlayer === 0 && <span className="text-[7px] text-pink-500 font-bold uppercase animate-pulse">TURN</span>}
                    </div>


                    {/* Center: Dice Section */}
                    <div className="w-[36%] flex flex-col items-center justify-center relative">
                        <AnimatePresence>
                            {showChat && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                    className="absolute -top-44 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-3xl p-3 rounded-2xl border border-white/20 flex flex-col gap-1.5 shadow-2xl z-[70] min-w-[150px]"
                                >
                                    <div className="text-[8px] text-pink-500 font-black uppercase tracking-[0.2em] mb-1 px-2">Quick Chat</div>
                                    {CHAT_MESSAGES.map(msg => (
                                        <button key={msg} onClick={() => sendExpression(msg)} className="text-[11px] text-white/90 hover:text-white hover:bg-pink-500/20 p-2 rounded-xl text-left font-bold transition-all">
                                            {msg}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-1 transform -translate-y-4">
                            <button onClick={rollDice} disabled={isRolling || turnStage !== 'ROLL' || (currentPlayer !== 0 && gameMode === 'SOLO')}
                                className={`w-20 h-20 rounded-3xl border-4 border-white flex items-center justify-center transition-all duration-700 shadow-[0_0_30px_rgba(255,255,255,0.2)]
                                                   ${turnStage === 'ROLL' ? 'floating-animation scale-110 active:scale-95' : 'grayscale-0 opacity-100'}`}
                                style={{
                                    background: players[currentPlayer].color,
                                    boxShadow: `0 10px 40px ${players[currentPlayer].color}66`
                                }}>
                                {isRolling ? <FaDice className="text-white text-3xl animate-spin" /> : <Dice dots={diceValue} />}
                            </button>
                        </div>
                        {turnStage === 'MOVE' && <div className="text-[10px] text-white font-black italic uppercase tracking-[0.2em] animate-bounce mt-[-8px]">PICK PIECE</div>}
                    </div>

                    {/* Right: Opponent Profile Box */}
                    <div className={`relative flex flex-col items-center justify-center w-[28%] h-20 rounded-2xl transition-all duration-500 border border-white/10 bg-white/5 ${currentPlayer === 1 ? 'ring-2 ring-purple-500 shadow-[0_0_15px_rgba(169,40,237,0.4)] scale-105' : 'opacity-40'}`}>
                        <AnimatePresence>
                            {activeExpression.p1 && (
                                <motion.div
                                    initial={{ scale: 0, y: 0, opacity: 0 }}
                                    animate={{ scale: 1, y: -70, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute z-[100] bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xl border-2 border-purple-500"
                                >
                                    {activeExpression.p1}
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden shadow-lg text-white">
                                <img src={players[1].profile} alt="Opponent" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#22C55E] border border-black rounded-full animate-pulse shadow-green-500/40"></div>
                        </div>
                        <span className="text-white text-[9px] font-black uppercase tracking-tighter mt-1 truncate w-full text-center px-1">{players[1].name}</span>
                        {currentPlayer === 1 && <span className="text-[7px] text-purple-500 font-bold uppercase animate-pulse">TURN</span>}
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in duration-500">
                    <div className="bg-black/60 border border-pink-500/30 rounded-[3.5rem] p-12 w-full max-w-xs text-center shadow-2xl scale-in-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#EC4891] to-[#A928ED] rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-8 animate-heart-beat">
                            <FaHeart />
                        </div>
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-3xl font-black italic uppercase mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>STAY IN LOVE?</h3>
                        <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-10 leading-relaxed italic text-center">Don't break the romantic magic!</p>
                        <div className="flex flex-col gap-4">
                            <button onClick={onCancel} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase italic shadow-xl transition-all active:scale-95">QUIT GAME</button>
                            <button onClick={() => setShowConfirm(false)} className="w-full py-5 bg-gradient-to-r from-[#EC4891] to-[#A928ED] text-white rounded-3xl font-black uppercase italic border border-white/20 shadow-2xl shadow-pink-500/30 active:scale-95 transition-all">STAY & PLAY</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Side Drawer */}
            <AnimatePresence mode="wait">
                {showSettings && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-black/90 backdrop-blur-2xl z-[201] border-r border-white/10 p-6 shadow-2xl flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-white font-black italic uppercase tracking-widest">Settings</h3>
                                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white"><FaTimes /></button>
                            </div>

                            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {/* Sound Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] text-pink-500 font-bold uppercase tracking-[0.2em]">Audio Controls</div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setSoundEnabled(!soundEnabled)}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${soundEnabled ? 'bg-pink-500/10 border-pink-500/30 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaDice />
                                                <span className="text-xs font-bold">Game Effects</span>
                                            </div>
                                            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                                        </button>
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isPlaying ? 'bg-purple-500/10 border-purple-500/30 text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaMusic />
                                                <span className="text-xs font-bold">Background Music</span>
                                            </div>
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </button>
                                    </div>
                                </div>

                                {/* Themes Section */}
                                <div className="space-y-4">
                                    <div className="text-[10px] text-pink-500 font-bold uppercase tracking-[0.2em]">Board Themes</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {THEMES.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setCurrentTheme(theme)}
                                                className={`p-3 rounded-xl border transition-all flex flex-col gap-2 items-center ${currentTheme.id === theme.id ? 'bg-white/10 border-white/40 ring-2 ring-pink-500' : 'bg-white/5 border-white/10 opacity-60'}`}
                                            >
                                                <div className="w-10 h-10 rounded-full shadow-inner border border-white/10" style={{ background: `linear-gradient(135deg, ${theme.mid}, ${theme.end})` }} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{theme.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <div className="text-[8px] text-white/20 font-bold text-center uppercase tracking-widest italic">
                                    Izhaar Romance Ludo v1.2
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

// Premium Base Component matching the "4 Box" Reference Image
const BaseBox = ({ r, c, color, label, corner }) => {
    // Determine label position inside the colored box
    const labelStyle = corner.includes('B')
        ? { bottom: '2%', left: '50%', transform: 'translateX(-50%)' }
        : { top: '2%', left: '50%', transform: 'translateX(-50%)' };

    return (
        <div
            className="absolute z-[2] transition-all duration-500 rounded-xl border-2 border-black/20 shadow-lg"
            style={{
                top: `${(r / 15) * 100}%`,
                left: `${(c / 15) * 100}%`,
                width: '40%', // 6/15 = 40%
                height: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color, // The "Full Colored" layer
            }}
        >
            {/* White Inner Box - Perfectly Centered in the colored area */}
            <div
                className="bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center relative border border-black/10"
                style={{
                    width: '66.666%', // 4/6 = 66.6%
                    height: '66.666%',
                    marginBottom: corner.includes('B') ? '8%' : '0',
                    marginTop: corner.includes('T') ? '8%' : '0',
                }}
            >
                {/* 4 Decorative slots */}
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-1.5 gap-1.5">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-center">
                            <div className="w-[85%] aspect-square rounded-full border border-black/5 flex items-center justify-center bg-black/[0.05] shadow-inner">
                                <FaHeart className="opacity-10" style={{ fontSize: '10px', color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Label - Locked inside the colored layer at the bottom/top */}
            <div
                className="absolute font-black whitespace-nowrap text-[12px] uppercase tracking-tighter italic filter drop-shadow-md text-white"
                style={{ ...labelStyle }}
            >
                {label}
            </div>
        </div>
    );
};

const Dice = ({ dots }) => {
    const d = { 1: [[50, 50]], 2: [[25, 25], [75, 75]], 3: [[20, 20], [50, 50], [80, 80]], 4: [[25, 25], [25, 75], [75, 25], [75, 75]], 5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]], 6: [[25, 25], [50, 25], [75, 25], [25, 75], [50, 75], [75, 75]] };
    return <div className="w-12 h-12 relative">
        {d[dots].map((p, i) => <div key={i} className="absolute w-3 h-3 bg-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" style={{ top: `${p[1]}%`, left: `${p[0]}%`, transform: 'translate(-50%, -50%)' }}></div>)}
    </div>;
};

export default Ludo;
