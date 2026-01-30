import { useNotification } from '../contexts/NotificationContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationItem = ({ notification, onRemove }) => {
  const TYPE_CONFIG = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50 border-green-200',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-50 border-red-200',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      bg: 'bg-yellow-50 border-yellow-200',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50 border-blue-200',
    },
  };

  const getIcon = (type) =>
    TYPE_CONFIG[type]?.icon ?? TYPE_CONFIG.info.icon;

  const getBgColor = (type) =>
    TYPE_CONFIG[type]?.bg ?? TYPE_CONFIG.info.bg;


  return (
    <div className={`flex items-center p-4 mb-4 border rounded-lg shadow-lg ${getBgColor(notification.type)}`}>
      {getIcon(notification.type)}
      <span className="ml-3 flex-1 text-sm font-medium text-gray-800">
        {notification.message}
      </span>
      <button
        onClick={() => onRemove(notification.id)}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;