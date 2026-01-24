// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { FaPlay, FaPause, FaLink, FaCopy, FaUsers, FaComments, FaPaperPlane, FaTimes, FaBell } from "react-icons/fa";
// import { BASE_URL } from "../../../config/config";
// import api from "../../../utils/api";
// import { useUserId } from "../../../hooks/useUserId";
// const SOCKET_URL = BASE_URL; // Adjust if needed

// // Watch Party Notification Badge Component
// function WatchPartyNotificationBadge({ notifCount, onClick, className = "" }) {
//     return (
//         <div className={`relative ${className}`}>
//             <button 
//                 onClick={onClick}
//                 className="relative hover:scale-110 transition-transform p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-500/20"
//                 title={`${notifCount} Watch Party Invitation${notifCount > 1 ? 's' : ''}`}
//             >
//                 <FaBell className="w-6 h-6 text-pink-400" />
//                 {notifCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg border-2 border-white/20 animate-pulse">
//                         {notifCount}
//                     </span>
//                 )}
//             </button>
//         </div>
//     );
// }

// const WatchParty = () => {
//     const userId = useUserId();
//     console.log("🔍 WatchParty mounted with userId:", userId);
    
//     const [roomId, setRoomId] = useState("");
//     const [joined, setJoined] = useState(false);
//     const [url, setUrl] = useState("");
//     const [inputUrl, setInputUrl] = useState("");
//     const [playing, setPlaying] = useState(false);
//     const [socket, setSocket] = useState(null);
//     const playerRef = useRef(null); // Will hold the YT Player instance

//     // Check if player is ready
//     const [playerReady, setPlayerReady] = useState(false);

//     // New State for Features
//     const [inviteeMobile, setInviteeMobile] = useState("");
//     const [roomDetails, setRoomDetails] = useState(null);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [messageInput, setMessageInput] = useState("");
//     const [showInvitePopup, setShowInvitePopup] = useState(null); // { roomId, hostName }
//     const [notifications, setNotifications] = useState([]);
//     const [loadingNotifications, setLoadingNotifications] = useState(false);
//     const messagesEndRef = useRef(null);

//     // Initialize Socket
//     useEffect(() => {
//         if (!userId) return;
        
//         const newSocket = io(SOCKET_URL, {
//             query: { userId: userId },
//         });
//         setSocket(newSocket);

//         return () => newSocket.disconnect();
//     }, [userId]);

//     // Fetch Watch Party Notifications from Backend
//     useEffect(() => {
//         if (!userId) return;
        
//         const fetchNotifications = async () => {
//             try {
//                 setLoadingNotifications(true);
//                 console.log("📡 Fetching notifications for user:", userId);
//                 const response = await api.get("/watch-party/notifications");
              
                
//                 if (response.data.success) {
//                     const notifData = response.data.data || [];
//                     console.log("📢 Raw Notification Data:", JSON.stringify(notifData, null, 2));
//                     console.log("📢 Notification Count:", notifData.length);
                    
//                     setNotifications(notifData);
                    
//                     if (notifData.length > 0) {
//                         console.log("✅ Notifications set in state, count:", notifData.length);
//                         notifData.forEach((n, idx) => {
//                             console.log(`  [${idx}] Notification:`, {
//                                 id: n._id || n.id,
//                                 type: n.type,
//                                 sender: n.sender_id || n.senderId,
//                                 roomId: n.data?.roomId || n.roomId,
//                                 title: n.title,
//                                 message: n.message,
//                                 fullData: n
//                             });
//                         });
//                     } else {
//                         console.log("⚠️ No notifications found in response");
//                     }
//                 } else {
//                     console.warn("❌ API returned success: false", response.data.message);
//                 }
//             } catch (err) {
//                 console.error("❌ Error fetching watch party notifications:", {
//                     message: err.message,
//                     status: err.response?.status,
//                     data: err.response?.data
//                 });
//             } finally {
//                 setLoadingNotifications(false);
//             }
//         };

//         if (userId) {
//             fetchNotifications();
//             // Refresh notifications every 30 seconds
//             const interval = setInterval(fetchNotifications, 30000);
//             return () => clearInterval(interval);
//         } else {
//             console.warn("⚠️ User ID not available, skipping notification fetch");
//         }
//     }, [userId]);

//     // Mark Notification as Read
//     const markNotificationAsRead = async (notificationId) => {
//         try {
//             await api.patch(`/watch-party/notifications/${notificationId}/read`);
//             // Remove from notifications or mark as read
//             setNotifications(prev => prev.filter(n => n._id !== notificationId));
//             console.log("✅ Notification marked as read:", notificationId);
//         } catch (err) {
//             console.error("❌ Error marking notification as read:", err);
//         }
//     };

//     // Request Storage Access (Edge fix)
//     useEffect(() => {
//         if (document.requestStorageAccess) {
//             document.requestStorageAccess()
//                 .then(() => console.log('[WatchParty] Storage access granted'))
//                 .catch((err) => console.log('[WatchParty] Storage access denied:', err));
//         }
//     }, []);

//     // Scroll to bottom of chat
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };
//     useEffect(scrollToBottom, [chatMessages]);

//     // --- YouTube API Loader ---
//     useEffect(() => {
//         if (!window.YT) {
//             const tag = document.createElement('script');
//             tag.src = "https://www.youtube.com/iframe_api";
//             const firstScriptTag = document.getElementsByTagName('script')[0];
//             firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//         }
//     }, []);

//     // --- Player Initialization / Update ---
//     useEffect(() => {
//         if (!url || !joined) return;

//         const videoId = extractVideoId(url);
//         if (!videoId) return;

//         const initPlayer = () => {
//             // Check if element exists (it should be the div we render)
//             if (!document.getElementById('youtube-player')) return;

//             // If player instance exists, just load video
//             if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
//                 playerRef.current.loadVideoById(videoId);
//                 return;
//             }

//             // Create new player
//             // 'youtube-player' div will be replaced by iframe
//             playerRef.current = new window.YT.Player('youtube-player', {
//                 height: '100%',
//                 width: '100%',
//                 videoId: videoId,
//                 playerVars: {
//                     'playsinline': 1,
//                     'controls': 1, // User controls enabled
//                     'modestbranding': 1,
//                     'rel': 0,
//                     'origin': window.location.origin
//                 },
//                 events: {
//                     'onReady': onPlayerReady,
//                     'onStateChange': onPlayerStateChange
//                 }
//             });
//         };

//         if (window.YT && window.YT.Player) {
//             initPlayer();
//         } else {
//             window.onYouTubeIframeAPIReady = initPlayer;
//         }

//     }, [url, joined]);


//     // --- Utils ---
//     const extractVideoId = (input) => {
//         if (!input) return null;
//         try {
//             // Robust regex for YT IDs
//             const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
//             const match = input.match(regex);
//             if (match && match[1]) {
//                 return match[1];
//             }
//             return null;
//         } catch (e) {
//             return null;
//         }
//     };


//     // --- Player Event Handlers ---

//     const isRemoteUpdate = useRef(false);

//     const onPlayerReady = (event) => {
//         setPlayerReady(true);
//         if (playing) {
//             event.target.playVideo();
//         }
//     };

