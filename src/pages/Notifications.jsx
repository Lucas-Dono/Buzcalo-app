import { useState } from 'react';

function Notifications() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'connection',
      user: 'Carlos Méndez',
      avatar: 'CM',
      action: 'aceptó tu solicitud de conexión',
      time: 'Hace 5 minutos',
      read: false,
      gradient: 'from-primary-500 to-accent-500'
    },
    {
      id: 2,
      type: 'recommendation',
      user: 'Ana Torres',
      avatar: 'AT',
      action: 'recomendó tu publicación',
      time: 'Hace 1 hora',
      read: false,
      gradient: 'from-secondary-500 to-primary-500'
    },
    {
      id: 3,
      type: 'comment',
      user: 'Roberto Silva',
      avatar: 'RS',
      action: 'comentó en tu publicación: "Excelente trabajo!"',
      time: 'Hace 3 horas',
      read: false,
      gradient: 'from-accent-500 to-secondary-500'
    },
    {
      id: 4,
      type: 'follow',
      user: 'María González',
      avatar: 'MG',
      action: 'comenzó a seguirte',
      time: 'Hace 5 horas',
      read: true,
      gradient: 'from-primary-400 to-secondary-400'
    },
    {
      id: 5,
      type: 'mention',
      user: 'Luis Ramírez',
      avatar: 'LR',
      action: 'te mencionó en un comentario',
      time: 'Ayer',
      read: true,
      gradient: 'from-accent-400 to-primary-400'
    },
    {
      id: 6,
      type: 'job',
      user: 'Tech Innovators',
      avatar: 'TI',
      action: 'publicó una nueva oportunidad laboral que podría interesarte',
      time: 'Hace 2 días',
      read: true,
      gradient: 'from-secondary-400 to-accent-400'
    },
    {
      id: 7,
      type: 'recommendation',
      user: 'Patricia Morales',
      avatar: 'PM',
      action: 'recomendó tu negocio',
      time: 'Hace 3 días',
      read: true,
      gradient: 'from-primary-500 to-secondary-500'
    },
  ];

  const filters = [
    { value: 'all', label: 'Todas', icon: '🔔' },
    { value: 'connection', label: 'Conexiones', icon: '👥' },
    { value: 'recommendation', label: 'Recomendaciones', icon: '👍' },
    { value: 'comment', label: 'Comentarios', icon: '💬' },
    { value: 'job', label: 'Oportunidades', icon: '💼' },
  ];

  const getIcon = (type) => {
    const icons = {
      connection: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      recommendation: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      comment: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      follow: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      mention: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      ),
      job: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    };
    return icons[type] || icons.connection;
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Notificaciones</h1>
            <p className="text-neutral-600">
              Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </p>
          </div>
          <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-semibold text-sm">
            Marcar todas como leídas
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                filter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-primary-50/30' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${notification.gradient} flex items-center justify-center text-white font-semibold`}>
                      {notification.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${
                      notification.type === 'recommendation' ? 'bg-primary-600' :
                      notification.type === 'comment' ? 'bg-secondary-600' :
                      notification.type === 'connection' ? 'bg-accent-600' :
                      'bg-neutral-600'
                    } flex items-center justify-center text-white border-2 border-white`}>
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-800">
                      <span className="font-semibold">{notification.user}</span>{' '}
                      <span className="text-neutral-600">{notification.action}</span>
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">{notification.time}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    )}
                    <button className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No hay notificaciones</h3>
            <p className="text-neutral-500">No tienes notificaciones en esta categoría</p>
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
            Cargar más notificaciones
          </button>
        </div>
      )}
    </div>
  );
}

export default Notifications;
