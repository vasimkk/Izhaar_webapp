import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'black' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>{'< '}</Text>
                </TouchableOpacity>
                {chatPartnerAvatar ? (
                    <Image source={{ uri: chatPartnerAvatar }} style={styles.avatarLarge} />
                ) : (
                    <Image source={require('../../assets/images/profile.png')} style={styles.footerIconImg} />
                )}
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.chatPartnerName}>{chatPartnerName}</Text>
                    {chatPartnerStatus ? (
                        <Text style={styles.chatPartnerStatus}>{chatPartnerStatus}</Text>
                    ) : null}
                </View>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenu(true)}>
                    <Text style={styles.menuBtnText}>⋮</Text>
                </TouchableOpacity>
            </View>
            {/* Menu Modal */}
            <Modal
                visible={showMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMenu(false)}
            >
                <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMenu(false)}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); /* clear chat logic here */ }}>
                            <Text style={styles.menuItemText}>Clear Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); /* block logic here */ }}>
                            <Text style={styles.menuItemText}>Block</Text>
                        </TouchableOpacity>
                        {isSender && (
                            <TouchableOpacity style={styles.menuItem} onPress={() => handleRevealIdentity(selectedChat)}>
                                <Text style={styles.menuItemText}>Reveal Identity</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>
                            <Text style={styles.menuItemText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <View style={styles.messagesContainer}>
                {messagesLoading ? (
                    <ActivityIndicator size="large" color="#ff3a76" />
                ) : (
                    <FlatList
                        data={messages}
                        keyExtractor={item => item.id?.toString() || item._id || Math.random().toString()}
                        renderItem={({ item }) => {
                            // Only show time if createdAt or updatedAt exists
                            let msgTime = '';
                            if (item.createdAt) {
                                msgTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            } else if (item.updatedAt) {
                                msgTime = new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            return (
                                <View style={item.senderId === currentUserId ? styles.bubbleMeWhatsapp : styles.bubbleOtherWhatsapp}>
                                    <Text style={styles.messageTextWhatsapp}>{item.text || item.message}</Text>
                                    {msgTime ? (
                                        <Text style={styles.messageTimeWhatsapp}>{msgTime}</Text>
                                    ) : null}
                                </View>
                            );
                        }}
                        contentContainerStyle={styles.messagesList}
                    />
                )}
                {/* Typing indicator */}
                {isTyping && (
                    <View style={styles.typingIndicator}><Text style={styles.typingText}>Typing...</Text></View>
                )}
                <View style={styles.inputBarContainer}>
                    <TouchableOpacity style={styles.iconBtn}><Text style={styles.icon}>📎</Text></TouchableOpacity>
                    <TextInput
                        style={styles.inputWhatsapp}
                        value={newMessage}
                        onChangeText={text => {
                            setNewMessage(text);
                            // setIsTyping(true); // You can wire this up to your socket events
                        }}
                        placeholder="Type your message..."
                        editable={!sending}
                        placeholderTextColor="#888"
                        multiline
                        maxLength={1000}
                        blurOnSubmit={false}
                        returnKeyType="default"
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendBtnWhatsapp} disabled={sending || !newMessage.trim()}>
                        <Text style={styles.sendBtnTextWhatsapp}>▶</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'black',
        // paddingTop: 30,
        // paddingBottom: 10,
        paddingHorizontal: 16,
    },
      menuBtn: {
            marginLeft: 'auto',
            padding: 8,
        },
        menuBtnText: {
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
        },
        menuOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
        },
        menuContainer: {
            backgroundColor: '#222',
            borderRadius: 10,
            marginTop: 60,
            marginRight: 16,
            paddingVertical: 8,
            width: 150,
            elevation: 5,
        },
        menuItem: {
            paddingVertical: 12,
            paddingHorizontal: 20,
        },
        menuItemText: {
            color: 'white',
            fontSize: 16,
        },
        typingIndicator: {
            alignSelf: 'flex-start',
            marginLeft: 16,
            marginBottom: 8,
        },
        typingText: {
            color: '#888',
            fontStyle: 'italic',
            fontSize: 14,
        },
        inputBarContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            borderTopWidth: 1,
            borderColor: '#ececec',
            backgroundColor: '#fff',
            marginBottom: 30,
        },
    chatPartnerName: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    chatPartnerStatus: {
        color: '#aaa',
        fontSize: 13,
        marginLeft: 12,
        marginTop: -4,
    },
    avatarLarge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eee',
    },
    avatarLargePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#444',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        // marginBottom: 10,
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
        fontSize: 14,
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
       padding:10,
        
    },
    backBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
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


export default ChatRoomView;