//     const onPlayerStateChange = (event) => {
//         // YT.PlayerState: 1 (playing), 2 (paused)
//         if (isRemoteUpdate.current) {
//             isRemoteUpdate.current = false;
//             return;
//         }

//         if (event.data === window.YT.PlayerState.PLAYING) {
//             if (!playing) {
//                 setPlaying(true);
//                 socket?.emit("watch-party-action", { roomId, type: "play" });
//             }
//         } else if (event.data === window.YT.PlayerState.PAUSED) {
//             if (playing) {
//                 setPlaying(false);
//                 socket?.emit("watch-party-action", { roomId, type: "pause" });
//             }
//         }
//     };


//     // --- Socket Event Listeners ---
//     useEffect(() => {
//         if (!socket) return;

//         socket.on("watch-party-action", ({ type, payload }) => {
//             console.log(`📡 Received action: ${type}`, payload);

//             isRemoteUpdate.current = true;

//             switch (type) {
//                 case "url":
//                     setUrl(payload);
//                     setInputUrl(payload);
//                     setPlaying(false);
//                     setPlayerReady(false);
//                     // Player will reload via effect observing 'url'
//                     break;
//                 case "play":
//                     setPlaying(true);
//                     if (playerRef.current?.playVideo) playerRef.current.playVideo();
//                     break;
//                 case "pause":
//                     setPlaying(false);
//                     if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo();
//                     break;
//                 case "seek":
//                     if (playerRef.current?.seekTo) playerRef.current.seekTo(payload, true);
//                     break;
//                 case "end":
//                     // Another participant ended the party; exit for everyone
//                     try { playerRef.current?.pauseVideo?.(); } catch (_) {}
//                     setPlaying(false);
//                     setJoined(false);
//                     setRoomId("");
//                     setUrl("");
//                     setChatMessages([]);
//                     setRoomDetails(null);
//                     setShowInvitePopup(null);
//                     break;
//                 default:
//                     break;
//             }
//             // Clear flag safety
//             setTimeout(() => { isRemoteUpdate.current = false; }, 500);
//         });

//         socket.on("watch-party-request-state", ({ requesterId, roomId: requestRoomId }) => {
//             // Respond to state requests - send our current state even if player isn't fully ready
//             if (url) {
//                 let currentTime = 0;
//                 if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
//                     currentTime = playerRef.current.getCurrentTime();
//                 }
//                 const currentState = {
//                     url,
//                     playing,
//                     time: currentTime
//                 };
//                 socket.emit("watch-party-sync-state", { roomId, state: currentState, targetId: requesterId });
//                 console.log(`📤 Sent sync state to ${requesterId}:`, currentState);
//             }
//         });

//         // When someone joins, actively share our state with them
//         socket.on("watch-party-user-joined", ({ userId, socketId }) => {
//             console.log(`👤 User joined the room: ${userId}`);
//             if (url) {
//                 let currentTime = 0;
//                 if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
//                     currentTime = playerRef.current.getCurrentTime();
//                 }
//                 const currentState = {
//                     url,
//                     playing,
//                     time: currentTime
//                 };
//                 socket.emit("watch-party-sync-state", { roomId, state: currentState, targetId: socketId });
//             }
//         });

//         socket.on("watch-party-sync-state", ({ state, targetId }) => {
//             if (!targetId || targetId === socket.id) {
//                 if (state.url && state.url !== url) {
//                     setUrl(state.url);
//                     setInputUrl(state.url);
//                 }

//                 if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
//                     const current = playerRef.current.getCurrentTime();
//                     if (Math.abs(current - state.time) > 2) {
//                         playerRef.current.seekTo(state.time, true);
//                     }

//                     if (state.playing) {
//                         playerRef.current.playVideo();
//                         setPlaying(true);
//                     } else {
//                         playerRef.current.pauseVideo();
//                         setPlaying(false);
//                     }
//                 }
//             }
//         });

//         // Other listeners
//         socket.on("watch-party-invite", (invite) => {
//             setShowInvitePopup(invite);
//             console.log("📨 Watch Party Invite received:", invite);
//             // Mark notification as read when user sees invite
//             if (invite.notificationId) {
//                 markNotificationAsRead(invite.notificationId);
//             }
//         });
//         socket.on("watch-party-details", (details) => {
//             setRoomDetails(details);
//             if (details.videoUrl && !url) {
//                 setUrl(details.videoUrl);
//                 setInputUrl(details.videoUrl);
//             }
//         });
//         socket.on("watch-party-chat-message", (msg) => setChatMessages(prev => [...prev, msg]));
//         socket.on("watch-party-created", (res) => {
//             if (res.success) {
//                 setRoomId(res.roomId);
//                 socket.emit("join-watch-party", { roomId: res.roomId, userId: userId });
//                 setJoined(true);
//             } else {
//                 alert("Failed to create party: " + res.error);
//             }
//         });

//         return () => {
//             socket.off("watch-party-action");
//             socket.off("watch-party-request-state");
//             socket.off("watch-party-sync-state");
//             socket.off("watch-party-user-joined");
//             socket.off("watch-party-invite");
//             socket.off("watch-party-details");
//             socket.off("watch-party-chat-message");
//             socket.off("watch-party-created");
//         };
//     }, [socket, joined, roomId, url, playing, userId]);

//     // --- Local Handlers ---
//     const handleJoin = () => {
//         const trimmedRoomId = roomId.trim();
//         if (trimmedRoomId && socket) {
//             setRoomId(trimmedRoomId);
//             socket.emit("join-watch-party", { roomId: trimmedRoomId, userId: userId });
//             setJoined(true);
//             setTimeout(() => {
//                 socket.emit("watch-party-request-state", { roomId: trimmedRoomId, requesterId: socket.id });
//             }, 1000);
//         }
//     };

//     const handleCreateParty = () => {
//         if (!userId) return alert("Please log in to create a party");
//         const trimmedRoomId = roomId.trim();
//         const id = trimmedRoomId || Math.random().toString(36).substring(2, 8).toUpperCase();
//         setRoomId(id);

//         // Check URL if provided
//         let finalUrl = null;
//         if (inputUrl) {
//             const videoId = extractVideoId(inputUrl);
//             if (videoId) {
//                 finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
//                 setUrl(finalUrl);
//                 setInputUrl(finalUrl); // Clean input
//             }
//         }

//         socket.emit("create-watch-party", {
//             hostId: userId,
//             inviteeMobile,
//             roomId: id,
//             videoUrl: finalUrl
//         });
//     };

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         const trimmedRoomId = roomId.trim();
//         if (!messageInput.trim() || !userId || !trimmedRoomId) return;
//         socket.emit("watch-party-chat-message", {
//             roomId: trimmedRoomId,
//             senderId: userId,
//             senderName: "Me",
//             message: messageInput
//         });
//         setMessageInput("");
//     };

//     const handleUrlSubmit = (e) => {
//         e.preventDefault();
//         if (inputUrl && socket) {
//             const videoId = extractVideoId(inputUrl);
//             if (!videoId) return alert("Please enter a valid YouTube URL");

