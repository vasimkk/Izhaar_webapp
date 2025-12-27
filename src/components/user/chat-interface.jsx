
import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../.././utils/api';
import ChatRoomView from './ChatRoomView';
import { BASE_URL } from '../../config/config';
import profileImg from '../../assets/images/profile.png';

const socket = io(BASE_URL);

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
    if (selectedChat && selectedChat.chatRoomId) {
      socket.emit('joinRoom', { chatRoomId: selectedChat.chatRoomId });
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, []);

  // Memoize render functions
  const renderChatItem = useCallback((item) => {
    // Determine if current user is sender or receiver
    const isSender = item.senderId === currentUserId;
    // On click, fetch participants and set selected chat
    const handleClick = async () => {
      setSelectedChat(item);
      const data = await fetchParticipants(item.chatRoomId);
      setParticipants(data);
    };
    let displayValue = '';
    if (isSender) {
      displayValue = item.receiverName || item.receiverId;
    } else {
      const code = getIzhaarCode(item);
      const izhaarStatus = izhaarStatuses[code];
      if (izhaarStatus?.sender_revealed) {
        displayValue = izhaarStatus.sender_name || item.senderName || item.senderId;
      } else if (item.senderAnonymous) {
        displayValue = 'Anonymous';
      } else {
        displayValue = 'Izhaar_Sender';
      }
    }
    // Find the latest message for this chat
    let latestMsg = '';
    if (item.messages && item.messages.length > 0) {
      latestMsg = item.messages[item.messages.length - 1].message;
    } else if (item.latestMessage) {
      latestMsg = item.latestMessage;
    }
    return (
      <div
        className="bg-pink-100 rounded-lg p-4 mb-3 flex items-center cursor-pointer hover:shadow-md transition"
        onClick={handleClick}
        tabIndex={0}
        role="button"
        onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <img src={profileImg} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <div className="text-base text-gray-700 font-semibold">{displayValue}</div>
          {latestMsg ? (
            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{latestMsg}</div>
          ) : null}
        </div>
      </div>
    );
  }, [currentUserId, izhaarStatuses]);

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
    if (!newMessage.trim() || !selectedChat || !currentUserId) return;
    const receiverId = selectedChat.senderId === currentUserId
      ? selectedChat.receiverId
      : selectedChat.senderId;
    socket.emit('sendMessage', {
      chatRoomId: selectedChat.chatRoomId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    });
    setNewMessage('');
  }, [newMessage, selectedChat, currentUserId]);

  if (isAuthLoading) {
    return (
      <div className="flex flex-1 min-h-screen justify-center items-center bg-black">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black pt-12">
      {!selectedChat ? (
        <>
          <div className="text-2xl font-bold text-white text-center mb-4">Chats</div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-8">{error}</div>
          ) : (
            <div className="px-4 pb-8">
              {chats.map((item) => renderChatItem(item))}
            </div>
          )}
        </>
      ) : (
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
          chats={chats}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          handleRevealIdentity={handleRevealIdentity}
          izhaarStatuses={izhaarStatuses}
          getIzhaarCode={getIzhaarCode}
        />
      )}
    </div>
  );
};





export default ChatInterface;

