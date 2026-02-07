import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config/config';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { accessToken } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);
    const [unseenChatCount, setUnseenChatCount] = useState(0);
    const [unseenCrushCount, setUnseenCrushCount] = useState(0);
    const [unseenPartyCount, setUnseenPartyCount] = useState(0);
    const [unseenQuizCount, setUnseenQuizCount] = useState(0);
    const [activeInvite, setActiveInvite] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Sound URLs
    const INVITE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';
    const MESSAGE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3';
    const DEFAULT_NOTIFICATION_URL = 'https://izhaarlove.com/';

    // Extract userId from token
    const [tokenUserId, setTokenUserId] = useState(null);

    useEffect(() => {
        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                setTokenUserId(payload.id || payload.userId);
            } catch (e) {
                console.error("Failed to decode token:", e);
            }
        } else {
            setTokenUserId(null);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            setCurrentUser(null);
            return;
        }
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                setCurrentUser(res.data.profile || res.data);
            } catch (err) {
                console.error("Failed to fetch profile in NotificationContext:", err);
            }
        };
        fetchProfile();
    }, [accessToken]);

    const playSound = (url) => {
        try {
            const audio = new Audio(url);
            audio.play().catch(e => console.log("Audio play blocked by browser:", e));
        } catch (err) {
            console.error("Sound error:", err);
        }
    };

    const showLocalNotification = async ({ title, body, tag, data }) => {
        try {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration?.showNotification) return;
            await registration.showNotification(title, {
                body,
                icon: '/izhaar-logo.png',
                badge: '/izhaar-logo.png',
                tag,
                renotify: true,
                timestamp: Date.now(),
                data: {
                    ...data,
                    navigateTo: DEFAULT_NOTIFICATION_URL
                },
                vibrate: [200, 100, 200],
                requireInteraction: false,
                silent: false,
                dir: 'auto',
                lang: 'en-US'
            });
        } catch (err) {
            console.error('Local notification error:', err);
        }
    };

    const fetchSummary = useCallback(async () => {
        if (!tokenUserId) return;
        try {
            const mobileParam = (currentUser && currentUser.mobile) ? currentUser.mobile : 'me';
            const res = await api.get(`/notification/summary/${mobileParam}`);
            setUnseenNotificationCount(Number(res.data.totalUnseenNotifications) || 0);
            setUnseenChatCount(Number(res.data.unseenChatCount) || 0);
            setUnseenCrushCount(Number(res.data.unseenCrushCount) || 0);
            setUnseenPartyCount(Number(res.data.unseenPartyCount) || 0);
            setUnseenQuizCount(Number(res.data.unseenQuizCount) || 0);
        } catch (err) {
            console.error("Failed to fetch notification summary:", err);
        }
    }, [tokenUserId, currentUser]);

    useEffect(() => {
        if (!tokenUserId) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(BASE_URL, {
            query: { userId: tokenUserId },
        });

        setSocket(newSocket);
        fetchSummary();

        // Socket Listeners
        newSocket.on("quiz-invite-received", (data) => {
            setUnseenNotificationCount(prev => prev + 1);
            setActiveInvite(data);
            playSound(INVITE_SOUND);
            toast.info(`🎮 Quiz Challenge from ${data.senderName}!`);
        });

        newSocket.on("watch-party-invite", (data) => {
            setUnseenNotificationCount(prev => prev + 1);
            playSound(INVITE_SOUND);
            toast.info(`🎬 Watch Party Invite from ${data.hostName}!`, {
                onClick: () => window.location.href = `/user/watch-party?roomId=${data.roomId}`
            });
            showLocalNotification({
                title: '🎬 Watch Party Invite',
                body: data.hostName ? `${data.hostName} invited you to a watch party` : 'You have a watch party invite',
                tag: 'watch-party-invite',
                data: { type: 'WATCH_PARTY_INVITE', senderName: data.hostName }
            });
        });

        newSocket.on("secret-crush-update", (data) => {
            setUnseenNotificationCount(prev => prev + 1);
            playSound(INVITE_SOUND);
            toast.info(`🤫 ${data.message || "Someone added you as a secret crush!"}`, {
                onClick: () => window.location.href = `/user/secret-crush`
            });
            showLocalNotification({
                title: 'New Secret Crush! 🤫',
                body: data.message,
                tag: 'secret-crush-update',
                data: { type: 'SECRET_CRUSH_ADDED', url: '/user/secret-crush' }
            });
        });

        newSocket.on("new-izhaar-notification", (data) => {
            setUnseenNotificationCount(prev => prev + 1);
            playSound(INVITE_SOUND);
            toast.info(`❤️ ${data.message || "Someone is waiting for you!"}`, {
                onClick: () => window.location.href = `/user/notifications`
            });
        });

        newSocket.on("new-message", (data) => {
            const userId = tokenUserId;
            // Don't increment if we sent the message
            if (String(data.senderId) === String(userId)) return;

            // Only increment if we are not currently in that chat room
            const currentPath = window.location.pathname;
            if (!currentPath.includes(`/user/chat/${data.chatRoomId}`) &&
                !currentPath.includes(`/user/chat-interface`)) {
                setUnseenChatCount(prev => prev + 1);
                playSound(MESSAGE_SOUND);
            }
        });

        newSocket.on("messages-seen", (data) => {
            // If messages were seen, we might want to refresh summary or decrement count
            // But it's complex to know exactly how many were seen without a full refresh
            fetchSummary();
        });

        return () => {
            newSocket.disconnect();
        };
    }, [tokenUserId, fetchSummary]);

    const markAsRead = async (type, notificationId = null) => {
        if (!currentUser || !currentUser.mobile) return;
        try {
            await api.post('/notification/mark-read', {
                type,
                notificationId,
                mobile: currentUser.mobile
            });
            fetchSummary();
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            unseenNotificationCount,
            unseenChatCount,
            unseenCrushCount,
            unseenPartyCount,
            unseenQuizCount,
            activeInvite,
            setActiveInvite,
            fetchSummary,
            markAsRead,
            socket
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
