self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        
        // Determine notification type and customize accordingly
        const notificationType = data.type || 'IZHAAR';
        let title = 'Izhaar ❤️';
        let body = 'Someone is waiting for you ❤️';
        let tag = 'izhaar-notification';
        let vibrate = [200, 100, 200, 100, 400];
        let badge = '/izhaar-logo.png';
        
        // Customize based on notification type
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
        }
        
        const options = {
            body: body,
            icon: '/izhaar-logo.png',
            badge: badge,
            tag: tag, // Group notifications by type
            renotify: true, // Alert even if notification with same tag exists
            timestamp: Date.now(),
            data: {
                ...data.data,
                type: notificationType,
                senderName: data.senderName
            },
            vibrate: vibrate,
            requireInteraction: false,
            silent: false,
            // Notification actions
            actions: [
                {
                    action: 'view',
                    title: 'View',
                    icon: '/izhaar-logo.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/izhaar-logo.png'
                }
            ],
            dir: 'auto',
            lang: 'en-US',
            // Rich notification features
            badge: '/izhaar-logo.png',
            tag: tag
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Handle different actions
    if (event.action === 'dismiss') {
        // Just close the notification
        return;
    }
    
    // Determine URL based on notification type
    let url = '/';
    const notificationType = event.notification.data?.type || 'IZHAAR';
    
    if (event.notification.data && event.notification.data.url) {
        url = event.notification.data.url;
    } else {
        // Default routing based on type
        switch(notificationType) {
            case 'LETTER':
                url = '/user/notifictions/IzhaarNotificationDetail';
                break;
            case 'SONG':
                url = '/user/notifictions/IzhaarNotificationDetail';
                break;
            case 'MESSAGE':
                url = '/user/chat-interface';
                break;
            case 'REQUEST':
                url = '/user/requests';
                break;
            default:
                url = '/user/dashboard';
        }
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Look for existing window with matching URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // If no matching window, open new one and navigate
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
