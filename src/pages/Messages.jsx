import { useState } from 'react';

function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Carlos Méndez',
      avatar: 'CM',
      lastMessage: '¿Podemos agendar una reunión?',
      time: 'Hace 5 min',
      unread: 2,
      online: true,
      gradient: 'from-primary-500 to-accent-500'
    },
    {
      id: 2,
      name: 'Ana Torres',
      avatar: 'AT',
      lastMessage: 'Gracias por la información',
      time: 'Hace 1 hora',
      unread: 0,
      online: true,
      gradient: 'from-secondary-500 to-primary-500'
    },
    {
      id: 3,
      name: 'Roberto Silva',
      avatar: 'RS',
      lastMessage: 'Perfecto, nos vemos mañana',
      time: 'Hace 3 horas',
      unread: 0,
      online: false,
      gradient: 'from-accent-500 to-secondary-500'
    },
    {
      id: 4,
      name: 'María González',
      avatar: 'MG',
      lastMessage: 'El proyecto avanza bien 👍',
      time: 'Ayer',
      unread: 0,
      online: false,
      gradient: 'from-primary-400 to-secondary-400'
    },
  ];

  const messages = [
    { id: 1, sender: 'other', text: 'Hola, ¿cómo estás?', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Muy bien, gracias. ¿Y tú?', time: '10:32 AM' },
    { id: 3, sender: 'other', text: 'Excelente. Quería consultarte sobre el proyecto', time: '10:33 AM' },
    { id: 4, sender: 'me', text: 'Claro, dime en qué te puedo ayudar', time: '10:35 AM' },
    { id: 5, sender: 'other', text: '¿Podemos agendar una reunión?', time: '10:36 AM' },
  ];

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden h-full flex">
        {/* Chat List */}
        <div className="w-full md:w-96 border-r border-neutral-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-neutral-800 mb-4">Mensajes</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                className="w-full px-4 py-2 pl-10 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.gradient} flex items-center justify-center text-white font-semibold`}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-800 truncate">{chat.name}</h3>
                      <span className="text-xs text-neutral-500">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-600 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChatData ? (
          <div className="flex-1 flex flex-col hidden md:flex">
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedChatData.gradient} flex items-center justify-center text-white font-semibold`}>
                    {selectedChatData.avatar}
                  </div>
                  {selectedChatData.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-800">{selectedChatData.name}</h2>
                  <p className="text-xs text-neutral-500">
                    {selectedChatData.online ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === 'me'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs text-neutral-500 mt-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">Selecciona una conversación</h3>
              <p className="text-neutral-500">Elige un chat para comenzar a enviar mensajes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
