import { useState } from 'react';
import ProductCard from '../components/ProductCard';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [maxDistance, setMaxDistance] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas', icon: '🏪' },
    { id: 'electronics', name: 'Electrónica', icon: '📱' },
    { id: 'food', name: 'Alimentos', icon: '🍕' },
    { id: 'fashion', name: 'Moda', icon: '👕' },
    { id: 'home', name: 'Hogar', icon: '🏠' },
    { id: 'health', name: 'Salud', icon: '💊' },
    { id: 'books', name: 'Libros', icon: '📚' },
    { id: 'sports', name: 'Deportes', icon: '⚽' },
  ];

  const products = [
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
      category: 'electronics'
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
      category: 'fashion'
    },
    // Más productos...
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header con búsqueda */}
      <div className="bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Buscar Productos</h1>

        {/* Barra de búsqueda principal */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="¿Qué estás buscando? Ej: notebook, pizza, remera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-12 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-800 placeholder-neutral-400"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filtros rápidos */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filtros</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-neutral-700"
          >
            <option value="distance">Más cercanos</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
            <option value="newest">Más nuevos</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">San Luis, Centro</span>
          </div>
        </div>
      </div>

      {/* Panel de filtros expandido */}
      {showFilters && (
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-md p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Distancia */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Distancia máxima
              </label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Cualquier distancia</option>
                <option value="0.5">Hasta 500m</option>
                <option value="1">Hasta 1 km</option>
                <option value="2">Hasta 2 km</option>
                <option value="5">Hasta 5 km</option>
              </select>
            </div>

            {/* Rango de precio */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Rango de precio
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos los precios</option>
                <option value="0-5000">Hasta $5.000</option>
                <option value="5000-20000">$5.000 - $20.000</option>
                <option value="20000-50000">$20.000 - $50.000</option>
                <option value="50000+">Más de $50.000</option>
              </select>
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Disponibilidad
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 w-4 h-4 text-primary-600 rounded" defaultChecked />
                  <span className="text-sm text-neutral-700">En stock</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm text-neutral-700">Con descuento</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-200">
            <button className="px-5 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
              Limpiar filtros
            </button>
            <button className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                selectedCategory === cat.id
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

      {/* Resultados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-800">
            {filteredProducts.length} productos encontrados
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-700 mb-2">No encontramos productos</h3>
            <p className="text-neutral-500 mb-4">Intenta con otros términos de búsqueda o categorías</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
