
import { useState } from 'react';
import profileImg from '../../assets/images/profile.png';

function ChatRoomView({ selectedChat, setSelectedChat, messages, messagesLoading, renderMessageItem, newMessage, setNewMessage, sending, handleSendMessage, currentUserId, participants, chats, setParticipants, showMenu, setShowMenu, handleRevealIdentity, izhaarStatuses, getIzhaarCode }) {
    const [isTyping, setIsTyping] = useState(false); // You can wire this up to your socket events
    // Determine chat partner info
    let chatPartner = null;
    let chatPartnerName = '';
    let chatPartnerAvatar = null;
    let chatPartnerStatus = '';

    if (participants) {
        if (selectedChat.senderId === currentUserId) {
            // Sender: show receiver info
            chatPartner = participants.receiver;
        } else {
            // Receiver: show sender info (if revealed)
            const code = getIzhaarCode(selectedChat);
            const izhaarStatus = izhaarStatuses ? izhaarStatuses[code] : null;
            if (izhaarStatus?.sender_revealed) {
                chatPartner = participants.sender;
                chatPartnerName = izhaarStatus.sender_name || participants.sender?.name || 'Unknown';
            } else {
                chatPartner = null;
                chatPartnerName = 'Anonymous';
            }
        }
        if (!chatPartnerName) chatPartnerName = chatPartner?.name || 'Anonymous';
        chatPartnerAvatar = chatPartner?.avatar || null;
        // Status logic (assumes chatPartner.online and chatPartner.lastSeen are available)
        if (isTyping) {
            chatPartnerStatus = 'Typing...';
        } else if (chatPartner) {
            if (typeof chatPartner.online !== 'undefined') {
                if (chatPartner.online) {
                    chatPartnerStatus = 'Online';
                } else if (chatPartner.lastSeen) {
                    const lastSeenDate = new Date(chatPartner.lastSeen);
                    chatPartnerStatus = `Last seen: ${lastSeenDate.toLocaleString()}`;
                } else {
                    chatPartnerStatus = 'Offline';
                }
            } else {
                chatPartnerStatus = 'Offline';
            }
        } else {
            chatPartnerStatus = '';
        }
    }

    const isSender = selectedChat.senderId === currentUserId;
    return (
        <div className="flex flex-col h-screen bg-black">
            {/* Header */}
            <div className="flex flex-row items-center px-4 py-3 bg-black border-b border-gray-800">
                <button onClick={() => setSelectedChat(null)} className="text-white text-2xl font-bold mr-2">{'< '}</button>
                {chatPartnerAvatar ? (
                    <img src={chatPartnerAvatar} alt="Avatar" className="w-12 h-12 rounded-full bg-gray-200" />
                ) : (
                    <img src={profileImg} alt="Avatar" className="w-12 h-12 rounded-full bg-gray-200" />
                )}
                <div className="flex flex-col flex-1 ml-3">
                    <span className="text-white text-xl font-bold">{chatPartnerName}</span>
                    {chatPartnerStatus ? (
                        <span className="text-gray-400 text-xs mt-0.5">{chatPartnerStatus}</span>
                    ) : null}
                </div>
                <button className="ml-auto px-2 py-1 text-white text-2xl font-bold" onClick={() => setShowMenu(true)}>⋮</button>
            </div>
            {/* Menu Modal */}
            {showMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-end z-50" onClick={() => setShowMenu(false)}>
                    <div className="bg-gray-900 rounded-lg mt-16 mr-4 py-2 w-40 flex flex-col shadow-lg" onClick={e => e.stopPropagation()}>
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-gray-800" onClick={() => { setShowMenu(false); /* clear chat logic here */ }}>Clear Chat</button>
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-gray-800" onClick={() => { setShowMenu(false); /* block logic here */ }}>Block</button>
                        {isSender && (
                            <button className="py-2 px-5 text-white text-base text-left hover:bg-gray-800" onClick={() => handleRevealIdentity(selectedChat)}>Reveal Identity</button>
                        )}
                        <button className="py-2 px-5 text-white text-base text-left hover:bg-gray-800" onClick={() => setShowMenu(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {/* Messages */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto px-2 pt-3 pb-2">
                {messagesLoading ? (
                    <div className="flex flex-1 justify-center items-center"><div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {messages.map((item, idx) => {
                            let msgTime = '';
                            if (item.createdAt) {
                                msgTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } else if (item.updatedAt) {
                                msgTime = new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            const isMe = item.senderId === currentUserId;
                            return (
                                <div key={item.id || item._id || idx} className={`flex mb-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-base ${isMe ? 'bg-green-100 rounded-tr-md ml-10' : 'bg-white border border-gray-200 rounded-tl-md mr-10'}`}>
                                        <div className="text-gray-900">{item.text || item.message}</div>
                                        {msgTime && <div className="flex items-center justify-end mt-1 text-xs text-gray-500">{msgTime}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                {/* Typing indicator */}
                {isTyping && (
                    <div className="ml-4 mb-2 text-gray-400 italic text-sm">Typing...</div>
                )}
            </div>
            {/* Input Bar */}
            <div className="flex flex-row items-center px-2 py-3 border-t border-gray-200 bg-white">
                <button className="px-2 text-xl">📎</button>
                <textarea
                    className="flex-1 min-h-[40px] max-h-[120px] rounded-2xl px-4 py-2 bg-gray-100 text-base text-gray-900 mx-2 resize-none focus:outline-none"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    maxLength={1000}
                    rows={1}
                />
                <button
                    onClick={handleSendMessage}
                    className={`ml-2 px-4 py-2 rounded-2xl font-bold text-lg ${sending || !newMessage.trim() ? 'bg-green-200 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    disabled={sending || !newMessage.trim()}
                >▶</button>
            </div>
        </div>
    );
}





export default ChatRoomView;

