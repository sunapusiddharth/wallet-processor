import React, { useState, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { FixedSizeList as List } from 'react-window';
import { useWebSocket } from '../../hooks/useWebSocket';
import { usePushNotifications } from '../../hooks/usePushNotifications';

const PAGE_SIZE = 20;

const NotificationsPage = ({ userId }) => {
    const [newNotifications, setNewNotifications] = useState([]);
    const { isOnline, notifications, markAsRead } = useWebSocket(userId);
    usePushNotifications(userId);

    // Fetch historical notifications
    const fetchNotifications = useCallback(async ({ pageParam = 0 }) => {
        const response = await fetch(
            `/api/notifications?user_id=${userId}&page=${pageParam}`
        );
        return response.json();
    }, [userId]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ['notifications', userId],
        fetchNotifications,
        {
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
            },
        }
    );

    // Combine WebSocket and historical notifications
    const allNotifications = [
        ...newNotifications,
        ...(data?.pages?.flat() || [])
    ];

    // Handle new WebSocket notifications
    React.useEffect(() => {
        if (notifications.length > 0) {
            setNewNotifications(prev => [
                ...notifications.filter(n => !prev.some(p => p.id === n.id)),
                ...prev
            ]);
        }
    }, [notifications]);

    // Virtualized list renderer
    const Row = ({ index, style }) => {
        const notification = allNotifications[index];
        const isNew = newNotifications.some(n => n.id === notification.id);

        return (
            <div
                style={style}
                className={`notification-item ${isNew ? 'new' : ''} ${notification.isRead ? '' : 'unread'}`}
            >
                <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className={`priority-badge ${notification.risk_level}`}>
                        {notification.risk_level.toUpperCase()}
                    </span>
                    {!notification.isRead && (
                        <button
                            className="mark-read"
                            onClick={() => markAsRead(notification.id)}
                        >
                            Mark Read
                        </button>
                    )}
                </div>
                <p>{notification.message}</p>
                <time>{new Date(notification.created_at).toLocaleString()}</time>
            </div>
        );
    };

    return (
        <div className="notifications-page">
            <div className="status-bar">
                <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </span>
                <h2>Notifications</h2>
            </div>

            {allNotifications.length > 0 ? (
                <List
                    height={600}
                    itemCount={allNotifications.length}
                    itemSize={120}
                    width="100%"
                    onItemsRendered={({ visibleStopIndex }) => {
                        if (visibleStopIndex === allNotifications.length - 5 &&
                            hasNextPage &&
                            !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                >
                    {Row}
                </List>
            ) : (
                <div className="empty-state">
                    <p>No notifications yet</p>
                </div>
            )}

            {isFetchingNextPage && (
                <div className="loading-indicator">Loading more...</div>
            )}
        </div>
    );
};

export default NotificationsPage;