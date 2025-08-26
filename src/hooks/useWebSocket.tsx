import { useEffect, useCallback, useState } from 'react';

export function useWebSocket(userId:string) {
    const [socket, setSocket] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Connect to WebSocket
    useEffect(() => {
        if (!userId) return;

        const ws = new WebSocket(`ws://localhost:8080/ws?user_id=${userId}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsOnline(true);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'notification':
                    setNotifications(prev => [message.data, ...prev]);
                    break;
                case 'online':
                    setIsOnline(message.status);
                    break;
                default:
                    console.log('Unknown message type:', message.type);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsOnline(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [userId]);

    // Send message helper
    const send = useCallback((type, data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type, data }));
        }
    }, [socket]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        send('read', notificationId);
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            )
        );
    }, [send]);

    return {
        isOnline,
        notifications,
        markAsRead,
        send
    };
}