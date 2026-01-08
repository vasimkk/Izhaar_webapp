
import { useState, useRef, useEffect } from 'react';
import api from '../../utils/api';
import profileImg from '../../assets/images/profile.png';
import { getAIChatSuggestions, getConversationStarters, generateAiReply } from '../../utils/aiSuggestionService';

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
            const recentMessages = messages.slice(-10).map(msg => ({
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
            const recentMessages = messages.slice(-10).map(msg => ({
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
    return (
        <div
            className="flex h-full min-h-[85vh] flex-col overflow-hidden rounded-2xl border border-white/10"
            style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(20, 20, 30, 0.85) 100%)'
            }}
        >
            {/* Header */}
            <div
                className="flex items-center gap-3 px-4 py-3 border-b border-white/10 backdrop-blur-lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)'
                }}
            >
                <button onClick={() => setSelectedChat(null)} className="text-white text-2xl font-bold">{'< '}</button>
                {chatPartnerAvatar ? (
                    <img src={chatPartnerAvatar} alt="Avatar" className="w-12 h-12 rounded-full bg-gray-200 object-cover border border-white/30" />
                ) : (
                    <img src={profileImg} alt="Avatar" className="w-12 h-12 rounded-full bg-gray-200 object-cover border border-white/30" />
                )}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-xl font-bold">{chatPartnerName}</span>
                        {chatPartner && onlineUsers && onlineUsers.has(String(chatPartner.id)) && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                    </div>
                    {chatPartnerStatus ? (
                        <span className={`text-xs mt-0.5 ${
                            chatPartnerStatus === 'Online' || chatPartnerStatus === 'Typing...' 
                                ? 'text-green-400' 
                                : 'text-gray-400'
                        }`}>
                            {chatPartnerStatus}
                        </span>
                    ) : null}
                </div>
                <button className="px-3 py-1 text-white text-xl font-bold" onClick={() => setShowMenu(true)}>⋮</button>
            </div>
            {/* Menu Modal */}
            {showMenu && (
                <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setShowMenu(false)}>
                    <div
                        className="mt-16 mr-4 py-2 w-44 flex flex-col rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(15, 15, 25, 0.85) 100%)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-white/5" onClick={() => { setShowMenu(false); /* clear chat logic here */ }}>Clear Chat</button>
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-white/5" onClick={handleBlockUser} disabled={blockLoading}>{blockLoading ? 'Blocking...' : 'Block'}</button>
                        {isSender && (
                            <button className="py-2 px-5 text-white text-base text-left hover:bg-white/5" onClick={() => handleRevealIdentity(selectedChat)}>Reveal Identity</button>
                        )}
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-white/5" onClick={() => setShowMenu(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {/* Messages */}
            <div
                className="flex-1 min-h-0 flex flex-col overflow-y-auto px-2 pt-3 pb-2 scrollbar-hide border-t border-b border-white/5"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)'
                }}
            >
                {(isBlocked || blockType === 'blockedByMe' || blockType === 'blockedMe') ? (
                    blockType === 'blockedByMe' ? (
                        <div className="flex flex-1 flex-col justify-center items-center text-gray-500 font-normal text-base">
                            <div className="mb-3 text-center">You blocked this contact. Unblock to chat.</div>
                            <button
                                className="px-4 py-2 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 text-base"
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
                        <div className="flex flex-1 flex-col justify-center items-center text-gray-500 font-normal text-base">
                            <div className="mb-3 text-center">{blockerName} blocked you. You can't send messages.</div>
                        </div>
                    ) : null
                ) : messagesLoading ? (
                    <div className="flex flex-1 justify-center items-center"><div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {messages.map((item, idx) => {
                            // Debug: log message status and seen fields
                            if (item.senderId === currentUserId) {
                                console.log('[TickDebug]', {
                                    id: item.id,
                                    status: item.status,
                                    seen: item.seen,
                                    message: item.message || item.text
                                });
                            }
                            let msgTime = '';
                            if (item.createdAt) {
                                msgTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } else if (item.updatedAt) {
                                msgTime = new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            const isMe = item.senderId === currentUserId;
                            // WhatsApp-style ticks
                            let tickIcon = null;
                            // Only use status === 'SEEN' for blue double tick, else single gray tick
                            if (isMe) {
                                if (item.status === 'SEEN') {
                                    tickIcon = (
                                        <span className="ml-1">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 8.5L7 11.5L12 6.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M2 9.5L7 14.5L14 7.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    );
                                } else {
                                    tickIcon = (
                                        <span className="ml-1">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 8.5L7 11.5L12 6.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    );
                                }
                            }
                            const messageText = item.message || item.text;
                            return (
                                <div key={item.id || item._id || idx} className={`flex mb-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div
                                        className={`rounded-3xl px-4 py-2 max-w-[72%] text-base shadow-md border ${isMe
                                                ? 'bg-green-500/15 border-green-400/40 text-green-50 rounded-tr-md'
                                                : 'bg-white/10 border-white/15 text-white rounded-tl-md backdrop-blur-sm'}`}
                                    >
                                            <div>{messageText}</div>
                                        <div className={`flex items-center justify-end mt-1 text-xs ${isMe ? 'text-green-200' : 'text-white/70'}`}>
                                            {msgTime}
                                            {tickIcon}
                                        </div>
                                        </div>
                                        {/* AI Reply button for received messages */}
                                        {!isMe && !isBlocked && (
                                            <button
                                                onClick={() => handleGenerateAiReply(messageText)}
                                                disabled={generatingReply === messageText}
                                                className="mt-1 px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-xs font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                title="Generate AI Reply"
                                            >
                                                {generatingReply === messageText ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                                        <span>AI...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M9 11l3 3L22 4"/>
                                                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                                                        </svg>
                                                        <span>AI</span>
                                                    </>
                                                )}
                                            </button>
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
                    <div className="ml-4 mb-2 text-white/60 italic text-sm">Typing...</div>
                )}
            </div>
            {/* AI Suggestions Bar */}
            {(aiSuggestions.length > 0 || aiSuggestionsLoading) && !isBlocked && (
                <div
                    className="px-2 py-2 border-t border-white/5 backdrop-blur-lg flex-shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)'
                    }}
                >
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        <span className="text-xs text-white/50 font-medium whitespace-nowrap">AI Suggestions:</span>
                        {aiSuggestionsLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-white/40">Thinking...</span>
                            </div>
                        ) : (
                            aiSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setNewMessage(suggestion);
                                        setAiSuggestions([]);
                                    }}
                                    className="px-3 py-1.5 rounded-xl text-xs text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm whitespace-nowrap transition-all hover:scale-105 flex-shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
            {/* Input Bar */}
            <div
                className="flex flex-row items-center px-2 py-3 border-t border-white/10 backdrop-blur-lg flex-shrink-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)'
                }}
            >
                {/* AI Assist Button */}
                {!isBlocked && (
                    <button
                        onClick={handleGetAiSuggestions}
                        disabled={aiSuggestionsLoading || !newMessage.trim()}
                        className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        title="Get AI suggestions to improve your message"
                    >
                        {aiSuggestionsLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs">AI...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                                </svg>
                                <span className="text-xs">AI</span>
                            </>
                        )}
                    </button>
                )}
                <textarea
                    className="flex-1 min-h-[40px] max-h-[120px] rounded-2xl px-4 py-2 mx-2 resize-none focus:outline-none text-base text-white bg-white/5 border border-white/10 backdrop-blur"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={
                        isBlocked
                            ? blockType === 'blockedByMe'
                                ? 'You blocked this contact.'
                                : blockType === 'blockedMe'
                                    ? `${blockerName} blocked you.`
                                    : 'You cannot send messages.'
                            : 'Type your message...'
                    }
                    disabled={sending || isBlocked}
                    maxLength={1000}
                    rows={1}
                />
                <button
                    onClick={handleSendMessage}
                    className={`ml-2 px-4 py-2 rounded-2xl font-bold text-lg transition-all ${sending || !newMessage.trim() || isBlocked
                        ? 'bg-green-500/30 text-white/70 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30'}`}
                    disabled={sending || !newMessage.trim() || isBlocked}
                >▶</button>
            </div>
        </div>
    );
}





export default ChatRoomView;

