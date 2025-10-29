import { Heart, MapPin, Star, Phone } from 'lucide-react';

export default function ServiceCard({ service, onFavorite }) {
  const {
    id,
    name,
    description,
    category,
    priceType,
    price,
    priceUnit,
    images = [],
    provider,
    rating = 0,
    reviewCount = 0,
    isFavorite = false
  } = service;

  const handleWhatsApp = () => {
    const phone = provider.phone || provider.whatsapp;
    if (phone) {
      const message = encodeURIComponent(`Hola! Vi tu servicio "${name}" en BúZCalo y me interesa. ¿Podrías darme más información?`);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  const renderPrice = () => {
    if (priceType === 'quote') {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-xl font-bold text-teal-600">
            Consultar
          </span>
        </div>
      );
    }

    if (priceType === 'hourly') {
      return (
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-2xl font-bold text-teal-600">
            ${price?.toLocaleString()}
          </span>
          <span className="text-[10px] md:text-xs text-neutral-500">
            /{priceUnit || 'hora'}
          </span>
        </div>
      );
    }

    // Fixed price
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-lg md:text-2xl font-bold text-teal-600">
          ${price?.toLocaleString()}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Imagen */}
      <div className="relative aspect-square bg-gradient-to-br from-teal-50 to-cyan-50">
        {images[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl md:text-6xl">🛠️</span>
          </div>
        )}

        {/* Badge de SERVICIO */}
        <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2">
          <span className="bg-teal-500 text-white text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-md">
            SERVICIO
          </span>
        </div>

        {/* Botón de favorito */}
        <button
          onClick={() => onFavorite?.(id)}
          className="absolute top-1.5 md:top-2 right-1.5 md:right-2 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600'
            }`}
          />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-2 md:p-4">
        {/* Categoría */}
        <div className="mb-1">
          <span className="text-[9px] md:text-xs text-teal-600 font-semibold">
            {category}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-neutral-800 text-xs md:text-sm mb-1 line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Descripción (solo en desktop) */}
        <p className="hidden md:block text-xs text-neutral-600 mb-2 line-clamp-2">
          {description}
        </p>

        {/* Precio */}
        <div className="mb-1.5 md:mb-2">
          {renderPrice()}
        </div>

        {/* Info del prestador */}
        <div className="space-y-0.5 md:space-y-1 mb-2 md:mb-3">
          {/* Negocio/Prestador */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-[10px] md:text-xs font-bold flex-shrink-0">
              {provider.name[0].toUpperCase()}
            </div>
            <span className="text-[10px] md:text-sm text-neutral-700 font-medium truncate">
              {provider.name}
            </span>
            {provider.verified && (
              <span className="text-[10px] md:text-xs">✓</span>
            )}
          </div>

          {/* Cobertura */}
          {provider.coverageArea && (
            <div className="flex items-center gap-1 text-neutral-600">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
              <span className="text-[10px] md:text-xs truncate">
                {provider.coverageArea}
              </span>
            </div>
          )}

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] md:text-xs font-semibold text-neutral-700">
                {rating.toFixed(1)}
              </span>
              <span className="text-[10px] md:text-xs text-neutral-500">
                ({reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-1 md:gap-2">
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] md:text-sm font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <Phone className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden md:inline">Contactar</span>
            <span className="md:hidden">WhatsApp</span>
          </button>
          <button className="px-2 md:px-4 py-1.5 md:py-2 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-lg text-[10px] md:text-sm font-semibold transition-colors">
            <span className="hidden md:inline">Ver detalles</span>
            <span className="md:hidden">Ver</span>
          </button>
        </div>
      </div>
    </div>
  );
}
