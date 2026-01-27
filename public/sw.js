self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: 'Someone is waiting for you ❤️',
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'izhaar-notification', // Group notifications together
            renotify: true, // Alert even if notification with same tag exists
            timestamp: Date.now(),
            data: data.data || {}, // Contains the URL
            vibrate: [200, 100, 200, 100, 400], // Distinct "Alert" pattern
            requireInteraction: false, // Changed to false to avoid spam detection
            silent: false,
            // actions: [
            //     { action: 'open_url', title: 'Check Now', icon: '/logo192.png' }
            // ]
        };

        event.waitUntil(
            self.registration.showNotification('Izhaar ❤️', options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    let url = '/';
    if (event.notification.data && event.notification.data.url) {
        url = event.notification.data.url;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // If a window is already open, focus it and navigate
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
