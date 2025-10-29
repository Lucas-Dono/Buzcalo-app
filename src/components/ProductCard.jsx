function ProductCard({ product }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Imagen del producto */}
      <div className="relative aspect-square bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-accent-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            NUEVO
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-2">{product.name}</h3>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Negocio y ubicación */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded bg-gradient-to-br ${product.business.gradient} flex items-center justify-center text-white text-xs font-bold`}>
              {product.business.avatar}
            </div>
            <span className="text-sm text-neutral-700 font-medium">{product.business.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{product.distance} • {product.location}</span>
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold ${product.available ? 'text-accent-600' : 'text-neutral-400'}`}>
            {product.available ? '✓ Disponible' : 'Agotado'}
          </span>
          {product.stock && (
            <span className="text-xs text-neutral-500">Stock: {product.stock}</span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm">
            Ver detalles
          </button>
          <button className="px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
