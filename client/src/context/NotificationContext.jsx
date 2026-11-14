import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        const notifs = res.data.data.notifications || [];
        const unread = typeof res.data.data.unreadCount === 'number'
          ? res.data.data.unreadCount
          : notifs.filter((n) => !n.isRead).length;

        setNotifications(notifs);
        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    // Find target to know if it was unread
    const target = notifications.find((n) => n._id === id);
    const wasUnread = target ? !target.isRead : false;

    // Optimistic local state update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (!res.data?.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to mark notification read', err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0 && notifications.every((n) => n.isRead)) {
      return;
    }

    setMarkingAll(true);
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      const res = await api.patch('/notifications/read-all');
      if (res.data?.success) {
        toast.success('All notifications marked as read');
      } else {
        fetchNotifications();
        toast.error('Failed to mark all as read');
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
      fetchNotifications();
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markingAll,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
