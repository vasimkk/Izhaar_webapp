
import { useState, useRef, useEffect } from 'react';
import api from '../../../utils/api';
import profileImg from '../../../assets/images/profile.png';
import { getAIChatSuggestions, getConversationStarters, generateAiReply } from '../../../utils/aiSuggestionService';
import { FaArrowLeft } from 'react-icons/fa';

// Debounce helper function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

function ChatRoomView({ selectedChat, setSelectedChat, messages, messagesLoading, renderMessageItem, newMessage, setNewMessage, sending, handleSendMessage, currentUserId, participants, chats, setParticipants, showMenu, setShowMenu, handleRevealIdentity, izhaarStatuses, getIzhaarCode, socket, onlineUsers }) {
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
            className="flex h-full min-h-[85vh] flex-col overflow-hidden rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl"
            style={{
                background: 'rgba(255, 255, 255, 0.05)'
            }}
        >

            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 border-b border-white/10 backdrop-blur-xl"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                }}
            >
                {/* <button onClick={() => setSelectedChat(null)} className="text-white text-2xl font-bold">{'< '}</button> */}

                {/* Mobile Back Button - Inside Header */}
                <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 text-white"
                >
                    <FaArrowLeft size={18} />
                </button>

                {chatPartnerAvatar ? (
                    <img src={chatPartnerAvatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 object-cover border-2 border-pink-400/30 ring-2 ring-white/10" />
                ) : (
                    <img src={profileImg} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 object-cover border-2 border-pink-400/30 ring-2 ring-white/10" />
                )}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">{chatPartnerName}</span>
                        {chatPartner && onlineUsers && onlineUsers.has(String(chatPartner.id)) && (
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        )}
                    </div>
                    {chatPartnerStatus ? (
                        <span className={`text-xs ${chatPartnerStatus === 'Online' || chatPartnerStatus === 'Typing...'
                            ? 'text-green-400 font-medium'
                            : 'text-white/40'
                            }`}>
                            {chatPartnerStatus}
                        </span>
                    ) : null}
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition text-white" onClick={() => setShowMenu(true)}>⋮</button>
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
                                            <div className="leading-relaxed whitespace-pre-wrap">{messageText}</div>
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

                <button
                    onClick={handleSendMessage}
                    className={`mb-1 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${sending || !newMessage.trim() || isBlocked
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95'}`}
                    disabled={sending || !newMessage.trim() || isBlocked}
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
        </div>
    </>
    );
}

export default ChatRoomView;
