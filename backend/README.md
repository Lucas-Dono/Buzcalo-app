# BuZCalo Backend API

Backend API para BuZCalo - Plataforma de descubrimiento de productos y servicios locales.

## 🚀 Tecnologías

- **Node.js** 20+ con TypeScript
- **Express.js** - Framework web
- **Prisma ORM** - Database ORM
- **PostgreSQL** + PostGIS - Base de datos principal
- **Redis** - Cache y sessions
- **JWT** - Autenticación
- **Cloudinary** - Almacenamiento de imágenes
- **Docker** - Containerización

## 📋 Requisitos previos

- Node.js 20 o superior
- Docker y Docker Compose
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar servicios con Docker**
```bash
docker-compose up -d
```

5. **Generar cliente de Prisma**
```bash
npm run prisma:generate
```

6. **Ejecutar migraciones**
```bash
npm run prisma:migrate
```

7. **Poblar base de datos con datos de prueba**
```bash
npm run prisma:seed
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Producción
```bash
npm run build
npm start
```

## 📚 Scripts disponibles

- `npm run dev` - Inicia servidor en modo desarrollo con hot-reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia servidor en producción
- `npm run prisma:generate` - Genera cliente de Prisma
- `npm run prisma:migrate` - Ejecuta migraciones de base de datos
- `npm run prisma:studio` - Abre Prisma Studio (GUI para base de datos)
- `npm run prisma:seed` - Pobla base de datos con datos de prueba

## 🔑 Credenciales de prueba

Después de ejecutar `npm run prisma:seed`:

- **Cliente**: `cliente@test.com` / `Test1234`
- **Negocio**: `negocio@test.com` / `Test1234`
- **Servicios**: `servicios@test.com` / `Test1234`

## 📡 Endpoints principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Perfil usuario autenticado

### Usuarios
- `GET /api/users/me` - Ver perfil
- `PATCH /api/users/me` - Actualizar perfil

### Negocios
- `GET /api/businesses` - Listar negocios
- `GET /api/businesses/:id` - Ver negocio
- `POST /api/businesses` - Crear negocio
- `PATCH /api/businesses/:id` - Actualizar negocio

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Ver producto
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto

### Servicios
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Ver servicio
- `POST /api/services` - Crear servicio
- `PATCH /api/services/:id` - Actualizar servicio

### Stories
- `GET /api/stories` - Listar stories activas
- `POST /api/stories` - Crear story
- `DELETE /api/stories/:id` - Eliminar story

### Favoritos
- `GET /api/favorites` - Mis favoritos
- `POST /api/favorites` - Agregar favorito
- `DELETE /api/favorites/:id` - Quitar favorito

### Reviews
- `GET /api/reviews` - Listar reviews
- `POST /api/reviews` - Crear review

### Suscripciones
- `GET /api/subscriptions/me` - Ver plan actual
- `POST /api/subscriptions/subscribe` - Suscribirse a Plan Partner

### Búsqueda
- `GET /api/search?q=...` - Búsqueda global

### Ciudades
- `GET /api/cities` - Listar ciudades activas

## 🗄️ Estructura del proyecto

```
backend/
├── prisma/
│   ├── schema.prisma       # Schema de base de datos
│   ├── seed.ts             # Seed data
│   └── migrations/         # Migraciones
├── src/
│   ├── config/             # Configuración
│   │   ├── env.ts
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── cityFilter.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── controllers/        # Controladores
│   │   └── auth.controller.ts
│   ├── services/           # Lógica de negocio
│   ├── repositories/       # Acceso a datos
│   ├── models/             # Tipos y modelos
│   ├── schemas/            # Validaciones
│   ├── routes/             # Rutas
│   ├── jobs/               # Cron jobs
│   ├── utils/              # Utilidades
│   │   ├── logger.ts
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   ├── errors.ts
│   │   └── slug.util.ts
│   ├── app.ts              # Configuración Express
│   └── server.ts           # Punto de entrada
├── docker-compose.yml      # Docker services
├── tsconfig.json           # TypeScript config
├── package.json
└── README.md
```

## 🔒 Seguridad

- Rate limiting en endpoints críticos
- Helmet para headers de seguridad
- CORS configurado
- Passwords hasheados con bcrypt (cost 12)
- JWT con access (15min) y refresh tokens (7d)
- Validación de inputs con schemas

## 🌍 Variables de entorno

Ver `.env.example` para lista completa de variables requeridas.

Principales:
- `DATABASE_URL` - Connection string de PostgreSQL
- `REDIS_HOST`, `REDIS_PORT` - Configuración Redis
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - Secrets para JWT
- `CLOUDINARY_*` - Credenciales Cloudinary
- `FRONTEND_URL` - URL del frontend para CORS

## 📝 Licencia

ISC

## 👥 Team

BuZCalo Team
