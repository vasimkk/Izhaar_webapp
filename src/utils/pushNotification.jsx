import api from "./api";

const VAPID_PUBLIC_KEY = "BBwW_63-Frj2jtrPBDy4QawsPQtn4zdFJMwAE2t4f1N7_HpjVNGuP3eMFMu6clOfUY_UtVKHGLMiEwKOOaJk8Js";

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const registerPushNotification = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied.');
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Send subscription to backend
        await api.post('/notifications/subscribe', { subscription });
        console.log('Push subscription successful');
    } catch (error) {
        console.error('Error during push notification registration:', error);
    }
};

// New function to ask for notification permission every time user enters dashboard
export const requestNotificationPermission = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported in this browser.');
        return;
    }

    try {
        // Check current permission status
        const currentPermission = Notification.permission;

        // If already granted, just ensure subscription is active
        if (currentPermission === 'granted') {
            await registerPushNotification();
            return;
        }

        // Ask user if they want to enable notifications
        const userWantsNotifications = window.confirm(
            '❤️ Do you want to receive real-time notifications when someone sends you an Izhaar?\n\nYou\'ll be notified instantly when someone is waiting for you!'
        );

        if (userWantsNotifications) {
            await registerPushNotification();
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
};

