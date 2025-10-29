# BuZCalo - Red Social Profesional

BuZCalo es una plataforma de red social profesional que combina las mejores características de las redes sociales (como las historias y el feed interactivo) con funcionalidades de networking profesional (conexiones, oportunidades laborales, y recomendaciones de negocios).

## Características

- **Feed Social Profesional**: Publicaciones con contexto empresarial y profesional
- **Actualizaciones de Red**: Sistema de historias adaptado al mundo profesional con categorías
- **Conexiones**: Red de contactos profesionales con conexiones en común
- **Navegación Profesional**: Incluye secciones como Mi Red, Mi Negocio, y Oportunidades
- **Perfil Profesional**: Estadísticas de vistas de perfil y conexiones
- **Diseño Moderno**: Interfaz limpia con paleta de colores profesional (azul, naranja, verde azulado)

## Tecnologías

- **React 19** - Librería UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Inter Font** - Tipografía profesional

## Paleta de Colores

- **Azul Principal** (`primary`): #0066ff - Confianza y profesionalismo
- **Naranja Energético** (`secondary`): #ff7700 - Creatividad y conexión
- **Verde Azulado** (`accent`): #00bda2 - Crecimiento profesional
- **Grises Neutrales** (`neutral`): Escala completa para textos y fondos

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Header.jsx       # Navegación superior con logo BuZCalo
│   ├── Sidebar.jsx      # Menú lateral con navegación profesional
│   ├── Stories.jsx      # Actualizaciones de red con categorías
│   ├── Post.jsx         # Publicaciones con contexto profesional
│   └── Suggestions.jsx  # Recomendaciones profesionales
├── layouts/
│   └── MainLayout.jsx   # Layout principal
└── pages/
    └── Home.jsx         # Página principal
```

## Diferencias con Instagram/LinkedIn

BuZCalo se diferencia de otras plataformas al:
- Combinar la inmediatez de las redes sociales con el profesionalismo de LinkedIn
- Usar un diseño único con formas cuadradas/redondeadas en lugar de círculos completos
- Implementar "recomendaciones" en lugar de "likes" para dar un toque más profesional
- Incluir contexto empresarial en todas las publicaciones
- Mostrar métricas profesionales (vistas de perfil, conexiones)
