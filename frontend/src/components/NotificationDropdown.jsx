import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const recentNotifications = notifications.slice(0, 10);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    onClose();
    if (notification.issue_id) {
      navigate(`/issues/${notification.issue_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Upravo';
    if (diffMins < 60) return `Prije ${diffMins} min`;
    if (diffHours < 24) return `Prije ${diffHours} h`;
    if (diffDays < 7) return `Prije ${diffDays} dana`;
    return date.toLocaleDateString('hr-HR');
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg border z-50 max-h-96 overflow-y-auto">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Obavijesti</h3>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Oznaci sve kao procitano
          </button>
        )}
      </div>

      {recentNotifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500 text-sm">
          Nemate obavijesti
        </div>
      ) : (
        <ul>
          {recentNotifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.is_read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {!notification.is_read && (
                  <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                )}
                <div className={`flex-1 ${notification.is_read ? 'ml-4' : ''}`}>
                  <p className="text-sm text-gray-800 leading-tight">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
