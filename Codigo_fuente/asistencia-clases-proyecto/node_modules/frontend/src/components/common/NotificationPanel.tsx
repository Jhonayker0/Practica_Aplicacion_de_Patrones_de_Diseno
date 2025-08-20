import React, { useState, useEffect } from 'react';

interface NotificationPanelProps {
  notifications: string[];
  alerts: string[];
  stats: any;
  onClearNotifications: () => void;
  onClearAlerts: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  alerts,
  stats,
  onClearNotifications,
  onClearAlerts
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'stats'>('notifications');

  // Mostrar panel automáticamente cuando hay notificaciones nuevas
  useEffect(() => {
    if (notifications.length > 0 || alerts.length > 0) {
      setIsVisible(true);
    }
  }, [notifications.length, alerts.length]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Ver notificaciones"
        >
          🔔
          {(notifications.length + alerts.length > 0) && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length + alerts.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-800">🔔 Centro de Notificaciones</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'notifications'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Actividad ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'alerts'
              ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Alertas ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'stats'
              ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Stats
        </button>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {activeTab === 'notifications' && (
          <div className="p-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay notificaciones</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="text-sm p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r"
                    >
                      {notification}
                    </div>
                  ))}
                </div>
                <button
                  onClick={onClearNotifications}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition-colors"
                >
                  Limpiar Notificaciones
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="p-4">
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay alertas</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`text-sm p-3 rounded border-l-4 ${
                        alert.includes('CRÍTICA') || alert.includes('GRAVE')
                          ? 'bg-red-50 border-red-400 text-red-800'
                          : alert.includes('ATENCIÓN')
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                          : 'bg-green-50 border-green-400 text-green-800'
                      }`}
                    >
                      {alert}
                    </div>
                  ))}
                </div>
                <button
                  onClick={onClearAlerts}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200 transition-colors"
                >
                  Limpiar Alertas
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Total marcado:</span>
                <span className="font-medium">{stats.totalMarked || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Cambios realizados:</span>
                <span className="font-medium">{stats.changesCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Hora más activa:</span>
                <span className="font-medium">{stats.mostActiveTime || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Última actualización:</span>
                <span className="font-medium text-xs">
                  {stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;