//             const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
//             setUrl(cleanUrl);
//             socket.emit("watch-party-action", { roomId, type: "url", payload: cleanUrl });
//         }
//     };



//     // Manual controls (optional, if native controls are hidden or user prefers them)
//     const handlePlayBtn = () => playerRef.current?.playVideo();
//     const handlePauseBtn = () => playerRef.current?.pauseVideo();

//     const [activeTab, setActiveTab] = useState("join");

//     // Display notification banner if there are pending notifications
//     const hasPendingNotifications = notifications.length > 0;
    
//     // State for notification dropdown
//     const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    
//     console.log("🎯 Render - Notifications state:", {
//         count: notifications.length,
//         hasPending: hasPendingNotifications,
//         joined: joined,
//         shouldShowBanner: hasPendingNotifications && !joined,
//         firstNotif: notifications[0]
//     });

//     return (
//         <div className="flex flex-col h-full text-white relative">

//             {/* Watch Party Notification Badge - Fixed Position */}
//             {!joined && (
//                 <div className="fixed top-4 right-4 z-50 mt-6">
//                     <WatchPartyNotificationBadge 
//                         notifCount={notifications.length}
//                         onClick={() => setShowNotifDropdown(!showNotifDropdown)}
//                     />
                    
//                     {/* Notification Dropdown */}
//                     {showNotifDropdown && notifications.length > 0 && (
//                         <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
//                             <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
//                                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
//                                     <FaBell className="text-pink-400" />
//                                     Watch Party Invites
//                                 </h3>
//                                 <button 
//                                     onClick={() => setShowNotifDropdown(false)}
//                                     className="text-gray-400 hover:text-white transition"
//                                 >
//                                     <FaTimes />
//                                 </button>
//                             </div>
                            
//                             <div className="space-y-2">
//                                 {notifications.map((notif, idx) => {
//                                     const roomIdValue = notif.roomId || notif.data?.roomId || (typeof notif.data === 'string' ? JSON.parse(notif.data).roomId : null);
//                                     const senderName = notif.senderName || notif.title || "Someone";
                                    
//                                     return (
//                                         <div 
//                                             key={notif._id || notif.id || idx}
//                                             className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition cursor-pointer"
//                                             onClick={() => {
//                                                 if (roomIdValue) {
//                                                     setRoomId(roomIdValue);
//                                                     markNotificationAsRead(notif._id || notif.id);
//                                                     setShowNotifDropdown(false);
//                                                     setTimeout(() => {
//                                                         if (socket) {
//                                                             socket.emit("join-watch-party", { roomId: roomIdValue, userId: userId });
//                                                             setJoined(true);
//                                                         }
//                                                     }, 100);
//                                                 }
//                                             }}
//                                         >
//                                             <div className="flex items-start gap-3 mt-10">
//                                                 <div className="text-2xl">🎟️</div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-sm font-semibold text-white truncate">{senderName}</p>
//                                                     <p className="text-xs text-purple-200 mb-2">{notif.message || "invited you to watch together"}</p>
//                                                     {roomIdValue && (
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-pink-300">
//                                                                 {roomIdValue}
//                                                             </span>
//                                                             <button
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     navigator.clipboard.writeText(roomIdValue);
//                                                                     alert("Room ID copied!");
//                                                                 }}
//                                                                 className="p-1 hover:bg-white/10 rounded transition"
//                                                             >
//                                                                 <FaCopy className="text-xs text-gray-400" />
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}

          

//             {/* Notifications Banner */}
//             {hasPendingNotifications && !joined && (
//                 <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-3 border-b border-pink-400/30 shadow-lg">
//                     <div className="flex items-center justify-between gap-3 flex-wrap">
//                         <div className="flex items-center gap-2">
//                             <div className="text-2xl animate-pulse">🎟️</div>
//                             <span className="text-sm font-semibold">You have {notifications.length} pending party invite{notifications.length > 1 ? 's' : ''}!</span>
//                         </div>
//                         <button
//                             onClick={() => {
//                                 if (notifications[0]) {
//                                     const notif = notifications[0];
//                                     // Try multiple possible roomId locations
//                                     const roomIdValue = notif.roomId || notif.data?.roomId || (typeof notif.data === 'string' ? JSON.parse(notif.data).roomId : null);
//                                     const notifId = notif._id || notif.id;
                                    
//                                     console.log("🎟️ Joining from notification:", { roomIdValue, notifId, notif });
                                    
//                                     if (roomIdValue) {
//                                         setRoomId(roomIdValue);
//                                         if (notifId) {
//                                             markNotificationAsRead(notifId);
//                                         }
//                                         setTimeout(() => {
//                                             if (socket) {
//                                                 socket.emit("join-watch-party", { roomId: roomIdValue, userId: userId });
//                                                 setJoined(true);
//                                             }
//                                         }, 100);
//                                     } else {
//                                         console.error("❌ No roomId found in notification");
//                                         alert("Invalid notification data");
//                                     }
//                                 }
//                             }}
//                             className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition"
//                         >
//                             Join Party
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Invite Popup */}
//             {showInvitePopup && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
//                     <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
//                         <div className="text-4xl">🎟️</div>
//                         <h3 className="text-xl font-bold text-white">Watch Party Invite!</h3>
//                         <p className="text-purple-200">
//                             <span className="font-bold text-white">{showInvitePopup.hostName}</span> invited you to watch together!
//                         </p>

//                         {/* Room ID Display */}
//                         <div className="bg-black/30 p-4 rounded-xl border border-purple-400/30">
//                             <p className="text-xs text-purple-300 mb-2">Room ID</p>
//                             <div className="flex items-center justify-center gap-2">
//                                 <span className="text-2xl font-mono font-bold text-pink-400 tracking-wider">
//                                     {showInvitePopup.roomId}
//                                 </span>
//                                 <button
//                                     onClick={() => {
//                                         navigator.clipboard.writeText(showInvitePopup.roomId);
//                                         alert("Room ID copied!");
//                                     }}
//                                     className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
//                                     title="Copy Room ID"
//                                 >
//                                     <FaCopy className="text-sm" />
//                                 </button>
//                             </div>
//                             <p className="text-xs text-purple-300 mt-2">You can join manually with this code</p>
//                         </div>

