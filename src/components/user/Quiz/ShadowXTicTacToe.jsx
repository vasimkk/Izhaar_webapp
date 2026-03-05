import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaRegCircle, FaHeart, FaChevronLeft, FaUndo, FaBars } from "react-icons/fa";

const ShadowXTicTacToe = ({ socket, roomId, user, gameMode, onCancel }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isMyTurn, setIsMyTurn] = useState(gameMode === 'ONLINE' ? false : true);
    const [mySymbol, setMySymbol] = useState(gameMode === 'ONLINE' ? null : 'X');
    const [winner, setWinner] = useState(null);
    const [status, setStatus] = useState(gameMode === 'ONLINE' ? "Waiting..." : "Your Turn");

    // Sound logic
    const playSound = (type) => {
        const urls = {
            click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
            win: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
            draw: 'https://www.soundjay.com/misc/sounds/button-10.mp3'
        };
        const audio = new Audio(urls[type]);
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const checkWinner = useCallback((currentBoard) => {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let line of lines) {
            const [a, b, c] = line;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) return currentBoard[a];
        }
        if (currentBoard.every(sq => sq !== null)) return 'Draw';
        return null;
    }, []);

    const makeAiMove = useCallback((currentBoard) => {
        const available = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (available.length === 0) return;
        const aiSymbol = mySymbol === 'X' ? 'O' : 'X';
        for (let m of available) {
            const copy = [...currentBoard]; copy[m] = aiSymbol;
            if (checkWinner(copy) === aiSymbol) return m;
        }
        for (let m of available) {
            const copy = [...currentBoard]; copy[m] = mySymbol;
            if (checkWinner(copy) === mySymbol) return m;
        }
        if (available.includes(4)) return 4;
        return available[Math.floor(Math.random() * available.length)];
    }, [mySymbol, checkWinner]);

    useEffect(() => {
        if (gameMode === 'SOLO' && !isMyTurn && !winner) {
            const timer = setTimeout(() => {
                const move = makeAiMove(board);
                if (move !== undefined) {
                    const next = [...board];
                    const aiSymbol = mySymbol === 'X' ? 'O' : 'X';
                    next[move] = aiSymbol;
                    setBoard(next);
                    playSound('click');
                    const res = checkWinner(next);
                    if (res) {
                        setWinner(res);
                        playSound(res === 'Draw' ? 'draw' : 'win');
                    } else {
                        setIsMyTurn(true);
                    }
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isMyTurn, board, gameMode, winner, makeAiMove, mySymbol, checkWinner]);

    const handleSquareClick = (index) => {
        if (!isMyTurn || board[index] || winner) return;

        const next = [...board];
        next[index] = mySymbol;
        setBoard(next);
        playSound('click');

        const res = checkWinner(next);
        if (res) {
            setWinner(res);
            playSound(res === 'Draw' ? 'draw' : 'win');
            if (socket && gameMode === 'ONLINE') {
                socket.emit("game-move", { roomId, userId: user.id, gameType: 'TIC_TAC_TOE', moveData: { type: 'OVER', winner: res, board: next } });
            }
        } else {
            setIsMyTurn(false);
            if (socket && gameMode === 'ONLINE') {
                socket.emit("game-move", { roomId, userId: user.id, gameType: 'TIC_TAC_TOE', moveData: { type: 'MOVE', index, symbol: mySymbol, board: next } });
            }
        }
    };

    // Socket listeners for Online
    useEffect(() => {
        if (socket && gameMode === 'ONLINE') {
            socket.on("opponent-move", (data) => {
                if (data.gameType === 'TIC_TAC_TOE') {
                    setBoard(data.moveData.board);
                    if (data.moveData.type === 'MOVE') {
                        setIsMyTurn(true);
                        playSound('click');
                    } else if (data.moveData.type === 'OVER') {
                        setWinner(data.moveData.winner);
                        playSound(data.moveData.winner === 'Draw' ? 'draw' : 'win');
                    }
                }
            });
            return () => socket.off("opponent-move");
        }
    }, [socket, gameMode]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-between pb-12 pt-6 overflow-hidden"
            style={{ background: "linear-gradient(180deg, #1A4D8E 0%, #0D2647 100%)" }}>

            {/* Header */}
            <div className="w-full max-w-sm px-6 flex justify-between items-center z-50">
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"><FaBars /></button>
                <div className="px-5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white tracking-widest">OX BATTLE</div>
                <button onClick={() => window.location.reload()} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"><FaTimes /></button>
            </div>

            <div className="flex flex-col items-center">
                <h2 className="text-4xl font-black italic text-white/20 uppercase tracking-[0.5em] mb-8">ShadowX</h2>

                {/* BOARD GRID - Clear Black/White lines */}
                <div className="w-[85vw] max-w-[340px] aspect-square grid grid-cols-3 gap-0 bg-white/20 border-4 border-white/20 rounded-2xl overflow-hidden shadow-2xl relative">
                    {board.map((val, i) => (
                        <button key={i} onClick={() => handleSquareClick(i)}
                            className={`border-[0.5px] border-white/20 flex items-center justify-center bg-[#014088] transition-all hover:bg-[#0250AA]
                                              ${winner && winner !== 'Draw' ? 'opacity-50' : ''}`}>
                            {val === 'X' && <FaTimes className="text-pink-500 text-5xl animate-in zoom-in-50 duration-200" />}
                            {val === 'O' && <FaRegCircle className="text-blue-400 text-5xl animate-in zoom-in-50 duration-200" />}
                        </button>
                    ))}

                    {winner && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <div className="text-white text-3xl font-black italic uppercase mb-6 tracking-widest scale-in-center">
                                {winner === 'Draw' ? "DRAW!" : winner === mySymbol ? "YOU WON!" : "AI WON!"}
                            </div>
                            <button onClick={() => setBoard(Array(9).fill(null)) || setWinner(null) || setIsMyTurn(true)}
                                className="px-8 py-3 bg-yellow-400 text-blue-900 font-black rounded-full shadow-xl active:scale-95 transition-all">
                                REPLAY
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PLAYER PILL BAR (Same as Ludo) */}
            <div className="w-full max-w-[340px] h-20 bg-[#003B75] rounded-3xl border-4 border-[#005ABF] flex items-center relative px-2 shadow-2xl">
                <div className={`flex-1 h-14 rounded-2xl flex items-center gap-3 px-3 transition-all ${isMyTurn ? 'bg-gradient-to-r from-pink-600 to-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-white/30' : 'opacity-30 grayscale'}`}>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <FaTimes className="text-pink-600 text-sm" />
                    </div>
                    <span className="text-white text-[14px] font-black italic uppercase tracking-tighter">You</span>
                </div>

                <div className="w-20 h-20 absolute left-1/2 -track-x-1/2 -translate-x-1/2 -top-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center text-white/20 animate-pulse">
                        <FaUndo size={24} />
                    </div>
                </div>

                <div className={`flex-1 h-14 rounded-2xl flex items-center justify-end gap-3 px-3 transition-all ${!isMyTurn && !winner ? 'bg-gradient-to-l from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-white/30' : 'opacity-30 grayscale'}`}>
                    <span className="text-white text-[14px] font-black italic uppercase tracking-tighter">Com</span>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <FaRegCircle className="text-blue-600 text-sm" />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scaleIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .scale-in-center { animation: scaleIn 0.3s ease-out forwards; }
            `}} />
        </div>
    );
};

export default ShadowXTicTacToe;
