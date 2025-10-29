import { useState } from 'react';

function Business() {
  const [activeTab, setActiveTab] = useState('products');
  const [isEditing, setIsEditing] = useState(false);
  const [businessStatus, setBusinessStatus] = useState('open'); // open, closed

  const stats = [
    { label: 'Productos activos', value: '45', icon: '📦', color: 'primary' },
    { label: 'Vistas este mes', value: '2.3k', icon: '👁️', color: 'secondary' },
    { label: 'Consultas', value: '38', icon: '💬', color: 'accent' },
    { label: 'Favoritos', value: '156', icon: '❤️', color: 'neutral' },
  ];

  const myProducts = [
    {
      id: 1,
      name: 'Auriculares Bluetooth Sony WH-1000XM4',
      price: 45000,
      originalPrice: 52000,
      stock: 3,
      category: 'Electrónica',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      status: 'active',
      views: 234
    },
    {
      id: 2,
      name: 'Notebook Lenovo IdeaPad 3',
      price: 125000,
      stock: 1,
      category: 'Electrónica',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      status: 'active',
      views: 567
    },
    {
      id: 3,
      name: 'Mouse Logitech MX Master 3',
      price: 8500,
      stock: 5,
      category: 'Electrónica',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
      status: 'active',
      views: 123
    },
    {
      id: 4,
      name: 'Teclado Mecánico Redragon',
      price: 12000,
      stock: 0,
      category: 'Electrónica',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
      status: 'out_of_stock',
      views: 89
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-md overflow-hidden">
        {/* Banner con gradiente */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 relative">
          {/* Avatar superpuesto sobre el banner */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 border-4 border-white flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              TL
            </div>
          </div>
        </div>

        {/* Información del negocio */}
        <div className="pt-16 px-6 pb-4">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-neutral-800 truncate">TechStore Local</h1>
              <p className="text-neutral-600 text-sm">Electrónica y Tecnología</p>
              <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">Centro - Av. Illia 425, San Luis</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent-100 border border-accent-300 rounded-lg">
                <div className="w-2 h-2 bg-accent-600 rounded-full animate-pulse"></div>
                <select
                  value={businessStatus}
                  onChange={(e) => setBusinessStatus(e.target.value)}
                  className="bg-transparent font-semibold text-accent-700 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="open">Abierto</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm whitespace-nowrap">
                Editar perfil
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'products'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Mis Productos
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'info'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'offers'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Ofertas del Día
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-sm text-neutral-600 font-medium">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-neutral-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products Section */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-800">Catálogo de Productos</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar producto</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map((product) => (
              <div key={product.id} className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="relative aspect-square bg-neutral-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.status === 'out_of_stock' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-neutral-800 text-white px-4 py-2 rounded-lg font-bold">SIN STOCK</span>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary-600">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-500 line-through">${product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-neutral-600">Stock: {product.stock > 0 ? product.stock : 'Agotado'}</span>
                    <span className="text-neutral-500">{product.views} vistas</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold text-sm">
                      Editar
                    </button>
                    <button className="px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      {activeTab === 'info' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Información del Negocio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Nombre del negocio</label>
                <p className="text-neutral-800">TechStore Local</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Descripción</label>
                <p className="text-neutral-600">Tecnología de última generación al mejor precio. Somos tu tienda de confianza en el centro de la ciudad.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Categoría</label>
                <p className="text-neutral-800">Electrónica y Tecnología</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Dirección</label>
                <p className="text-neutral-800">Av. Illia 425, Centro, San Luis</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Horarios de Atención</h2>
            <div className="space-y-3">
              {[
                { day: 'Lunes a Viernes', hours: '09:00 - 20:00' },
                { day: 'Sábados', hours: '09:00 - 14:00' },
                { day: 'Domingos', hours: 'Cerrado' },
              ].map((schedule, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <span className="font-semibold text-neutral-700">{schedule.day}</span>
                  <span className="text-neutral-600">{schedule.hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h3 className="font-semibold text-primary-800 mb-2">Contacto</h3>
              <div className="space-y-2 text-sm">
                <p className="text-primary-700">📞 +54 266 123-4567</p>
                <p className="text-primary-700">📧 contacto@techstore.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offers Section */}
      {activeTab === 'offers' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-1">Ofertas del Día</h2>
              <p className="text-sm text-neutral-600">Publicá ofertas especiales que desaparecen a las 23:59hs</p>
            </div>
            <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva oferta</span>
            </button>
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-700 mb-2">No hay ofertas activas</h3>
            <p className="text-neutral-500">Creá ofertas del día para atraer más clientes</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Business;