//                         <div className="flex gap-3 pt-2">
//                             <button onClick={() => setShowInvitePopup(null)} className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold">Decline</button>
//                             <button onClick={() => {
//                                 setRoomId(showInvitePopup.roomId);
//                                 setShowInvitePopup(null);
//                                 setTimeout(() => {
//                                     if (socket) {
//                                         socket.emit("join-watch-party", { roomId: showInvitePopup.roomId, userId: userId });
//                                         setJoined(true);
//                                     }
//                                 }, 100);
//                             }} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition text-sm font-bold shadow-lg">Join Party</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {!joined ? (
//                 <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
//                     <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Watch Party</h2>
//                     <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl w-full max-w-md">
//                         <div className="flex mb-6 bg-black/20 rounded-lg p-1">
//                             <button className={`flex-1 py-2 rounded-md transition ${activeTab === "join" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`} onClick={() => setActiveTab("join")}>Join Party</button>
//                             <button className={`flex-1 py-2 rounded-md transition ${activeTab === "create" ? "bg-pink-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`} onClick={() => { setActiveTab("create"); setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase()); }}>Create Party</button>
//                         </div>
//                         {activeTab === "join" ? (
//                             <>
//                                 <input
//                                     type="text"
//                                     value={roomId}
//                                     onChange={(e) => setRoomId(e.target.value)}
//                                     className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition mb-4"
//                                     placeholder="Enter Room ID"
//                                 />
//                                 <button
//                                     onClick={handleJoin}
//                                     className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
//                                 >
//                                     Join Existing Room
//                                 </button>
//                             </>
//                         ) : (
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm text-gray-300 mb-1">Video URL (Optional)</label>
//                                     <input
//                                         type="text"
//                                         value={inputUrl}
//                                         onChange={(e) => setInputUrl(e.target.value)}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
//                                         placeholder="Paste YouTube Link..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm text-gray-300 mb-1">Friend's Mobile (Optional)</label>
//                                     <input
//                                         type="tel"
//                                         value={inviteeMobile}
//                                         onChange={(e) => setInviteeMobile(e.target.value)}
//                                         className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
//                                         placeholder="e.g. 9876543210"
//                                     />
//                                 </div>

//                                 <div className="flex gap-2 pt-2">
//                                     <button
//                                         onClick={() => {
//                                             setActiveTab("join");
//                                             setRoomId("");
//                                             setInviteeMobile("");
//                                             setInputUrl("");
//                                         }}
//                                         className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-bold transition text-sm text-gray-300"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleCreateParty}
//                                         className="flex-[2] bg-gradient-to-r from-pink-500 to-rose-500 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
//                                     >
//                                         Start Party & Invite
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="flex flex-col lg:flex-row h-full gap-4 p-4 md:p-6 overflow-hidden">
//                     <div className="flex-1 flex flex-col min-w-0">
//                         {/* Header */}
//                         <div className="flex justify-between items-center mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
//                             <div className="flex items-center gap-3 overflow-hidden">
//                                 <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-2 rounded-lg shrink-0"><FaUsers className="text-xl" /></div>
//                                 <div className="min-w-0">
//                                     <h3 className="font-bold text-lg truncate">Room: {roomId}</h3>
//                                     <p className="text-xs text-gray-400">{socket?.connected ? 'Live' : 'Offline'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button onClick={() => { navigator.clipboard.writeText(roomId); alert("Copied!"); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"><FaCopy /></button>
//                                 <button
//                                     onClick={() => {
//                                         // Broadcast to room so all participants exit
//                                         try { socket?.emit("watch-party-action", { roomId, type: "end" }); } catch (_) {}
//                                         // Locally leave the party immediately
//                                         try { playerRef.current?.pauseVideo?.(); } catch (_) {}
//                                         setPlaying(false);
//                                         setJoined(false);
//                                         setRoomId("");
//                                         setUrl("");
//                                         setChatMessages([]);
//                                         setRoomDetails(null);
//                                         setShowInvitePopup(null);
//                                     }}
//                                     className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition"
//                                 >
//                                     <FaTimes />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Player Container */}
//                         <div id="youtube-player-container" className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0" style={{ paddingTop: '56.25%' }}>
//                             {/* The div below is replaced by the iframe */}
//                             <div id="youtube-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>

//                             {!url && (
//                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white/5 pointer-events-none">
//                                     <FaPlay className="text-4xl mb-2 opacity-30" />
//                                     <p>Load a video to start watching</p>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="mt-4 flex justify-center gap-4">
//                             <button
//                                 onClick={() => {
//                                     isRemoteUpdate.current = true;
//                                     if (playing) {
//                                         setPlaying(false);
//                                         playerRef.current?.pauseVideo();
//                                         socket?.emit("watch-party-action", { roomId, type: "pause" });
//                                     } else {
//                                         setPlaying(true);
//                                         playerRef.current?.playVideo();
//                                         socket?.emit("watch-party-action", { roomId, type: "play" });
//                                     }
//                                 }}
//                                 disabled={!url}
//                                 className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                             >
//                                 {playing ? <FaPause /> : <FaPlay />} {playing ? "Pause" : "Play"}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Chat */}
//                     <div className="lg:w-80 flex flex-col gap-4 min-h-[400px]">
//                         <div className="flex-1 bg-white/10 rounded-xl border border-white/10 flex flex-col overflow-hidden">
//                             <div className="p-3 border-b border-white/10 bg-black/20 flex items-center gap-2"><FaComments className="text-purple-400" /><span className="font-bold text-sm">Live Chat</span></div>
//                             <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20">
//                                 {chatMessages.map((msg, idx) => (
//                                     <div key={idx} className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
//                                         <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.senderId === userId ? "bg-purple-600 text-white rounded-br-none" : "bg-white/10 text-gray-200 rounded-bl-none"}`}>{msg.message}</div>
//                                         <span className="text-[10px] text-gray-500 mt-1">{msg.senderName}</span>
//                                     </div>
//                                 ))}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                             <form onSubmit={handleSendMessage} className="p-3 bg-black/20 border-t border-white/10 flex gap-2">
//                                 <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition" />
//                                 <button type="submit" className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"><FaPaperPlane size={14} /></button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WatchParty;
//New code_____
// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { FaPlay, FaPause, FaCopy, FaUsers, FaComments, FaPaperPlane, FaTimes, FaBell, FaClock, FaVideo } from "react-icons/fa";
// import { BASE_URL } from "../../../config/config";
// import api from "../../../utils/api";
// import { useUserId } from "../../../hooks/useUserId";

// const SOCKET_URL = BASE_URL;

// // Watch Party Notification Badge Component
// function WatchPartyNotificationBadge({ notifCount, onClick, className = "" }) {
//     return (
//         <div className={`relative ${className}`}>
//             <button 
//                 onClick={onClick}
//                 className="relative hover:scale-110 transition-transform p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-500/20"
//                 title={`${notifCount} Watch Party Invitation${notifCount > 1 ? 's' : ''}`}
//             >
//                 <FaBell className="w-6 h-6 text-pink-400" />
//                 {notifCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg border-2 border-white/20 animate-pulse">
//                         {notifCount}
//                     </span>
//                 )}
//             </button>
//         </div>
//     );
// }

// // Timer Component
// function PartyTimer({ expiresAt, onExpire }) {
//     const [timeLeft, setTimeLeft] = useState(0);

//     useEffect(() => {
//         if (!expiresAt) return;

//         const interval = setInterval(() => {
//             const now = Date.now();
//             const diff = expiresAt - now;
            
//             if (diff <= 0) {
//                 setTimeLeft(0);
//                 clearInterval(interval);
//                 onExpire();
//             } else {
//                 setTimeLeft(diff);
//             }
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [expiresAt, onExpire]);

//     const minutes = Math.floor(timeLeft / 60000);
//     const seconds = Math.floor((timeLeft % 60000) / 1000);
//     const percentage = expiresAt ? ((timeLeft / (45 * 60 * 1000)) * 100) : 100;
//     const isUrgent = minutes < 5;

