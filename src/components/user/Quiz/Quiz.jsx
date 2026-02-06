import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import QuizLobby from "./QuizLobby";
import QuizGame from "./QuizGame";
import QuizResult from "./QuizResult";
import QuizWaiting from "./QuizWaiting";
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
            console.log("Quiz starting!", data);
            if (data?.questions && data.questions.length > 0) {
                setQuestions(data.questions);
            } else {
                // Fallback in case server didn't send them (e.g. older session)
                fetchQuestions();
            }
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
        if (rId) {
            console.log("Found roomId in URL:", rId);
            setRoomId(rId);
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

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/quiz/questions?limit=5");
            if (res.data.success) {
                setQuestions(res.data.questions);
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const handleCreateQuiz = (id, targetMob) => {
        setRoomId(id);
        setTargetMobile(targetMob);
        setIsHost(true);
        setGameState("WAITING");
        if (socket) {
            socket.emit("quiz-invite", {
                senderId: user?.user_id || user?.id,
                receiverMobile: targetMob,
                roomId: id
            });
            socket.emit("join-quiz", { roomId: id, userId: user?.user_id || user?.id });
        }
    };

    const handleJoinQuiz = (id) => {
        setRoomId(id);
        setIsHost(false);
        setGameState("WAITING");
        if (socket) {
            socket.emit("join-quiz", { roomId: id, userId: user?.user_id || user?.id });
        }
    };

    return (
        <div className="min-h-screen w-full py-12 px-4" style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
            {gameState === "LOBBY" && (
                <QuizLobby onCreateQuiz={handleCreateQuiz} onJoinQuiz={handleJoinQuiz} user={user} />
            )}
            {gameState === "WAITING" && (
                <QuizWaiting
                    roomId={roomId}
                    targetMobile={targetMobile}
                    status={waitingStatus}
                    onCancel={() => setGameState("LOBBY")}
                />
            )}
            {gameState === "GAME" && (
                <QuizGame
                    questions={questions}
                    socket={socket}
                    roomId={roomId}
                    user={user}
                    opponentProgress={opponentProgress}
                />
            )}
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
