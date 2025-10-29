function Suggestions() {
  const suggestions = [
    { id: 1, name: 'Tech Innovators', avatar: 'TI', type: 'Tecnología', followers: '1.2k', connections: '15 conexiones en común' },
    { id: 2, name: 'Consultora Digital', avatar: 'CD', type: 'Consultoría', followers: '856', connections: '8 conexiones en común' },
    { id: 3, name: 'Marketing Pro', avatar: 'MP', type: 'Marketing', followers: '2.3k', connections: '22 conexiones en común' },
    { id: 4, name: 'Finanzas Corp', avatar: 'FC', type: 'Finanzas', followers: '3.1k', connections: '12 conexiones en común' },
    { id: 5, name: 'Design Studio Hub', avatar: 'DS', type: 'Diseño', followers: '945', connections: '5 conexiones en común' },
  ];

  return (
    <div className="hidden lg:block fixed right-8 top-24 w-80">
      {/* Perfil Usuario */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-800">usuario123</p>
              <p className="text-xs text-neutral-500">Profesional independiente</p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">Vistas del perfil</span>
            <span className="text-primary-600 font-semibold">127</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600">Conexiones</span>
            <span className="text-primary-600 font-semibold">245</span>
          </div>
        </div>
      </div>

      {/* Sugerencias */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-neutral-700 font-semibold text-sm">Recomendados para ti</p>
          <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">Ver todo</button>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {suggestion.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-800 truncate">{suggestion.name}</p>
                  <p className="text-xs text-neutral-500 mb-1">{suggestion.type}</p>
                  <p className="text-xs text-neutral-600">{suggestion.connections}</p>
                </div>
              </div>
              <button className="text-primary-600 border border-primary-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary-50 transition-colors flex-shrink-0 ml-2">
                Conectar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-neutral-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:text-primary-600">Información</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">Ayuda</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">Prensa</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">API</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">Empleo</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">Privacidad</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-600">Condiciones</a>
        </div>
        <p className="text-neutral-400">BuZCalo © 2025</p>
      </div>
    </div>
  );
}

export default Suggestions;
