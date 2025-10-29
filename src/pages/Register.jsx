import { useState } from 'react';
import { User, Store, Truck, Wrench, ShoppingBag, ArrowRight, Check } from 'lucide-react';

const userTypes = [
  {
    id: 'CUSTOMER',
    name: 'Cliente',
    description: 'Buscar productos y servicios locales',
    icon: User,
    color: 'blue',
    features: ['Buscar productos', 'Guardar favoritos', 'Dejar reviews', 'Contactar vendedores']
  },
  {
    id: 'BUSINESS',
    name: 'Comercio Establecido',
    description: 'Tengo un local físico',
    icon: Store,
    color: 'purple',
    features: ['Publicaciones ilimitadas', 'Página de negocio', 'Stories de ofertas', 'Estadísticas']
  },
  {
    id: 'STREET_VENDOR',
    name: 'Vendedor Ambulante',
    description: 'Feriante, food truck, delivery',
    icon: Truck,
    color: 'orange',
    features: ['Publicar productos', 'Stories de ofertas', 'Ubicaciones múltiples', 'Perfil verificado']
  },
  {
    id: 'SERVICE_PROVIDER',
    name: 'Prestador de Servicios',
    description: 'Plomero, electricista, profesor, etc.',
    icon: Wrench,
    color: 'teal',
    features: ['Publicar servicios', 'Portfolio de trabajos', 'Horarios flexibles', 'Cotizaciones']
  },
  {
    id: 'OCCASIONAL_SELLER',
    name: 'Vendedor Ocasional',
    description: 'Vendo algo puntual',
    icon: ShoppingBag,
    color: 'green',
    features: ['Hasta 3 publicaciones', 'Registro rápido', 'Sin comisiones', 'Venta simple']
  }
];

export default function Register() {
  const [step, setStep] = useState(1); // 1: Seleccionar tipo, 2: Formulario
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    // Datos básicos (todos los tipos)
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: 'mercedes', // Pre-seleccionado para Mercedes

    // Datos de negocio (BUSINESS, STREET_VENDOR, SERVICE_PROVIDER)
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    businessAddress: '',
    cuit: '',

    // Para STREET_VENDOR
    usualLocations: '',

    // Para SERVICE_PROVIDER
    serviceCategories: [],
    coverageArea: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Aquí iría la llamada al backend
    console.log('Registrando usuario:', {
      type: selectedType,
      ...formData
    });

    alert('Registro exitoso! (Mock)');
  };

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500',
        from: 'from-blue-50',
        to: 'to-blue-100'
      },
      purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        from: 'from-purple-50',
        to: 'to-purple-100'
      },
      orange: {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-500',
        from: 'from-orange-50',
        to: 'to-orange-100'
      },
      teal: {
        bg: 'bg-teal-500',
        hover: 'hover:bg-teal-600',
        text: 'text-teal-600',
        border: 'border-teal-500',
        from: 'from-teal-50',
        to: 'to-teal-100'
      },
      green: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-green-600',
        border: 'border-green-500',
        from: 'from-green-50',
        to: 'to-green-100'
      }
    };
    return colors[color];
  };

  // STEP 1: Selección de tipo de usuario
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
              Únete a BúZCalo
            </h1>
            <p className="text-base md:text-lg text-neutral-600">
              Selecciona cómo quieres usar la plataforma
            </p>
          </div>

          {/* Cards de tipos de usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {userTypes.map((type) => {
              const Icon = type.icon;
              const colors = getColorClasses(type.color);

              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setStep(2);
                  }}
                  className="bg-white border-2 border-neutral-200 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  {/* Icono */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-neutral-800 mb-2">
                    {type.name}
                  </h3>

                  {/* Descripción */}
                  <p className="text-sm text-neutral-600 mb-4">
                    {type.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-600">
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              ¿Ya tienes cuenta?{' '}
              <button className="text-primary-600 font-semibold hover:underline">
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Formulario de registro
  const selectedTypeData = userTypes.find(t => t.id === selectedType);
  const colors = getColorClasses(selectedTypeData.color);
  const Icon = selectedTypeData.icon;

  const requiresBusinessData = ['BUSINESS', 'STREET_VENDOR', 'SERVICE_PROVIDER'].includes(selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header con tipo seleccionado */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep(1)}
              className="text-neutral-600 hover:text-neutral-800"
            >
              ← Volver
            </button>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800">
                {selectedTypeData.name}
              </h2>
              <p className="text-sm text-neutral-600">
                {selectedTypeData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Datos personales */}
          <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-4">
              Datos personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Teléfono {requiresBusinessData && '*'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required={requiresBusinessData}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+54 9 2324 123456"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </div>

          {/* Datos del negocio/servicio (solo si aplica) */}
          {requiresBusinessData && (
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-800 mb-4">
                {selectedType === 'BUSINESS' && 'Datos del comercio'}
                {selectedType === 'STREET_VENDOR' && 'Datos del emprendimiento'}
                {selectedType === 'SERVICE_PROVIDER' && 'Datos del servicio'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Nombre del {selectedType === 'BUSINESS' ? 'negocio' : 'emprendimiento'} *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Panadería Don Juan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="alimentos">Alimentos y Bebidas</option>
                    <option value="indumentaria">Indumentaria</option>
                    <option value="ferreteria">Ferretería</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="servicios">Servicios Profesionales</option>
                    <option value="hogar">Hogar y Decoración</option>
                    <option value="salud">Salud y Belleza</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                {selectedType === 'BUSINESS' && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Dirección del local *
                    </label>
                    <input
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Av. Libertad 123, Mercedes"
                    />
                  </div>
                )}

                {selectedType === 'STREET_VENDOR' && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Ubicaciones habituales
                    </label>
                    <textarea
                      name="usualLocations"
                      value={formData.usualLocations}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: Feria de los miércoles en Plaza, Food truck en Parque los sábados"
                    />
                  </div>
                )}

                {selectedType === 'SERVICE_PROVIDER' && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Área de cobertura *
                    </label>
                    <select
                      name="coverageArea"
                      value={formData.coverageArea}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecciona el área</option>
                      <option value="toda-mercedes">Toda Mercedes</option>
                      <option value="centro">Centro y alrededores</option>
                      <option value="zona-norte">Zona Norte</option>
                      <option value="zona-sur">Zona Sur</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe tu negocio o servicio..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botón de registro */}
          <div className="pt-6">
            <button
              type="submit"
              className={`w-full ${colors.bg} ${colors.hover} text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Términos */}
          <p className="text-xs text-center text-neutral-600">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Términos y Condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Política de Privacidad
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
