import { useCallback, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import ChatRoomView from './ChatRoomView';
import { BASE_URL } from '../../../config/config';
import profileImg from '../../../assets/images/profile.png';
import { FaSearch } from 'react-icons/fa';

// Fetch sender and receiver info for a chat room
const fetchParticipants = async (chatRoomId) => {
  try {
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
    const res = await api.get(`/izhaar/status/${izhaarCode}`);
    return res.data;
  } catch (e) {
    console.error('Failed to fetch izhaar status:', e);
    return null;
  }
};

const ChatInterface = () => {
  const { accessToken, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [participants, setParticipants] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [izhaarStatuses, setIzhaarStatuses] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobile, setMobile] = useState('');
  const [requestNotifications, setRequestNotifications] = useState([]);
  const socketRef = useRef(null);

  // Get user id from JWT
  let currentUserId = null;
  try {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      currentUserId = payload.id || payload.userId || null;
    }
  } catch {}

  // Helper to get izhaar code from chat
  const getIzhaarCode = (chat) =>
    chat.izhaarCode || chat.izhaar_code || chat.code || chat.chatRoomId || chat.id;

  // Fetch profile and chat requests from notifications
  const fetchProfileAndRequests = useCallback(async () => {
    try {
      const profileRes = await api.get('/profile/me');
      const profileData = profileRes.data.profile || profileRes.data;
      const userMobile = profileData.mobile;
      setMobile(userMobile);

      if (!userMobile) {
        setRequestNotifications([]);
        return;
      }

      const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
      const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
      
      // Show all requests
      setRequestNotifications(notifs);
    } catch (e) {
      console.error('Failed to fetch requests:', e);
      setRequestNotifications([]);
    }
  }, []);

  // Fetch chats and izhaar statuses together
  const fetchChatsAndParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/chats');
      const chatsRaw = res.data?.chats || [];

      const statusResults = await Promise.all(
        chatsRaw.map(async (chat) => {
          const code = getIzhaarCode(chat);
          if (!code) return [null, null];
          const status = await fetchIzhaarStatus(code);
          return [code, status];
        })
      );

      const statusMap = {};
      statusResults.forEach(([code, status]) => {
        if (code && status) statusMap[code] = status;
      });
      setIzhaarStatuses(statusMap);

      const chatsWithNames = await Promise.all(
        chatsRaw.map(async (chat) => {
          try {
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
    fetchProfileAndRequests();
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchChatsAndParticipants();
      fetchProfileAndRequests();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchChatsAndParticipants, fetchProfileAndRequests]);

  // Initialize Socket.IO connection with userId
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(BASE_URL, {
      query: { userId: currentUserId },
    });
    socketRef.current = socket;

    socket.on('user-online', ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, String(userId)]));
    });

    socket.on('user-offline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(String(userId));
        return newSet;
      });
    });

    socket.on('new-message', ({ chatRoomId, lastMessage, lastMessageTime, senderId, receiverId }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.chatRoomId === chatRoomId) {
            const isForCurrentUser = receiverId === currentUserId;
            return {
              ...chat,
              lastMessage,
              lastMessageTime,
              unseenCount:
                isForCurrentUser && chat.chatRoomId !== selectedChat?.chatRoomId
                  ? (chat.unseenCount || 0) + 1
                  : chat.unseenCount || 0,
            };
          }
          return chat;
        })
      );
    });

    socket.on('receiveMessage', (msg) => {
      if (selectedChat && msg.chatRoomId === selectedChat.chatRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('new-chat-request', () => {
      fetchChatsAndParticipants();
      fetchProfileAndRequests();
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, selectedChat, fetchChatsAndParticipants, fetchProfileAndRequests]);

  const handleRevealIdentity = useCallback(
    async (selectedChat) => {
      setShowMenu(false);
      try {
        const izhaarCode =
          selectedChat.izhaarCode ||
          selectedChat.izhaar_code ||
          selectedChat.code ||
          selectedChat.chatRoomId ||
          selectedChat.id;

        if (!izhaarCode) {
          alert('No izhaar_code found for this chat.');
          return;
        }

        await api.patch(`/izhaar/reveal/${izhaarCode}`);
        alert('Your identity has been revealed to the receiver.');

        if (typeof setParticipants === 'function') {
          setParticipants((prev) => ({
            ...prev,
            sender: { ...prev?.sender, revealed: true },
          }));
        }

        setChats((prevChats) =>
          prevChats.map((chat) => {
            const chatCode =
              chat.izhaarCode || chat.izhaar_code || chat.code || chat.chatRoomId || chat.id;
            if (chatCode === izhaarCode) {
              return {
                ...chat,
                senderRevealed: true,
                senderName: participants?.sender?.name || chat.senderName || chat.senderId,
              };
            }
            return chat;
          })
        );

        if (selectedChat?.chatRoomId) {
          const data = await fetchParticipants(selectedChat.chatRoomId);
          setParticipants(data);
        }
        
        // Auto-refresh chats after revealing identity
        await fetchChatsAndParticipants();
      } catch (err) {
        alert('Failed to reveal identity.');
      }
    },
    [participants, fetchChatsAndParticipants]
  );

  useEffect(() => {
    if (!selectedChat) return;
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

      const markAsSeen = async () => {
        try {
          await api.post(`/chat/${selectedChat.chatRoomId}/messages/seen`);
          setChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.chatRoomId === selectedChat.chatRoomId) {
                return { ...chat, unseenCount: 0 };
              }
              return chat;
            })
          );
        } catch (err) {
          console.error('Failed to mark messages as seen:', err);
        }
      };
      markAsSeen();
    }
  }, [selectedChat]);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;

    const isSender = chat.senderId === currentUserId;
    let displayName = '';

    if (isSender) {
      displayName = chat.receiverName || chat.receiverId;
    } else {
      const code = getIzhaarCode(chat);
      const izhaarStatus = izhaarStatuses[code];
      if (izhaarStatus?.sender_revealed) {
        displayName = izhaarStatus.sender_name || chat.senderName || chat.senderId;
      } else {
        displayName = 'Izhaar_Sender';
      }
    }

    const lastMessage = chat.lastMessage || chat.latestMessage || '';
    return (
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter notifications based on search query - Show all requests
  const filteredNotifications = requestNotifications.filter((notif) => {
    if (!searchQuery.trim()) return true;

    const izhaarCode = notif.izhaar_code || notif.code || '';
    const senderName = notif.sender_name || '';
    const type = notif.type || '';

    return (
      izhaarCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Only count unseen requests for the badge
  const pendingRequestsCount = requestNotifications.filter(
    (notif) => notif.status !== 'SEEN' && notif.status !== 'ACCEPTED' && notif.status !== 'REJECTED'
  ).length;

  const renderChatItem = useCallback(
    (item) => {
      const isSender = item.senderId === currentUserId;
      const otherUserId = isSender ? item.receiverId : item.senderId;
      const isOnline = otherUserId && onlineUsers.has(String(otherUserId));

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

      const latestMsg = item.lastMessage || item.latestMessage || '';
      const unseenCount = item.unseenCount || 0;

      return (
        <div
          key={item.chatRoomId}
          className={`rounded-2xl p-4 mb-3 flex items-center cursor-pointer transition hover:scale-[1.01] hover:shadow-lg border backdrop-blur-md relative ${
            selectedChat?.chatRoomId === item.chatRoomId
              ? 'border-pink-400/50 bg-pink-500/10'
              : 'border-white/10'
          }`}
          style={{
            background:
              selectedChat?.chatRoomId === item.chatRoomId
                ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
          }}
          onClick={handleClick}
          tabIndex={0}
          role="button"
          onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        >
          <div className="relative">
            <img
              src={displayAvatar}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3 object-cover border border-white/30"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-black/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="text-base text-white font-semibold truncate">{displayValue}</div>
              {latestMsg && (
                <div className="text-xs text-white/50 ml-2">
                  {item.lastMessageTime
                    ? new Date(item.lastMessageTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
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
    },
    [currentUserId, izhaarStatuses, onlineUsers, selectedChat]
  );

   // Render notification item
   // ...existing code...

const renderNotificationItem = useCallback(
  (item) => {
    const displayValue = item.sender_name || 'Izhaar Sender';
    const izhaarCode = item.izhaar_code || item.code;
    const messagePreview = item.type === 'SONG' ? 'Someone sent you a song' : 'Someone sent you an Izhaar';
    const status = item.status || 'PENDING';

    const handleView = async (e) => {
      e.stopPropagation();
      try {
        const code = izhaarCode;
        if (code) {
          await api.patch(`/izhaar/status/${code}`);
        }
        // Auto-refresh both chats and requests
        await fetchProfileAndRequests();
        await fetchChatsAndParticipants();
        navigate('/user/notifictions/IzhaarNotificationDetail', { state: { izhaar: item } });
      } catch (err) {
        console.error('Failed to mark as seen:', err);
        alert('Failed to view notification');
      }
    };

    const getStatusDisplay = () => {
      switch (status) {
        case 'ACCEPTED':
          return (
            <div className="flex items-center gap-1 mt-2 px-2 py-1 rounded bg-green-500/20 border border-green-400/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span className="text-green-400 text-xs font-medium">Accepted</span>
            </div>
          );
        case 'REJECTED':
          return (
            <div className="flex items-center gap-1 mt-2 px-2 py-1 rounded bg-red-500/20 border border-red-400/30">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              <span className="text-red-400 text-xs font-medium">Rejected</span>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        key={item.id || izhaarCode}
        className="rounded-xl p-3 mb-2 flex items-start gap-3 border border-purple-400/30 backdrop-blur-md hover:bg-white/5 transition cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        }}
        onClick={handleView}
      >
        {/* Icon */}
        <div className="text-xl flex-shrink-0 mt-1">{item.type === 'SONG' ? '🎵' : '💌'}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Code + Time Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-mono font-bold text-purple-300">{izhaarCode || 'N/A'}</div>
            {item.created_at && (
              <div className="text-xs text-white/40 flex-shrink-0">
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>

          {/* Message Preview */}
          <div className="text-xs text-white/70 mt-1 line-clamp-1">{messagePreview}</div>

          {/* Status */}
          {getStatusDisplay()}
        </div>
      </div>
    );
  },
  [fetchProfileAndRequests, navigate]
);

// ...existing code...
// ...existing code...

  const renderMessageItem = useCallback(
    (item) => {
      const isMe = item.senderId === currentUserId;
      return (
        <div className={`flex mb-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`rounded-2xl px-4 py-2 max-w-[70%] text-base ${
              isMe ? 'bg-green-100 rounded-tr-md ml-10' : 'bg-white border border-gray-200 rounded-tl-md mr-10'
            }`}
          >
            <div className="text-gray-900">{item.message}</div>
            <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
              {item.created_at
                ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
              {isMe && <span className="ml-1 text-blue-400">✔✔</span>}
            </div>
          </div>
        </div>
      );
    },
    [currentUserId]
  );

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChat || !currentUserId || !socketRef.current) return;
    const receiverId = selectedChat.senderId === currentUserId ? selectedChat.receiverId : selectedChat.senderId;
    socketRef.current.emit('sendMessage', {
      chatRoomId: selectedChat.chatRoomId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    });
    setNewMessage('');
    
    // Auto-refresh chats after sending message
    setTimeout(() => {
      fetchChatsAndParticipants();
    }, 500);
  }, [newMessage, selectedChat, currentUserId, fetchChatsAndParticipants]);

  if (isAuthLoading) {
    return (
      <div className="flex flex-1 min-h-screen justify-center items-center">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chatListPanel = (
    <div className="w-full md:max-w-sm ">
      <div className="text-2xl font-bold text-purple-500 text-center mb-4 md:hidden">Chats</div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" />
          <input
            type="text"
            placeholder="Search By user Name "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 rounded-xl bg-white  border border-white/20  placeholder-gray/50 focus:outline-none focus:border-pink-400 transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-2 font-semibold transition-all relative ${
            activeTab === 'messages' ? 'text-purple-700' : 'text-purple-700 hover:text-purple-700'
          }`}
        >
          Messages
          {activeTab === 'messages' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 font-semibold transition-all relative flex items-center ${
            activeTab === 'requests' ? 'text-pink-400' : 'text-purple-700 hover:text-purple-700'
          }`}
        >
          Requests
          {pendingRequestsCount > 0 && (
            <span className="ml-2 b text-purple-700 text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
          {activeTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <div className="px-0 pb-8 md:p-0">
          <div
            className="rounded-3xl p-4 sm:p-6 shadow-2xl h-[60vh] md:h-[65vh] flex flex-col"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.4) 100%)',
            }}
          >
            <div className="space-y-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {activeTab === 'messages' ? (
                filteredChats.filter((chat) => chat.status === 'accepted' || chat.status === 'active' || !chat.status)
                  .length > 0 ? (
                  filteredChats
                    .filter((chat) => chat.status === 'accepted' || chat.status === 'active' || !chat.status)
                    .map((item) => renderChatItem(item))
                ) : (
                  <div className="text-center text-white/50 py-8">
                    {searchQuery ? 'No chats found' : 'No messages yet'}
                  </div>
                )
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => renderNotificationItem(item))
              ) : (
                <div className="text-center text-white/50 py-8">
                  <div className="text-6xl mb-4">🔔</div>
                  <div className="text-lg font-semibold">No requests</div>
                </div>
              )}
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
    <div
      className="hidden md:flex flex-1 items-center justify-center text-white/70 text-lg rounded-3xl border border-white/10 backdrop-blur-lg shadow-2xl p-6 h-[85vh]"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.25) 100%)',
      }}
    >
      Select a chat to start messaging.
    </div>
  );

  return (
    <div className="relative min-h-screen pt-12 overflow-hidden">
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

      <div className="absolute inset-0 "style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }} />

      <div className="relative z-10">
        {/* Mobile: show either list or chat */}
        <div className="md:hidden px-4 pb-8">
          {selectedChat ? <div>{chatPanel}</div> : chatListPanel}
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