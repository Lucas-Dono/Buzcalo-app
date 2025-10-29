import { useState, useEffect } from 'react';

function Stories() {
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  useEffect(() => {
    // Auto-ocultar el banner después de 20 segundos
    const timer = setTimeout(() => {
      setShowInfoBanner(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const stories = [
    {
      id: 1,
      name: 'Crear',
      avatar: '+',
      gradient: 'from-neutral-400 to-neutral-500',
      isAdd: true
    },
    {
      id: 2,
      name: 'TechStore',
      avatar: 'TS',
      gradient: 'from-primary-400 to-primary-600',
      type: 'offer',
      badge: '50% OFF',
      badgeColor: 'bg-red-500',
      distance: '0.5 km',
      hasNew: true
    },
    {
      id: 3,
      name: 'Panadería Sol',
      avatar: 'PS',
      gradient: 'from-secondary-400 to-secondary-600',
      type: 'daily',
      badge: 'HOY',
      badgeColor: 'bg-accent-500',
      distance: '0.3 km',
      hasNew: true
    },
    {
      id: 4,
      name: 'Farmacia',
      avatar: 'FM',
      gradient: 'from-accent-400 to-accent-600',
      type: 'offer',
      badge: '2x1',
      badgeColor: 'bg-secondary-500',
      distance: '1.2 km',
      hasNew: true
    },
    {
      id: 5,
      name: 'Librería',
      avatar: 'LB',
      gradient: 'from-primary-500 to-accent-500',
      type: 'new',
      badge: 'NUEVO',
      badgeColor: 'bg-primary-500',
      distance: '1.5 km',
      hasNew: true
    },
    {
      id: 6,
      name: 'Deportes',
      avatar: 'DP',
      gradient: 'from-secondary-500 to-primary-500',
      distance: '2.1 km',
      hasNew: false
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-2xl shadow-md p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="text-base font-bold text-neutral-800">
            Ofertas y Productos del Día
          </h2>
        </div>
        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          Disponibles hoy
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2.5 flex-shrink-0 pt-3">
            <div className="relative group">
              {/* Ring animado para nuevas ofertas */}
              {story.hasNew && (
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              )}

              {/* Badge de oferta/tipo - MOVIDO ARRIBA DEL CONTENEDOR */}
              {story.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${story.badgeColor} text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-xl border-2 border-white uppercase tracking-wide z-10`}>
                  {story.badge}
                </div>
              )}

              <div
                className={`relative w-[88px] h-[88px] rounded-2xl ${
                  story.gradient !== 'from-neutral-400 to-neutral-500'
                    ? `bg-gradient-to-br ${story.gradient}`
                    : 'bg-neutral-200'
                } p-1 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-xl`}
              >
                {/* Contenido interno */}
                <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-white font-bold text-2xl drop-shadow-lg">
                    {story.avatar}
                  </div>
                </div>

                {/* Botón de crear */}
                {story.isAdd && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white border-3 border-white shadow-xl transform hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                )}

                {/* Shine effect */}
                {!story.isAdd && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            </div>

            {/* Info del negocio */}
            <div className="text-center space-y-0.5">
              <span className="text-xs font-bold text-neutral-800 max-w-[90px] truncate block">
                {story.name}
              </span>
              {story.distance && (
                <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{story.distance}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nota informativa con animación de ocultamiento */}
      <div
        className={`mt-4 pt-4 border-t border-neutral-200 transition-all duration-500 overflow-hidden ${
          showInfoBanner ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 mt-0 pt-0 border-0'
        }`}
      >
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl p-3 relative">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-900 leading-relaxed flex-1">
            <span className="font-semibold">Las ofertas del día desaparecen a las 23:59hs.</span> ¡No te las pierdas!
          </p>
          <button
            onClick={() => setShowInfoBanner(false)}
            className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Stories;
