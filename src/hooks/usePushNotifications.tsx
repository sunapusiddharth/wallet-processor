import { useEffect } from 'react';

const VAPID_PUBLIC_KEY = '<YOUR_PUBLIC_VAPID_KEY>';

export function usePushNotifications(userId:string) {
    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        const subscribeUser = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const permission = await Notification.requestPermission();

                if (permission !== 'granted') return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });

                // Send to backend
                await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    body: JSON.stringify(subscription),
                });
            } catch (error) {
                console.error('Push subscription failed:', error);
            }
        };

        subscribeUser();
    }, [userId]);
}

function urlBase64ToUint8Array(base64String:string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}