//     return (
//         <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-xl p-4 border border-pink-500/30">
//             <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                     <FaClock className={`${isUrgent ? 'text-red-400 animate-pulse' : 'text-pink-400'}`} />
//                     <span className="text-sm font-semibold text-white">Party Time Remaining</span>
//                 </div>
//                 <span className={`text-2xl font-bold font-mono ${isUrgent ? 'text-red-400' : 'text-pink-400'}`}>
//                     {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
//                 </span>
//             </div>
            
//             {/* Progress Bar */}
//             <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
//                 <div 
//                     className={`h-full rounded-full transition-all duration-1000 ${
//                         isUrgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
//                     }`}
//                     style={{ width: `${percentage}%` }}
//                 />
//             </div>
            
//             {isUrgent && (
//                 <p className="text-xs text-red-400 mt-2 animate-pulse">⚠️ Party will auto-cancel soon!</p>
//             )}
//         </div>
//     );
// }

// const WatchParty = () => {
//     const userId = useUserId();
    
//     const [roomId, setRoomId] = useState("");
//     const [joined, setJoined] = useState(false);
//     const [url, setUrl] = useState("");
//     const [inputUrl, setInputUrl] = useState("");
//     const [playing, setPlaying] = useState(false);
//     const [socket, setSocket] = useState(null);
//     const playerRef = useRef(null);
//     const [playerReady, setPlayerReady] = useState(false);

//     const [inviteeMobile, setInviteeMobile] = useState("");
//     const [roomDetails, setRoomDetails] = useState(null);
//     const [chatMessages, setChatMessages] = useState([]);
//     const [messageInput, setMessageInput] = useState("");
//     const [showInvitePopup, setShowInvitePopup] = useState(null);
//     const [notifications, setNotifications] = useState([]);
//     const [loadingNotifications, setLoadingNotifications] = useState(false);
//     const messagesEndRef = useRef(null);

//     // Timer states
//     const [partyExpiresAt, setPartyExpiresAt] = useState(null);
//     const [isWaitingForPartner, setIsWaitingForPartner] = useState(false);
//     const [activeTab, setActiveTab] = useState("join");
//     const [showNotifDropdown, setShowNotifDropdown] = useState(false);

//     // Initialize Socket
//     useEffect(() => {
//         if (!userId) return;
        
//         const newSocket = io(SOCKET_URL, {
//             query: { userId: userId },
//         });
//         setSocket(newSocket);

//         return () => newSocket.disconnect();
//     }, [userId]);

//     // Fetch Watch Party Notifications
//     useEffect(() => {
//         if (!userId) return;
        
//         const fetchNotifications = async () => {
//             try {
//                 setLoadingNotifications(true);
//                 const response = await api.get("/watch-party/notifications");
                
//                 if (response.data.success) {
//                     const notifData = response.data.data || [];
//                     setNotifications(notifData);
//                 }
//             } catch (err) {
//                 console.error("❌ Error fetching notifications:", err);
//             } finally {
//                 setLoadingNotifications(false);
//             }
//         };

//         if (userId) {
//             fetchNotifications();
//             const interval = setInterval(fetchNotifications, 30000);
//             return () => clearInterval(interval);
//         }
//     }, [userId]);

//     // Mark Notification as Read
//     const markNotificationAsRead = async (notificationId) => {
//         try {
//             await api.patch(`/watch-party/notifications/${notificationId}/read`);
//             setNotifications(prev => prev.filter(n => n._id !== notificationId));
//         } catch (err) {
//             console.error("❌ Error marking notification as read:", err);
//         }
//     };

//     // Auto-cancel party when timer expires
//     const handlePartyExpire = () => {
//         alert("⏰ Party time expired! The watch party has been automatically cancelled.");
//         handleLeaveParty();
//     };

//     const handleLeaveParty = () => {
//         try { socket?.emit("watch-party-action", { roomId, type: "end" }); } catch (_) {}
//         try { playerRef.current?.pauseVideo?.(); } catch (_) {}
//         setPlaying(false);
//         setJoined(false);
//         setRoomId("");
//         setUrl("");
//         setChatMessages([]);
//         setRoomDetails(null);
//         setShowInvitePopup(null);
//         setPartyExpiresAt(null);
//         setIsWaitingForPartner(false);
//     };

//     // Request Storage Access (Edge fix)
//     useEffect(() => {
//         if (document.requestStorageAccess) {
//             document.requestStorageAccess()
//                 .then(() => console.log('[WatchParty] Storage access granted'))
//                 .catch((err) => console.log('[WatchParty] Storage access denied:', err));
//         }
//     }, []);

//     // Scroll to bottom of chat
//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };
//     useEffect(scrollToBottom, [chatMessages]);

//     // YouTube API Loader
//     useEffect(() => {
//         if (!window.YT) {
//             const tag = document.createElement('script');
//             tag.src = "https://www.youtube.com/iframe_api";
//             const firstScriptTag = document.getElementsByTagName('script')[0];
//             firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//         }
//     }, []);

//     // Player Initialization
//     useEffect(() => {
//         if (!url || !joined) return;

//         const videoId = extractVideoId(url);
//         if (!videoId) return;

//         const initPlayer = () => {
//             if (!document.getElementById('youtube-player')) return;

//             if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
//                 playerRef.current.loadVideoById(videoId);
//                 return;
//             }

//             playerRef.current = new window.YT.Player('youtube-player', {
//                 height: '100%',
//                 width: '100%',
//                 videoId: videoId,
//                 playerVars: {
//                     'playsinline': 1,
//                     'controls': 1,
//                     'modestbranding': 1,
//                     'rel': 0,
//                     'origin': window.location.origin
//                 },
//                 events: {
//                     'onReady': onPlayerReady,
//                     'onStateChange': onPlayerStateChange
//                 }
//             });
//         };

//         if (window.YT && window.YT.Player) {
//             initPlayer();
//         } else {
//             window.onYouTubeIframeAPIReady = initPlayer;
//         }
//     }, [url, joined]);

//     const extractVideoId = (input) => {
//         if (!input) return null;
//         try {
//             const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
//             const match = input.match(regex);
//             return match?.[1] || null;
//         } catch (e) {
//             return null;
//         }
//     };

//     const isRemoteUpdate = useRef(false);

//     const onPlayerReady = (event) => {
//         setPlayerReady(true);
//         if (playing) {
//             event.target.playVideo();
//         }
//     };

//     const onPlayerStateChange = (event) => {
//         if (isRemoteUpdate.current) {
//             isRemoteUpdate.current = false;
//             return;
//         }

//         if (event.data === window.YT.PlayerState.PLAYING) {
//             if (!playing) {
//                 setPlaying(true);
//                 socket?.emit("watch-party-action", { roomId, type: "play" });
//             }
//         } else if (event.data === window.YT.PlayerState.PAUSED) {
//             if (playing) {
//                 setPlaying(false);
//                 socket?.emit("watch-party-action", { roomId, type: "pause" });
//             }
//         }
//     };

//     // Socket Event Listeners
//     useEffect(() => {
//         if (!socket) return;

//         socket.on("watch-party-action", ({ type, payload }) => {
//             isRemoteUpdate.current = true;

