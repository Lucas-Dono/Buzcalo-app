import { useState } from 'react';
import ProductCard from '../components/ProductCard';

function Favorites() {
  const [activeTab, setActiveTab] = useState('products');

  const favoriteProducts = [
    {
      id: 1,
      name: 'Auriculares Bluetooth Sony WH-1000XM4',
      price: 45000,
      originalPrice: 52000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      business: {
        name: 'TechStore Local',
        avatar: 'TL',
        gradient: 'from-primary-500 to-accent-500'
      },
      distance: '0.5 km',
      location: 'Centro',
      available: true,
      stock: 3,
      category: 'electronics',
      savedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Zapatillas Deportivas Nike Air Max',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      business: {
        name: 'Deportes García',
        avatar: 'DG',
        gradient: 'from-secondary-500 to-primary-500'
      },
      distance: '1.2 km',
      location: 'Av. Principal',
      available: true,
      stock: 5,
      isNew: true,
      category: 'fashion',
      savedDate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Cafetera Express Philips',
      price: 15500,
      originalPrice: 18000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop',
      business: {
        name: 'Bazar El Hogar',
        avatar: 'BH',
        gradient: 'from-accent-500 to-secondary-500'
      },
      distance: '0.8 km',
      location: 'Barrio Norte',
      available: true,
      stock: 2,
      category: 'home',
      savedDate: '2024-01-10'
    },
  ];

  const favoriteBusinesses = [
    {
      id: 1,
      name: 'TechStore Local',
      avatar: 'TL',
      category: 'Electrónica',
      description: 'Tecnología de última generación al mejor precio',
      distance: '0.5 km',
      location: 'Centro - Av. Illia 425',
      products: 45,
      gradient: 'from-primary-500 to-accent-500',
      isOpen: true,
    },
    {
      id: 2,
      name: 'Pizzería Don Antonio',
      avatar: 'DA',
      category: 'Alimentos',
      description: 'Las mejores pizzas caseras de la ciudad',
      distance: '0.3 km',
      location: 'Esquina Principal - San Martín 234',
      products: 12,
      gradient: 'from-accent-500 to-secondary-500',
      isOpen: true,
      hasOffer: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Mis Favoritos</h1>
        <p className="text-neutral-600">Productos y negocios que guardaste para revisar después</p>

        {/* Tabs */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'businesses'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            Negocios
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">
              {favoriteProducts.length} productos guardados
            </h2>
            {favoriteProducts.length > 0 && (
              <button className="text-sm text-neutral-600 hover:text-neutral-800 font-medium">
                Limpiar todo
              </button>
            )}
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No tienes productos favoritos</h3>
              <p className="text-neutral-500 mb-4">Guardá productos que te interesen para verlos después</p>
            </div>
          )}
        </div>
      )}

      {/* Businesses Tab */}
      {activeTab === 'businesses' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">
              {favoriteBusinesses.length} negocios guardados
            </h2>
            {favoriteBusinesses.length > 0 && (
              <button className="text-sm text-neutral-600 hover:text-neutral-800 font-medium">
                Limpiar todo
              </button>
            )}
          </div>

          {favoriteBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {favoriteBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className={`h-24 bg-gradient-to-br ${business.gradient} relative`}>
                    {business.hasOffer && (
                      <div className="absolute top-2 right-2 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        🔥 OFERTA
                      </div>
                    )}
                    <button className="absolute top-2 left-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full text-secondary-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4 -mt-10">
                    {/* Avatar */}
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${business.gradient} border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3`}>
                      {business.avatar}
                    </div>

                    {/* Business Info */}
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-neutral-800 mb-1">{business.name}</h3>
                      <p className="text-sm text-primary-600 font-semibold mb-1">{business.category}</p>
                      <p className="text-sm text-neutral-600 mb-2">{business.description}</p>

                      {/* Location & Distance */}
                      <div className="flex items-start gap-2 text-xs text-neutral-500 mb-2">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{business.location} • {business.distance}</span>
                      </div>

                      {/* Status & Products */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className={`px-2 py-1 rounded-full font-semibold ${business.isOpen ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'}`}>
                          {business.isOpen ? '🟢 Abierto' : '⭕ Cerrado'}
                        </span>
                        <span className="text-neutral-600 font-semibold">{business.products} productos</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm">
                        Ver catálogo
                      </button>
                      <button className="px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
              <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No tienes negocios favoritos</h3>
              <p className="text-neutral-500 mb-4">Guardá negocios que te interesen para encontrarlos fácilmente</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Tip */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary-800 mb-1">Consejo</h3>
            <p className="text-sm text-primary-700">Agregá productos y negocios a favoritos tocando el ícono de corazón. Así podrás encontrarlos rápidamente cuando los necesites.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Favorites;
