import { useState } from 'react';

function Opportunities() {
  const [filter, setFilter] = useState('all');

  const opportunities = [
    {
      id: 1,
      title: 'Desarrollador Full Stack Senior',
      company: 'Tech Innovators',
      companyAvatar: 'TI',
      location: 'Ciudad de México (Remoto)',
      type: 'Tiempo completo',
      salary: '$50,000 - $70,000',
      posted: 'Hace 2 días',
      applicants: 24,
      gradient: 'from-primary-500 to-accent-500',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Diseñador UX/UI',
      company: 'Design Studio Hub',
      companyAvatar: 'DS',
      location: 'Guadalajara',
      type: 'Medio tiempo',
      salary: '$30,000 - $45,000',
      posted: 'Hace 5 días',
      applicants: 18,
      gradient: 'from-secondary-500 to-primary-500',
      tags: ['Figma', 'Adobe XD', 'UI Design']
    },
    {
      id: 3,
      title: 'Gerente de Marketing Digital',
      company: 'Marketing Pro',
      companyAvatar: 'MP',
      location: 'Monterrey',
      type: 'Tiempo completo',
      salary: '$45,000 - $60,000',
      posted: 'Hace 1 semana',
      applicants: 32,
      gradient: 'from-accent-500 to-secondary-500',
      tags: ['SEO', 'SEM', 'Social Media']
    },
    {
      id: 4,
      title: 'Consultor de Negocios',
      company: 'Consultora Digital',
      companyAvatar: 'CD',
      location: 'Remoto',
      type: 'Freelance',
      salary: '$40,000 - $55,000',
      posted: 'Hace 3 días',
      applicants: 15,
      gradient: 'from-primary-400 to-secondary-400',
      tags: ['Estrategia', 'Análisis', 'Consultoría']
    },
  ];

  const filters = [
    { value: 'all', label: 'Todas' },
    { value: 'fulltime', label: 'Tiempo completo' },
    { value: 'parttime', label: 'Medio tiempo' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'remote', label: 'Remoto' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Oportunidades</h1>
        <p className="text-neutral-600 mb-6">Descubre ofertas laborales que se ajusten a tu perfil</p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por cargo, empresa o habilidad..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-700">
              <option>Ubicación</option>
              <option>Ciudad de México</option>
              <option>Guadalajara</option>
              <option>Monterrey</option>
              <option>Remoto</option>
            </select>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              Buscar
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                filter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">127</p>
          <p className="text-sm text-neutral-600">Nuevas esta semana</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-secondary-600">42</p>
          <p className="text-sm text-neutral-600">Aplicaciones activas</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-accent-600">8</p>
          <p className="text-sm text-neutral-600">Entrevistas</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-neutral-700">3</p>
          <p className="text-sm text-neutral-600">Ofertas recibidas</p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${opp.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {opp.companyAvatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-800 mb-1">{opp.title}</h3>
                    <p className="text-neutral-600 font-semibold mb-2">{opp.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {opp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {opp.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {opp.salary}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {opp.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold whitespace-nowrap ml-4">
                  Aplicar
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>{opp.posted}</span>
                  <span>•</span>
                  <span>{opp.applicants} aplicaciones</span>
                </div>
                <button className="text-neutral-600 hover:text-primary-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
          Cargar más oportunidades
        </button>
      </div>
    </div>
  );
}

export default Opportunities;
