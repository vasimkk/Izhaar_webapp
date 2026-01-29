

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaCopy, FaUsers, FaComments, FaPaperPlane, FaTimes, FaClock, FaVideo } from "react-icons/fa";
import { BASE_URL } from "../../../config/config";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import { useNavigate, useLocation } from "react-router-dom";

const SOCKET_URL = BASE_URL;

// Timer Component
function PartyTimer({ expiresAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiresAt - now;
            
            if (diff <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
                onExpire();
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const percentage = expiresAt ? ((timeLeft / (45 * 60 * 1000)) * 100) : 100;
    const isUrgent = minutes < 5;

    return (
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-xl p-4 border border-pink-500/30">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <FaClock className={`${isUrgent ? 'text-red-400 animate-pulse' : 'text-pink-400'}`} />
                    <span className="text-sm font-semibold text-white">Party Time Remaining</span>
                </div>
                <span className={`text-2xl font-bold font-mono ${isUrgent ? 'text-red-400' : 'text-pink-400'}`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                        isUrgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            
            {isUrgent && (
                <p className="text-xs text-red-400 mt-2 animate-pulse">⚠️ Party will auto-cancel soon!</p>
            )}
        </div>
    );
}

const WatchParty = () => {
    const userId = useUserId();
    const navigate = useNavigate();
    const location = useLocation();

    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [url, setUrl] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const [playing, setPlaying] = useState(false);
    const [socket, setSocket] = useState(null);
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const [inviteeMobile, setInviteeMobile] = useState("");
    const [roomDetails, setRoomDetails] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showInvitePopup, setShowInvitePopup] = useState(null);
    const messagesEndRef = useRef(null);

    // Timer states
    const [partyExpiresAt, setPartyExpiresAt] = useState(null);
    const [isWaitingForPartner, setIsWaitingForPartner] = useState(false);
    const [activeTab, setActiveTab] = useState("join");
    const [partnerJoined, setPartnerJoined] = useState(false);
    const [partyCancelled, setPartyCancelled] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isHost, setIsHost] = useState(false);
    const pendingSeekTimeRef = useRef(null);
    const [showPlayPrompt, setShowPlayPrompt] = useState(false);
    const [userName, setUserName] = useState("");
    const [partnerName, setPartnerName] = useState("");

    // Extract roomId from URL and auto-join
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlRoomId = params.get('roomId');
        
        if (urlRoomId) {
            setRoomId(urlRoomId.toUpperCase());
            // Auto-join will be triggered after socket is ready
        }
    }, [location]);

    // Initialize Socket
    useEffect(() => {
        if (!userId) return;
        
        const newSocket = io(SOCKET_URL, {
            query: { userId: userId },
        });
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [userId]);

    // Fetch current user's name
    useEffect(() => {
        async function fetchUserName() {
            if (!userId) return;
            try {
                const res = await api.get('/profile/me');
                const name = res.data.profile?.first_name || res.data.profile?.name || "User";
                setUserName(name);
            } catch (err) {
                console.error('Error fetching user name:', err);
                setUserName("User");
            }
        }
        fetchUserName();
    }, [userId]);

    // Auto-join when socket is ready and roomId is set from URL
    useEffect(() => {
        if (socket && roomId && !joined && userId) {
            const params = new URLSearchParams(location.search);
            const urlRoomId = params.get('roomId');
            
            if (urlRoomId && urlRoomId.toUpperCase() === roomId) {
                // Auto-join after a short delay to ensure socket is connected
                const timer = setTimeout(() => {
                    handleJoin();
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [socket, roomId, userId, location]);

    // Auto-cancel party when timer expires
    const handlePartyExpire = () => {
        alert("⏰ Party time expired! The watch party has been automatically cancelled.");
        handleLeaveParty();
    };

    const handleLeavePartyConfirm = () => {
        const confirmed = window.confirm("🚨 Are you sure you want to cancel the party?\n\nThis will end the party for both you and your partner.");
        if (confirmed) {
            handleLeaveParty("cancelled");
        }
    };



    const handleLeaveParty = (reason = "left") => {
        try { socket?.emit("watch-party-action", { roomId, type: "end", reason: reason }); } catch (_) {}
        try { playerRef.current?.pauseVideo?.(); } catch (_) {}
        setPlaying(false);
        setJoined(false);
        setPartnerJoined(false);
        setRoomId("");
        setUrl("");
        setChatMessages([]);
        setRoomDetails(null);
        setShowInvitePopup(null);
        setPartyExpiresAt(null);
        setIsWaitingForPartner(false);
    };

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

    // YouTube API Loader
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // Player Initialization
    useEffect(() => {
        if (!url || !joined) return;

        const videoId = extractVideoId(url);
        if (!videoId) return;

        const initPlayer = () => {
            if (!document.getElementById('youtube-player')) return;

            if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
                playerRef.current.loadVideoById(videoId);
                return;
            }

            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0, // Hide all native controls
                    'disablekb': 1, // Disable keyboard controls
                    'modestbranding': 1, // Hide YouTube logo
                    'rel': 0, // Don't show related videos
                    'fs': 0, // Disable fullscreen
                    'iv_load_policy': 3, // Hide annotations
                    'cc_load_policy': 0, // Hide captions
                    'autohide': 1, // Auto-hide controls
                    'showinfo': 0, // Hide video info
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

    const extractVideoId = (input) => {
        if (!input) return null;
        try {
            // Remove whitespace
            input = input.trim();
            
            // If it's already just a video ID (11 chars)
            if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
                return input;
            }
            
            // Try multiple patterns
            const patterns = [
                /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
                /([a-zA-Z0-9_-]{11})/  // Fallback: any 11-char sequence
            ];
            
            for (const pattern of patterns) {
                const match = input.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }
            
            return null;
        } catch (e) {
            console.error('Error extracting video ID:', e);
            return null;
        }
    };

    const isRemoteUpdate = useRef(false);

    const onPlayerReady = (event) => {
        setPlayerReady(true);
        setDuration(event.target.getDuration());
        if (pendingSeekTimeRef.current !== null) {
            event.target.seekTo(pendingSeekTimeRef.current, true);
            setCurrentTime(pendingSeekTimeRef.current);
            pendingSeekTimeRef.current = null;
        }
        if (playing) {
            event.target.playVideo();
        }
    };

    // Update current time periodically
    useEffect(() => {
        if (!playerRef.current || !playing) return;
        
        const interval = setInterval(() => {
            if (playerRef.current?.getCurrentTime && !isSeeking) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 100);
        
        return () => clearInterval(interval);
    }, [playing, isSeeking]);

    const onPlayerStateChange = (event) => {
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

    // Socket Event Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on("watch-party-action", ({ type, payload }) => {
            isRemoteUpdate.current = true;

            switch (type) {
                case "url":
                    setUrl(payload);
                    setInputUrl(payload);
                    setPlaying(false);
                    setPlayerReady(false);
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
                    if (playerRef.current?.seekTo) {
                        playerRef.current.seekTo(payload, true);
                        setCurrentTime(payload);
                    }
                    break;
                case "sync-state":
                    if (payload?.url) {
                        setUrl(payload.url);
                        setInputUrl(payload.url);
                    }
                    if (typeof payload?.currentTime === "number") {
                        pendingSeekTimeRef.current = payload.currentTime;
                        setCurrentTime(payload.currentTime);
                        if (playerRef.current?.seekTo) {
                            playerRef.current.seekTo(payload.currentTime, true);
                        }
                    }
                    if (typeof payload?.playing === "boolean") {
                        setPlaying(payload.playing);
                        if (payload.playing) {
                            // Mute first to allow autoplay on mobile
                            playerRef.current?.mute?.();
                            playerRef.current?.playVideo?.();
                            // Show prompt to unmute/enable sound
                            setShowPlayPrompt(true);
                            // Auto-hide prompt after 3 seconds if video plays
                            setTimeout(() => setShowPlayPrompt(false), 3000);
                        } else {
                            playerRef.current?.pauseVideo?.();
                            setShowPlayPrompt(false);
                        }
                    }
                    break;
                default:
                    break;
            }
            setTimeout(() => { isRemoteUpdate.current = false; }, 500);
        });

        socket.on("watch-party-user-joined", async ({ userId: joinedUserId }) => {
            setIsWaitingForPartner(false);
            setPartnerJoined(true);
            
            // Fetch partner's name
            try {
                const res = await api.get(`/profile/user/${joinedUserId}`);
                const name = res.data.profile?.first_name || res.data.profile?.name || "Friend";
                setPartnerName(name);
            } catch (err) {
                console.error('Error fetching partner name:', err);
                setPartnerName("Friend");
            }
            
            setChatMessages(prev => [...prev, {
                senderId: 'system',
                senderName: 'System',
                message: '🎉 Partner joined the party!',
                isSystem: true
            }]);
            if (isHost && roomId && url) {
                // Send current state to partner when they join
                // Host can then manually click play to start video for both
                socket.emit("watch-party-action", {
                    roomId,
                    type: "sync-state",
                    payload: {
                        url,
                        playing: playing, // Send current state, not forced to true
                        currentTime: playerRef.current?.getCurrentTime?.() ?? currentTime
                    }
                });
            }
        });

        socket.on("watch-party-invite", (invite) => {
            setShowInvitePopup(invite);
        });

        socket.on("watch-party-details", (details) => {
            setRoomDetails(details);
            if (details.videoUrl && !url) {
                setUrl(details.videoUrl);
                setInputUrl(details.videoUrl);
            }
            if (details?.hostId && userId) {
                setIsHost(details.hostId === userId);
            }
        });

        socket.on("watch-party-chat-message", (msg) => setChatMessages(prev => [...prev, msg]));

        socket.on("watch-party-created", (res) => {
            if (res.success) {
                setRoomId(res.roomId);
                socket.emit("join-watch-party", { roomId: res.roomId, userId: userId });
                setJoined(true);
                setIsWaitingForPartner(true);
                setPartyExpiresAt(Date.now() + (45 * 60 * 1000));
            } else {
                alert("Failed to create party: " + res.error);
            }
        });

        return () => {
            socket.off("watch-party-action");
            socket.off("watch-party-user-joined");
            socket.off("watch-party-invite");
            socket.off("watch-party-details");
            socket.off("watch-party-chat-message");
            socket.off("watch-party-created");
        };
    }, [socket, joined, roomId, url, playing, userId]);

    const handleJoin = () => {
        const trimmedRoomId = roomId.trim();
        if (trimmedRoomId && socket) {
            setRoomId(trimmedRoomId);
            socket.emit("join-watch-party", { roomId: trimmedRoomId, userId: userId });
            setJoined(true);
            setIsWaitingForPartner(false);
            setIsHost(false);
        }
    };

    const handleCreateParty = () => {
        if (!userId) return alert("Please log in to create a party");
        const trimmedRoomId = roomId.trim();
        const id = trimmedRoomId || Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(id);
        setIsHost(true);

        let finalUrl = null;
        if (inputUrl) {
            const videoId = extractVideoId(inputUrl);
            if (videoId) {
                finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
                setUrl(finalUrl);
                setInputUrl(finalUrl);
            }
        }

        socket.emit("create-watch-party", {
            hostId: userId,
            inviteeMobile,
            roomId: id,
            videoUrl: finalUrl
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedRoomId = roomId.trim();
        if (!messageInput.trim() || !userId || !trimmedRoomId) return;
        
        socket.emit("watch-party-chat-message", {
            roomId: trimmedRoomId,
            senderId: userId,
            senderName: userName || "User",
            message: messageInput
        });
        setMessageInput("");
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col min-h-screen text-white relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            <style>{`
                .seek-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ec4899, #a855f7);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.6);
                    transition: transform 0.2s;
                }
                .seek-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
                .seek-slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ec4899, #a855f7);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.6);
                    transition: transform 0.2s;
                }
                .seek-slider::-moz-range-thumb:hover {
                    transform: scale(1.2);
                }
            `}</style>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
{/* Mobile Back Button */}
      <button
        onClick={() => {
            if (joined) {
                handleLeavePartyConfirm();
            } else {
                navigate("/user/dashboard");
            }
        }}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(212, 197, 232, 0.3)',
          boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-[#2D1B4E]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

            {!joined ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 relative z-10">
                    {/* Hero Section */}
                    <div className="text-center mb-6 animate-fade-in">
                        <div className="inline-block mb-4">
                            <div className="relative">
                                <FaVideo className="text-7xl text-pink-400 animate-bounce" />
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                            Watch Party
                        </h2>
                        <p className="text-gray-300 text-xl">Watch together, laugh together! 🍿</p>
                    </div>

                    <div className="bg-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md border-2 border-white/20 shadow-2xl w-full max-w-lg">
                        <div className="flex mb-6 bg-black/30 rounded-xl p-1.5">
                            <button 
                                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-base ${
                                    activeTab === "join" 
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105" 
                                        : "text-gray-400 hover:text-white"
                                }`} 
                                onClick={() => setActiveTab("join")}
                            >
                                Join Party
                            </button>
                            <button 
                                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-base ${
                                    activeTab === "create" 
                                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105" 
                                        : "text-gray-400 hover:text-white"
                                }`} 
                                onClick={() => { setActiveTab("create"); setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase()); }}
                            >
                                Create Party
                            </button>
                        </div>

                        {activeTab === "join" ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-3 font-semibold">Room Code</label>
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                        className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-4 text-white text-center text-2xl font-mono font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition tracking-widest uppercase placeholder:text-gray-500"
                                        placeholder="ENTER CODE"
                                        maxLength={6}
                                    />
                                </div>
                                <button
                                    onClick={handleJoin}
                                    className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 transform hover:shadow-purple-500/50"
                                >
                                    🚀 Join the Fun!
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="flex text-sm text-gray-300 mb-3 font-semibold items-center gap-2">
                                        <FaVideo className="text-pink-400" />
                                        Video URL
                                    </label>
                                    <input
                                        type="text"
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500"
                                        placeholder="🎬 Paste YouTube Link..."
                                    />
                                </div>
                                <div>
                                    <label className="flex text-sm text-gray-300 mb-3 font-semibold items-center gap-2">
                                        <FaUsers className="text-purple-400" />
                                        Friend's Mobile 
                                    </label>
                                    <input
                                        type="tel"
                                        value={inviteeMobile}
                                        onChange={(e) => setInviteeMobile(e.target.value)}
                                        className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500"
                                        placeholder="📱9876543210"
                                    />
                                </div>

                                <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <FaClock className="text-pink-400 text-lg mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">⏰ 45 Minute Party</p>
                                            <p className="text-xs text-gray-300 leading-relaxed">Your friend has 45 minutes to join before the party auto-cancels!</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateParty}
                                    className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 transform hover:shadow-pink-500/50"
                                >
                                    🎉 Start Party & Invite
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-4 p-4 md:p-6 overflow-hidden relative z-10">
                    {/* Party Cancelled Screen */}
                    {partyCancelled && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                            <div className="text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {cancellationReason === "cancelled" ? "Party Cancelled" : "Party Ended"}
                                </h2>
                                <p className="text-gray-300 mb-6">The watch party has been ended. Redirecting...</p>
                                <div className="flex justify-center gap-2">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Waiting for Partner Banner */}
                    {isWaitingForPartner && !partnerJoined && (
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30 animate-pulse">
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm font-semibold text-white">Waiting for your friend to join...</span>
                                <div className="text-xl">⏳</div>
                            </div>
                        </div>
                    )}

                    {/* Timer Display - Only show when waiting for partner */}
                    {partyExpiresAt && isWaitingForPartner && !partnerJoined && (
                        <PartyTimer expiresAt={partyExpiresAt} onExpire={handlePartyExpire} />
                    )}

                    <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0">
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg">
                                        <FaUsers className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">Room: {roomId}</h3>
                                        <p className="text-xs text-gray-300 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                                            {socket?.connected ? 'Live' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { navigator.clipboard.writeText(roomId); alert("Room ID copied! Share with friends! 🎉"); }} 
                                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition hover:scale-110"
                                        title="Copy Room ID"
                                    >
                                        <FaCopy />
                                    </button>
                                    <button
                                        onClick={handleLeavePartyConfirm}
                                        className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition hover:scale-110"
                                        title="Cancel Party"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

{/* Player - Locked to prevent direct interaction */}
            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 flex-shrink-0" style={{ paddingTop: '56.25%' }}>
                {/* 🔥 Overlay to block all direct clicks on YouTube player - Only custom controls work */}
                <div className="absolute inset-0 bg-transparent z-10 cursor-default"></div>
                
                <div id="youtube-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></div>
                
                {/* Tap to Play/Unmute Prompt */}
                {showPlayPrompt && playing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-30">
                        <button
                            onClick={() => {
                                // Use actual player time (video has been playing muted in background)
                                const actualTime = playerRef.current?.getCurrentTime?.() ?? currentTime;
                                playerRef.current?.seekTo?.(actualTime, true);
                                playerRef.current?.unMute?.();
                                playerRef.current?.playVideo?.();
                                setShowPlayPrompt(false);
                            }}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold text-lg shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center gap-3 animate-bounce"
                        >
                            <FaPlay /> Tap to Play with Sound
                        </button>
                        <p className="text-xs text-gray-300 mt-3">Video is muted. Tap to enable sound.</p>
                    </div>
                )}
                
                {!url && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm z-20">
                        <FaPlay className="text-6xl mb-4 text-pink-400 animate-pulse" />
                        <p className="text-xl font-semibold">Ready to watch? 🎬</p>
                        <p className="text-sm text-gray-300 mt-2">Load a video to start the party!</p>
                    </div>
                )}
            </div>

                            {/* Video Progress Bar */}
                            {url && (
                                <div className="mt-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-xl p-4 border border-pink-500/30">
                                    <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 100}
                                            value={currentTime}
                                            onChange={(e) => {
                                                const newTime = parseFloat(e.target.value);
                                                setCurrentTime(newTime);
                                                setIsSeeking(true);
                                            }}
                                            onMouseUp={(e) => {
                                                const newTime = parseFloat(e.target.value);
                                                if (playerRef.current?.seekTo) {
                                                    playerRef.current.seekTo(newTime, true);
                                                }
                                                socket?.emit("watch-party-action", { roomId, type: "seek", payload: newTime });
                                                setIsSeeking(false);
                                            }}
                                            onTouchEnd={(e) => {
                                                const newTime = parseFloat(e.target.value);
                                                if (playerRef.current?.seekTo) {
                                                    playerRef.current.seekTo(newTime, true);
                                                }
                                                socket?.emit("watch-party-action", { roomId, type: "seek", payload: newTime });
                                                setIsSeeking(false);
                                            }}
                                            className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer seek-slider"
                                            style={{
                                                background: `linear-gradient(to right, #ec4899 0%, #a855f7 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 🔥 CUSTOM SYNCED CONTROLS */}
                            <div className="mt-4 flex justify-center gap-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        isRemoteUpdate.current = true;
                                        if (playing) {
                                            setPlaying(false);
                                            playerRef.current?.pauseVideo();
                                            socket?.emit("watch-party-action", { roomId, type: "pause" });
                                        } else {
                                            setPlaying(true);
                                            playerRef.current?.playVideo();
                                            socket?.emit("watch-party-action", { roomId, type: "play" });
                                        }
                                    }}
                                    disabled={!url}
                                    className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold text-lg shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    {playing ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
                                </button>
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="lg:w-80 flex flex-col min-h-[400px]">
                            <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-purple-500/30 flex flex-col overflow-hidden shadow-xl">
                                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center gap-3">
                                    <FaComments className="text-pink-400 text-xl" />
                                    <span className="font-bold">Live Chat</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
                                            {msg.isSystem ? (
                                                <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl text-sm text-center max-w-full">
                                                    {msg.message}
                                                </div>
                                            ) : (
                                                <>
                                                    <span className={`text-[11px] font-semibold mb-1 ${
                                                        msg.senderId === userId 
                                                            ? 'text-pink-400' 
                                                            : 'text-blue-400'
                                                    }`}>
                                                        {msg.senderName}
                                                    </span>
                                                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-lg ${
                                                        msg.senderId === userId 
                                                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none" 
                                                            : "bg-white/10 text-gray-200 rounded-bl-none backdrop-blur-md"
                                                    }`}>
                                                        {msg.message}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="p-3 bg-black/30 border-t border-white/10 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={messageInput} 
                                        onChange={(e) => setMessageInput(e.target.value)} 
                                        placeholder="Type a message..." 
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition" 
                                    />
                                    <button 
                                        type="submit" 
                                        className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:scale-110 transition shadow-lg"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchParty;