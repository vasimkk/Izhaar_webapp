import { useCallback, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
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
  const { fetchSummary } = useNotifications();
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
  const [pendingFile, setPendingFile] = useState(null);
  const socketRef = useRef(null);

  // Get user id from JWT
  let currentUserId = null;
  try {
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      currentUserId = payload.id || payload.userId || null;
    }
  } catch { }

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

      // Filter only Letter and Song requests
      const filtered = notifs.filter(n => n.type === 'LETTER' || n.type === 'SONG' || !n.type);
      setRequestNotifications(filtered);
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

    socket.on('new-message', ({ chatRoomId, lastMessage, lastMessageTime, senderId, receiverId, mediaType }) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.chatRoomId === chatRoomId) {
            const isForCurrentUser = receiverId === currentUserId;

            // Generate preview text
            let displayMessage = lastMessage;
            if (!displayMessage && mediaType) {
              if (mediaType === 'IMAGE') displayMessage = '🖼️ Photo';
              else if (mediaType === 'VIDEO') displayMessage = '🎥 Video';
              else displayMessage = '📄 Document';
            }

            return {
              ...chat,
              lastMessage: displayMessage,
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

  // Handle browser back button (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      if (selectedChat) {
        setSelectedChat(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedChat]);

  // Wrapper for closing chat to handle history
  const handleCloseChat = (value) => {
    if (value === null) {
      if (window.history.state?.chatOpen) {
        window.history.back(); // Triggers popstate -> setSelectedChat(null)
      } else {
        setSelectedChat(null);
      }
    } else {
      setSelectedChat(value);
    }
  };

  useEffect(() => {
    if (selectedChat && selectedChat.chatRoomId && socketRef.current) {
      socketRef.current.emit('joinRoom', { chatRoomId: selectedChat.chatRoomId });

      const markAsSeen = async () => {
        try {
          await api.post(`/chat/${selectedChat.chatRoomId}/messages/seen`);
          fetchSummary(); // Update global badge count
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
        // Push state on mobile so back button works expectedly
        if (window.innerWidth < 768) {
          window.history.pushState({ chatOpen: true }, "");
        }
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
          className={`rounded-2xl p-4 mb-3 flex items-center cursor-pointer transition hover:scale-[1.01] border backdrop-blur-md relative ${selectedChat?.chatRoomId === item.chatRoomId
            ? 'bg-pink-500/10 border-pink-400/30'
            : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          onClick={handleClick}
          tabIndex={0}
          role="button"
          onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        >
          <div className="relative">
            <img
              src={displayAvatar}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 object-cover border border-white/10 ring-2 ring-white/5"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-3 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1E1E2E]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="text-base text-white font-semibold truncate">{displayValue}</div>
              {latestMsg && (
                <div className="text-[10px] text-white/40 ml-2 font-medium">
                  {item.lastMessageTime
                    ? new Date(item.lastMessageTime).toLocaleString([], {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : ''}
                </div>
              )}
            </div>
            {latestMsg ? (
              <div className={`text-sm mt-1 max-w-xs truncate ${unseenCount > 0 ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                {latestMsg}
              </div>
            ) : null}
          </div>
          {unseenCount > 0 && (
            <div className="ml-3 flex-shrink-0 bg-pink-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shadow-lg shadow-pink-500/40 animate-pulse">
              {unseenCount > 99 ? '99+' : unseenCount}
            </div>
          )}
        </div>
      );
    },
    [currentUserId, izhaarStatuses, onlineUsers, selectedChat]
  );

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
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span className="text-green-300 text-[10px] font-bold tracking-wide uppercase">Accepted</span>
              </div>
            );
          case 'REJECTED':
            return (
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span className="text-red-300 text-[10px] font-bold tracking-wide uppercase">Rejected</span>
              </div>
            );
          default:
            return null;
        }
      };

      const isUnseen = ['SENT', 'DELIVERED'].includes(status);

      return (
        <div
          key={item.id || izhaarCode}
          className={`rounded-2xl p-4 mb-3 flex items-start gap-3 border transition cursor-pointer relative ${isUnseen
            ? 'border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10'
            : 'border-white/5 bg-white/5 opacity-80'}`}
          onClick={handleView}
        >
          {isUnseen && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-glow"></span>
              <span className="text-[9px] font-bold text-pink-300 uppercase tracking-wider">New</span>
            </div>
          )}
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl flex-shrink-0 border border-white/10">
            {item.type === 'SONG' ? '🎵' : '💌'}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Code + Time Row */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="text-xs font-mono font-bold text-purple-200 tracking-wider">#{izhaarCode || 'N/A'}</div>
              {item.created_at && (
                <div className="text-[10px] text-white/30 flex-shrink-0">
                  {new Date(item.created_at).toLocaleString([], {
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>

            {/* Message Preview */}
            <div className="text-xs text-white/80 line-clamp-1 mb-1 font-medium">{messagePreview}</div>

            {/* Status */}
            {getStatusDisplay()}
          </div>
        </div>
      );
    },
    [fetchProfileAndRequests, navigate]
  );

  // No renderMessageItem needed in parent, passed to child

  const handleFileUpload = async (file) => {
    if (!file || !selectedChat) return;

    // Check file size (e.g., 20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      alert("File is too large. Max 20MB allowed.");
      return;
    }

    try {
      setSending(true);
      const formData = new FormData();
      formData.append('media', file);
      formData.append('chatRoomId', selectedChat.chatRoomId);

      const res = await api.post('/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setPendingFile({
          url: res.data.mediaUrl,
          type: res.data.mediaType,
          name: res.data.originalName
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if ((!newMessage.trim() && !pendingFile) || !selectedChat || !currentUserId || !socketRef.current) return;
    const receiverId = selectedChat.senderId === currentUserId ? selectedChat.receiverId : selectedChat.senderId;

    socketRef.current.emit('sendMessage', {
      chatRoomId: selectedChat.chatRoomId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
      mediaUrl: pendingFile?.url || null,
      mediaType: pendingFile?.type || null
    });

    setNewMessage('');
    setPendingFile(null);

    // Auto-refresh chats after sending message
    setTimeout(() => {
      fetchChatsAndParticipants();
    }, 500);
  }, [newMessage, selectedChat, currentUserId, fetchChatsAndParticipants, pendingFile]);

  if (isAuthLoading) {
    return (
      <div className="flex flex-1 min-h-screen justify-center items-center bg-[#0F0F17]">
        <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chatListPanel = (
    <div className="w-full md:max-w-sm flex flex-col h-[75vh]">
      <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent text-center mb-6 md:hidden">Messages</div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-pink-400 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-pink-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 mb-6 bg-white/5 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'messages'
            ? 'bg-white/10 text-white shadow-md'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'requests'
            ? 'bg-white/10 text-white shadow-md'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5'
            }`}
        >
          Requests
          {pendingRequestsCount > 0 && (
            <span className="bg-pink-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 mt-8 py-4 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>
      ) : (
        <div className="flex-1 min-h-0">
          <div
            className="rounded-3xl h-full flex flex-col"
          >
            <div className="space-y-1 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {activeTab === 'messages' ? (
                filteredChats.filter((chat) => chat.status === 'accepted' || chat.status === 'active' || !chat.status)
                  .length > 0 ? (
                  filteredChats
                    .filter((chat) => chat.status === 'accepted' || chat.status === 'active' || !chat.status)
                    .map((item) => renderChatItem(item))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-white/30">
                    <span className="text-4xl mb-3 opacity-50">💬</span>
                    <p>{searchQuery ? 'No chats found' : 'No messages yet'}</p>
                  </div>
                )
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => renderNotificationItem(item))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-white/30">
                  <div className="text-4xl mb-4 opacity-50">🔔</div>
                  <div className="text-sm font-medium">No new requests</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const chatPanel = selectedChat ? (
    <div className="h-full md:h-[75vh]">
      <ChatRoomView
        selectedChat={selectedChat}
        setSelectedChat={handleCloseChat}
        messages={messages}
        messagesLoading={messagesLoading}
        // renderMessageItem passed internally
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
        handleFileUpload={handleFileUpload}
        pendingFile={pendingFile}
        setPendingFile={setPendingFile}
      />
    </div>
  ) : (
    <div
      className="hidden md:flex flex-1 items-center justify-center text-white/40 text-lg rounded-3xl border border-white/5 backdrop-blur-sm p-6 h-[75vh] flex-col gap-4 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-2">
        ✨
      </div>
      <div>
        <h3 className="text-white font-bold text-xl mb-1">Select a conversation</h3>
        <p className="text-sm max-w-xs mx-auto">Click on a chat from the list to start messaging your loved ones.</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen pt-12 overflow-hidden text-white"
      style={{
        background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)'
      }}
    >
      {/* Heart Bokeh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <style>{`
           @keyframes floatHeart {
             0% { transform: translateY(100vh) scale(0.8); opacity: 0; }
             10% { opacity: 0.4; }
             100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
           }
           @keyframes floatUp {
             0% { transform: translateY(100vh) scale(0.8) rotate(0deg); opacity: 0; }
             20% { opacity: 0.6; }
             100% { transform: translateY(-20vh) scale(1.1) rotate(10deg); opacity: 0; }
           }
           @keyframes twinkle {
             0%, 100% { opacity: 0; transform: scale(0.5); }
             50% { opacity: 1; transform: scale(1.2); }
           }
           .romantic-word {
             font-family: serif;
             font-style: italic;
             position: absolute;
             animation: floatUp 25s linear infinite;
           }
           .sparkle {
             position: absolute;
             border-radius: 50%;
             animation: twinkle 4s ease-in-out infinite;
           }
         `}</style>

        {/* Static Large Blurred Hearts */}
        <div className="absolute top-[10%] left-[5%] text-[150px] text-pink-600/10 blur-xl animate-pulse">♥</div>
        <div className="absolute top-[50%] right-[10%] text-[120px] text-purple-600/10 blur-xl animate-pulse delay-700">♥</div>
        <div className="absolute bottom-[10%] left-[30%] text-[180px] text-pink-700/10 blur-2xl">♥</div>

        {/* Multi-Color Sparkles */}
        {[...Array(40)].map((_, i) => {
          const colors = ['bg-yellow-200', 'bg-pink-300', 'bg-cyan-300', 'bg-white', 'bg-purple-300'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={`sparkle-${i}`}
              className={`sparkle ${randomColor} shadow-[0_0_8px_currentColor]`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `-${Math.random() * 5}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          );
        })}

        {/* Floating Bokeh Hearts */}
        {[...Array(24)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute text-pink-500/20 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 120}%`,
              fontSize: `${Math.random() * 80 + 20}px`,
              filter: `blur(${Math.random() * 8 + 4}px)`,
              animation: `floatHeart ${Math.random() * 20 + 15}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`,
              color: Math.random() > 0.5 ? 'rgba(236, 72, 153, 0.3)' : 'rgba(168, 85, 247, 0.3)',
            }}
          >
            ♥
          </div>
        ))}

        {/* Floating Romantic Words */}
        {['Love', 'Ishq', 'Forever', 'Soulmate', 'Destiny', 'Izhaar', 'Amour', 'Dil', 'Yours', 'Dream'].map((word, i) => (
          <div
            key={`word-${i}`}
            className="romantic-word text-white/5"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 4 + 2}rem`,
              animationDuration: `${Math.random() * 15 + 25}s`,
              animationDelay: `-${Math.random() * 20}s`,
              opacity: Math.random() * 0.15 + 0.05,
              textShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Mobile Back Button */}
      {/* Hidden because using Dashboard wrapper usually, but kept for direct nav if needed */}
      {!selectedChat && (
        <button
          onClick={() => navigate("/user/dashboard")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-xl shadow-lg transition-all active:scale-95 border border-white/10 text-white hover:bg-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Mobile: show either list or chat */}
        <div className="md:hidden">
          {selectedChat ? (
            <div
              className="fixed inset-0 z-[100] flex flex-col"
              style={{ background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)' }}
            >
              {chatPanel}
            </div>
          ) : (
            <div className="px-4 pb-4">{chatListPanel}</div>
          )}
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden md:flex gap-6 px-6 pb-8 justify-center">
          {chatListPanel}
          <div className="flex-[2] max-w-4xl h-[75vh]">{chatPanel}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;