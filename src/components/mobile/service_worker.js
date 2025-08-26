self.addEventListener('push', event => {
    const data = event.data.json();
    const { title, message, url } = data;

    event.waitUntil(
        self.registration.showNotification(title, {
            body: message,
            icon: '/logo.png',
            data: { url },
            badge: '/badge.png',
            vibrate: [200, 100, 200]
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data?.url || '/notifications';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            const client = windowClients.find(c =>
                c.url === url && 'focus' in c
            );

            if (client) return client.focus();

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
})