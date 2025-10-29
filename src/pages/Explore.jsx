import { useState } from 'react';

function Explore() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏪' },
    { id: 'electronics', name: 'Electrónica', icon: '📱' },
    { id: 'food', name: 'Alimentos', icon: '🍕' },
    { id: 'fashion', name: 'Moda', icon: '👕' },
    { id: 'home', name: 'Hogar', icon: '🏠' },
    { id: 'health', name: 'Salud', icon: '💊' },
    { id: 'books', name: 'Libros', icon: '📚' },
    { id: 'sports', name: 'Deportes', icon: '⚽' },
  ];

  const businesses = [
    {
      id: 1,
      name: 'TechStore Local',
      avatar: 'TL',
      category: 'electronics',
      categoryName: 'Electrónica',
      description: 'Tecnología de última generación al mejor precio',
      distance: '0.5 km',
      location: 'Centro - Av. Illia 425',
      products: 45,
      gradient: 'from-primary-500 to-accent-500',
      isOpen: true,
      featuredProducts: [
        { name: 'Auriculares Sony', price: 45000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
        { name: 'Notebook Lenovo', price: 125000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
        { name: 'Mouse Logitech', price: 8500, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop' },
      ]
    },
    {
      id: 2,
      name: 'Deportes García',
      avatar: 'DG',
      category: 'sports',
      categoryName: 'Deportes',
      description: 'Todo para tu actividad física y deporte',
      distance: '1.2 km',
      location: 'Av. Principal 890',
      products: 28,
      gradient: 'from-secondary-500 to-primary-500',
      isOpen: true,
      featuredProducts: [
        { name: 'Zapatillas Nike', price: 28000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop' },
        { name: 'Pelota Fútbol', price: 5500, image: 'https://images.unsplash.com/photo-1614632537199-9cd89a4e8b98?w=200&h=200&fit=crop' },
      ]
    },
    {
      id: 3,
      name: 'Pizzería Don Antonio',
      avatar: 'DA',
      category: 'food',
      categoryName: 'Alimentos',
      description: 'Las mejores pizzas caseras de la ciudad',
      distance: '0.3 km',
      location: 'Esquina Principal - San Martín 234',
      products: 12,
      gradient: 'from-accent-500 to-secondary-500',
      isOpen: true,
      hasOffer: true,
      featuredProducts: [
        { name: 'Pizza Napolitana', price: 3500, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
        { name: 'Empanadas x12', price: 2800, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=200&h=200&fit=crop' },
      ]
    },
    {
      id: 4,
      name: 'Bazar El Hogar',
      avatar: 'BH',
      category: 'home',
      categoryName: 'Hogar',
      description: 'Todo lo que necesitas para tu hogar',
      distance: '0.8 km',
      location: 'Barrio Norte - Colón 567',
      products: 67,
      gradient: 'from-primary-400 to-secondary-400',
      isOpen: true,
      featuredProducts: [
        { name: 'Cafetera Philips', price: 15500, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&h=200&fit=crop' },
        { name: 'Juego de Ollas', price: 12000, image: 'https://images.unsplash.com/photo-1584990347449-5726bb64ff42?w=200&h=200&fit=crop' },
      ]
    },
    {
      id: 5,
      name: 'Librería Cervantes',
      avatar: 'LC',
      category: 'books',
      categoryName: 'Libros',
      description: 'Libros nuevos y usados, papelería',
      distance: '1.5 km',
      location: 'Plaza Mayor - Belgrano 123',
      products: 89,
      gradient: 'from-secondary-400 to-accent-400',
      isOpen: false,
      featuredProducts: [
        { name: 'Cien Años de Soledad', price: 2500, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop' },
        { name: 'El Principito', price: 1800, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop' },
      ]
    },
    {
      id: 6,
      name: 'Farmacia del Centro',
      avatar: 'FC',
      category: 'health',
      categoryName: 'Salud',
      description: 'Medicamentos, perfumería y cuidado personal',
      distance: '0.6 km',
      location: 'Centro - Pringles 345',
      products: 156,
      gradient: 'from-accent-400 to-primary-400',
      isOpen: true,
      featuredProducts: [
        { name: 'Protector Solar FPS50', price: 4500, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
        { name: 'Vitaminas C', price: 2200, image: 'https://images.unsplash.com/photo-1550572017-4370ede345d7?w=200&h=200&fit=crop' },
      ]
    },
  ];

  const nearbyStats = [
    { label: 'Negocios cerca', value: businesses.length, icon: '🏪' },
    { label: 'Abiertos ahora', value: businesses.filter(b => b.isOpen).length, icon: '🟢' },
    { label: 'Con ofertas', value: businesses.filter(b => b.hasOffer).length, icon: '🔥' },
  ];

  const filteredBusinesses = activeCategory === 'all'
    ? businesses
    : businesses.filter(b => b.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-1">Negocios Locales</h1>
            <p className="text-neutral-600">Descubre comercios cerca de ti</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-primary-700">San Luis, Centro</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {nearbyStats.map((stat, index) => (
            <div key={index} className="bg-white border border-neutral-200 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
              <p className="text-xs text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-neutral-800">Categorías</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400 hover:bg-neutral-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-800">
            {filteredBusinesses.length} negocios encontrados
          </h2>
          <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-neutral-700">
            <option>Más cercanos</option>
            <option>Más productos</option>
            <option>Abiertos ahora</option>
          </select>
        </div>

        {/* Businesses Grid/List */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredBusinesses.map((business) => (
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
              </div>

              <div className="p-4 -mt-10">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${business.gradient} border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3`}>
                  {business.avatar}
                </div>

                {/* Business Info */}
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-neutral-800 mb-1">{business.name}</h3>
                  <p className="text-sm text-primary-600 font-semibold mb-1">{business.categoryName}</p>
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

                {/* Featured Products */}
                {business.featuredProducts && business.featuredProducts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-neutral-700 mb-2">Productos destacados:</p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {business.featuredProducts.map((product, idx) => (
                        <div key={idx} className="flex-shrink-0 w-24">
                          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-1">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-neutral-800 font-semibold truncate">${product.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm">
                    Ver catálogo
                  </button>
                  <button className="px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredBusinesses.length > 0 && (
          <div className="text-center mt-6">
            <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
              Ver más negocios
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-700 mb-2">No hay negocios en esta categoría</h3>
            <p className="text-neutral-500 mb-4">Intenta con otra categoría o verifica tu ubicación</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Ver todos los negocios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
