import { useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter } from 'lucide-react';

// Mock data - en producción vendrá del backend
const mockServices = [
  {
    id: 1,
    name: 'Clases de Guitarra a Domicilio',
    description: 'Clases personalizadas para todos los niveles. 10 años de experiencia. Método propio adaptado a cada alumno.',
    category: 'Clases de Música',
    priceType: 'hourly',
    price: 2500,
    priceUnit: 'hora',
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400'],
    provider: {
      name: 'Música con Juan',
      verified: true,
      coverageArea: 'Toda Mercedes',
      phone: '5492324123456',
      rating: 4.8,
      reviewCount: 24
    },
    rating: 4.8,
    reviewCount: 24,
    isFavorite: false
  },
  {
    id: 2,
    name: 'Plomería en General',
    description: 'Reparación de cañerías, destapes, instalaciones sanitarias. Presupuesto sin cargo. Atención de urgencias.',
    category: 'Plomería',
    priceType: 'quote',
    images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400'],
    provider: {
      name: 'Plomería Rodríguez',
      verified: true,
      coverageArea: 'Mercedes y alrededores',
      phone: '5492324234567',
      rating: 4.9,
      reviewCount: 56
    },
    rating: 4.9,
    reviewCount: 56,
    isFavorite: true
  },
  {
    id: 3,
    name: 'Clases Particulares - Matemática',
    description: 'Apoyo escolar para primaria y secundaria. CBC. Preparación para exámenes. Clases online y presenciales.',
    category: 'Clases Particulares',
    priceType: 'hourly',
    price: 2000,
    priceUnit: 'hora',
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400'],
    provider: {
      name: 'Prof. María Gómez',
      verified: false,
      coverageArea: 'Centro de Mercedes',
      phone: '5492324345678',
      rating: 5.0,
      reviewCount: 12
    },
    rating: 5.0,
    reviewCount: 12,
    isFavorite: false
  },
  {
    id: 4,
    name: 'Electricista Matriculado',
    description: 'Instalaciones eléctricas, tableros, iluminación, reparaciones. Certificado para AySA y distribuidora. 15 años de experiencia.',
    category: 'Electricidad',
    priceType: 'quote',
    images: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'],
    provider: {
      name: 'Electricidad López',
      verified: true,
      coverageArea: 'Toda Mercedes',
      phone: '5492324456789',
      rating: 4.7,
      reviewCount: 89
    },
    rating: 4.7,
    reviewCount: 89,
    isFavorite: false
  },
  {
    id: 5,
    name: 'Servicio de Limpieza del Hogar',
    description: 'Limpieza profunda, mantenimiento regular, limpieza post-obra. Personal capacitado y con referencias.',
    category: 'Limpieza',
    priceType: 'hourly',
    price: 1800,
    priceUnit: 'hora',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'],
    provider: {
      name: 'Limpieza Profesional MB',
      verified: true,
      coverageArea: 'Mercedes y zona',
      phone: '5492324567890',
      rating: 4.6,
      reviewCount: 34
    },
    rating: 4.6,
    reviewCount: 34,
    isFavorite: false
  },
  {
    id: 6,
    name: 'Peluquería a Domicilio',
    description: 'Corte, tintura, peinados para eventos. Voy a tu casa con todos los materiales. Turnos de lun a sáb.',
    category: 'Belleza',
    priceType: 'fixed',
    price: 3500,
    priceUnit: 'servicio',
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'],
    provider: {
      name: 'Silvia - Peluquera',
      verified: false,
      coverageArea: 'Centro y barrios',
      phone: '5492324678901',
      rating: 4.9,
      reviewCount: 67
    },
    rating: 4.9,
    reviewCount: 67,
    isFavorite: false
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: '🔍', color: 'neutral' },
  { id: 'hogar', name: 'Hogar', icon: '🏠', color: 'blue' },
  { id: 'educacion', name: 'Educación', icon: '📚', color: 'purple' },
  { id: 'belleza', name: 'Belleza', icon: '💇', color: 'pink' },
  { id: 'construccion', name: 'Construcción', icon: '🔨', color: 'orange' },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻', color: 'cyan' },
  { id: 'eventos', name: 'Eventos', icon: '🎉', color: 'yellow' },
  { id: 'automotor', name: 'Automotor', icon: '🚗', color: 'red' }
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // all, fixed, hourly, quote
  const [showFilters, setShowFilters] = useState(false);

  const handleFavorite = (serviceId) => {
    console.log('Toggle favorite:', serviceId);
    // Aquí iría la lógica de favoritos con el backend
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
        <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
          Servicios en Mercedes
        </h1>
        <p className="text-sm md:text-base opacity-90">
          Encontrá profesionales y servicios locales de confianza
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-2 md:p-3">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-neutral-800 placeholder-neutral-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors ${
              showFilters
                ? 'bg-teal-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-neutral-700">
                Tipo de precio:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                    priceFilter === 'all'
                      ? 'bg-teal-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPriceFilter('fixed')}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                    priceFilter === 'fixed'
                      ? 'bg-teal-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Precio fijo
                </button>
                <button
                  onClick={() => setPriceFilter('hourly')}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                    priceFilter === 'hourly'
                      ? 'bg-teal-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Por hora
                </button>
                <button
                  onClick={() => setPriceFilter('quote')}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                    priceFilter === 'quote'
                      ? 'bg-teal-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  A consultar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categorías */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-2 md:p-3">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-teal-500 text-white shadow-md scale-105'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className="text-sm md:text-base">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-xs md:text-sm text-neutral-600">
          <span className="font-semibold text-neutral-800">{mockServices.length}</span> servicios encontrados
        </p>
        <select className="text-xs md:text-sm border border-neutral-200 rounded-lg px-2 md:px-3 py-1.5 text-neutral-700 bg-white">
          <option>Más relevantes</option>
          <option>Mejor calificados</option>
          <option>Menor precio</option>
          <option>Mayor precio</option>
        </select>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        {mockServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onFavorite={handleFavorite}
          />
        ))}
      </div>

      {/* Empty state (si no hay resultados) */}
      {mockServices.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 md:p-12 text-center">
          <div className="text-5xl md:text-6xl mb-4">🔍</div>
          <h3 className="text-lg md:text-xl font-bold text-neutral-800 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-sm md:text-base text-neutral-600 mb-4">
            Intenta con otra búsqueda o categoría
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceFilter('all');
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* CTA para prestadores de servicios */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 md:p-6 text-center">
        <h3 className="text-base md:text-lg font-bold text-neutral-800 mb-2">
          ¿Ofrecés un servicio profesional?
        </h3>
        <p className="text-xs md:text-sm text-neutral-600 mb-3 md:mb-4">
          Registrate gratis y llegá a miles de clientes potenciales en Mercedes
        </p>
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold text-sm md:text-base transition-colors shadow-md">
          Publicar mi servicio
        </button>
      </div>
    </div>
  );
}
