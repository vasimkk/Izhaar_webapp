
import { useState, useRef, useEffect } from 'react';
import api from '../../../utils/api';
import profileImg from '../../../assets/images/profile.png';
import { getAIChatSuggestions, getConversationStarters, generateAiReply } from '../../../utils/aiSuggestionService';
import { FaArrowLeft, FaVideo, FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaPhoneSlash, FaExpandAlt, FaCompressAlt, FaPhone, FaPlus, FaImage, FaFileAlt, FaVideo as FaVideoIcon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

// Debounce helper function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

function ChatRoomView({ selectedChat, setSelectedChat, messages, messagesLoading, renderMessageItem, newMessage, setNewMessage, sending, handleSendMessage, currentUserId, participants, chats, setParticipants, showMenu, setShowMenu, handleRevealIdentity, izhaarStatuses, getIzhaarCode, socket, onlineUsers, pendingFile, setPendingFile, handleFileUpload }) {
    const navigate = useNavigate();
    const [isTyping, setIsTyping] = useState(false);
    const [typingUserId, setTypingUserId] = useState(null);
    const typingTimeoutRef = useRef(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);
    const [blockType, setBlockType] = useState(null); // 'blockedByMe' | 'blockedMe' | null
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiSuggestionsLoading, setAiSuggestionsLoading] = useState(false);
    const [generatingReply, setGeneratingReply] = useState(null); // Track which message is generating reply
    const suggestionTimeoutRef = useRef(null);
    const debouncedGetSuggestionsRef = useRef(null);

    // --- Video Call State (Ported from WatchParty) ---
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [callType, setCallType] = useState(null); // 'video' | 'voice'

    const isCallActiveRef = useRef(false);
    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const iceCandidatesQueue = useRef([]);

    useEffect(() => {
        isCallActiveRef.current = isCallActive;
    }, [isCallActive]);

    const rtcConfig = useMemo(() => ({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" }
        ]
    }), []);

    // Draggable position for video
    const [videoPos, setVideoPos] = useState({ x: 20, y: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const handleDragStart = (e) => {
        if (e.target.closest('button')) return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - videoPos.x,
            y: e.clientY - videoPos.y
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        setVideoPos({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const createPeerConnection = useCallback((stream) => {
        if (peerConnectionRef.current) return;
        const pc = new RTCPeerConnection(rtcConfig);
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit("watch-party-signal", {
                    roomId: selectedChat.chatRoomId,
                    type: "ice-candidate",
                    payload: event.candidate
                });
            }
        };
    }, [selectedChat, socket, rtcConfig]);

    const startCall = async (type = 'video') => {
        if (isCallActive) return;
        try {
            const constraints = type === 'video' ? { video: true, audio: true } : { video: false, audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMyStream(stream);
            setCallType(type);
            setIsMicOn(true);
            setIsCameraOn(type === 'video');
            setIsCallActive(true);
            createPeerConnection(stream);

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            socket?.emit("watch-party-signal", {
                roomId: selectedChat.chatRoomId,
                type: "offer",
                payload: offer,
                callType: type
            });
        } catch (err) {
            alert(`Could not start ${type} call. Please ensure permissions are granted.`);
        }
    };

    const acceptCall = async () => {
        if (!incomingCall) return;
        try {
            const type = incomingCall.callType || 'video';
            const constraints = type === 'video' ? { video: true, audio: true } : { video: false, audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMyStream(stream);
            setCallType(type);
            setIsMicOn(true);
            setIsCameraOn(type === 'video');
            setIsCallActive(true);
            createPeerConnection(stream);

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.payload));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket?.emit("watch-party-signal", {
                roomId: selectedChat.chatRoomId,
                type: "answer",
                payload: answer,
                targetId: incomingCall.senderId
            });

            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
            setIncomingCall(null);
        } catch (err) {
            console.error("Error accepting call:", err);
        }
    };

    const endCall = () => {
        if (myStream) {
            myStream.getTracks().forEach(track => track.stop());
            setMyStream(null);
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        setIsCallActive(false);
        setIncomingCall(null);
        setCallType(null);
        socket?.emit("watch-party-signal", { roomId: selectedChat.chatRoomId, type: "end-call" });
    };

    const handleSignal = useCallback(async ({ type, payload, senderId, callType: sigCallType }) => {
        if (!isCallActiveRef.current && type === "offer") {
            setIncomingCall({ payload, senderId, callType: sigCallType });
            return;
        }
        if (!peerConnectionRef.current) return;

        if (type === "answer") {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload));
            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } else if (type === "ice-candidate") {
            if (peerConnectionRef.current.remoteDescription) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload));
            } else {
                iceCandidatesQueue.current.push(payload);
            }
        } else if (type === "end-call") {
            endCall();
        }
    }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;
        socket.on("watch-party-signal", handleSignal);
        return () => socket.off("watch-party-signal", handleSignal);
    }, [socket, handleSignal]);

    useEffect(() => {
        if (myVideoRef.current && myStream) myVideoRef.current.srcObject = myStream;
    }, [isCallActive, myStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
    }, [isCallActive, remoteStream]);
    // Check if user is blocked on mount or when chat changes
    useEffect(() => {
        const checkBlocked = async () => {
            if (!participants || !currentUserId) return;
            const chatPartnerId = selectedChat.senderId === currentUserId ? participants.receiver?.id : participants.sender?.id;
            if (!chatPartnerId) return;
            try {
                // Use backend response: { blocked, blocker, blockedUser }
                const res = await api.post('/block-user/check', {
                    userA: currentUserId,
                    userB: chatPartnerId
                });
                console.log('[BlockCheck] API response:', res.data, 'currentUserId:', currentUserId, 'chatPartnerId:', chatPartnerId);
                if (res.data?.blocked) {
                    setIsBlocked(true);
                    if (res.data.blocker == currentUserId) {
                        setBlockType('blockedByMe');
                        console.log('[BlockCheck] You have blocked this user.');
                    } else if (res.data.blocker == chatPartnerId) {
                        setBlockType('blockedMe');
                        console.log('[BlockCheck] You are blocked by this user.');
                    } else {
                        setBlockType(null);
                        console.log('[BlockCheck] Blocked, but unknown who blocked whom.');
                    }
                } else {
                    setIsBlocked(false);
                    setBlockType(null);
                    console.log('[BlockCheck] No block between users.');
                }
            } catch (err) {
                setIsBlocked(false);
                setBlockType(null);
                console.error('[BlockCheck] Error checking block:', err);
            }
        };
        checkBlocked();
    }, [participants, currentUserId, selectedChat]);

    // Block user handler
    const handleBlockUser = async () => {
        if (!participants || !currentUserId) return;
        const chatPartnerId = selectedChat.senderId === currentUserId ? participants.receiver?.id : participants.sender?.id;
        if (!chatPartnerId) return;
        setBlockLoading(true);
        try {
            await api.post('/block-user', {
                blockerId: currentUserId,
                blockedId: chatPartnerId
            });
            setIsBlocked(true);
            setShowMenu(false);
            alert('User blocked successfully.');
        } catch (err) {
            if (err.response?.status === 409) {
                alert('User already blocked.');
            } else {
                alert('Failed to block user.');
            }
        } finally {
            setBlockLoading(false);
        }
    };
    // Determine chat partner info
    let chatPartner = null;
    let chatPartnerName = '';
    let chatPartnerAvatar = null;
    let chatPartnerStatus = '';
    // For block message: who is the blocker?
    let blockerName = '';

    if (participants) {
        if (selectedChat.senderId === currentUserId) {
            // Sender: show receiver info
            chatPartner = participants.receiver;
            chatPartnerAvatar = participants.receiver?.profile_photo || null;
            chatPartnerName = participants.receiver?.name || 'Anonymous';
        } else {
            // Receiver: show sender info (if revealed)
            const code = getIzhaarCode(selectedChat);
            const izhaarStatus = izhaarStatuses ? izhaarStatuses[code] : null;
            if (izhaarStatus?.sender_revealed) {
                chatPartner = participants.sender;
                chatPartnerName = izhaarStatus.sender_name || participants.sender?.name || 'Anonymous';
                chatPartnerAvatar = participants.sender?.profile_photo || null;
            } else {
                chatPartner = null;
                chatPartnerName = 'Anonymous';
                chatPartnerAvatar = null;
            }
        }
        // Blocker name logic
        if (blockType === 'blockedByMe') {
            blockerName = 'You';
        } else if (blockType === 'blockedMe') {
            // The other user blocked me, so blocker is the other user
            if (selectedChat.senderId === currentUserId) {
                blockerName = participants.receiver?.name || 'User';
            } else {
                blockerName = participants.sender?.name || 'User';
            }
        } else {
            blockerName = '';
        }
        // Status logic - check online status from socket
        const chatPartnerId = chatPartner?.id;
        const isPartnerOnline = chatPartnerId && onlineUsers && onlineUsers.has(String(chatPartnerId));

        if (isTyping && typingUserId === chatPartnerId) {
            chatPartnerStatus = 'Typing...';
        } else if (isPartnerOnline) {
            chatPartnerStatus = 'Online';
        } else {
            chatPartnerStatus = 'Offline';
        }
    }

    const isSender = selectedChat.senderId === currentUserId;
    // Ref for auto-scroll
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, messagesLoading]);

    // Listen for typing events
    useEffect(() => {
        if (!socket || !selectedChat) return;

        const handleTyping = ({ chatRoomId, userId, isTyping: typing }) => {
            if (chatRoomId === selectedChat.chatRoomId && userId !== currentUserId) {
                setIsTyping(typing);
                setTypingUserId(typing ? userId : null);

                // Clear typing after 3 seconds if no stop-typing event
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                if (typing) {
                    typingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                        setTypingUserId(null);
                    }, 3000);
                }
            }
        };

        socket.on('user-typing', handleTyping);

        return () => {
            socket.off('user-typing', handleTyping);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [socket, selectedChat, currentUserId]);

    // Handle typing indicators when user types
    useEffect(() => {
        if (!socket || !selectedChat || !newMessage.trim()) {
            // Stop typing if message is empty
            if (socket && selectedChat) {
                socket.emit('stop-typing', {
                    chatRoomId: selectedChat.chatRoomId,
                    userId: currentUserId
                });
            }
            return;
        }

        // Emit typing event
        socket.emit('typing', {
            chatRoomId: selectedChat.chatRoomId,
            userId: currentUserId
        });

        // Stop typing after 2 seconds of no input
        const timeout = setTimeout(() => {
            if (socket && selectedChat) {
                socket.emit('stop-typing', {
                    chatRoomId: selectedChat.chatRoomId,
                    userId: currentUserId
                });
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [newMessage, socket, selectedChat, currentUserId]);

    // Manual AI suggestions function (called on button click)
    const handleGetAiSuggestions = async () => {
        if (!selectedChat || isBlocked || !newMessage.trim()) {
            return;
        }

        setAiSuggestionsLoading(true);
        try {
            // Only send last 5 messages for faster processing
            const recentMessages = messages.slice(-5).map(msg => ({
                ...msg,
                currentUserId
            }));

            const suggestions = await getAIChatSuggestions(newMessage, recentMessages, currentUserId);
            setAiSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching AI suggestions:', error);
            setAiSuggestions([]);
        } finally {
            setAiSuggestionsLoading(false);
        }
    };

    // Generate AI reply for a received message
    const handleGenerateAiReply = async (message) => {
        if (!message || !message.trim()) return;

        setGeneratingReply(message);
        try {
            // Only send last 5 messages for faster processing
            const recentMessages = messages.slice(-5).map(msg => ({
                ...msg,
                currentUserId
            }));

            const reply = await generateAiReply(message, recentMessages, currentUserId);
            if (reply) {
                setNewMessage(reply);
                setAiSuggestions([]);
            }
        } catch (error) {
            console.error('Error generating AI reply:', error);
        } finally {
            setGeneratingReply(null);
        }
    };

    // Clear suggestions when chat changes
    useEffect(() => {
        setAiSuggestions([]);
    }, [selectedChat]);

    // Debug: log block state and type on every render
    console.log('[Render] isBlocked:', isBlocked, 'blockType:', blockType, 'blockerName:', blockerName);
    return (<>
        {/* Back Button - Mobile Only */}

        <div
            className="flex h-full w-full flex-col overflow-hidden md:min-h-[85vh] md:rounded-3xl md:border md:border-white/20 md:shadow-2xl backdrop-blur-3xl rounded-none border-0"
            style={{
                background: 'rgba(255, 255, 255, 0.05)'
            }}
        >

            {/* Header */}
            <div
                className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 border-b border-white/10 backdrop-blur-xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                }}
            >
                {/* Mobile Back Button - Inside Header */}
                <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-white/10 text-white flex-shrink-0"
                >
                    <FaArrowLeft size={16} />
                </button>

                {chatPartnerAvatar ? (
                    <img src={chatPartnerAvatar} alt="Avatar" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 object-cover border-2 border-pink-400/30 ring-2 ring-white/10 flex-shrink-0" />
                ) : (
                    <img src={profileImg} alt="Avatar" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 object-cover border-2 border-pink-400/30 ring-2 ring-white/10 flex-shrink-0" />
                )}

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                        <span className="text-white text-base md:text-lg font-bold truncate">{chatPartnerName}</span>
                        {chatPartner && onlineUsers && onlineUsers.has(String(chatPartner.id)) && (
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></div>
                        )}
                    </div>
                    {chatPartnerStatus ? (
                        <span className={`text-[10px] md:text-xs truncate ${chatPartnerStatus === 'Online' || chatPartnerStatus === 'Typing...'
                            ? 'text-green-400 font-medium'
                            : 'text-white/40'
                            }`}>
                            {chatPartnerStatus}
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                    <button
                        onClick={() => startCall('voice')}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition group"
                        title="Voice Call"
                    >
                        <FaPhone size={14} className="text-pink-400 group-hover:text-pink-300 transition-all group-hover:scale-110" />
                    </button>

                    <button
                        onClick={() => startCall('video')}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition group"
                        title="Video Call"
                    >
                        <FaVideo size={16} className="text-pink-400 group-hover:text-pink-300 transition-all group-hover:scale-110" />
                    </button>

                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition text-white" onClick={() => setShowMenu(true)}>⋮</button>
                </div>
            </div>
            {/* Menu Modal */}
            {showMenu && (
                <div className="fixed inset-0 flex h-[300px] justify-end z-50 p-4" onClick={() => setShowMenu(false)}>
                    <div
                        className="mt-12 w-48 flex flex-col rounded-xl border border-white/20 overflow-hidden shadow-2xl backdrop-blur-2xl"
                        style={{
                            background: 'rgba(30,30,40,0.95)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="py-3 px-4 text-red-300 text-sm text-left hover:bg-white/5 transition border-b border-white/5" onClick={handleBlockUser} disabled={blockLoading}>{blockLoading ? 'Blocking...' : 'Block User'}</button>
                        {isSender && (
                            <button className="py-3 px-4 text-white text-sm text-left hover:bg-white/5 transition border-b border-white/5" onClick={() => handleRevealIdentity(selectedChat)}>Reveal Identity</button>
                        )}
                        <button className="py-3 px-4 text-white/70 text-sm text-left hover:bg-white/5 transition" onClick={() => setShowMenu(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {/* Messages */}
            <div
                className="flex-1 min-h-0 flex flex-col overflow-y-auto px-4 pt-4 pb-2 scrollbar-none"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {(isBlocked || blockType === 'blockedByMe' || blockType === 'blockedMe') ? (
                    blockType === 'blockedByMe' ? (
                        <div className="flex flex-1 flex-col justify-center items-center text-white/50 text-sm">
                            <div className="mb-4 text-center">You blocked this contact. Unblock to chat.</div>
                            <button
                                className="px-6 py-2 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition border border-white/20 backdrop-blur-md"
                                onClick={async () => {
                                    if (!participants || !currentUserId) return;
                                    const chatPartnerId = selectedChat.senderId === currentUserId ? participants.receiver?.id : participants.sender?.id;
                                    if (!chatPartnerId) return;
                                    setBlockLoading(true);
                                    try {
                                        const res = await api.post('/unblock-user', {
                                            blockerId: currentUserId,
                                            blockedId: chatPartnerId
                                        });
                                        setIsBlocked(false);
                                        setBlockType(null);
                                        console.log('[Unblock] Response:', res.data);
                                        alert('User unblocked successfully.');
                                    } catch (err) {
                                        console.error('[Unblock] Failed to unblock user:', err);
                                        alert('Failed to unblock user.');
                                    } finally {
                                        setBlockLoading(false);
                                    }
                                }}
                                disabled={blockLoading}
                            >
                                {blockLoading ? 'Unblocking...' : 'Unblock'}
                            </button>
                        </div>
                    ) : blockType === 'blockedMe' ? (
                        <div className="flex flex-1 flex-col justify-center items-center text-white/30 font-light text-sm">
                            <div className="mb-3 text-center px-8">{blockerName || "User"} blocked you. You can't send messages.</div>
                        </div>
                    ) : null
                ) : messagesLoading ? (
                    <div className="flex flex-1 justify-center items-center"><div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {messages.map((item, idx) => {
                            // Debug: log message status and seen fields
                            const isMe = item.senderId === currentUserId;
                            let msgTime = '';
                            if (item.createdAt) {
                                msgTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } else if (item.updatedAt) {
                                msgTime = new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }

                            // WhatsApp-style ticks
                            let tickIcon = null;
                            if (isMe) {
                                if (item.status === 'SEEN') {
                                    tickIcon = (
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 8.5L7 11.5L12 6.5" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 9.5L7 14.5L14 7.5" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    );
                                } else {
                                    tickIcon = (
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 8.5L7 11.5L12 6.5" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    );
                                }
                            }
                            const messageText = item.message || item.text;

                            // Style definition for animations if not present
                            return (
                                <div
                                    key={item.id || item._id || idx}
                                    className={`flex mb-4 px-1 ${isMe ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.4s_ease-out_both]`}
                                >
                                    <style>{`
                                      @keyframes fadeInUp {
                                        from { opacity: 0; transform: translateY(20px); }
                                        to { opacity: 1; transform: translateY(0); }
                                      }
                                    `}</style>
                                    <div className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`rounded-2xl px-5 py-3 text-[15px] shadow-sm relative ${isMe
                                                ? 'bg-gradient-to-br from-pink-600 to-purple-700 text-white rounded-tr-sm'
                                                : 'bg-white/10 backdrop-blur-md border border-white/5 text-gray-100 rounded-tl-sm'}`}
                                        >
                                            {/* Media Content */}
                                            {item.mediaUrl && (
                                                <div className="mb-2 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                                    {item.mediaType === 'IMAGE' ? (
                                                        <img src={item.mediaUrl} alt="Shared" className="max-w-full h-auto max-h-[300px] object-cover cursor-pointer" onClick={() => window.open(item.mediaUrl, '_blank')} />
                                                    ) : item.mediaType === 'VIDEO' ? (
                                                        <video src={item.mediaUrl} controls className="max-w-full max-h-[300px]" />
                                                    ) : (
                                                        <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 text-pink-200 hover:text-pink-100 transition">
                                                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-xl">📄</div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold truncate">Document</div>
                                                                <div className="text-[10px] opacity-60">Tap to open</div>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            {messageText && <div className="leading-relaxed whitespace-pre-wrap">{messageText}</div>}
                                            <div className={`flex items-center justify-end mt-1.5 gap-1 text-[10px] ${isMe ? 'text-pink-100/70' : 'text-white/40'}`}>
                                                {msgTime}
                                                {tickIcon}
                                            </div>
                                        </div>
                                        {/* AI Reply button for received messages - enhanced */}
                                        {!isMe && !isBlocked && idx === messages.length - 1 && (
                                            <div className="ml-1 mt-1 animate-[fadeInUp_0.5s_ease-out]">
                                                <button
                                                    onClick={() => handleGenerateAiReply(messageText)}
                                                    disabled={generatingReply === messageText}
                                                    className="group relative px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-pink-500/30 text-pink-200 text-[11px] font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                                    {generatingReply === messageText ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                                                            <span>Crafting Reply...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm animate-pulse">✨</span>
                                                            <span>Tap for AI Reply</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
                {/* Typing indicator */}
                {isTyping && !isBlocked && (
                    <div className="ml-4 mb-2 flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* AI Suggestions Bar - Premium Pop-up Island */}
            {(aiSuggestions.length > 0 || aiSuggestionsLoading) && !isBlocked && (
                <div
                    className="mx-3 mb-1 rounded-2xl border border-pink-500/20 backdrop-blur-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.3)] flex-shrink-0 animate-[slideUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
                    style={{
                        background: 'linear-gradient(165deg, rgba(40, 10, 50, 0.9) 0%, rgba(10, 5, 20, 0.95) 100%)'
                    }}
                >
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/5">
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-bold flex items-center gap-1.5 shadow-sm">
                                <span className="text-base animate-[bounce_2s_infinite]">✨</span> MAGIC SUGGESTIONS
                            </span>
                            <span className="text-[10px] text-white/40 font-medium ml-6">Tap to auto-fill your message</span>
                        </div>
                        <button
                            onClick={() => setAiSuggestions([])}
                            className="text-white/30 hover:text-white bg-black/20 hover:bg-white/10 rounded-full p-1.5 transition-all active:scale-90"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-3">
                        <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 snap-x">
                            {aiSuggestionsLoading ? (
                                <div className="flex items-center gap-2.5 w-full justify-center py-2 opacity-70">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-[ping_1s_infinite]" />
                                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-[ping_1s_infinite_0.2s]" />
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[ping_1s_infinite_0.4s]" />
                                    <span className="text-xs text-white/60 font-medium ml-2">Dreaming up replies...</span>
                                </div>
                            ) : (
                                aiSuggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setNewMessage(suggestion);
                                            setAiSuggestions([]);
                                        }}
                                        className="group relative snap-start px-4 py-3 rounded-xl text-xs text-white bg-gradient-to-br from-white/10 to-white/5 hover:from-pink-500/20 hover:to-purple-500/20 border border-white/10 hover:border-pink-500/50 backdrop-blur-md whitespace-nowrap transition-all active:scale-95 flex-shrink-0 shadow-lg hover:shadow-pink-500/20"
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                        <span className="relative z-10">{suggestion}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Pending File Preview */}
            {pendingFile && (
                <div className="mx-4 mb-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-bottom-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 flex items-center justify-center border border-white/10">
                        {pendingFile.type === 'IMAGE' ? (
                            <img src={pendingFile.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : pendingFile.type === 'VIDEO' ? (
                            <div className="text-xl">📹</div>
                        ) : (
                            <div className="text-xl">📄</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{pendingFile.name || 'File Preview'}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider">{pendingFile.type}</div>
                    </div>
                    <button
                        onClick={() => setPendingFile(null)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition"
                        title="Remove attachment"
                    >
                        <FaPlus className="rotate-45" size={12} />
                    </button>
                </div>
            )}

            {/* Input Bar */}
            <div
                className="flex flex-row items-end px-3 py-3 border-t border-white/10 backdrop-blur-xl flex-shrink-0 gap-2"
                style={{
                    background: 'rgba(255, 255, 255, 0.03)'
                }}
            >
                {/* AI Assist Button - Premium Dark Focused */}
                {!isBlocked && (
                    <button
                        onClick={handleGetAiSuggestions}
                        disabled={aiSuggestionsLoading || !newMessage.trim()}
                        className={`
                            relative h-11 px-4 mr-2 rounded-xl flex items-center gap-2 transition-all duration-300 border
                            ${!newMessage.trim()
                                ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed grayscale opacity-50'
                                : 'bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 border-purple-500/30 text-white cursor-pointer shadow-[0_0_25px_rgba(88,28,135,0.6)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] hover:border-purple-400/50 hover:scale-105 active:scale-95 group ring-1 ring-purple-500/20'}
                        `}
                        title="Get AI Suggestions"
                    >
                        {aiSuggestionsLoading ? (
                            <div className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className={`text-xl filter drop-shadow-md ${newMessage.trim() ? 'group-hover:animate-pulse transform' : ''}`}>🪄</span>
                                <div className="flex flex-col items-start justify-center h-full">
                                    <span className={`text-[11px] font-black uppercase tracking-wider leading-none ${!newMessage.trim() ? '' : 'text-purple-100 drop-shadow-sm'}`}>AI</span>
                                    <span className={`text-[9px] font-bold leading-none mt-0.5 ${!newMessage.trim() ? 'hidden' : 'text-purple-300'}`}>Magic</span>
                                </div>

                                {newMessage.trim() && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3 pointer-events-none">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600 border border-white/20 shadow-md"></span>
                                    </span>
                                )}
                            </>
                        )}
                    </button>
                )}

                <textarea
                    className="flex-1 min-h-[44px] max-h-[140px] rounded-2xl px-4 py-3 resize-none focus:outline-none text-[15px] leading-snug text-white bg-white/5 border border-white/10 focus:border-pink-500/30 backdrop-blur-sm placeholder:text-white/20 transition-all"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
                    }}
                    placeholder={
                        isBlocked
                            ? 'Messaging unavailable'
                            : 'Type a message...'
                    }
                    disabled={sending || isBlocked}
                    maxLength={2000}
                    rows={1}
                />

                {/* Attachment Button */}
                {!isBlocked && (
                    <div className="relative mb-1">
                        <label className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer">
                            <FaPlus size={18} />
                            <input
                                type="file"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    // Handle file upload through props
                                    if (typeof handleFileUpload === 'function') {
                                        await handleFileUpload(file);
                                    } else {
                                        console.warn("handleFileUpload prop missing in ChatRoomView");
                                    }
                                    // Reset input
                                    e.target.value = '';
                                }}
                            />
                        </label>
                    </div>
                )}

                <button
                    onClick={handleSendMessage}
                    className={`mb-1 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${sending || (!newMessage.trim() && !pendingFile) || isBlocked
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95'}`}
                    disabled={sending || (!newMessage.trim() && !pendingFile) || isBlocked}
                >
                    {sending ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* --- Full Screen Call Overlay --- */}
            {isCallActive && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col bg-[#0F0F17] animate-[fadeIn_0.3s_ease-out]"
                >
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes pulse-ring {
                            0% { transform: scale(0.8); opacity: 0.5; }
                            50% { transform: scale(1.2); opacity: 0.3; }
                            100% { transform: scale(1.5); opacity: 0; }
                        }
                    `}</style>

                    {/* Background Visuals */}
                    <div className="absolute inset-0 z-0">
                        {callType === 'video' ? (
                            <div className="h-full w-full bg-black">
                                {remoteStream ? (
                                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center flex-col gap-4">
                                        <div className="w-24 h-24 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
                                        <span className="text-white/40 font-medium tracking-widest uppercase text-xs">Connecting Video...</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1E1B4B] via-[#0F0F17] to-[#1E1B4B]">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-[pulse-ring_3s_infinite]" />
                                    <div className="absolute inset-0 rounded-full bg-pink-500/10 animate-[pulse-ring_3s_infinite_1s]" />
                                    <img
                                        src={chatPartnerAvatar || profileImg}
                                        alt="Avatar"
                                        className="w-32 h-32 rounded-full border-4 border-pink-500/30 object-cover relative z-10 shadow-2xl"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Top Header Controls */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex flex-col">
                            <h2 className="text-white text-2xl font-bold drop-shadow-lg">{chatPartnerName}</h2>
                            <span className="text-pink-400 text-sm font-medium tracking-wider uppercase">{callType === 'video' ? 'Video Call' : 'Voice Call'}</span>
                        </div>
                    </div>

                    {/* Floating Self View (Only for Video) */}
                    {callType === 'video' && (
                        <div className="absolute top-24 right-6 w-32 md:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 bg-black">
                            <video ref={myVideoRef} autoPlay playsInline muted className="h-full w-full object-cover mirror" />
                        </div>
                    )}

                    {/* Immersive Bottom Controls */}
                    <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center gap-8">
                        <div className="flex items-center gap-6 px-8 py-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                            <button
                                onClick={() => {
                                    if (myStream) {
                                        const t = myStream.getAudioTracks()[0];
                                        if (t) t.enabled = !isMicOn;
                                        setIsMicOn(!isMicOn);
                                    }
                                }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
                            >
                                {isMicOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24} />}
                            </button>

                            {callType === 'video' && (
                                <button
                                    onClick={() => {
                                        if (myStream) {
                                            const t = myStream.getVideoTracks()[0];
                                            if (t) t.enabled = !isCameraOn;
                                            setIsCameraOn(!isCameraOn);
                                        }
                                    }}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}
                                >
                                    {isCameraOn ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
                                </button>
                            )}

                            <button
                                onClick={endCall}
                                className="w-16 h-16 rounded-full bg-red-600 text-white hover:bg-red-700 hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center"
                            >
                                <FaPhoneSlash size={28} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Incoming Call Immersive Overlay */}
            {incomingCall && !isCallActive && (
                <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#0F0F17]/95 backdrop-blur-3xl animate-[fadeIn_0.3s_ease-out]">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping" />
                        <img
                            src={chatPartnerAvatar || profileImg}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full border-4 border-pink-500/50 object-cover relative z-10"
                        />
                    </div>

                    <div className="text-center mb-16">
                        <div className="text-pink-400 text-sm font-bold uppercase tracking-[0.2em] mb-3 animate-pulse">Incoming {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call</div>
                        <h2 className="text-white text-3xl font-black">{chatPartnerName}</h2>
                    </div>

                    <div className="flex gap-12">
                        <button
                            onClick={() => setIncomingCall(null)}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-lg group-active:scale-90">
                                <FaPhoneSlash size={24} />
                            </div>
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Decline</span>
                        </button>

                        <button
                            onClick={acceptCall}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)] group-hover:scale-110 group-active:scale-90">
                                {incomingCall.callType === 'video' ? <FaVideo size={28} /> : <FaPhone size={28} />}
                            </div>
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Accept</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    </>
    );
}

export default ChatRoomView;
