import { useState } from 'react';
import Post from '../components/Post';

function Profile() {
  const [activeTab, setActiveTab] = useState('about');

  const mockPosts = [
    {
      id: 1,
      author: {
        name: 'Usuario Ejemplo',
        avatar: 'U',
        businessType: 'Desarrollador Full Stack',
        category: 'Tecnología'
      },
      description: 'Compartiendo mi último proyecto de desarrollo web. ¡Fue un desafío increíble! 🚀',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop',
      likes: 234,
      comments: 45,
      timeAgo: 'Hace 3 horas'
    },
  ];

  const skills = [
    'React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'AWS',
    'Docker', 'GraphQL', 'Next.js', 'Tailwind CSS'
  ];

  const experience = [
    {
      id: 1,
      title: 'Desarrollador Full Stack Senior',
      company: 'Tech Innovators',
      period: '2021 - Presente',
      description: 'Desarrollo de aplicaciones web escalables usando React y Node.js'
    },
    {
      id: 2,
      title: 'Desarrollador Frontend',
      company: 'Digital Solutions',
      period: '2019 - 2021',
      description: 'Creación de interfaces de usuario modernas y responsivas'
    },
  ];

  const education = [
    {
      id: 1,
      title: 'Ingeniería en Sistemas Computacionales',
      institution: 'Universidad Tecnológica',
      period: '2015 - 2019'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 relative">
          {/* Avatar superpuesto sobre el banner */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-4xl">
              U
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-neutral-800 truncate">Usuario Ejemplo</h1>
              <p className="text-neutral-600 text-sm">Comprador frecuente</p>
              <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">San Luis, Centro</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm whitespace-nowrap">
                Editar perfil
              </button>
              <button className="px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'about'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'favorites'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Favoritos
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`pb-3 px-2 font-semibold text-sm transition-colors ${
                activeTab === 'purchases'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Historial
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === 'about' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Información Personal</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Contacto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>usuario@ejemplo.com</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+54 266 123-4567</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">Ubicación</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>San Luis, Centro</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Miembro desde Octubre 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h3 className="font-semibold text-neutral-800 mb-3">Estadísticas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">12</p>
                <p className="text-xs text-neutral-600">Productos favoritos</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-600">5</p>
                <p className="text-xs text-neutral-600">Negocios seguidos</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-2xl font-bold text-accent-600">28</p>
                <p className="text-xs text-neutral-600">Consultas realizadas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Productos Favoritos</h2>
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-700 mb-2">No tienes productos favoritos aún</h3>
            <p className="text-neutral-500">Los productos que guardes aparecerán aquí</p>
          </div>
        </div>
      )}

      {activeTab === 'purchases' && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Historial de Consultas</h2>
          <p className="text-sm text-neutral-600 mb-6">Productos que consultaste recientemente</p>

          <div className="space-y-4">
            {[
              { name: 'Auriculares Sony', business: 'TechStore Local', date: 'Hace 2 días', price: 45000 },
              { name: 'Pizza Napolitana', business: 'Pizzería Don Antonio', date: 'Hace 5 días', price: 3500 },
              { name: 'Zapatillas Nike', business: 'Deportes García', date: 'Hace 1 semana', price: 28000 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div>
                  <h3 className="font-semibold text-neutral-800">{item.name}</h3>
                  <p className="text-sm text-neutral-600">{item.business}</p>
                  <p className="text-xs text-neutral-500 mt-1">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">${item.price.toLocaleString()}</p>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-1">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
