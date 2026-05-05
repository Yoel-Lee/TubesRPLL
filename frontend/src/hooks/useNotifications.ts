import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useNotifications(userRole: string | undefined) {
  const [notifications, setNotifications] = useState<any[]>([]);

  // mengambil data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error("Gagal memuat notifikasi", error);
      }
    };
    
    if (userRole) {
      fetchNotifications();
    }
  }, [userRole]);

  // menghitung notif yang belum dibaca
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // menandai satu dibaca
  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Gagal update notifikasi", error);
    }
  };

  // menandai semua dibaca
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Gagal update semua notifikasi", error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}