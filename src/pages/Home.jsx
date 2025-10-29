import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Stories from '../components/Stories';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todo', icon: '🏪' },
    { id: 'electronics', name: 'Electrónica', icon: '📱' },
    { id: 'food', name: 'Alimentos', icon: '🍕' },
    { id: 'fashion', name: 'Moda', icon: '👕' },
    { id: 'home', name: 'Hogar', icon: '🏠' },
    { id: 'health', name: 'Salud', icon: '💊' },
    { id: 'books', name: 'Libros', icon: '📚' },
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
      category: 'home'
    },
    {
      id: 4,
      name: 'Libro "Cien Años de Soledad" - Gabriel García Márquez',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      business: {
        name: 'Librería Cervantes',
        avatar: 'LC',
        gradient: 'from-primary-400 to-secondary-400'
      },
      distance: '1.5 km',
      location: 'Plaza Mayor',
      available: true,
      category: 'books'
    },
    {
      id: 5,
      name: 'Pizza Napolitana Grande',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
      business: {
        name: 'Pizzería Don Antonio',
        avatar: 'DA',
        gradient: 'from-secondary-400 to-accent-400'
      },
      distance: '0.3 km',
      location: 'Esquina Principal',
      available: true,
      category: 'food'
    },
    {
      id: 6,
      name: 'Notebook Lenovo IdeaPad 3',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
      business: {
        name: 'Computación Total',
        avatar: 'CT',
        gradient: 'from-accent-400 to-primary-400'
      },
      distance: '2.1 km',
      location: 'Zona Comercial',
      available: true,
      stock: 1,
      category: 'electronics'
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Stories - Ofertas del día */}
      <Stories />

      {/* Categories */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-2 md:p-3">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 md:gap-2 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className="text-sm md:text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h2 className="text-base md:text-lg font-bold text-neutral-800">
            Productos cerca de ti ({filteredProducts.length})
          </h2>
          <select className="px-2 md:px-3 py-1.5 md:py-2 border border-neutral-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-neutral-700">
            <option>Más cercanos</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>Más nuevos</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
          Ver más productos
        </button>
      </div>
    </div>
  );
}

export default Home;