//             switch (type) {
//                 case "url":
//                     setUrl(payload);
//                     setInputUrl(payload);
//                     setPlaying(false);
//                     setPlayerReady(false);
//                     break;
//                 case "play":
//                     setPlaying(true);
//                     if (playerRef.current?.playVideo) playerRef.current.playVideo();
//                     break;
//                 case "pause":
//                     setPlaying(false);
//                     if (playerRef.current?.pauseVideo) playerRef.current.pauseVideo();
//                     break;
//                 case "seek":
//                     if (playerRef.current?.seekTo) playerRef.current.seekTo(payload, true);
//                     break;
//                 case "end":
//                     handleLeaveParty();
//                     break;
//                 default:
//                     break;
//             }
//             setTimeout(() => { isRemoteUpdate.current = false; }, 500);
//         });

//         socket.on("watch-party-user-joined", ({ userId: joinedUserId }) => {
//             setIsWaitingForPartner(false);
//             setChatMessages(prev => [...prev, {
//                 senderId: 'system',
//                 senderName: 'System',
//                 message: '🎉 Partner joined the party!',
//                 isSystem: true
//             }]);
//         });

//         socket.on("watch-party-invite", (invite) => {
//             setShowInvitePopup(invite);
//             if (invite.notificationId) {
//                 markNotificationAsRead(invite.notificationId);
//             }
//         });

//         socket.on("watch-party-details", (details) => {
//             setRoomDetails(details);
//             if (details.videoUrl && !url) {
//                 setUrl(details.videoUrl);
//                 setInputUrl(details.videoUrl);
//             }
//         });

//         socket.on("watch-party-chat-message", (msg) => setChatMessages(prev => [...prev, msg]));

//         socket.on("watch-party-created", (res) => {
//             if (res.success) {
//                 setRoomId(res.roomId);
//                 socket.emit("join-watch-party", { roomId: res.roomId, userId: userId });
//                 setJoined(true);
//                 setIsWaitingForPartner(true);
//                 setPartyExpiresAt(Date.now() + (45 * 60 * 1000));
//             } else {
//                 alert("Failed to create party: " + res.error);
//             }
//         });

//         return () => {
//             socket.off("watch-party-action");
//             socket.off("watch-party-user-joined");
//             socket.off("watch-party-invite");
//             socket.off("watch-party-details");
//             socket.off("watch-party-chat-message");
//             socket.off("watch-party-created");
//         };
//     }, [socket, joined, roomId, url, playing, userId]);

//     const handleJoin = () => {
//         const trimmedRoomId = roomId.trim();
//         if (trimmedRoomId && socket) {
//             setRoomId(trimmedRoomId);
//             socket.emit("join-watch-party", { roomId: trimmedRoomId, userId: userId });
//             setJoined(true);
//             setIsWaitingForPartner(false);
//         }
//     };

//     const handleCreateParty = () => {
//         if (!userId) return alert("Please log in to create a party");
//         const trimmedRoomId = roomId.trim();
//         const id = trimmedRoomId || Math.random().toString(36).substring(2, 8).toUpperCase();
//         setRoomId(id);

//         let finalUrl = null;
//         if (inputUrl) {
//             const videoId = extractVideoId(inputUrl);
//             if (videoId) {
//                 finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
//                 setUrl(finalUrl);
//                 setInputUrl(finalUrl);
//             }
//         }

//         socket.emit("create-watch-party", {
//             hostId: userId,
//             inviteeMobile,
//             roomId: id,
//             videoUrl: finalUrl
//         });
//     };

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         const trimmedRoomId = roomId.trim();
//         if (!messageInput.trim() || !userId || !trimmedRoomId) return;
//         socket.emit("watch-party-chat-message", {
//             roomId: trimmedRoomId,
//             senderId: userId,
//             senderName: "Me",
//             message: messageInput
//         });
//         setMessageInput("");
//     };

//     return (
//         <div className="flex flex-col min-h-screen text-white relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
//             {/* Animated Background */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
//                 <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//             </div>

//             {/* Notification Badge */}
//             {!joined && (
//                 <div className="fixed top-6 right-6 z-50">
//                     <WatchPartyNotificationBadge 
//                         notifCount={notifications.length}
//                         onClick={() => setShowNotifDropdown(!showNotifDropdown)}
//                     />
                    
//                     {showNotifDropdown && notifications.length > 0 && (
//                         <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
//                             <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
//                                 <h3 className="text-sm font-bold text-white flex items-center gap-2">
//                                     <FaBell className="text-pink-400" />
//                                     Watch Party Invites
//                                 </h3>
//                                 <button 
//                                     onClick={() => setShowNotifDropdown(false)}
//                                     className="text-gray-400 hover:text-white transition"
//                                 >
//                                     <FaTimes />
//                                 </button>
//                             </div>
                            
//                             <div className="space-y-2">
//                                 {notifications.map((notif, idx) => {
//                                     const roomIdValue = notif.roomId || notif.data?.roomId;
//                                     const senderName = notif.senderName || notif.title || "Someone";
                                    
//                                     return (
//                                         <div 
//                                             key={notif._id || idx}
//                                             className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition cursor-pointer"
//                                             onClick={() => {
//                                                 if (roomIdValue) {
//                                                     setRoomId(roomIdValue);
//                                                     markNotificationAsRead(notif._id);
//                                                     setShowNotifDropdown(false);
//                                                     setTimeout(() => handleJoin(), 100);
//                                                 }
//                                             }}
//                                         >
//                                             <div className="flex items-start gap-3">
//                                                 <div className="text-2xl">🎟️</div>
//                                                 <div className="flex-1">
//                                                     <p className="text-sm font-semibold text-white">{senderName}</p>
//                                                     <p className="text-xs text-purple-200">{notif.message || "invited you"}</p>
//                                                     {roomIdValue && (
//                                                         <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-pink-300 mt-1 inline-block">
//                                                             {roomIdValue}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {!joined ? (
//                 <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 relative z-10">
//                     {/* Hero Section */}
//                     <div className="text-center mb-6 animate-fade-in">
//                         <div className="inline-block mb-4">
//                             <div className="relative">
//                                 <FaVideo className="text-7xl text-pink-400 animate-bounce" />
//                                 <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
//                             </div>
//                         </div>
//                         <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
//                             Watch Party
//                         </h2>
//                         <p className="text-gray-300 text-xl">Watch together, laugh together! 🍿</p>
//                     </div>

//                     <div className="bg-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md border-2 border-white/20 shadow-2xl w-full max-w-lg">
//                         <div className="flex mb-6 bg-black/30 rounded-xl p-1.5">
//                             <button 
//                                 className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-base ${
//                                     activeTab === "join" 
//                                         ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105" 
//                                         : "text-gray-400 hover:text-white"
//                                 }`} 
//                                 onClick={() => setActiveTab("join")}
//                             >
//                                 Join Party
//                             </button>
//                             <button 
//                                 className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 font-semibold text-base ${
//                                     activeTab === "create" 
//                                         ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105" 
//                                         : "text-gray-400 hover:text-white"
//                                 }`} 
//                                 onClick={() => { setActiveTab("create"); setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase()); }}
//                             >
//                                 Create Party
//                             </button>
//                         </div>

