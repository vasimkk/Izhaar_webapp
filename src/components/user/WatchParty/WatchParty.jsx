import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaLink, FaCopy, FaUsers, FaComments, FaPaperPlane, FaTimes } from "react-icons/fa";

const SOCKET_URL = "http://192.168.0.112:5000"; // Adjust if needed

const WatchParty = ({ user }) => {
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [url, setUrl] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const [playing, setPlaying] = useState(false);
    const [socket, setSocket] = useState(null);
    const playerRef = useRef(null); // Will hold the YT Player instance

    // Check if player is ready
    const [playerReady, setPlayerReady] = useState(false);

    // New State for Features
    const [inviteeMobile, setInviteeMobile] = useState("");
    const [roomDetails, setRoomDetails] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showInvitePopup, setShowInvitePopup] = useState(null); // { roomId, hostName }
    const messagesEndRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            query: { userId: user?._id || "anon" },
        });
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [user]);

    // Request Storage Access (Edge fix)
    useEffect(() => {
        if (document.requestStorageAccess) {
            document.requestStorageAccess()
                .then(() => console.log('[WatchParty] Storage access granted'))
                .catch((err) => console.log('[WatchParty] Storage access denied:', err));
        }
    }, []);

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [chatMessages]);

    // --- YouTube API Loader ---
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // --- Player Initialization / Update ---
    useEffect(() => {
        if (!url || !joined) return;

        const videoId = extractVideoId(url);
        if (!videoId) return;

        const initPlayer = () => {
            // Check if element exists (it should be the div we render)
            if (!document.getElementById('youtube-player')) return;

            // If player instance exists, just load video
            if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
                playerRef.current.loadVideoById(videoId);
                return;
            }

            // Create new player
            // 'youtube-player' div will be replaced by iframe
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 1, // User controls enabled
                    'modestbranding': 1,
                    'rel': 0,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

    }, [url, joined]);


    // --- Utils ---
    const extractVideoId = (input) => {
        if (!input) return null;
        try {
            // Robust regex for YT IDs
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = input.match(regex);
            if (match && match[1]) {
                return match[1];
            }
            return null;
        } catch (e) {
            return null;
        }
    };


    // --- Player Event Handlers ---

    const isRemoteUpdate = useRef(false);

    const onPlayerReady = (event) => {
        setPlayerReady(true);
        if (playing) {
            event.target.playVideo();
        }
    };

    const onPlayerStateChange = (event) => {
        // YT.PlayerState: 1 (playing), 2 (paused)
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        if (event.data === window.YT.PlayerState.PLAYING) {
            if (!playing) {
                setPlaying(true);
                socket?.emit("watch-party-action", { roomId, type: "play" });
            }
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            if (playing) {
                setPlaying(false);
                socket?.emit("watch-party-action", { roomId, type: "pause" });
            }
        }
    };


    // --- Socket Event Listeners ---
    useEffect(() => {
        if (!socket) return;

        socket.on("watch-party-action", ({ type, payload }) => {
            console.log(`📡 Received action: ${type}`, payload);

            isRemoteUpdate.current = true;

            switch (type) {
                case "url":
                    setUrl(payload);
                    setInputUrl(payload);
                    setPlaying(false);
                    setPlayerReady(false);
                    // Player will reload via effect observing 'url'
                    break;
                case "play":
                    setPlaying(true);
                    if (playerRef.current?.playVideo) playerRef.current.playVideo();
                    break;
                case "pause":
                    setPlaying(false);
                    if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo();
                    break;
                case "seek":
                    if (playerRef.current?.seekTo) playerRef.current.seekTo(payload, true);
                    break;
                default:
                    break;
            }
            // Clear flag safety
            setTimeout(() => { isRemoteUpdate.current = false; }, 500);
        });

        socket.on("watch-party-request-state", ({ requesterId, roomId: requestRoomId }) => {
            // Respond to state requests - send our current state even if player isn't fully ready
            if (url) {
                let currentTime = 0;
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    currentTime = playerRef.current.getCurrentTime();
                }
                const currentState = {
                    url,
                    playing,
                    time: currentTime
                };
                socket.emit("watch-party-sync-state", { roomId, state: currentState, targetId: requesterId });
                console.log(`📤 Sent sync state to ${requesterId}:`, currentState);
            }
        });

        // When someone joins, actively share our state with them
        socket.on("watch-party-user-joined", ({ userId, socketId }) => {
            console.log(`👤 User joined the room: ${userId}`);
            if (url) {
                let currentTime = 0;
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    currentTime = playerRef.current.getCurrentTime();
                }
                const currentState = {
                    url,
                    playing,
                    time: currentTime
                };
                socket.emit("watch-party-sync-state", { roomId, state: currentState, targetId: socketId });
            }
        });

        socket.on("watch-party-sync-state", ({ state, targetId }) => {
            if (!targetId || targetId === socket.id) {
                if (state.url && state.url !== url) {
                    setUrl(state.url);
                    setInputUrl(state.url);
                }

                if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                    const current = playerRef.current.getCurrentTime();
                    if (Math.abs(current - state.time) > 2) {
                        playerRef.current.seekTo(state.time, true);
                    }

                    if (state.playing) {
                        playerRef.current.playVideo();
                        setPlaying(true);
                    } else {
                        playerRef.current.pauseVideo();
                        setPlaying(false);
                    }
                }
            }
        });

        // Other listeners
        socket.on("watch-party-invite", (invite) => setShowInvitePopup(invite));
        socket.on("watch-party-details", (details) => {
            setRoomDetails(details);
            if (details.videoUrl && !url) {
                setUrl(details.videoUrl);
                setInputUrl(details.videoUrl);
            }
        });
        socket.on("watch-party-chat-message", (msg) => setChatMessages(prev => [...prev, msg]));
        socket.on("watch-party-created", (res) => {
            if (res.success) {
                setRoomId(res.roomId);
                socket.emit("join-watch-party", { roomId: res.roomId, userId: user?._id });
                setJoined(true);
            } else {
                alert("Failed to create party: " + res.error);
            }
        });

        return () => {
            socket.off("watch-party-action");
            socket.off("watch-party-request-state");
            socket.off("watch-party-sync-state");
            socket.off("watch-party-user-joined");
            socket.off("watch-party-invite");
            socket.off("watch-party-details");
            socket.off("watch-party-chat-message");
            socket.off("watch-party-created");
        };
    }, [socket, joined, roomId, url, playing, user]);

    // --- Local Handlers ---
    const handleJoin = () => {
        const trimmedRoomId = roomId.trim();
        if (trimmedRoomId && socket) {
            setRoomId(trimmedRoomId);
            socket.emit("join-watch-party", { roomId: trimmedRoomId, userId: user?._id });
            setJoined(true);
            setTimeout(() => {
                socket.emit("watch-party-request-state", { roomId: trimmedRoomId, requesterId: socket.id });
            }, 1000);
        }
    };

    const handleCreateParty = () => {
        if (!user) return alert("Please log in to create a party");
        const trimmedRoomId = roomId.trim();
        const id = trimmedRoomId || Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(id);

        // Check URL if provided
        let finalUrl = null;
        if (inputUrl) {
            const videoId = extractVideoId(inputUrl);
            if (videoId) {
                finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                setUrl(finalUrl);
                setInputUrl(finalUrl); // Clean input
            }
        }

        socket.emit("create-watch-party", {
            hostId: user._id || user.id,
            inviteeMobile,
            roomId: id,
            videoUrl: finalUrl
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedRoomId = roomId.trim();
        if (!messageInput.trim() || !user || !trimmedRoomId) return;
        socket.emit("watch-party-chat-message", {
            roomId: trimmedRoomId,
            senderId: user._id || user.id,
            senderName: user?.name || "Me",
            message: messageInput
        });
        setMessageInput("");
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (inputUrl && socket) {
            const videoId = extractVideoId(inputUrl);
            if (!videoId) return alert("Please enter a valid YouTube URL");

            const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
            setUrl(cleanUrl);
            socket.emit("watch-party-action", { roomId, type: "url", payload: cleanUrl });
        }
    };



    // Manual controls (optional, if native controls are hidden or user prefers them)
    const handlePlayBtn = () => playerRef.current?.playVideo();
    const handlePauseBtn = () => playerRef.current?.pauseVideo();

    const [activeTab, setActiveTab] = useState("join");

    return (
        <div className="flex flex-col h-full text-white relative">

            {/* Invite Popup */}
            {showInvitePopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
                        <div className="text-4xl">🎟️</div>
                        <h3 className="text-xl font-bold text-white">Watch Party Invite!</h3>
                        <p className="text-purple-200">
                            <span className="font-bold text-white">{showInvitePopup.hostName}</span> invited you to watch together!
                        </p>

                        {/* Room ID Display */}
                        <div className="bg-black/30 p-4 rounded-xl border border-purple-400/30">
                            <p className="text-xs text-purple-300 mb-2">Room ID</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-mono font-bold text-pink-400 tracking-wider">
                                    {showInvitePopup.roomId}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(showInvitePopup.roomId);
                                        alert("Room ID copied!");
                                    }}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                                    title="Copy Room ID"
                                >
                                    <FaCopy className="text-sm" />
                                </button>
                            </div>
                            <p className="text-xs text-purple-300 mt-2">You can join manually with this code</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowInvitePopup(null)} className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold">Decline</button>
                            <button onClick={() => {
                                setRoomId(showInvitePopup.roomId);
                                setShowInvitePopup(null);
                                setTimeout(() => {
                                    if (socket) {
                                        socket.emit("join-watch-party", { roomId: showInvitePopup.roomId, userId: user?._id });
                                        setJoined(true);
                                    }
                                }, 100);
                            }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition text-sm font-bold shadow-lg">Join Party</button>
                        </div>
                    </div>
                </div>
            )}

            {!joined ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Watch Party</h2>
                    <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl w-full max-w-md">
                        <div className="flex mb-6 bg-black/20 rounded-lg p-1">
                            <button className={`flex-1 py-2 rounded-md transition ${activeTab === "join" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`} onClick={() => setActiveTab("join")}>Join Party</button>
                            <button className={`flex-1 py-2 rounded-md transition ${activeTab === "create" ? "bg-pink-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`} onClick={() => { setActiveTab("create"); setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase()); }}>Create Party</button>
                        </div>
                        {activeTab === "join" ? (
                            <>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition mb-4"
                                    placeholder="Enter Room ID"
                                />
                                <button
                                    onClick={handleJoin}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
                                >
                                    Join Existing Room
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Video URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
                                        placeholder="Paste YouTube Link..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Friend's Mobile (Optional)</label>
                                    <input
                                        type="tel"
                                        value={inviteeMobile}
                                        onChange={(e) => setInviteeMobile(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setActiveTab("join");
                                            setRoomId("");
                                            setInviteeMobile("");
                                            setInputUrl("");
                                        }}
                                        className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-bold transition text-sm text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateParty}
                                        className="flex-[2] bg-gradient-to-r from-pink-500 to-rose-500 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
                                    >
                                        Start Party & Invite
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row h-full gap-4 p-4 md:p-6 overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg shrink-0"><FaUsers className="text-xl" /></div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg truncate">Room: {roomId}</h3>
                                    <p className="text-xs text-gray-400">{socket?.connected ? 'Live' : 'Offline'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { navigator.clipboard.writeText(roomId); alert("Copied!"); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"><FaCopy /></button>
                                <button onClick={() => { setJoined(false); setRoomId(""); setUrl(""); }} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition"><FaTimes /></button>
                            </div>
                        </div>

                        {/* URL Input - Only show if no video loaded */}
                        {!url ? (
                            <form onSubmit={handleUrlSubmit} className="flex gap-3 mb-4">
                                <input
                                    type="text"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Paste YouTube Link..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                                />
                                <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl font-bold transition text-sm">Load</button>
                            </form>
                        ) : (
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => {
                                        setUrl("");
                                        setInputUrl("");
                                    }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition border border-white/20"
                                >
                                    Change Video
                                </button>
                            </div>
                        )}

                        {/* Player Container */}
                        <div id="youtube-player-container" className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0" style={{ paddingTop: '56.25%' }}>
                            {/* The div below is replaced by the iframe */}
                            <div id="youtube-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>

                            {!url && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white/5 pointer-events-none">
                                    <FaPlay className="text-4xl mb-2 opacity-30" />
                                    <p>Load a video to start watching</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={playing ? handlePauseBtn : handlePlayBtn}
                                disabled={!url}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {playing ? <FaPause /> : <FaPlay />} {playing ? "Stop" : "Play"}
                            </button>
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="lg:w-80 flex flex-col gap-4 min-h-[400px]">
                        <div className="flex-1 bg-white/10 rounded-xl border border-white/10 flex flex-col overflow-hidden">
                            <div className="p-3 border-b border-white/10 bg-black/20 flex items-center gap-2"><FaComments className="text-purple-400" /><span className="font-bold text-sm">Live Chat</span></div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20">
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.senderId === user?._id ? "items-end" : "items-start"}`}>
                                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.senderId === user?._id ? "bg-purple-600 text-white rounded-br-none" : "bg-white/10 text-gray-200 rounded-bl-none"}`}>{msg.message}</div>
                                        <span className="text-[10px] text-gray-500 mt-1">{msg.senderName}</span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-3 bg-black/20 border-t border-white/10 flex gap-2">
                                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition" />
                                <button type="submit" className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"><FaPaperPlane size={14} /></button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchParty;
