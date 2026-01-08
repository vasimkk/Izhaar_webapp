
import { useCallback, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../.././utils/api';
import ChatRoomView from './ChatRoomView';
import { BASE_URL } from '../../config/config';
import profileImg from '../../assets/images/profile.png';

const bgVideo =
  "https://res.cloudinary.com/df5jbm55b/video/upload/f_auto,q_auto/theme_1_zzu3gm.mp4";

// Fetch sender and receiver info for a chat room
// API: Get sender and receiver info for a chat room
const fetchParticipants = async (chatRoomId) => {
  try {
    // GET /chat/participants?chatRoomId=... : returns { sender, receiver }
    const res = await api.get(`/chat/participants?chatRoomId=${chatRoomId}`);
    return res.data;
  } catch (e) {
    console.error('Failed to fetch participants:', e);
    return null;
  }
};

// API: Get izhaar status (sender revealed, sender name, etc.)
const fetchIzhaarStatus = async (izhaarCode) => {
  try {
    // GET /izhaar/status/:izhaarCode : returns { sender_revealed, sender_name, ... }
    const res = await api.get(`/izhaar/status/${izhaarCode}`);
    return res.data;
  } catch (e) {
    console.error('Failed to fetch izhaar status:', e);
    return null;
  }
};

const ChatInterface = () => {
  const { accessToken, isAuthLoading } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [participants, setParticipants] = useState(null); // { sender, receiver }
  const [showMenu, setShowMenu] = useState(false);
  const [izhaarStatuses, setIzhaarStatuses] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users
  const socketRef = useRef(null);

  // Get user id from JWT (adjust as needed for your app)
  let currentUserId = null;
  try {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      currentUserId = payload.id || payload.userId || null;
    }
  } catch {}

  // Helper to get izhaar code from chat
  const getIzhaarCode = (chat) => chat.izhaarCode || chat.izhaar_code || chat.code || chat.chatRoomId || chat.id;

  // Fetch chats and izhaar statuses together
  // API: Fetch all chats, izhaar statuses, and participants for chat list
  const fetchChatsAndParticipants = useCallback(async () => {
    try {
      setLoading(true);
      // GET /chats : returns all chat rooms for the user
      const res = await api.get('/chats');
      const chatsRaw = res.data?.chats || [];
      // For each chat, fetch izhaar status (sender reveal info)
      const statusResults = await Promise.all(
        chatsRaw.map(async (chat) => {
          const code = getIzhaarCode(chat);
          if (!code) return [null, null];
          const status = await fetchIzhaarStatus(code);
          return [code, status];
        })
      );
      // Build status map for quick lookup
      const statusMap = {};
      statusResults.forEach(([code, status]) => {
        if (code && status) statusMap[code] = status;
      });
      setIzhaarStatuses(statusMap);
      // For each chat, fetch sender/receiver names
      const chatsWithNames = await Promise.all(
        chatsRaw.map(async (chat) => {
          try {
            // GET /chat/participants?chatRoomId=... : returns sender/receiver info
            const participants = await fetchParticipants(chat.chatRoomId);
            return {
              ...chat,
              receiverName: participants?.receiver?.name || chat.receiverName || chat.receiverId,
              senderName: participants?.sender?.name || chat.senderName || chat.senderId,
              receiverAvatar: participants?.receiver?.profile_photo || null,
              senderAvatar: participants?.sender?.profile_photo || null,
            };
          } catch {
            return chat;
          }
        })
      );
      setChats(chatsWithNames);
    } catch (e) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatsAndParticipants();
  }, [fetchChatsAndParticipants]);

  // Initialize Socket.IO connection with userId
  useEffect(() => {
    if (!currentUserId) return;

    // Connect socket with userId
    const socket = io(BASE_URL, {
      query: { userId: currentUserId }
    });
    socketRef.current = socket;

    // Listen for user online/offline events
    socket.on('user-online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, String(userId)]));
    });

    socket.on('user-offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(String(userId));
        return newSet;
      });
    });

    // Listen for new messages to update chat list
    socket.on('new-message', ({ chatRoomId, lastMessage, lastMessageTime, senderId, receiverId }) => {
      setChats(prevChats => prevChats.map(chat => {
        if (chat.chatRoomId === chatRoomId) {
          const isForCurrentUser = receiverId === currentUserId;
          return {
            ...chat,
            lastMessage,
            lastMessageTime,
            unseenCount: isForCurrentUser && chat.chatRoomId !== selectedChat?.chatRoomId
              ? (chat.unseenCount || 0) + 1
              : chat.unseenCount || 0
          };
        }
        return chat;
      }));
    });

    // Listen for incoming messages in current chat
    socket.on('receiveMessage', (msg) => {
      if (selectedChat && msg.chatRoomId === selectedChat.chatRoomId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, selectedChat]);

  // Reveal identity handler for ChatRoomView (now inside component)
  // API: Reveal sender identity for a chat (PATCH /izhaar/reveal/:izhaarCode)
  const handleRevealIdentity = useCallback(async (selectedChat) => {
    setShowMenu(false);
    try {
      // Try all possible izhaarCode fields in order of likelihood
      const izhaarCode = selectedChat.izhaarCode || selectedChat.izhaar_code || selectedChat.code || selectedChat.chatRoomId || selectedChat.id;
      console.log("Reveal identity izhaarCode:", izhaarCode, selectedChat);
      if (!izhaarCode) {
        alert('No izhaar_code found for this chat.');
        return;
      }
      // PATCH /izhaar/reveal/:izhaarCode : reveal sender identity
      await api.patch(`/izhaar/reveal/${izhaarCode}`);
      alert('Your identity has been revealed to the receiver.');
      if (typeof setParticipants === 'function') {
        setParticipants(prev => ({
          ...prev,
          sender: { ...prev.sender, revealed: true }
        }));
      }
      // Update the chat in the chats array so receiver sees sender name
      setChats(prevChats => prevChats.map(chat => {
        const chatCode = chat.izhaarCode || chat.izhaar_code || chat.code || chat.chatRoomId || chat.id;
        if (chatCode === izhaarCode) {
          return {
            ...chat,
            senderRevealed: true,
            senderName: participants?.sender?.name || chat.senderName || chat.senderId
          };
        }
        return chat;
      }));
      // Only re-fetch participants for the selected chat
      if (selectedChat?.chatRoomId) {
        const data = await fetchParticipants(selectedChat.chatRoomId);
        setParticipants(data);
      }
    } catch (err) {
      alert('Failed to reveal identity.');
    }
  }, [participants]);

  useEffect(() => {
    if (!selectedChat) return;
    // API: Get all messages for a chat room (GET /api/chat/:chatRoomId/messages)
    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        const res = await api.get(`/chat/${selectedChat.chatRoomId}/messages`);
        setMessages(res.data?.messages || []);
      } catch (e) {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && selectedChat.chatRoomId && socketRef.current) {
      socketRef.current.emit('joinRoom', { chatRoomId: selectedChat.chatRoomId });
      
      // Mark messages as seen when chat is opened
      const markAsSeen = async () => {
        try {
          await api.post(`/chat/${selectedChat.chatRoomId}/messages/seen`);
          // Update unseen count to 0
          setChats(prevChats => prevChats.map(chat => {
            if (chat.chatRoomId === selectedChat.chatRoomId) {
              return { ...chat, unseenCount: 0 };
            }
            return chat;
          }));
        } catch (err) {
          console.error('Failed to mark messages as seen:', err);
        }
      };
      markAsSeen();
    }
  }, [selectedChat]);

  // Memoize render functions
  const renderChatItem = useCallback((item) => {
    // Determine if current user is sender or receiver
    const isSender = item.senderId === currentUserId;
    // Get the other user's ID to check online status
    const otherUserId = isSender ? item.receiverId : item.senderId;
    const isOnline = otherUserId && onlineUsers.has(String(otherUserId));
    
    // On click, fetch participants and set selected chat
    const handleClick = async () => {
      setSelectedChat(item);
      const data = await fetchParticipants(item.chatRoomId);
      setParticipants(data);
    };
    let displayValue = '';
    let displayAvatar = profileImg;
    if (isSender) {
      displayValue = item.receiverName || item.receiverId;
      displayAvatar = item.receiverAvatar || profileImg;
    } else {
      const code = getIzhaarCode(item);
      const izhaarStatus = izhaarStatuses[code];
      if (izhaarStatus?.sender_revealed) {
        displayValue = izhaarStatus.sender_name || item.senderName || item.senderId;
        displayAvatar = item.senderAvatar || profileImg;
      } else if (item.senderAnonymous) {
        displayValue = 'Anonymous';
        displayAvatar = profileImg;
      } else {
        displayValue = 'Izhaar_Sender';
        displayAvatar = profileImg;
      }
    }
    // Get the latest message (from API or real-time update)
    const latestMsg = item.lastMessage || item.latestMessage || '';
    const unseenCount = item.unseenCount || 0;
    
    return (
      <div
        className={`rounded-2xl p-4 mb-3 flex items-center cursor-pointer transition hover:scale-[1.01] hover:shadow-lg border backdrop-blur-md relative ${
          selectedChat?.chatRoomId === item.chatRoomId 
            ? 'border-pink-400/50 bg-pink-500/10' 
            : 'border-white/10'
        }`}
        style={{
          background: selectedChat?.chatRoomId === item.chatRoomId
            ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
        }}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <div className="relative">
          <img src={displayAvatar} alt="Profile" className="w-10 h-10 rounded-full mr-3 object-cover border border-white/30" />
          {isOnline && (
            <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-black/50"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-base text-white font-semibold truncate">{displayValue}</div>
            {latestMsg && (
              <div className="text-xs text-white/50 ml-2">
                {item.lastMessageTime 
                  ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </div>
            )}
          </div>
          {latestMsg ? (
            <div className="text-xs text-white/70 mt-1 max-w-xs truncate">{latestMsg}</div>
          ) : null}
        </div>
        {unseenCount > 0 && (
          <div className="ml-2 flex-shrink-0 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unseenCount > 99 ? '99+' : unseenCount}
          </div>
        )}
      </div>
    );
  }, [currentUserId, izhaarStatuses, onlineUsers, selectedChat]);

  const renderMessageItem = useCallback((item) => {
    const isMe = item.senderId === currentUserId;
    return (
      <div className={`flex mb-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}> 
        <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-base ${isMe ? 'bg-green-100 rounded-tr-md ml-10' : 'bg-white border border-gray-200 rounded-tl-md mr-10'}`}> 
          <div className="text-gray-900">{item.message}</div>
          <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
            {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            {isMe && <span className="ml-1 text-blue-400">✔✔</span>}
          </div>
        </div>
      </div>
    );
  }, [currentUserId]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedChat || !currentUserId || !socketRef.current) return;
    const receiverId = selectedChat.senderId === currentUserId
      ? selectedChat.receiverId
      : selectedChat.senderId;
    socketRef.current.emit('sendMessage', {
      chatRoomId: selectedChat.chatRoomId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    });
    setNewMessage('');
  }, [newMessage, selectedChat, currentUserId]);

  if (isAuthLoading) {
    return (
      <div className="flex flex-1 min-h-screen justify-center items-center">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chatListPanel = (
    <div className="w-full md:max-w-sm">
      <div className="text-2xl font-bold text-white text-center mb-4 md:hidden">Chats</div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <div className="px-0 pb-8 md:p-0">
          <div
            className="rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10 backdrop-blur-lg h-[70vh] md:h-[75vh] flex flex-col"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.4) 100%)'
            }}
          >
            <div className="space-y-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {chats.map((item) => renderChatItem(item))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const chatPanel = selectedChat ? (
    <div className="h-[75vh]">
      <ChatRoomView
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        messages={messages}
        messagesLoading={messagesLoading}
        renderMessageItem={renderMessageItem}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending}
        handleSendMessage={handleSendMessage}
        currentUserId={currentUserId}
        participants={participants}
        setParticipants={setParticipants}
        chats={chats}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        handleRevealIdentity={handleRevealIdentity}
        izhaarStatuses={izhaarStatuses}
        getIzhaarCode={getIzhaarCode}
        socket={socketRef.current}
        onlineUsers={onlineUsers}
      />
    </div>
  ) : (
    <div className="hidden md:flex flex-1 items-center justify-center text-white/70 text-lg rounded-3xl border border-white/10 backdrop-blur-lg shadow-2xl p-6 h-[75vh]"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.25) 100%)'
      }}
    >
      Select a chat to start messaging.
    </div>
  );

  return (
    <div className="relative min-h-screen pt-12 overflow-hidden">
     <video
  className="absolute inset-0 h-full w-full object-cover"
  src={bgVideo}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  onLoadedData={(e) => {
    const video = e.currentTarget;
    if (video.paused) {
      video.play().catch(() => {});
    }
  }}
>
  Your browser does not support the video tag.
</video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10">
        {/* Mobile: show either list or chat */}
        <div className="md:hidden px-4 pb-8">
          {!selectedChat ? chatListPanel : chatPanel}
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden md:flex gap-4 px-4 pb-8">
          {chatListPanel}
          <div className="flex-1 h-[75vh]">{chatPanel}</div>
        </div>
      </div>
    </div>
  );
};





export default ChatInterface;