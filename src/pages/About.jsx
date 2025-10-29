function About() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-400 via-secondary-500 to-secondary-600 rounded-2xl shadow-lg p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            La Nueva Guía Amarilla, Digitalizada
          </h1>
          <p className="text-lg md:text-xl text-secondary-50 leading-relaxed">
            ¿Recuerdas cuando buscabas en las páginas amarillas de la guía telefónica para encontrar comercios cerca tuyo?
            Ahora es más fácil, más rápido y está en tu bolsillo.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nuestra Historia */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-3">Nuestra Historia</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            BuZCalo nace de la nostalgia y necesidad de volver a conectar a los comercios locales con su comunidad.
            Durante décadas, la guía telefónica con sus páginas amarillas fue el puente entre compradores y vendedores locales.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Hoy, transformamos ese concepto en una plataforma digital moderna, donde encontrar productos cerca de ti
            es tan simple como abrir tu teléfono.
          </p>
        </div>

        {/* Por Qué Existimos */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-3">¿Por Qué Existimos?</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            En ciudades alejadas de las capitales, conseguir productos puede ser un desafío. Las entregas de e-commerce
            tardan días, y caminar por el centro buscando un producto específico consume tiempo y energía.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            BuZCalo te muestra <span className="font-semibold text-neutral-800">qué productos están disponibles cerca de ti, ahora mismo</span>,
            para que puedas comprarlos hoy sin esperar envíos ni recorrer toda la ciudad.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">¿Qué hace especial a BuZCalo?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">100% Local</h3>
            <p className="text-sm text-neutral-600">
              Solo mostramos productos disponibles en tu ciudad. Sin envíos, sin esperas.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Retiro Inmediato</h3>
            <p className="text-sm text-neutral-600">
              Encontrá el producto que buscás y retiralo hoy mismo del comercio.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🔥</span>
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Ofertas del Día</h3>
            <p className="text-sm text-neutral-600">
              Descubrí promociones especiales que desaparecen a las 23:59hs.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">De las Páginas Amarillas a BuZCalo</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Antes */}
          <div className="text-center">
            <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">📕</span>
            </div>
            <h3 className="font-bold text-neutral-700 mb-3">Guía Telefónica</h3>
            <ul className="text-sm text-neutral-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Buscar manualmente en páginas amarillas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Llamar para preguntar disponibilidad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Recorrer el centro hasta encontrarlo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Sin información de precios u ofertas</span>
              </li>
            </ul>
          </div>

          {/* Ahora */}
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-secondary-500">
              <span className="text-4xl">📱</span>
            </div>
            <h3 className="font-bold text-secondary-700 mb-3">BuZCalo</h3>
            <ul className="text-sm text-neutral-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-secondary-500 mt-1">✓</span>
                <span className="font-medium">Buscá productos desde tu teléfono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500 mt-1">✓</span>
                <span className="font-medium">Ves stock y disponibilidad en tiempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500 mt-1">✓</span>
                <span className="font-medium">Conocé la distancia exacta al comercio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary-500 mt-1">✓</span>
                <span className="font-medium">Precios, ofertas y descuentos visibles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Nuestra Misión</h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          Revitalizar el comercio local conectando a compradores y vendedores de manera simple y efectiva.
          Queremos que encuentres lo que buscás sin salir de tu ciudad, apoyando a los negocios de tu comunidad.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-secondary-600 font-semibold">
          <span className="text-2xl">💛</span>
          <span>Hecho con amor para tu ciudad</span>
        </div>
      </div>
    </div>
  );
}

export default About;
