const DEFAULT_NOTIFICATION_URL = 'https://izhaarlove.com/';

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();

        // Determine notification type and customize accordingly
        const notificationType = data.type || (data.data && data.data.type) || 'IZHAAR';
        let title = data.title || 'Izhaar ❤️';
        let body = data.body || 'Someone is waiting for you ❤️';
        let tag = data.tag || 'izhaar-notification';
        let vibrate = [200, 100, 200, 100, 400];
        let badge = '/izhaar-logo.png';

        // Customize based on notification type (only if not provided by backend)
        if (!data.title || !data.body) {
            if (notificationType === 'LETTER') {
                title = '💌 New Letter';
                body = data.senderName ? `${data.senderName} sent you a letter` : 'Someone sent you a letter ❤️';
                vibrate = [300, 150, 300];
            } else if (notificationType === 'SONG') {
                title = '🎵 New Song';
                body = data.senderName ? `${data.senderName} sent you a song` : 'Someone sent you a song 🎵';
                vibrate = [150, 100, 150, 100, 150];
            } else if (notificationType === 'MESSAGE') {
                title = '💬 New Message';
                body = data.senderName ? `${data.senderName}: ${data.preview || 'New message'}` : 'New message received';
                tag = 'chat-notification';
                vibrate = [100, 50, 100];
            } else if (notificationType === 'REQUEST') {
                title = '📋 New Request';
                body = data.senderName ? `${data.senderName} has a request` : 'Someone sent you a request';
                tag = 'request-notification';
                vibrate = [250, 100, 250];
            } else if (notificationType === 'WATCH_PARTY_INVITE') {
                title = '🎬 Watch Party Invite';
                body = data.senderName ? `${data.senderName} invited you to a watch party` : 'You have a watch party invite';
                tag = 'watch-party-invite';
                vibrate = [200, 100, 200];
            } else if (notificationType === 'QUIZ_INVITE') {
                title = '🎮 Quiz Challenge';
                body = data.senderName ? `${data.senderName} challenged you to a quiz!` : 'You have a quiz challenge!';
                tag = 'quiz-invite';
                vibrate = [100, 50, 100, 50, 100];
            }
        }

        const options = {
            body: body,
            icon: '/izhaar-logo.png',
            badge: badge,
            tag: tag, // Group notifications by type
            renotify: true, // Alert even if notification with same tag exists
            timestamp: Date.now(),
            data: {
                type: notificationType,
                senderName: data.senderName,
                url: data.url || (data.data && data.data.url) || DEFAULT_NOTIFICATION_URL
            },
            vibrate: vibrate,
            requireInteraction: false,
            silent: false,
            dir: 'auto',
            lang: 'en-US'
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Determine the URL to navigate to
    let url = DEFAULT_NOTIFICATION_URL;
    const notificationData = event.notification.data;

    if (notificationData && (notificationData.url || notificationData.navigateTo)) {
        const path = notificationData.url || notificationData.navigateTo;
        // If it's a relative path, append it to the base URL
        if (path.startsWith('/')) {
            url = new URL(path, self.location.origin).href;
        } else if (path.startsWith('http')) {
            url = path;
        }
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Look for existing window
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // Check if the client is already at the target URL or home
                if ('focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            // If no window exists, open new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// PWA Installation requirements: Install, Activate, and Fetch events
self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim any existing clients immediately
    event.waitUntil(clients.claim());
});

// Mandatory fetch event for PWA installability
self.addEventListener('fetch', (event) => {
    // Simple pass-through fetch - could be used for caching later
    event.respondWith(fetch(event.request));
});
