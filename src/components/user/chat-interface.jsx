import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ChatRoomView from './ChatRoomView';
import { BASE_URL } from '../config/config';

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
  const renderChatItem = useCallback(({ item }) => {
    // Determine if current user is sender or receiver
    const isSender = item.senderId === currentUserId;
    // On press, fetch participants and set selected chat
    const handlePress = async () => {
      setSelectedChat(item);
      const data = await fetchParticipants(item.chatRoomId);
      setParticipants(data);
    };
    let displayLabel = '';
    let displayValue = '';
    if (isSender) {
      // Sender: show receiver name
      displayLabel = 'Receiver';
      displayValue = item.receiverName || item.receiverId;
    } else {
      // Receiver: show sender name ONLY if revealed, else show appropriate message
      displayLabel = 'Sender';
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
      <TouchableOpacity style={styles.chatItem} onPress={handlePress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/profile.png')} style={styles.footerIconImg} />
          <View>
            <Text style={styles.userName}>{displayValue}</Text>
            {latestMsg ? (
              <Text style={styles.latestMsgText} numberOfLines={1}>{latestMsg}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [currentUserId, izhaarStatuses]);

  const renderMessageItem = useCallback(({ item }) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther
      ]}>
        <View style={[
          styles.bubble,
          isMe ? styles.bubbleMeWhatsapp : styles.bubbleOtherWhatsapp
        ]}>
          <Text style={styles.messageTextWhatsapp}>{item.message}</Text>
          <View style={styles.timeTickRow}>
            <Text style={styles.messageTimeWhatsapp}>
              {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
            {isMe && (
              <Text style={styles.tickIcon}>✔✔</Text>
            )}
          </View>
        </View>
      </View>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff3a76" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {!selectedChat ? (
        <>
          <Text style={styles.header}>Chats</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#ff3a76" />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={chats}
              keyExtractor={item => item.chatRoomId || item._id}
              renderItem={renderChatItem}
              contentContainerStyle={styles.list}
            />
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  latestMsgText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    maxWidth: 180,
  },
  footerIconImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12, 
  },
	container: {
		flex: 1,
		backgroundColor: 'black',
		paddingTop: 50,
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginBottom: 10,
	},
	list: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	chatItem: {
		backgroundColor: '#ffe6eb',
		borderRadius: 10,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
	},
	chatRoomId: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	userName: {
		fontSize: 15,
		color: '#666',
		marginTop: 4,
	},
	error: {
		color: 'red',
		textAlign: 'center',
		marginTop: 20,
	},
	messagesContainer: {
		flex: 1,
		paddingHorizontal: 8,
		paddingTop: 10,
		backgroundColor:"white"
	},
	backBtn: {
		marginBottom: 10,
		alignSelf: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: '#eee',
		borderRadius: 6,
	},
	backBtnText: {
		color: '#ff3a76',
		fontWeight: 'bold',
		fontSize: 16,
	},
	messagesList: {
		paddingBottom: 20,
	},
	messageRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		marginBottom: 10,
		paddingHorizontal: 4,
	},
	messageRowMe: {
		justifyContent: 'flex-end',
	},
	messageRowOther: {
		justifyContent: 'flex-start',
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginHorizontal: 6,
		backgroundColor: '#eee',
	},
	bubble: {
		maxWidth: '70%',
		padding: 12,
		borderRadius: 18,
		marginHorizontal: 2,
	},
	// WhatsApp-like message bubbles
	bubbleMeWhatsapp: {
		backgroundColor: '#dcf8c6',
		alignSelf: 'flex-end',
		borderRadius: 16,
		borderTopRightRadius: 4,
		marginLeft: 40,
		marginRight: 4,
		padding: 10,
		marginBottom: 2,
		maxWidth: '80%',
	},
	bubbleOtherWhatsapp: {
		backgroundColor: '#fff',
		alignSelf: 'flex-start',
		borderRadius: 16,
		borderTopLeftRadius: 4,
		marginRight: 40,
		marginLeft: 4,
		padding: 10,
		marginBottom: 2,
		borderWidth: 1,
		borderColor: '#ececec',
		maxWidth: '80%',
	},
	messageTextWhatsapp: {
		fontSize: 16,
		color: '#222',
	},
	messageTimeWhatsapp: {
		fontSize: 11,
		color: '#888',
		marginLeft: 4,
	},
	timeTickRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginTop: 2,
	},
	tickIcon: {
		fontSize: 12,
		color: '#34b7f1',
		marginLeft: 2,
	},
	// WhatsApp-like input bar
	inputContainerWhatsapp: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
		borderTopWidth: 1,
		borderColor: '#ececec',
		backgroundColor: '#fff',
		marginBottom: 30,
	},
	inputWhatsapp: {
		flex: 1,
		minHeight: 40,
		maxHeight: 120,
		borderWidth: 0,
		borderRadius: 20,
		paddingHorizontal: 16,
		backgroundColor: '#f0f0f0',
		fontSize: 16,
		marginHorizontal: 4,
		color: '#222',
		textAlignVertical: 'top',
	},
	iconBtn: {
		padding: 6,
		marginHorizontal: 2,
	},
	icon: {
		fontSize: 20,
	},
	sendBtnWhatsapp: {
		backgroundColor: '#25d366',
		borderRadius: 20,
		paddingHorizontal: 14,
		paddingVertical: 8,
		marginLeft: 2,
	},
	sendBtnTextWhatsapp: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 18,
	},
});


export default ChatInterface;