//                         {activeTab === "join" ? (
//                             <div className="space-y-5">
//                                 <div>
//                                     <label className="block text-sm text-gray-300 mb-3 font-semibold">Room Code</label>
//                                     <input
//                                         type="text"
//                                         value={roomId}
//                                         onChange={(e) => setRoomId(e.target.value.toUpperCase())}
//                                         className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-4 text-white text-center text-2xl font-mono font-bold focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition tracking-widest uppercase placeholder:text-gray-500"
//                                         placeholder="ENTER CODE"
//                                         maxLength={6}
//                                     />
//                                 </div>
//                                 <button
//                                     onClick={handleJoin}
//                                     className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 transform hover:shadow-purple-500/50"
//                                 >
//                                     🚀 Join the Fun!
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="space-y-5">
//                                 <div>
//                                     <label className="block text-sm text-gray-300 mb-3 font-semibold flex items-center gap-2">
//                                         <FaVideo className="text-pink-400" />
//                                         Video URL (Optional)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={inputUrl}
//                                         onChange={(e) => setInputUrl(e.target.value)}
//                                         className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500"
//                                         placeholder="🎬 Paste YouTube Link..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm text-gray-300 mb-3 font-semibold flex items-center gap-2">
//                                         <FaUsers className="text-purple-400" />
//                                         Friend's Mobile (Optional)
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         value={inviteeMobile}
//                                         onChange={(e) => setInviteeMobile(e.target.value)}
//                                         className="w-full bg-black/30 border-2 border-white/20 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition placeholder:text-gray-500"
//                                         placeholder="📱 9876543210"
//                                     />
//                                 </div>

//                                 <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4">
//                                     <div className="flex items-start gap-3">
//                                         <FaClock className="text-pink-400 text-lg mt-0.5 flex-shrink-0" />
//                                         <div>
//                                             <p className="text-sm font-bold text-white mb-1">⏰ 45 Minute Party</p>
//                                             <p className="text-xs text-gray-300 leading-relaxed">Your friend has 45 minutes to join before the party auto-cancels!</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={handleCreateParty}
//                                     className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 transform hover:shadow-pink-500/50"
//                                 >
//                                     🎉 Start Party & Invite
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="flex-1 flex flex-col gap-4 p-4 md:p-6 overflow-hidden relative z-10">
//                     {/* Waiting for Partner Banner */}
//                     {isWaitingForPartner && (
//                         <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30 animate-pulse">
//                             <div className="flex items-center justify-center gap-3">
//                                 <div className="flex gap-1">
//                                     <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
//                                     <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                                     <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                                 </div>
//                                 <span className="text-sm font-semibold text-white">Waiting for your friend to join...</span>
//                                 <div className="text-xl">⏳</div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Timer Display */}
//                     {partyExpiresAt && (
//                         <PartyTimer expiresAt={partyExpiresAt} onExpire={handlePartyExpire} />
//                     )}

//                     <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0">
//                         <div className="flex-1 flex flex-col min-w-0">
//                             {/* Header */}
//                             <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md p-4 rounded-xl border border-pink-500/30">
//                                 <div className="flex items-center gap-3">
//                                     <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg">
//                                         <FaUsers className="text-xl" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-xl">Room: {roomId}</h3>
//                                         <p className="text-xs text-gray-300 flex items-center gap-2">
//                                             <span className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
//                                             {socket?.connected ? 'Live' : 'Offline'}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button 
//                                         onClick={() => { navigator.clipboard.writeText(roomId); alert("Room ID copied! Share with friends! 🎉"); }} 
//                                         className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition hover:scale-110"
//                                         title="Copy Room ID"
//                                     >
//                                         <FaCopy />
//                                     </button>
//                                     <button
//                                         onClick={handleLeaveParty}
//                                         className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition hover:scale-110"
//                                         title="Leave Party"
//                                     >
//                                         <FaTimes />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Player */}
//                             <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 flex-shrink-0" style={{ paddingTop: '56.25%' }}>
//                                 <div id="youtube-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
//                                 {!url && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
//                                         <FaPlay className="text-6xl mb-4 text-pink-400 animate-pulse" />
//                                         <p className="text-xl font-semibold">Ready to watch? 🎬</p>
//                                         <p className="text-sm text-gray-300 mt-2">Load a video to start the party!</p>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="mt-4 flex justify-center gap-4">
//                                 <button
//                                     onClick={() => {
//                                         isRemoteUpdate.current = true;
//                                         if (playing) {
//                                             setPlaying(false);
//                                             playerRef.current?.pauseVideo();
//                                             socket?.emit("watch-party-action", { roomId, type: "pause" });
//                                         } else {
//                                             setPlaying(true);
//                                             playerRef.current?.playVideo();
//                                             socket?.emit("watch-party-action", { roomId, type: "play" });
//                                         }
//                                     }}
//                                     disabled={!url}
//                                     className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold text-lg shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
//                                 >
//                                     {playing ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Chat */}
//                         <div className="lg:w-80 flex flex-col min-h-[400px]">
//                             <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-purple-500/30 flex flex-col overflow-hidden shadow-xl">
//                                 <div className="p-4 border-b border-white/10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center gap-3">
//                                     <FaComments className="text-pink-400 text-xl" />
//                                     <span className="font-bold">Live Chat</span>
//                                 </div>
//                                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                                     {chatMessages.map((msg, idx) => (
//                                         <div key={idx} className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
//                                             {msg.isSystem ? (
//                                                 <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl text-sm text-center max-w-full">
//                                                     {msg.message}
//                                                 </div>
//                                             ) : (
//                                                 <>
//                                                     <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-lg ${
//                                                         msg.senderId === userId 
//                                                             ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none" 
//                                                             : "bg-white/10 text-gray-200 rounded-bl-none backdrop-blur-md"
//                                                     }`}>
//                                                         {msg.message}
//                                                     </div>
//                                                     <span className="text-[10px] text-gray-400 mt-1">{msg.senderName}</span>
//                                                 </>
//                                             )}
//                                         </div>
//                                     ))}
//                                     <div ref={messagesEndRef} />
//                                 </div>
//                                 <form onSubmit={handleSendMessage} className="p-3 bg-black/30 border-t border-white/10 flex gap-2">
//                                     <input 
//                                         type="text" 
//                                         value={messageInput} 
//                                         onChange={(e) => setMessageInput(e.target.value)} 
//                                         placeholder="Type a message..." 
//                                         className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition" 
//                                     />
//                                     <button 
//                                         type="submit" 
//                                         className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:scale-110 transition shadow-lg"
//                                     >
//                                         <FaPaperPlane />
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WatchParty;

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaCopy, FaUsers, FaComments, FaPaperPlane, FaTimes, FaBell, FaClock, FaVideo } from "react-icons/fa";
import { BASE_URL } from "../../../config/config";
import api from "../../../utils/api";
import { useUserId } from "../../../hooks/useUserId";
import { useNavigate } from "react-router-dom";

const SOCKET_URL = BASE_URL;

