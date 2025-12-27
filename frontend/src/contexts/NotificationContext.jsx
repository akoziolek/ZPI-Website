import React, { useState, useCallback, useMemo } from 'react';
import { NotificationContext } from '../hooks/useNotification';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  const showSuccess = useCallback((message, duration) => addNotification(message, 'success', duration), [addNotification]);
  const showError = useCallback((message, duration) => addNotification(message, 'error', duration), [addNotification]);
  const showWarning = useCallback((message, duration) => addNotification(message, 'warning', duration), [addNotification]);
  const showInfo = useCallback((message, duration) => addNotification(message, 'info', duration), [addNotification]);

  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }), [notifications, addNotification, removeNotification, showSuccess, showError, showWarning, showInfo]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};