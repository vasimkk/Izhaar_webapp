import React, { useState, useEffect, useCallback } from "react";
import { FaDice, FaStar, FaBars, FaRedo, FaTimes, FaUndo } from "react-icons/fa";

const COLORS = {
    RED: "#FF1A1A",
    GREEN: "#00B33C",
    BLUE: "#0099FF",
    YELLOW: "#FFCC00",
    WHITE: "#FFFFFF",
    BOARD_BG: "linear-gradient(180deg, #1A4D8E 0%, #0D2647 100%)",
};

const SnakeLadders = ({ socket, roomId, user, gameMode, onCancel }) => {
    const [players, setPlayers] = useState([
        { id: 1, name: 'You', pos: 1, color: COLORS.BLUE },
        { id: 2, name: 'Com', pos: 1, color: COLORS.GREEN }
    ]);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [diceValue, setDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [turnStage, setTurnStage] = useState('ROLL');

    const snakes = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 };
    const ladders = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

    const playSound = (type) => {
        const urls = {
            roll: 'https://www.soundjay.com/misc/sounds/dice-roll-1.mp3',
            move: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
            snake: 'https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3',
            ladder: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
        };
        const audio = new Audio(urls[type]);
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const rollDice = useCallback(async () => {
        if (isRolling || turnStage !== 'ROLL') return;
        setIsRolling(true);
        playSound('roll');

        await new Promise(r => setTimeout(r, 800));
        const val = Math.floor(Math.random() * 6) + 1;
        setDiceValue(val);
        setIsRolling(false);
        setTurnStage('MOVE');

        const newPlayers = [...players];
        const p = newPlayers[currentPlayer];
        let nextPos = p.pos + val;

        if (nextPos > 100) {
            setTimeout(nextTurn, 1000);
            return;
        }

        p.pos = nextPos;
        setPlayers([...newPlayers]);
        playSound('move');

        setTimeout(() => {
            if (snakes[nextPos]) {
                p.pos = snakes[nextPos];
                setPlayers([...newPlayers]);
                playSound('snake');
            } else if (ladders[nextPos]) {
                p.pos = ladders[nextPos];
                setPlayers([...newPlayers]);
                playSound('ladder');
            }
            if (p.pos === 100) {
                alert(p.name + " Wins!");
                onCancel();
            } else {
                nextTurn();
            }
        }, 1000);
    }, [isRolling, turnStage, currentPlayer, players]);

    const nextTurn = () => {
        setCurrentPlayer(c => (c === 0 ? 1 : 0));
        setTurnStage('ROLL');
    };

    useEffect(() => {
        if (gameMode === 'SOLO' && currentPlayer === 1 && turnStage === 'ROLL' && !isRolling) {
            const timer = setTimeout(rollDice, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, turnStage, isRolling, gameMode, rollDice]);

    return (
        <div className="w-full min-h-screen relative flex flex-col items-center justify-between pb-12 pt-6 overflow-hidden"
            style={{ background: COLORS.BOARD_BG }}>

            {/* Header */}
            <div className="w-full max-w-sm px-6 flex justify-between items-center z-50">
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"><FaBars /></button>
                <div className="px-5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white tracking-widest">SNAKE ARENA</div>
                <button onClick={() => window.location.reload()} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"><FaTimes /></button>
            </div>

            <div className="relative w-[92vw] aspect-square max-w-[360px] bg-white rounded-xl border-4 border-[#083D75] overflow-hidden shadow-2xl">
                <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
                    {Array(100).fill(0).map((_, i) => {
                        const row = Math.floor((99 - i) / 10);
                        const col = (99 - i) % 10;
                        const actualCol = row % 2 !== 0 ? 9 - col : col;
                        const number = row * 10 + actualCol + 1;
                        const isEven = (row + actualCol) % 2 === 0;

                        return (
                            <div key={number} className={`relative border-[0.5px] border-black/20 flex items-center justify-center ${isEven ? 'bg-black/5' : 'bg-white'}`}>
                                <span className="text-[7px] text-black/20 absolute top-0.5 left-0.5 font-bold">{number}</span>

                                {players.map(p => p.pos === number && (
                                    <div key={p.id} className="w-4 h-4 rounded-full border border-white shadow-lg z-10 animate-bounce"
                                        style={{ backgroundColor: p.color }}></div>
                                ))}

                                {snakes[number] && <div className="absolute inset-0 flex items-center justify-center text-red-500/20 text-xs font-black">🐍</div>}
                                {ladders[number] && <div className="absolute inset-0 flex items-center justify-center text-green-500/20 text-xs font-black">🪜</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Control Bar */}
            <div className="w-full max-w-[340px] h-20 bg-[#003B75] rounded-3xl border-4 border-[#005ABF] flex items-center relative px-2 shadow-2xl">
                <div className={`flex-1 h-14 rounded-2xl flex items-center gap-3 px-3 transition-all ${currentPlayer === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400 border border-white/30 shadow-lg' : 'opacity-30'}`}>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 font-black text-blue-600 shadow-md text-[10px]">Y</div>
                    <span className="text-white text-xs font-black italic uppercase tracking-tighter">You</span>
                </div>

                <div className="absolute left-1/2 -track-x-1/2 -translate-x-1/2 -top-10">
                    <button onClick={rollDice} disabled={isRolling || turnStage !== 'ROLL' || (currentPlayer !== 0 && gameMode === 'SOLO')}
                        className={`w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center transition-all
                                          ${isRolling ? 'rotate-animation' : ''} ${turnStage === 'ROLL' ? 'animate-bounce' : 'grayscale'}`}>
                        {isRolling ? <FaDice className="text-white text-4xl" /> : <div className="text-white text-4xl font-black italic">{diceValue}</div>}
                    </button>
                </div>

                <div className={`flex-1 h-14 rounded-2xl flex items-center justify-end gap-3 px-3 transition-all ${currentPlayer === 1 ? 'bg-gradient-to-l from-green-600 to-green-400 border border-white/30 shadow-lg' : 'opacity-30'}`}>
                    <span className="text-white text-xs font-black italic uppercase tracking-tighter">Com</span>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 font-black text-green-600 shadow-md text-[10px]">C</div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .rotate-animation { animation: rot 0.3s linear infinite; }
            `}} />
        </div>
    );
};

export default SnakeLadders;