// Watch Party Notification Badge Component
function WatchPartyNotificationBadge({ notifCount, onClick, className = "" }) {
    
    return (
        <div className={`relative ${className}`}>
            <button 
                onClick={onClick}
                className="relative hover:scale-110 transition-transform p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30 hover:border-pink-500/60 hover:shadow-lg hover:shadow-pink-500/20"
                title={`${notifCount} Watch Party Invitation${notifCount > 1 ? 's' : ''}`}
            >
                <FaBell className="w-6 h-6 text-pink-400" />
                {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs font-bold z-10 shadow-lg border-2 border-white/20 animate-pulse">
                        {notifCount}
                    </span>
                )}
            </button>
        </div>
    );
}

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

    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [url, setUrl] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const [playing, setPlaying] = useState(false);
    const [socket, setSocket] = useState(null);
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);

    const [inviteeMobile, setInviteeMobile] = useState("");
    const [roomDetails, setRoomDetails] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [showInvitePopup, setShowInvitePopup] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const messagesEndRef = useRef(null);

    // Timer states
    const [partyExpiresAt, setPartyExpiresAt] = useState(null);
    const [isWaitingForPartner, setIsWaitingForPartner] = useState(false);
    const [activeTab, setActiveTab] = useState("join");
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // Initialize Socket
    useEffect(() => {
        if (!userId) return;
        
        const newSocket = io(SOCKET_URL, {
            query: { userId: userId },
        });
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [userId]);

    // Fetch Watch Party Notifications
    useEffect(() => {
        if (!userId) return;
        
        const fetchNotifications = async () => {
            try {
                setLoadingNotifications(true);
                const response = await api.get("/watch-party/notifications");
                
                if (response.data.success) {
                    const notifData = response.data.data || [];
                    setNotifications(notifData);
                }
            } catch (err) {
                console.error("❌ Error fetching notifications:", err);
            } finally {
                setLoadingNotifications(false);
            }
        };

        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    // Mark Notification as Read
    const markNotificationAsRead = async (notificationId) => {
        try {
            await api.patch(`/watch-party/notifications/${notificationId}/read`);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (err) {
            console.error("❌ Error marking notification as read:", err);
        }
    };

    // Auto-cancel party when timer expires
    const handlePartyExpire = () => {
        alert("⏰ Party time expired! The watch party has been automatically cancelled.");
        handleLeaveParty();
    };

    const handleLeaveParty = () => {
        try { socket?.emit("watch-party-action", { roomId, type: "end" }); } catch (_) {}
        try { playerRef.current?.pauseVideo?.(); } catch (_) {}
        setPlaying(false);
        setJoined(false);
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
                    'controls': 0, // 🔥 HIDE NATIVE CONTROLS - This prevents users from clicking YouTube play button
                    'disablekb': 1, // Disable keyboard controls
                    'modestbranding': 1,
                    'rel': 0,
                    'fs': 0, // Disable fullscreen button
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
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = input.match(regex);
            return match?.[1] || null;
        } catch (e) {
            return null;
        }
    };

    const isRemoteUpdate = useRef(false);

    const onPlayerReady = (event) => {
        setPlayerReady(true);
        if (playing) {
            event.target.playVideo();
        }
    };

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
                    if (playerRef.current?.seekTo) playerRef.current.seekTo(payload, true);
                    break;
                case "end":
                    handleLeaveParty();
                    break;
                default:
                    break;
            }
            setTimeout(() => { isRemoteUpdate.current = false; }, 500);
        });

        socket.on("watch-party-user-joined", ({ userId: joinedUserId }) => {
            setIsWaitingForPartner(false);
            setChatMessages(prev => [...prev, {
                senderId: 'system',
                senderName: 'System',
                message: '🎉 Partner joined the party!',
                isSystem: true
            }]);
        });

        socket.on("watch-party-invite", (invite) => {
            setShowInvitePopup(invite);
            if (invite.notificationId) {
                markNotificationAsRead(invite.notificationId);
            }
        });

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
        }
    };

    const handleCreateParty = () => {
        if (!userId) return alert("Please log in to create a party");
        const trimmedRoomId = roomId.trim();
        const id = trimmedRoomId || Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomId(id);

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
            senderName: "Me",
            message: messageInput
        });
        setMessageInput("");
    };

    return (
        <div className="flex flex-col min-h-screen text-white relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
{/* Mobile Back Button */}
      <button
        onClick={() => navigate("/user/dashboard")}
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
            {/* Notification Badge */}
            {!joined && (
                <div className="fixed top-6 right-6 z-50">
                    <WatchPartyNotificationBadge 
                        notifCount={notifications.length}
                        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    />
                    
                    {showNotifDropdown && notifications.length > 0 && (
                        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <FaBell className="text-pink-400" />
                                    Watch Party Invites
                                </h3>
                                <button 
                                    onClick={() => setShowNotifDropdown(false)}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                {notifications.map((notif, idx) => {
                                    const roomIdValue = notif.roomId || notif.data?.roomId;
                                    const senderName = notif.senderName || notif.title || "Someone";
                                    
                                    return (
                                        <div 
                                            key={notif._id || idx}
                                            className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition cursor-pointer"
                                            onClick={() => {
                                                if (roomIdValue) {
                                                    setRoomId(roomIdValue);
                                                    markNotificationAsRead(notif._id);
                                                    setShowNotifDropdown(false);
                                                    setTimeout(() => handleJoin(), 100);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="text-2xl">🎟️</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-white">{senderName}</p>
                                                    <p className="text-xs text-purple-200">{notif.message || "invited you"}</p>
                                                    {roomIdValue && (
                                                        <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-pink-300 mt-1 inline-block">
                                                            {roomIdValue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                                    <label className="block text-sm text-gray-300 mb-3 font-semibold flex items-center gap-2">
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
                                    <label className="block text-sm text-gray-300 mb-3 font-semibold flex items-center gap-2">
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
                    {/* Waiting for Partner Banner */}
                    {isWaitingForPartner && (
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

                    {/* Timer Display */}
                    {partyExpiresAt && (
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
                                        onClick={handleLeaveParty}
                                        className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition hover:scale-110"
                                        title="Leave Party"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* Player - Now with pointer-events-none to block direct clicks */}
                            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 flex-shrink-0" style={{ paddingTop: '56.25%' }}>
                                {/* 🔥 Overlay to prevent direct clicks on YouTube player */}
                                <div className="absolute inset-0 pointer-events-none z-10"></div>
                                
                                <div id="youtube-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                                {!url && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm z-20">
                                        <FaPlay className="text-6xl mb-4 text-pink-400 animate-pulse" />
                                        <p className="text-xl font-semibold">Ready to watch? 🎬</p>
                                        <p className="text-sm text-gray-300 mt-2">Load a video to start the party!</p>
                                    </div>
                                )}
                            </div>

                            {/* 🔥 CUSTOM SYNCED CONTROLS */}
                            <div className="mt-4 flex justify-center gap-4">
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
                                                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-lg ${
                                                        msg.senderId === userId 
                                                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none" 
                                                            : "bg-white/10 text-gray-200 rounded-bl-none backdrop-blur-md"
                                                    }`}>
                                                        {msg.message}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 mt-1">{msg.senderName}</span>
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