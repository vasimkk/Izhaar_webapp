import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../../../config/config";
import QuizLobby from "./QuizLobby";
import QuizGame from "./QuizGame";
import QuizResult from "./QuizResult";
import api from "../../../utils/api";

const Quiz = ({ user, socket }) => {
    const [gameState, setGameState] = useState("LOBBY"); // LOBBY, GAME, RESULT
    const [roomId, setRoomId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [opponentProgress, setOpponentProgress] = useState(null);
    const [finalResults, setFinalResults] = useState(null);

    useEffect(() => {
        if (!socket) return;

        const handleStart = () => {
            setGameState("GAME");
            fetchQuestions();
        };

        const handleProgress = (progress) => {
            setOpponentProgress(progress);
        };

        const handleResults = (results) => {
            setFinalResults(results);
            setGameState("RESULT");
        };

        socket.on("quiz-start", handleStart);
        socket.on("opponent-progress", handleProgress);
        socket.on("quiz-results", handleResults);

        return () => {
            socket.off("quiz-start", handleStart);
            socket.off("opponent-progress", handleProgress);
            socket.off("quiz-results", handleResults);
        };
    }, [socket]);

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

    const handleCreateQuiz = (id, targetMobile) => {
        setRoomId(id);
        setIsHost(true);
        socket.emit("quiz-invite", {
            senderId: user?.user_id || user?.id,
            receiverMobile: targetMobile,
            roomId: id
        });
        socket.emit("join-quiz", { roomId: id, userId: user?.user_id || user?.id });
    };

    return (
        <div className="h-full w-full py-6">
            {gameState === "LOBBY" && (
                <QuizLobby onCreateQuiz={handleCreateQuiz} user={user} />
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
