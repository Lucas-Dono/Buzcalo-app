function Network() {
  const connections = [
    {
      id: 1,
      name: 'Carlos Méndez',
      avatar: 'CM',
      role: 'CEO en Tech Solutions',
      mutualConnections: 45,
      connected: true,
      gradient: 'from-primary-500 to-accent-500'
    },
    {
      id: 2,
      name: 'Ana Torres',
      avatar: 'AT',
      role: 'Directora de Marketing',
      mutualConnections: 32,
      connected: true,
      gradient: 'from-secondary-500 to-primary-500'
    },
    {
      id: 3,
      name: 'Roberto Silva',
      avatar: 'RS',
      role: 'Desarrollador Senior',
      mutualConnections: 28,
      connected: true,
      gradient: 'from-accent-500 to-secondary-500'
    },
  ];

  const suggestions = [
    {
      id: 4,
      name: 'María González',
      avatar: 'MG',
      role: 'Diseñadora UX/UI',
      mutualConnections: 15,
      connected: false,
      gradient: 'from-primary-400 to-secondary-400'
    },
    {
      id: 5,
      name: 'Luis Ramírez',
      avatar: 'LR',
      role: 'Gerente de Ventas',
      mutualConnections: 22,
      connected: false,
      gradient: 'from-accent-400 to-primary-400'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Mi Red</h1>
        <p className="text-neutral-600">Gestiona tus conexiones profesionales</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-3xl font-bold text-primary-600">245</p>
            <p className="text-sm text-neutral-600">Conexiones</p>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <p className="text-3xl font-bold text-secondary-600">1.2k</p>
            <p className="text-sm text-neutral-600">Seguidores</p>
          </div>
          <div className="text-center p-4 bg-accent-50 rounded-lg">
            <p className="text-3xl font-bold text-accent-600">892</p>
            <p className="text-sm text-neutral-600">Siguiendo</p>
          </div>
          <div className="text-center p-4 bg-neutral-100 rounded-lg">
            <p className="text-3xl font-bold text-neutral-700">15</p>
            <p className="text-sm text-neutral-600">Solicitudes</p>
          </div>
        </div>
      </div>

      {/* Mis Conexiones */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-800">Mis Conexiones</h2>
          <input
            type="text"
            placeholder="Buscar conexiones..."
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${connection.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                  {connection.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">{connection.name}</h3>
                  <p className="text-sm text-neutral-600">{connection.role}</p>
                  <p className="text-xs text-neutral-500">{connection.mutualConnections} conexiones en común</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold">
                  Mensaje
                </button>
                <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-semibold">
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sugerencias */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Personas que quizás conozcas</h2>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${suggestion.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                  {suggestion.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800">{suggestion.name}</h3>
                  <p className="text-sm text-neutral-600">{suggestion.role}</p>
                  <p className="text-xs text-neutral-500">{suggestion.mutualConnections} conexiones en común</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold">
                Conectar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Network;
