import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import QuizLobby from "./QuizLobby";
import QuizGame from "./QuizGame";
import QuizResult from "./QuizResult";
import QuizWaiting from "./QuizWaiting";
import ShadowXTicTacToe from "./ShadowXTicTacToe";
import Ludo from "./Ludo";
import SnakeLadders from "./SnakeLadders";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";

const Quiz = ({ user: propUser, socket: propSocket }) => {
    const userId = useUserId();
    const location = useLocation();
    const [user, setUser] = useState(propUser);
    const [socket, setSocket] = useState(propSocket);
    const [gameState, setGameState] = useState("LOBBY"); // LOBBY, WAITING, GAME, RESULT
    const [roomId, setRoomId] = useState("");
    const [targetMobile, setTargetMobile] = useState("");
    const [waitingStatus, setWaitingStatus] = useState("Sending invitation...");
    const [questions, setQuestions] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [opponentProgress, setOpponentProgress] = useState(null);
    const [finalResults, setFinalResults] = useState(null);
    const [gameMode, setGameMode] = useState("ONLINE"); // ONLINE, SOLO, LOCAL

    const [selectedGame, setSelectedGame] = useState(null); // TIC_TAC_TOE, LUDO, QUIZ, SNAKE
    const [opponentPersona, setOpponentPersona] = useState(null); // KABIR or ZARA

    // Fetch user if not provided
    useEffect(() => {
        if (!user && userId) {
            const fetchUser = async () => {
                try {
                    const res = await api.get("/profile/me");
                    setUser(res.data.profile || res.data);
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };
            fetchUser();
        }
    }, [userId, user]);

    // Setup socket and global listeners
    useEffect(() => {
        if (!userId) return;

        const newSocket = io(BASE_URL, {
            query: { userId: userId }
        });
        setSocket(newSocket);

        const handleStart = (data) => {
            console.log("Game starting!", data);
            if (data.gameType) setSelectedGame(data.gameType);
            setGameState("GAME");
        };

        const handleProgress = (progress) => {
            setOpponentProgress(progress);
        };

        const handleResults = (results) => {
            setFinalResults(results);
            setGameState("RESULT");
        };

        const handleInviteSent = (res) => {
            if (res.success) setWaitingStatus("Invitation sent! Awaiting response...");
        };

        const handleUserJoined = (data) => {
            setWaitingStatus("Rival connected! Starting battle...");
        };

        const handleQuizError = (err) => {
            alert(err.message || "An error occurred");
            setGameState("LOBBY");
        };

        newSocket.on("quiz-start", handleStart);
        newSocket.on("opponent-progress", handleProgress);
        newSocket.on("quiz-results", handleResults);
        newSocket.on("quiz-invite-sent", handleInviteSent);
        newSocket.on("user-joined-quiz", handleUserJoined);
        newSocket.on("quiz-error", handleQuizError);

        // Check for roomId in URL
        const params = new URLSearchParams(location.search);
        const rId = params.get("roomId");
        const gType = params.get("game");
        if (rId) {
            console.log("Found roomId in URL:", rId);
            setRoomId(rId);
            if (gType) setSelectedGame(gType);
            setIsHost(false);
            setGameState("WAITING");
            newSocket.emit("join-quiz", { roomId: rId, userId: userId });
        }

        return () => {
            newSocket.off("quiz-start", handleStart);
            newSocket.off("opponent-progress", handleProgress);
            newSocket.off("quiz-results", handleResults);
            newSocket.off("quiz-invite-sent", handleInviteSent);
            newSocket.off("user-joined-quiz", handleUserJoined);
            newSocket.off("quiz-error", handleQuizError);
            newSocket.disconnect();
        };
    }, [userId]);

    const handleCreateQuiz = (id, targetMob, gameType) => {
        setRoomId(id);
        setTargetMobile(targetMob);
        setSelectedGame(gameType);
        setIsHost(true);
        setGameMode("ONLINE");
        setGameState("WAITING");
        if (socket) {
            socket.emit("quiz-invite", {
                senderId: user?.user_id || user?.id,
                receiverMobile: targetMob,
                roomId: id,
                gameType: gameType
            });
            socket.emit("join-quiz", { roomId: id, userId: user?.user_id || user?.id, gameType: gameType });
        }
    };

    const handleJoinQuiz = (id) => {
        setRoomId(id);
        setIsHost(false);
        setGameMode("ONLINE");
        setGameState("WAITING");
        if (socket) {
            socket.emit("join-quiz", { roomId: id, userId: user?.user_id || user?.id });
        }
    };

    const handleSoloPlay = (gameType, persona = 'KABIR') => {
        setSelectedGame(gameType);
        setOpponentPersona(persona);
        setGameMode("SOLO");
        setGameState("GAME");
    };

    const handleLocalPlay = (gameType) => {
        setSelectedGame(gameType);
        setGameMode("LOCAL");
        setGameState("GAME");
    };

    const renderGame = () => {
        switch (selectedGame) {
            case "TIC_TAC_TOE":
                return (
                    <ShadowXTicTacToe
                        socket={socket}
                        roomId={roomId}
                        user={user}
                        opponentProgress={opponentProgress}
                        gameMode={gameMode}
                        opponentPersona={opponentPersona}
                        onCancel={() => setGameState("LOBBY")}
                    />
                );
            case "QUIZ":
                return (
                    <QuizGame
                        questions={questions}
                        socket={socket}
                        roomId={roomId}
                        user={user}
                        opponentProgress={opponentProgress}
                        gameMode={gameMode}
                        opponentPersona={opponentPersona}
                        onCancel={() => setGameState("LOBBY")}
                    />
                );
            case "LUDO":
                return (
                    <Ludo
                        socket={socket}
                        roomId={roomId}
                        user={user}
                        gameMode={gameMode}
                        opponentPersona={opponentPersona}
                        onCancel={() => setGameState("LOBBY")}
                    />
                );
            case "SNAKE":
                return (
                    <SnakeLadders
                        socket={socket}
                        roomId={roomId}
                        user={user}
                        gameMode={gameMode}
                        opponentPersona={opponentPersona}
                        onCancel={() => setGameState("LOBBY")}
                    />
                );
            default:
                return <ShadowXTicTacToe socket={socket} roomId={roomId} user={user} gameMode={gameMode} />;
        }
    };

    return (
        <div className="min-h-screen w-full" style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
            {gameState === "LOBBY" && (
                <QuizLobby
                    onCreateQuiz={handleCreateQuiz}
                    onJoinQuiz={handleJoinQuiz}
                    onSoloPlay={handleSoloPlay}
                    onLocalPlay={handleLocalPlay}
                    user={user}
                />
            )}
            {gameState === "WAITING" && (
                <QuizWaiting
                    roomId={roomId}
                    targetMobile={targetMobile}
                    status={waitingStatus}
                    onCancel={() => setGameState("LOBBY")}
                />
            )}
            {gameState === "GAME" && renderGame()}
            {gameState === "RESULT" && (
                <QuizResult
                    results={finalResults}
                    user={user}
                    isHost={isHost}
                    onBack={() => setGameState("LOBBY")}
                />
            )}
        </div>
    );
};

export default Quiz;
