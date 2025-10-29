# BuZCalo - Arquitectura Backend Completa
## Análisis Crítico y Especificaciones Técnicas

**Proyecto:** Sistema de descubrimiento de productos y servicios locales hiperlocal
**Ciudad Inicial:** Mercedes, Buenos Aires, Argentina
**Versión:** 1.0
**Fecha:** Octubre 2025

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General y Análisis Crítico](#1-visión-general-y-análisis-crítico)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tipos de Usuarios y Sistema de Autenticación](#3-tipos-de-usuarios-y-sistema-de-autenticación)
4. [Modelo de Datos](#4-modelo-de-datos)
5. [API REST - Endpoints](#5-api-rest---endpoints)
6. [Sistema de Geolocalización y Filtrado por Ciudad](#6-sistema-de-geolocalización-y-filtrado-por-ciudad)
7. [Sistema de Stories con Expiración](#7-sistema-de-stories-con-expiración)
8. [Sistema de Servicios](#8-sistema-de-servicios)
9. [Infraestructura y DevOps](#9-infraestructura-y-devops)
10. [Seguridad](#10-seguridad)
11. [Escalabilidad Multi-Ciudad](#11-escalabilidad-multi-ciudad)
12. [Plan de Implementación](#12-plan-de-implementación)

---

## 1. VISIÓN GENERAL Y ANÁLISIS CRÍTICO

### 1.1 Concepto Core
BuZCalo es la **"Guía Amarilla digitalizada"** enfocada en comercio hiperlocal. NO es un marketplace de envíos, NO es e-commerce tradicional. Es un sistema de **descubrimiento y conexión** entre compradores y vendedores de la misma ciudad.

### 1.2 Análisis Crítico de Requisitos

#### ✅ FORTALEZAS del Modelo Propuesto
1. **Hiperlocal**: Reducir el scope a una ciudad es BRILLANTE para MVP
   - Menores costos de infraestructura
   - Validación rápida de mercado
   - Marketing más efectivo (boca a boca local)
   - Menos complejidad logística

2. **Multi-tipo de vendedor**: Esta es la CLAVE diferenciadora
   - Comercios establecidos (panadería, ferretería)
   - Vendedores ambulantes (feriantes, food trucks)
   - Prestadores de servicios (plomero, electricista, profesor particular)
   - Vendedores ocasionales (vendo mi mueble usado, excedente de huerta)

3. **Stories con ofertas del día**: Gamificación y urgencia
   - Genera tráfico diario recurrente
   - FOMO (Fear Of Missing Out) bien implementado

#### ⚠️ DESAFÍOS CRÍTICOS

**1. Problema de Liquidez (Chicken-and-egg)**
```
Sin vendedores → No hay productos → No vienen compradores
Sin compradores → Vendedores no ven valor → No publican productos
```
**Solución propuesta:**
- Fase 1: Onboarding manual de 20-30 comercios clave de Mercedes
- Fase 2: Incentivar publicación de ofertas diarias (gamificación para vendedores)
- Fase 3: Marketing hiperlocal (radio local, volanteo, redes sociales geolocalizadas)

**2. Problema de Calidad y Moderación**
Mercedes tiene ~65,000 habitantes. Si crece rápido, necesitas moderación.
- Vendedores ocasionales pueden ser fraudulentos
- Productos pueden no existir o estar en mal estado
- Servicios pueden ser de mala calidad

**Solución propuesta:**
- Sistema de verificación para comercios (AFIP, fotos de local)
- Reputación y reviews obligatorios post-contacto
- Moderación reactiva en fase 1, proactiva en fase 2
- Sistema de denuncias y penalizaciones

**3. Problema de Monetización Temprana**
Si cobras comisión desde el día 1, frenas el crecimiento. Si no cobras nunca, no hay negocio.

**Solución propuesta:**
- Año 1: Gratis para todos (crecimiento)
- Año 2: Freemium
  - Gratis: 5 publicaciones activas, posición estándar
  - Premium: Publicaciones ilimitadas, aparecer primero en búsquedas, destacados, estadísticas
- Año 3+: Comisión opcional por transacciones in-app (si implementamos pagos)

**4. Problema de Expansión Multi-Ciudad**
Cada ciudad nueva es un "cold start" completo.

**Solución propuesta:**
- Arquitectura multi-tenant desde día 1 (cada ciudad = tenant)
- Pero operación manual de expansión (no self-service)
- Expansión solo cuando Mercedes tenga >500 vendedores activos

### 1.3 Stack Tecnológico Recomendado

#### Backend
```
Node.js + Express.js (o Fastify)
├── TypeScript (tipado estricto)
├── PostgreSQL (datos relacionales, geolocalización con PostGIS)
├── Redis (cache, sessions, rate limiting)
├── S3/Cloudinary (imágenes de productos)
└── JWT + Refresh Tokens (autenticación)
```

**¿Por qué Node.js?**
- Mismo lenguage que frontend (JavaScript/TypeScript)
- Excelente para I/O intensivo (muchos usuarios consultando productos)
- Gran ecosistema de librerías
- Fácil escalar horizontalmente

**Alternativa considerada: Python + FastAPI**
- Pros: Mejor para ML futuro (recomendaciones), excelente documentación auto-generada
- Cons: Menor sinergia con frontend React, menos familiaridad del equipo (asumo)

#### Base de Datos

**PostgreSQL (Recomendado) vs MongoDB**

| Aspecto | PostgreSQL ✅ | MongoDB ❌ |
|---------|--------------|-----------|
| Relaciones (Usuario-Negocio-Productos) | Nativo, FKs | Manual, lento |
| Geolocalización | PostGIS (industria estándar) | Básico |
| Transacciones | ACID completo | Limitado |
| Búsqueda fulltext | Excelente | Básico |
| Escalabilidad | Vertical primero, sharding complejo | Horizontal nativo |

**Veredicto:** PostgreSQL porque las relaciones son complejas (usuarios, negocios, productos, servicios, reviews) y necesitas consistencia.

#### Infraestructura

**Fase 1 (MVP - Mercedes):**
```
1 servidor VPS (DigitalOcean, Linode, o AWS Lightsail)
├── 4GB RAM, 2 vCPUs
├── PostgreSQL + Redis + Node.js en mismo servidor
├── Nginx como reverse proxy
├── Costo: ~$30-40/mes
```

**Fase 2 (Crecimiento):**
```
Backend: Railway.app o Render.com (PaaS)
├── Auto-scaling
├── CI/CD integrado
└── ~$50-100/mes

Base de datos: Supabase o Neon (PostgreSQL managed)
├── Backups automáticos
├── PostGIS incluido
└── ~$25-50/mes

Imágenes: Cloudinary
├── Optimización automática
├── CDN global
└── ~$0-25/mes (free tier generoso)

Total: ~$100-200/mes
```

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              React 19 + Vite + Tailwind                      │
│                    (Ya implementado)                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│                   (Nginx + Rate Limit)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Capa de Autenticación                    │  │
│  │           (JWT + Refresh Tokens)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controladores                            │  │
│  │  • AuthController                                     │  │
│  │  • UserController                                     │  │
│  │  • BusinessController                                 │  │
│  │  • ProductController                                  │  │
│  │  • ServiceController                                  │  │
│  │  • StoryController                                    │  │
│  │  • SearchController                                   │  │
│  │  • ReviewController                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Servicios de Negocio                     │  │
│  │  • GeoService (filtrado por ciudad)                   │  │
│  │  • StoryExpirationService (cron 23:59)                │  │
│  │  • NotificationService                                │  │
│  │  • ImageProcessingService                             │  │
│  │  • SearchService (fulltext + filters)                 │  │
│  │  • ModerationService                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Repositorios (Data Access)               │  │
│  │  • UserRepository                                     │  │
│  │  • BusinessRepository                                 │  │
│  │  • ProductRepository                                  │  │
│  │  • ServiceRepository                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐  │
│  │   PostgreSQL     │  │      Redis       │  │   S3/    │  │
│  │   + PostGIS      │  │   (Cache/Jobs)   │  │Cloudinary│  │
│  └──────────────────┘  └──────────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                        │
│  • SendGrid/Resend (emails)                                  │
│  • Twilio (SMS verificación - opcional fase 2)              │
│  • Google Maps API (geocoding - opcional)                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Estructura de Carpetas Backend

```
buzcalo-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Config PostgreSQL
│   │   ├── redis.ts             # Config Redis
│   │   └── env.ts               # Variables de entorno
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Verificación JWT
│   │   ├── cityFilter.middleware.ts  # Filtrado por ciudad
│   │   ├── rateLimit.middleware.ts   # Rate limiting
│   │   ├── upload.middleware.ts      # Multer para imágenes
│   │   └── validation.middleware.ts  # Validación Zod
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── business.controller.ts
│   │   ├── product.controller.ts
│   │   ├── service.controller.ts
│   │   ├── story.controller.ts
│   │   ├── search.controller.ts
│   │   └── review.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── geo.service.ts       # Lógica geolocalización
│   │   ├── story-expiration.service.ts
│   │   ├── notification.service.ts
│   │   ├── image.service.ts
│   │   ├── search.service.ts
│   │   └── moderation.service.ts
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── business.repository.ts
│   │   ├── product.repository.ts
│   │   ├── service.repository.ts
│   │   └── story.repository.ts
│   │
│   ├── models/               # Schemas de base de datos (Prisma/TypeORM)
│   │   ├── User.ts
│   │   ├── Business.ts
│   │   ├── Product.ts
│   │   ├── Service.ts
│   │   ├── Story.ts
│   │   ├── Review.ts
│   │   └── City.ts
│   │
│   ├── schemas/              # Validaciones Zod
│   │   ├── auth.schema.ts
│   │   ├── product.schema.ts
│   │   └── service.schema.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── business.routes.ts
│   │   ├── product.routes.ts
│   │   ├── service.routes.ts
│   │   └── index.ts
│   │
│   ├── jobs/                 # Cron jobs
│   │   ├── expireStories.job.ts    # Corre a las 23:59
│   │   └── cleanupImages.job.ts
│   │
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts  # bcrypt
│   │   ├── logger.ts         # Winston
│   │   └── errors.ts         # Custom errors
│   │
│   └── app.ts                # Express app
│   └── server.ts             # Server startup
│
├── prisma/                   # Prisma ORM (recomendado)
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. TIPOS DE USUARIOS Y SISTEMA DE AUTENTICACIÓN

### 3.1 Tipos de Usuarios

#### **1. CLIENTE (Comprador)**
- Puede buscar productos y servicios
- Puede guardar favoritos
- Puede dejar reviews
- Puede contactar vendedores (WhatsApp, llamada)
- NO puede publicar (a menos que se registre como vendedor también)

**Registro:**
- Email + Contraseña
- Nombre completo
- Ciudad (selección de lista, NO texto libre)
- Opcional: foto de perfil, teléfono

#### **2. COMERCIO ESTABLECIDO**
- Tiene un local físico
- Puede publicar productos y servicios ilimitados (en free tier: límite)
- Puede crear Stories de ofertas del día
- Tiene página de negocio pública

**Registro:**
- Todo lo de Cliente +
- Nombre del negocio
- Dirección completa del local (autocomplete con Google Maps API)
- Categoría de negocio (almacén, panadería, ferretería, etc.)
- Teléfono obligatorio
- Horarios de atención
- CUIT/CUIL (opcional pero recomendado para verificación)
- Fotos del local (1-5 fotos)

**Verificación (Fase 2):**
- Moderador revisa fotos del local
- Verifica que dirección exista en Google Maps
- Badge "Verificado" en perfil

#### **3. VENDEDOR AMBULANTE**
- NO tiene local fijo (feriante, food truck, vendedor de feria)
- Puede publicar productos/servicios
- Puede crear Stories
- Su "ubicación" puede cambiar día a día

**Registro:**
- Todo lo de Cliente +
- Nombre del emprendimiento
- Tipo de venta ambulante (feriante, food truck, delivery propio, etc.)
- Ubicaciones habituales (ej: "Feria de los miércoles", "Plaza principal sábados")
- Teléfono obligatorio
- Opcional: fotos del puesto/vehículo

**Diferencias con Comercio:**
- NO tiene dirección fija en el mapa
- En su perfil dice "Vendedor Ambulante"
- Puede actualizar su ubicación actual (opcional, fase 2)

#### **4. PRESTADOR DE SERVICIOS**
- Ofrece servicios (plomero, electricista, profesor, etc.)
- NO vende productos físicos
- Puede tener local o trabajar a domicilio

**Registro:**
- Todo lo de Cliente +
- Nombre profesional / Emprendimiento
- Categoría de servicio (plomería, electricidad, clases, etc.)
- Descripción de servicios ofrecidos
- Tarifas (opcional, pueden poner "consultar")
- Radio de cobertura (ej: "Toda Mercedes", "Centro y alrededores")
- Teléfono obligatorio
- Certificaciones (opcional, fotos de títulos)

#### **5. VENDEDOR OCASIONAL**
- Vende algo puntual (mueble usado, bicicleta, excedente de huerta)
- Perfil simplificado
- NO puede crear Stories
- Límite de publicaciones activas (ej: 3)

**Registro:**
- Todo lo de Cliente +
- Teléfono obligatorio
- Opción de activar "Perfil de vendedor ocasional"

**Restricciones:**
- Máximo 3 publicaciones activas simultáneas (en free tier)
- NO puede tener página de negocio
- NO puede crear Stories
- Publicaciones expiran a los 30 días

### 3.2 Modelo de Datos de Usuarios

```typescript
// Enum para tipos de usuario
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
  STREET_VENDOR = 'STREET_VENDOR',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  OCCASIONAL_SELLER = 'OCCASIONAL_SELLER'
}

enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

// Tabla: users
interface User {
  id: string;                    // UUID
  email: string;                 // Único
  passwordHash: string;          // bcrypt
  role: UserRole;
  status: AccountStatus;
  cityId: string;                // FK a cities

  // Perfil básico
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Relaciones
  business?: Business;           // Si role = BUSINESS, STREET_VENDOR, SERVICE_PROVIDER
  products: Product[];
  services: Service[];
  favorites: Favorite[];
  reviews: Review[];
}

// Tabla: businesses (para BUSINESS, STREET_VENDOR, SERVICE_PROVIDER)
interface Business {
  id: string;
  userId: string;                // FK a users (1-to-1)

  // Info del negocio
  name: string;
  description?: string;
  category: string;              // "Panadería", "Ferretería", etc.

  // Ubicación (solo para BUSINESS con local fijo)
  address?: string;
  latitude?: number;
  longitude?: number;

  // Para STREET_VENDOR
  usualLocations?: string;       // JSON: ["Feria miércoles", "Plaza sábados"]

  // Para SERVICE_PROVIDER
  serviceCategories?: string[];  // ["Plomería", "Electricidad"]
  coverageArea?: string;         // "Toda Mercedes"

  // Contacto
  phone: string;
  whatsapp?: string;
  website?: string;

  // Horarios (JSON)
  schedule?: {
    monday?: { open: string, close: string },
    tuesday?: { open: string, close: string },
    // ...
  };

  // Verificación
  verified: boolean;
  verifiedAt?: Date;
  cuit?: string;                 // Opcional

  // Estadísticas
  rating: number;                // Promedio de reviews
  reviewCount: number;
  viewCount: number;
  favoriteCount: number;

  // Imágenes
  logoUrl?: string;
  coverImageUrl?: string;
  galleryImages?: string[];      // Array de URLs

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user: User;
  products: Product[];
  services: Service[];
  stories: Story[];
  reviews: Review[];
}
```

### 3.3 Sistema de Autenticación

#### **3.3.1 Flujo de Registro**

```typescript
POST /api/auth/register
Body: {
  // Común para todos
  email: string;
  password: string;           // Min 8 chars, 1 upper, 1 lower, 1 number
  firstName: string;
  lastName: string;
  cityId: string;             // ID de la ciudad (Mercedes)
  role: UserRole;

  // Si role != CUSTOMER
  businessData?: {
    name: string;
    category: string;
    phone: string;
    address?: string;         // Para BUSINESS
    usualLocations?: string;  // Para STREET_VENDOR
    serviceCategories?: string[]; // Para SERVICE_PROVIDER
    // ...
  }
}

Response: {
  user: {
    id: string;
    email: string;
    firstName: string;
    role: UserRole;
    status: AccountStatus;
  },
  tokens: {
    accessToken: string;      // JWT, expira en 15min
    refreshToken: string;     // JWT, expira en 7 días
  }
}
```

**Validaciones:**
1. Email único en la base de datos
2. Email válido (regex + optional: verificación con email)
3. Password: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
4. Ciudad existe en base de datos
5. Si role != CUSTOMER, businessData es obligatorio
6. Teléfono formato argentino: +549XXXXXXXXXX (validar con regex)

**Proceso:**
1. Validar datos
2. Hashear password con bcrypt (cost=12)
3. Crear registro en `users`
4. Si role != CUSTOMER, crear registro en `businesses`
5. Generar Access Token (JWT, expira 15min) y Refresh Token (expira 7 días)
6. Enviar email de bienvenida (async, no bloquear response)
7. Enviar email de verificación (async)

#### **3.3.2 Flujo de Login**

```typescript
POST /api/auth/login
Body: {
  email: string;
  password: string;
}

Response: {
  user: { ... },
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
}
```

**Proceso:**
1. Buscar user por email
2. Verificar password con bcrypt.compare()
3. Actualizar `lastLoginAt`
4. Generar nuevos tokens
5. Retornar user + tokens

**Rate Limiting:** 5 intentos por IP por 15 minutos (usar Redis)

#### **3.3.3 Estructura JWT**

```typescript
// Access Token (15 min)
{
  sub: userId,              // Subject
  email: string,
  role: UserRole,
  cityId: string,           // IMPORTANTE: para filtrado
  businessId?: string,      // Si aplica
  iat: number,              // Issued at
  exp: number,              // Expires
  type: 'access'
}

// Refresh Token (7 días)
{
  sub: userId,
  type: 'refresh',
  iat: number,
  exp: number,
  tokenFamily: string       // Para detectar reutilización (security)
}
```

#### **3.3.4 Refresh Token Flow**

```typescript
POST /api/auth/refresh
Headers: {
  Authorization: "Bearer <refreshToken>"
}

Response: {
  accessToken: string;
  refreshToken: string;     // Nuevo refresh token (rotation)
}
```

**Proceso (Refresh Token Rotation):**
1. Validar refresh token
2. Verificar que no esté en blacklist (Redis)
3. Generar nuevo access token
4. Generar nuevo refresh token
5. Agregar viejo refresh token a blacklist (Redis, TTL 7 días)
6. Retornar ambos tokens

**Security:** Si detectas reuso de refresh token viejo (está en blacklist y alguien lo intenta usar), invalidar TODA la familia de tokens del usuario (posible robo de token).

---

## 4. MODELO DE DATOS

### 4.1 Schema Completo (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= UBICACIÓN =============

model City {
  id        String   @id @default(uuid())
  name      String   @unique
  province  String
  country   String   @default("Argentina")

  // Coordenadas del centro de la ciudad (para cálculos de distancia)
  latitude  Float
  longitude Float

  // Metadata
  active    Boolean  @default(true)  // Permite desactivar ciudades
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  users     User[]

  @@index([name])
}

// ============= USUARIOS =============

enum UserRole {
  CUSTOMER
  BUSINESS
  STREET_VENDOR
  SERVICE_PROVIDER
  OCCASIONAL_SELLER
}

enum AccountStatus {
  ACTIVE
  PENDING_VERIFICATION
  SUSPENDED
  BANNED
}

model User {
  id           String        @id @default(uuid())
  email        String        @unique
  passwordHash String
  role         UserRole
  status       AccountStatus @default(ACTIVE)

  // Perfil
  firstName String
  lastName  String
  phone     String?
  avatarUrl String?

  // Ubicación
  cityId String
  city   City   @relation(fields: [cityId], references: [id])

  // Verificación
  emailVerified   Boolean   @default(false)
  emailVerifiedAt DateTime?

  // Metadata
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  lastLoginAt DateTime?

  // Relaciones
  business      Business?
  products      Product[]
  services      Service[]
  favorites     Favorite[]
  reviewsGiven  Review[]       @relation("ReviewAuthor")
  reviewsReceived Review[]     @relation("ReviewRecipient")

  @@index([email])
  @@index([cityId])
  @@index([role])
}

// ============= NEGOCIOS =============

model Business {
  id          String @id @default(uuid())
  userId      String @unique
  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Info básica
  name        String
  slug        String @unique  // Para URLs amigables: /negocio/panaderia-don-juan
  description String?
  category    String

  // Ubicación (para BUSINESS con local)
  address   String?
  latitude  Float?
  longitude Float?

  // Para STREET_VENDOR
  usualLocations String?  // JSON string: ["Feria miércoles", "Plaza sábados"]

  // Para SERVICE_PROVIDER
  serviceCategories String?  // JSON string: ["Plomería", "Electricidad"]
  coverageArea      String?  // "Toda Mercedes", "Centro y alrededores"

  // Contacto
  phone     String
  whatsapp  String?
  website   String?
  instagram String?
  facebook  String?

  // Horarios
  schedule Json?  // { monday: { open: "09:00", close: "18:00" }, ... }

  // Verificación
  verified   Boolean   @default(false)
  verifiedAt DateTime?
  cuit       String?

  // Estadísticas (denormalizadas para performance)
  rating         Float @default(0)
  reviewCount    Int   @default(0)
  viewCount      Int   @default(0)
  favoriteCount  Int   @default(0)
  productCount   Int   @default(0)
  serviceCount   Int   @default(0)

  // Imágenes
  logoUrl        String?
  coverImageUrl  String?
  galleryImages  String[]  // Array de URLs

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  products  Product[]
  services  Service[]
  stories   Story[]
  reviews   Review[]
  favorites Favorite[]

  @@index([slug])
  @@index([category])
  @@index([verified])
  @@index([rating])
}

// ============= PRODUCTOS =============

enum ProductStatus {
  ACTIVE
  PAUSED
  OUT_OF_STOCK
  DELETED
}

model Product {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  businessId  String?       // Null si es OCCASIONAL_SELLER sin business
  business    Business?     @relation(fields: [businessId], references: [id], onDelete: Cascade)

  // Info básica
  name        String
  description String
  category    String

  // Precio
  price       Float
  currency    String        @default("ARS")

  // Stock (opcional)
  hasStock    Boolean       @default(true)
  stockCount  Int?

  // Imágenes
  images      String[]      // Array de URLs

  // Condición (para productos usados)
  condition   String?       // "Nuevo", "Usado - Excelente", "Usado - Bueno", etc.

  // Estado
  status      ProductStatus @default(ACTIVE)

  // Ubicación (hereda de business o user)
  cityId      String        // Denormalizado para queries rápidas

  // Metadata
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  expiresAt   DateTime?     // Para OCCASIONAL_SELLER (30 días)
  viewCount   Int           @default(0)

  // Relaciones
  favorites   Favorite[]

  @@index([cityId])
  @@index([category])
  @@index([status])
  @@index([price])
  @@index([createdAt])
}

// ============= SERVICIOS =============

enum ServiceStatus {
  ACTIVE
  PAUSED
  DELETED
}

model Service {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  businessId  String?
  business    Business?     @relation(fields: [businessId], references: [id], onDelete: Cascade)

  // Info básica
  name        String
  description String
  category    String        // "Plomería", "Electricidad", "Clases particulares", etc.

  // Precio
  priceType   String        // "fixed", "hourly", "quote" (a consultar)
  price       Float?
  priceUnit   String?       // "hora", "servicio", "mes", etc.
  currency    String        @default("ARS")

  // Cobertura
  coverageArea String?      // "Toda Mercedes", "Centro", etc.

  // Imágenes
  images      String[]

  // Estado
  status      ServiceStatus @default(ACTIVE)

  // Ubicación
  cityId      String

  // Metadata
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  viewCount   Int           @default(0)

  // Relaciones
  favorites   Favorite[]

  @@index([cityId])
  @@index([category])
  @@index([status])
}

// ============= STORIES (Ofertas del Día) =============

enum StoryStatus {
  ACTIVE
  EXPIRED
  DELETED
}

model Story {
  id         String      @id @default(uuid())
  businessId String
  business   Business    @relation(fields: [businessId], references: [id], onDelete: Cascade)

  // Contenido
  title      String      // "50% OFF en pan", "2x1 en hamburguesas"
  imageUrl   String

  // Link (puede ser a un producto específico o genérico)
  linkType   String      // "product", "service", "external", "none"
  linkId     String?     // ID del producto/servicio
  linkUrl    String?     // URL externa (ej: Instagram)

  // Badge de oferta
  badge      String?     // "50%", "2x1", "HOY", "NUEVO"
  badgeColor String?     // Hex color

  // Estado
  status     StoryStatus @default(ACTIVE)

  // Expiración (23:59 del día de creación)
  createdAt  DateTime    @default(now())
  expiresAt  DateTime    // Auto-calculado al crear

  // Estadísticas
  viewCount  Int         @default(0)
  clickCount Int         @default(0)

  @@index([businessId])
  @@index([status])
  @@index([expiresAt])
}

// ============= FAVORITOS =============

model Favorite {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Puede ser favorito de Business, Product, o Service
  businessId String?
  business   Business? @relation(fields: [businessId], references: [id], onDelete: Cascade)

  productId  String?
  product    Product?  @relation(fields: [productId], references: [id], onDelete: Cascade)

  serviceId  String?
  service    Service?  @relation(fields: [serviceId], references: [id], onDelete: Cascade)

  createdAt  DateTime  @default(now())

  @@unique([userId, businessId])
  @@unique([userId, productId])
  @@unique([userId, serviceId])
  @@index([userId])
}

// ============= REVIEWS =============

model Review {
  id         String   @id @default(uuid())

  // Autor
  authorId   String
  author     User     @relation("ReviewAuthor", fields: [authorId], references: [id], onDelete: Cascade)

  // Receptor (puede ser User o Business)
  recipientId   String
  recipient     User?     @relation("ReviewRecipient", fields: [recipientId], references: [id], onDelete: Cascade)

  businessId String?
  business   Business? @relation(fields: [businessId], references: [id], onDelete: Cascade)

  // Contenido
  rating     Int       // 1-5 estrellas
  comment    String?

  // Metadata
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([businessId])
  @@index([authorId])
  @@index([rating])
}

// ============= DENUNCIAS (Fase 2) =============

enum ReportReason {
  SPAM
  FRAUD
  INAPPROPRIATE
  FAKE_PRODUCT
  BAD_SERVICE
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWED
  RESOLVED
  DISMISSED
}

model Report {
  id          String       @id @default(uuid())
  reporterId  String

  // Puede denunciar: User, Business, Product, Service, Review
  targetType  String       // "user", "business", "product", "service", "review"
  targetId    String

  reason      ReportReason
  description String?

  status      ReportStatus @default(PENDING)

  // Resolución
  reviewedBy  String?      // User ID del moderador
  reviewedAt  DateTime?
  resolution  String?      // Comentario del moderador

  createdAt   DateTime     @default(now())

  @@index([status])
  @@index([targetType, targetId])
}
```

### 4.2 Índices y Optimizaciones

**Queries Más Comunes:**
1. Buscar productos por ciudad + categoría
2. Buscar servicios por ciudad + categoría
3. Listar productos de un negocio
4. Stories activas de una ciudad
5. Reviews de un negocio

**Índices Críticos:**
```sql
-- Búsqueda de productos
CREATE INDEX idx_products_city_category_status
ON products(city_id, category, status);

CREATE INDEX idx_products_city_price
ON products(city_id, price)
WHERE status = 'ACTIVE';

-- Búsqueda fulltext
CREATE INDEX idx_products_search
ON products USING GIN(to_tsvector('spanish', name || ' ' || description));

-- Stories activas
CREATE INDEX idx_stories_expires_status
ON stories(expires_at, status)
WHERE status = 'ACTIVE';

-- Geolocalización (PostGIS)
CREATE INDEX idx_businesses_location
ON businesses USING GIST(ST_MakePoint(longitude, latitude));
```

---

## 5. API REST - ENDPOINTS

### 5.1 Autenticación

```typescript
POST   /api/auth/register          # Registro
POST   /api/auth/login             # Login
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Solicitar reset
POST   /api/auth/reset-password    # Resetear con token
POST   /api/auth/verify-email      # Verificar email
```

### 5.2 Usuarios

```typescript
GET    /api/users/me               # Perfil propio
PATCH  /api/users/me               # Actualizar perfil
DELETE /api/users/me               # Eliminar cuenta
GET    /api/users/:id              # Ver perfil público
POST   /api/users/change-password # Cambiar contraseña
```

### 5.3 Negocios

```typescript
GET    /api/businesses             # Listar negocios (filtros: category, verified, rating)
GET    /api/businesses/:id         # Ver negocio
GET    /api/businesses/slug/:slug  # Ver negocio por slug
POST   /api/businesses             # Crear negocio (solo si user.role permite)
PATCH  /api/businesses/:id         # Actualizar negocio (solo owner)
DELETE /api/businesses/:id         # Eliminar negocio (soft delete)
POST   /api/businesses/:id/view    # Incrementar view count

# Productos de un negocio
GET    /api/businesses/:id/products
GET    /api/businesses/:id/services
GET    /api/businesses/:id/reviews
GET    /api/businesses/:id/stories
```

### 5.4 Productos

```typescript
GET    /api/products               # Listar productos (filtros: category, minPrice, maxPrice, search)
GET    /api/products/:id           # Ver producto
POST   /api/products               # Crear producto
PATCH  /api/products/:id           # Actualizar producto (solo owner)
DELETE /api/products/:id           # Eliminar producto
POST   /api/products/:id/view      # Incrementar view count

# Búsqueda
GET    /api/products/search?q=...  # Búsqueda fulltext
```

### 5.5 Servicios

```typescript
GET    /api/services               # Listar servicios (filtros: category, priceType)
GET    /api/services/:id           # Ver servicio
POST   /api/services               # Crear servicio
PATCH  /api/services/:id           # Actualizar servicio (solo owner)
DELETE /api/services/:id           # Eliminar servicio
POST   /api/services/:id/view      # Incrementar view count

# Búsqueda
GET    /api/services/search?q=...  # Búsqueda fulltext
```

### 5.6 Stories

```typescript
GET    /api/stories                # Listar stories activas (filtradas por ciudad)
GET    /api/stories/:id            # Ver story
POST   /api/stories                # Crear story (solo BUSINESS, STREET_VENDOR, SERVICE_PROVIDER)
DELETE /api/stories/:id            # Eliminar story (solo owner)
POST   /api/stories/:id/view       # Incrementar view count
POST   /api/stories/:id/click      # Incrementar click count
```

### 5.7 Favoritos

```typescript
GET    /api/favorites              # Mis favoritos
POST   /api/favorites              # Agregar favorito (body: { type, id })
DELETE /api/favorites/:id          # Quitar favorito
```

### 5.8 Reviews

```typescript
GET    /api/reviews?businessId=... # Reviews de un negocio
POST   /api/reviews                # Crear review
PATCH  /api/reviews/:id            # Editar review (solo author)
DELETE /api/reviews/:id            # Eliminar review (solo author)
```

### 5.9 Búsqueda Global

```typescript
GET    /api/search?q=pizza         # Busca en productos + servicios + negocios
  Response: {
    products: Product[],
    services: Service[],
    businesses: Business[]
  }
```

### 5.10 Ciudades

```typescript
GET    /api/cities                 # Listar ciudades activas
GET    /api/cities/:id             # Info de una ciudad
```

### 5.11 Moderación (Admin)

```typescript
GET    /api/admin/reports          # Listar denuncias
PATCH  /api/admin/reports/:id      # Resolver denuncia
POST   /api/admin/users/:id/suspend
POST   /api/admin/users/:id/ban
POST   /api/admin/businesses/:id/verify
```

---

## 6. SISTEMA DE GEOLOCALIZACIÓN Y FILTRADO POR CIUDAD

### 6.1 Estrategia de Filtrado

**Principio:** TODO se filtra por ciudad a nivel de backend. El frontend NO debe poder ver contenido de otras ciudades.

**Implementación:**

```typescript
// middleware/cityFilter.middleware.ts

export const cityFilter = (req: Request, res: Response, next: NextFunction) => {
  // El JWT contiene cityId del usuario autenticado
  const userCityId = req.user.cityId;

  // Inyectar filtro en todas las queries
  req.cityFilter = { cityId: userCityId };

  next();
};

// Aplicar a todas las rutas públicas
app.use('/api/products', cityFilter);
app.use('/api/services', cityFilter);
app.use('/api/businesses', cityFilter);
app.use('/api/stories', cityFilter);
```

**En los controladores:**

```typescript
// controllers/product.controller.ts

async listProducts(req: Request, res: Response) {
  const { category, minPrice, maxPrice, search } = req.query;
  const cityId = req.cityFilter.cityId; // Inyectado por middleware

  const products = await prisma.product.findMany({
    where: {
      cityId,  // SIEMPRE filtrar por ciudad
      status: 'ACTIVE',
      category: category || undefined,
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      }
    },
    include: {
      business: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
          verified: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(products);
}
```

### 6.2 Geolocalización de Negocios

**Para negocios con local físico:**

1. **Geocoding al registrarse:**
```typescript
// services/geo.service.ts

import axios from 'axios';

export class GeoService {
  async geocodeAddress(address: string, city: string): Promise<{lat: number, lng: number}> {
    // Opción 1: Google Maps Geocoding API (pago después de free tier)
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: `${address}, ${city}, Argentina`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.results.length === 0) {
      throw new Error('Dirección no encontrada');
    }

    const location = response.data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };

    // Opción 2: Nominatim (OpenStreetMap, gratis pero con rate limits)
    // Mejor para MVP
  }

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
```

2. **Búsqueda por cercanía (Fase 2):**
```typescript
// Usando PostGIS
SELECT
  b.*,
  ST_Distance(
    ST_MakePoint(b.longitude, b.latitude)::geography,
    ST_MakePoint($userLng, $userLat)::geography
  ) AS distance_meters
FROM businesses b
WHERE b.city_id = $cityId
  AND ST_DWithin(
    ST_MakePoint(b.longitude, b.latitude)::geography,
    ST_MakePoint($userLng, $userLat)::geography,
    5000  -- Radio de 5km
  )
ORDER BY distance_meters ASC
LIMIT 20;
```

**Para MVP (Fase 1):** NO implementar búsqueda por cercanía. Mercedes es pequeña (~7km de diámetro), mostrar todos los resultados de la ciudad ordenados por relevancia.

### 6.3 Selección de Ciudad al Registrarse

**Frontend:**
```typescript
// Dropdown con ciudades activas
const [cities, setCities] = useState([]);

useEffect(() => {
  fetch('/api/cities')
    .then(res => res.json())
    .then(data => setCities(data));
}, []);

<select name="cityId" required>
  <option value="">Selecciona tu ciudad</option>
  {cities.map(city => (
    <option key={city.id} value={city.id}>
      {city.name}, {city.province}
    </option>
  ))}
</select>
```

**Validación backend:**
```typescript
// Verificar que la ciudad existe y está activa
const city = await prisma.city.findFirst({
  where: {
    id: cityId,
    active: true
  }
});

if (!city) {
  throw new BadRequestError('Ciudad inválida o no disponible');
}
```

---

## 7. SISTEMA DE STORIES CON EXPIRACIÓN

### 7.1 Lógica de Expiración

**Regla:** Stories creadas en cualquier momento del día expiran a las 23:59:59 de ese mismo día.

**Implementación al crear:**

```typescript
// controllers/story.controller.ts

async createStory(req: Request, res: Response) {
  const { businessId, title, imageUrl, linkType, linkId, badge } = req.body;

  // Verificar que el usuario sea dueño del negocio
  const business = await prisma.business.findUnique({
    where: { id: businessId }
  });

  if (!business || business.userId !== req.user.id) {
    throw new ForbiddenError('No tienes permiso para crear stories para este negocio');
  }

  // Calcular expiresAt: 23:59:59 del día actual
  const now = new Date();
  const expiresAt = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
  );

  const story = await prisma.story.create({
    data: {
      businessId,
      title,
      imageUrl,
      linkType,
      linkId,
      badge,
      expiresAt,
      status: 'ACTIVE'
    }
  });

  res.status(201).json(story);
}
```

### 7.2 Cron Job de Expiración

**Opción 1: Cron Job (Simple)**

```typescript
// jobs/expireStories.job.ts

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Corre a las 00:00:00 todos los días
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Expirando stories del día anterior...');

  const result = await prisma.story.updateMany({
    where: {
      status: 'ACTIVE',
      expiresAt: {
        lt: new Date() // Menor a la fecha actual
      }
    },
    data: {
      status: 'EXPIRED'
    }
  });

  console.log(`[CRON] ${result.count} stories expiradas`);
});

export default cron;
```

**Opción 2: Queue (Bull/BullMQ) - Más robusto**

```typescript
// jobs/expireStories.queue.ts

import { Queue, Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear queue
export const expireStoriesQueue = new Queue('expire-stories', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

// Worker que procesa el job
const worker = new Worker('expire-stories', async (job) => {
  console.log('[QUEUE] Expirando stories...');

  const result = await prisma.story.updateMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: new Date() }
    },
    data: { status: 'EXPIRED' }
  });

  return { expired: result.count };
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

// Schedule: todos los días a las 00:00
export const scheduleExpireStories = async () => {
  await expireStoriesQueue.add(
    'expire-stories-daily',
    {},
    {
      repeat: {
        pattern: '0 0 * * *' // Cron expression
      }
    }
  );
};
```

**Para MVP:** Usar Opción 1 (cron simple). Para producción: Opción 2.

### 7.3 Query de Stories Activas

```typescript
// controllers/story.controller.ts

async getActiveStories(req: Request, res: Response) {
  const cityId = req.cityFilter.cityId;

  const stories = await prisma.story.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: {
        gt: new Date() // Mayor a fecha actual (aún no expiraron)
      },
      business: {
        user: {
          cityId // Filtrar por ciudad del negocio
        }
      }
    },
    include: {
      business: {
        select: {
          name: true,
          slug: true,
          logoUrl: true,
          verified: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(stories);
}
```

### 7.4 Límites de Stories

**Para evitar spam:**

```typescript
// Límite: Máximo 5 stories activas por negocio por día
const activeStoriesCount = await prisma.story.count({
  where: {
    businessId,
    status: 'ACTIVE',
    createdAt: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)) // Desde las 00:00 de hoy
    }
  }
});

if (activeStoriesCount >= 5) {
  throw new BadRequestError('Has alcanzado el límite de 5 stories por día');
}
```

---

## 8. SISTEMA DE SERVICIOS

### 8.1 Diferencias con Productos

| Aspecto | Producto | Servicio |
|---------|----------|----------|
| Naturaleza | Bien físico | Trabajo, conocimiento |
| Stock | Sí (opcional) | No aplica |
| Precio | Fijo por unidad | Fijo, por hora, o "a consultar" |
| Entrega | Inmediata (local) | Se coordina |
| Imágenes | Del producto | Del trabajo realizado (portfolio) |

### 8.2 Categorías de Servicios

```typescript
// Categorías sugeridas para Mercedes
const serviceCategories = [
  // Hogar
  'Plomería',
  'Electricidad',
  'Pintura',
  'Carpintería',
  'Limpieza del hogar',
  'Jardinería',
  'Reparación de electrodomésticos',

  // Construcción
  'Albañilería',
  'Herrería',
  'Techista',

  // Educación
  'Clases particulares (primaria/secundaria)',
  'Clases de idiomas',
  'Clases de música',
  'Clases de danza',

  // Belleza y bienestar
  'Peluquería',
  'Manicura/Pedicura',
  'Masajes',
  'Personal trainer',

  // Tecnología
  'Reparación de computadoras',
  'Reparación de celulares',
  'Instalación de software',

  // Automotor
  'Mecánica',
  'Electricidad automotor',
  'Lavado de autos',

  // Eventos
  'Fotografía',
  'Catering',
  'Animación infantil',
  'DJ',

  // Otros
  'Transporte/Fletes',
  'Cerrajería',
  'Veterinaria a domicilio',
  'Gestoría'
];
```

### 8.3 Modelo de Precios

```typescript
enum PriceType {
  FIXED = 'FIXED',       // Precio fijo (ej: $5000 por corte de pelo)
  HOURLY = 'HOURLY',     // Por hora (ej: $2000/hora de clases)
  QUOTE = 'QUOTE'        // A consultar
}

// Ejemplos:
{
  name: 'Clases de guitarra a domicilio',
  priceType: 'HOURLY',
  price: 2500,
  priceUnit: 'hora',
  description: 'Clases personalizadas para principiantes e intermedios...'
}

{
  name: 'Reparación de goteras',
  priceType: 'QUOTE',
  price: null,
  priceUnit: null,
  description: 'Presupuesto sin cargo. El precio varía según la complejidad...'
}
```

### 8.4 Visualización en Frontend

**ProductCard vs ServiceCard:**

```typescript
// Adaptar ProductCard existente para mostrar servicios

// Si es servicio:
<div className="bg-teal-50 border-teal-200">  {/* Color diferente */}
  <span className="badge">SERVICIO</span>

  {service.priceType === 'QUOTE' ? (
    <span className="text-lg font-bold">Consultar precio</span>
  ) : service.priceType === 'HOURLY' ? (
    <span className="text-lg font-bold">
      ${service.price}/hora
    </span>
  ) : (
    <span className="text-lg font-bold">
      ${service.price}
    </span>
  )}

  <button>Ver detalles</button>
  <button>Contactar</button>
</div>
```

### 8.5 Página de Servicios

**Nueva ruta: `/servicios`**

```typescript
// pages/Services.jsx

import { useState, useEffect } from 'react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch(`/api/services?category=${selectedCategory}`)
      .then(res => res.json())
      .then(data => setServices(data));
  }, [selectedCategory]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Servicios en Mercedes</h1>

      {/* Filtro de categorías */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </button>
        <button onClick={() => setSelectedCategory('Plomería')}>
          🔧 Plomería
        </button>
        <button onClick={() => setSelectedCategory('Electricidad')}>
          ⚡ Electricidad
        </button>
        <button onClick={() => setSelectedCategory('Clases particulares')}>
          📚 Clases
        </button>
        {/* ... más categorías */}
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
```

---

## 9. INFRAESTRUCTURA Y DEVOPS

### 9.1 Variables de Entorno

```bash
# .env.example

# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/buzcalo

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_ACCESS_SECRET=tu_secret_super_secreto_access
JWT_REFRESH_SECRET=tu_secret_super_secreto_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (o S3)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (SendGrid, Resend, etc.)
EMAIL_PROVIDER=sendgrid
EMAIL_FROM=noreply@buzcalo.com.ar
SENDGRID_API_KEY=

# Google Maps (opcional)
GOOGLE_MAPS_API_KEY=

# Sentry (error tracking - opcional)
SENTRY_DSN=

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

### 9.2 Docker Compose (Desarrollo)

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_USER: buzcalo
      POSTGRES_PASSWORD: buzcalo_dev
      POSTGRES_DB: buzcalo
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://buzcalo:buzcalo_dev@postgres:5432/buzcalo
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
```

### 9.3 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linter
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: railway-app/deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

### 9.4 Monitoreo y Logs

```typescript
// utils/logger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Logs a archivo en producción
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),

    // Logs a consola en desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
```

**Integración con Sentry (recomendado):**

```typescript
// app.ts

import * as Sentry from "@sentry/node";

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% de requests
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// ... tus rutas ...

// Error handler (al final)
if (process.env.NODE_ENV === 'production') {
  app.use(Sentry.Handlers.errorHandler());
}
```

---

## 10. SEGURIDAD

### 10.1 Checklist de Seguridad

#### ✅ Autenticación y Autorización
- [x] Passwords hasheados con bcrypt (cost ≥ 12)
- [x] JWT con expiración corta (15min access, 7 días refresh)
- [x] Refresh token rotation (invalidar tokens viejos)
- [x] Rate limiting en login (5 intentos / 15 min)
- [x] Email verification obligatorio (opcional para MVP)
- [x] Protección contra CSRF con SameSite cookies
- [x] Validación de rol en cada endpoint protegido

#### ✅ Validación de Datos
- [x] Validación con Zod en todos los endpoints
- [x] Sanitización de inputs (prevenir XSS)
- [x] Límite de tamaño de requests (ej: 10MB para imágenes)
- [x] Validación de tipos de archivo (imágenes: solo JPG, PNG, WebP)

#### ✅ Protección contra Ataques
- [x] SQL Injection: Usar Prisma (prepared statements automáticos)
- [x] NoSQL Injection: No aplica (usamos PostgreSQL)
- [x] XSS: Sanitizar inputs, CSP headers
- [x] CSRF: SameSite cookies, CSRF tokens (opcional si usas JWT en headers)
- [x] Rate Limiting global: 100 requests / 15 min por IP
- [x] Rate Limiting específico:
  - Login: 5 / 15 min
  - Registro: 3 / hora
  - Crear producto: 10 / hora
  - Crear story: 5 / día
- [x] DDoS: Usar Cloudflare (gratis) como proxy

#### ✅ Protección de Datos Sensibles
- [x] HTTPS obligatorio en producción
- [x] Secrets en variables de entorno (nunca en código)
- [x] No loggear passwords, tokens, o datos sensibles
- [x] Encriptar datos sensibles en DB (opcional: CUIT/CUIL)

#### ✅ Moderación y Abuse Prevention
- [x] Sistema de denuncias (reports)
- [x] Límite de publicaciones por usuario
- [x] Verificación manual de negocios (Fase 2)
- [x] Banear usuarios por email + IP (fase 2)
- [x] Detección de contenido duplicado/spam (fase 2)

### 10.2 Implementación de Rate Limiting

```typescript
// middleware/rateLimit.middleware.ts

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379')
});

// Rate limit global
export const globalRateLimit = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:global:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                   // 100 requests
  message: 'Demasiadas solicitudes, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para login
export const loginRateLimit = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true, // No contar logins exitosos
  message: 'Demasiados intentos de login, intenta en 15 minutos'
});

// Rate limit para creación de contenido
export const createContentRateLimit = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:create:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10,
  message: 'Límite de publicaciones alcanzado, intenta en 1 hora'
});
```

**Uso:**

```typescript
// routes/auth.routes.ts
router.post('/login', loginRateLimit, authController.login);

// routes/product.routes.ts
router.post('/', authMiddleware, createContentRateLimit, productController.create);
```

### 10.3 Content Security Policy (CSP)

```typescript
// middleware/security.middleware.ts

import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Solo para desarrollo
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", process.env.API_URL],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});
```

---

## 11. ESCALABILIDAD MULTI-CIUDAD

### 11.1 Arquitectura Multi-Tenant

**Estrategia:** Shared Database con filtrado por `cityId` (Multi-tenant discriminator).

**Pros:**
- Más simple de implementar y mantener
- Menor costo de infraestructura
- Backup y migraciones centralizados
- Queries cross-city posibles (para analytics)

**Cons:**
- Riesgo de "data leakage" si hay bugs en filtros
- Harder to scale horizontally (pero no necesario hasta 100k+ usuarios)

**Alternativa (Fase 3+):** Database por ciudad (Single-tenant)
- Pros: Aislamiento total, más fácil escalar por ciudad
- Cons: Complejidad operacional, costos más altos

**Decisión para MVP:** Shared database con filtrado estricto por cityId.

### 11.2 Proceso de Expansión a Nueva Ciudad

**Paso 1: Agregar ciudad a la base de datos**

```typescript
// Script de migración
INSERT INTO cities (name, province, latitude, longitude, active)
VALUES ('Luján', 'Buenos Aires', -34.5708, -59.1056, true);
```

**Paso 2: Marketing hiperlocal en nueva ciudad**
- Onboarding manual de comercios clave
- Volanteo físico
- Publicidad en radio local
- Ads en Facebook/Instagram geolocalizados

**Paso 3: Monitoreo de KPIs**
- Mínimo 20 negocios activos
- Mínimo 100 productos publicados
- Mínimo 500 usuarios registrados

**Paso 4: Si funciona, repetir en siguiente ciudad**

### 11.3 Consideraciones de Escalabilidad

**Hasta 10 ciudades (< 50k usuarios):**
- 1 servidor backend (escalado vertical hasta 8GB RAM)
- 1 base de datos PostgreSQL (managed, ej: Supabase)
- Redis para cache y sessions
- CDN para imágenes (Cloudinary)

**10-50 ciudades (50k - 500k usuarios):**
- Backend en Kubernetes (auto-scaling horizontal)
- Database read replicas (lecturas distribuidas)
- Redis Cluster (alta disponibilidad)
- CDN multi-región

**50+ ciudades (500k+ usuarios):**
- Microservicios (separar Auth, Products, Search, etc.)
- Sharding de base de datos por región
- Message queue (RabbitMQ/Kafka) para eventos asincrónicos
- ElasticSearch para búsqueda avanzada

**Para MVP (Mercedes):** Opción 1 es MÁS que suficiente.

---

## 12. PLAN DE IMPLEMENTACIÓN

### 12.1 Roadmap por Fases

#### **FASE 1: MVP - Mercedes (3-4 meses)**

**Mes 1: Backend Core**
- [x] Setup proyecto (Node.js, TypeScript, Prisma, PostgreSQL)
- [x] Modelo de datos completo
- [x] Sistema de autenticación (JWT)
- [x] CRUD de usuarios, negocios, productos, servicios
- [x] Sistema de filtrado por ciudad
- [x] Upload de imágenes (Cloudinary)

**Mes 2: Features Core**
- [x] Sistema de Stories con expiración
- [x] Búsqueda y filtros
- [x] Favoritos
- [x] Reviews y ratings
- [x] APIs completas y documentadas (Swagger)

**Mes 3: Integración Frontend + Testing**
- [x] Integrar frontend React con backend
- [x] Sistema de registro multi-tipo
- [x] Páginas de servicios
- [x] Testing (unit + integration)
- [x] Deploy a staging

**Mes 4: Lanzamiento y Ajustes**
- [x] Onboarding de primeros 20 comercios de Mercedes
- [x] Beta privada con 50-100 usuarios
- [x] Ajustes basados en feedback
- [x] Lanzamiento público en Mercedes
- [x] Marketing local

**Métricas de éxito:**
- 50 negocios registrados
- 500 productos/servicios publicados
- 1000 usuarios registrados
- 50 usuarios activos diarios

#### **FASE 2: Crecimiento en Mercedes (6 meses)**

- [ ] Sistema de verificación de negocios (moderación)
- [ ] Sistema de denuncias y moderación
- [ ] Notificaciones push (opcional)
- [ ] Analytics para vendedores (estadísticas de vistas)
- [ ] Plan Premium para vendedores
- [ ] Búsqueda por cercanía (geolocalización avanzada)
- [ ] Sistema de chat in-app (opcional, alternativa a WhatsApp)

**Métricas de éxito:**
- 200 negocios registrados
- 5000 usuarios registrados
- 500 usuarios activos diarios
- Al menos 10 negocios pagando plan premium

#### **FASE 3: Expansión Multi-Ciudad (12 meses)**

- [ ] Expandir a 3 ciudades cercanas (Luján, Chivilcoy, Bragado)
- [ ] Dashboard de admin multi-ciudad
- [ ] Sistema de referidos (incentivos para expansion)
- [ ] App móvil nativa (React Native)

**Métricas de éxito por ciudad nueva:**
- 50 negocios en primeros 3 meses
- 1000 usuarios en primeros 6 meses

### 12.2 Stack de Tecnologías - Resumen

```
Frontend:
├── React 19
├── Vite
├── Tailwind CSS
├── React Query (para API calls)
└── React Router

Backend:
├── Node.js 20
├── TypeScript
├── Express.js (o Fastify)
├── Prisma ORM
├── PostgreSQL 15 + PostGIS
├── Redis 7
├── JWT (jsonwebtoken)
├── Bcrypt
├── Zod (validación)
├── Multer + Cloudinary (imágenes)
├── Winston (logging)
└── Bull/BullMQ (jobs)

Infraestructura:
├── Railway/Render (PaaS)
├── Supabase/Neon (PostgreSQL managed)
├── Cloudinary (CDN imágenes)
├── Cloudflare (DNS + DDoS protection)
├── SendGrid/Resend (emails)
└── Sentry (error tracking)

DevOps:
├── Docker + Docker Compose
├── GitHub Actions (CI/CD)
├── Swagger/OpenAPI (documentación)
└── Jest + Supertest (testing)
```

### 12.3 Costos Estimados

**MVP (Primeros 6 meses):**
```
Backend hosting (Railway/Render): $50/mes
Database (Supabase/Neon): $25/mes
Cloudinary (imágenes): $0 (free tier)
SendGrid (emails): $0-15/mes (hasta 100 emails/día gratis)
Dominio (.com.ar): $10/año
SSL: $0 (Let's Encrypt)
Total: ~$75-100/mes

Marketing Mercedes: $200-500/mes (volantes, Facebook Ads local)

TOTAL MES: $300-600/mes
TOTAL 6 MESES: $1,800-3,600
```

**Fase 2 (Crecimiento):**
```
Infraestructura: $150-300/mes (más tráfico)
Marketing: $500-1000/mes
TOTAL: $650-1300/mes
```

**Monetización esperada (mes 12):**
```
200 negocios × 10% pagan premium ($1000/mes) = 20 negocios
20 × $1000 = $20,000/mes
Costos: -$1,300/mes
Utilidad: $18,700/mes
```

---

## 13. ANÁLISIS CRÍTICO FINAL Y RECOMENDACIONES

### 13.1 Riesgos Principales

#### 🔴 RIESGO CRÍTICO: Chicken-and-egg Problem
**Probabilidad:** ALTA
**Impacto:** CRÍTICO

**Mitigación:**
1. **Onboarding manual agresivo:**
   - Ir personalmente a 50 comercios de Mercedes
   - Ofrecer registrarlos en el momento (con tu laptop)
   - Tomarles fotos de productos in-situ
   - Publicar sus primeros 10 productos por ellos
   - Objetivo: 50 comercios en las primeras 2 semanas

2. **Oferta de lanzamiento:**
   - "Premium gratis por 6 meses para los primeros 50 comercios"
   - Generar FOMO entre comerciantes

3. **Marketing en dos frentes:**
   - A comercios: "Tus clientes te buscan acá"
   - A usuarios: "Descubrí lo que tiene Mercedes"

#### 🟡 RIESGO MEDIO: Calidad de contenido
**Problema:** Comerciantes publican fotos malas, descripciones pobres.

**Mitigación:**
- Guías de "Cómo publicar" con ejemplos
- Moderación suave en las primeras semanas (sugerir mejoras)
- Templates de descripción

#### 🟡 RIESGO MEDIO: Fraude y estafas
**Problema:** Vendedores ocasionales publican productos que no existen.

**Mitigación:**
- Sistema de reviews post-contacto
- Denuncias y penalizaciones
- Verificación manual de negocios establecidos

#### 🟢 RIESGO BAJO: Escalabilidad técnica
La arquitectura propuesta escala fácilmente hasta 100k usuarios.

### 13.2 Recomendaciones Técnicas

#### ✅ HACER:
1. **Validar mercado ANTES de código:**
   - Entrevista a 20 comerciantes de Mercedes
   - ¿Pagarían $1000/mes por esto? ¿Por qué sí/no?
   - ¿Qué features son MUST-HAVE vs nice-to-have?

2. **MVP mínimo primero:**
   - Solo productos (NO servicios en v1.0)
   - Solo CUSTOMER y BUSINESS (NO vendedor ambulante, ocasional)
   - NO reviews (agregar después)
   - NO stories (agregar después)
   - Features core: Buscar, ver, contactar por WhatsApp

3. **Iterar rápido:**
   - Lanzar en 6 semanas (no 4 meses)
   - Features mínimas pero funcionales
   - Agregar features cada 2 semanas basado en feedback

4. **Medir todo:**
   - Google Analytics 4
   - Mixpanel o Amplitude (eventos de usuario)
   - Métricas clave:
     - DAU (Daily Active Users)
     - Retention rate (día 1, 7, 30)
     - Productos publicados / semana
     - Clicks en "Contactar" (conversión)

#### ❌ NO HACER:
1. **NO sobre-ingenierizar:**
   - NO microservicios en v1
   - NO Kubernetes en v1
   - NO ElasticSearch en v1 (PostgreSQL fulltext es suficiente)

2. **NO expandir demasiado rápido:**
   - Esperar a tener 500+ vendedores en Mercedes
   - Esperar a tener product-market fit claro

3. **NO ignorar legal:**
   - Términos y condiciones claros
   - Política de privacidad (GDPR-compliant)
   - Disclaimer: "BuZCalo es plataforma de conexión, no intermediario de pago"

### 13.3 Alternativas Consideradas

#### Backend Alternativo: Supabase (Backend-as-a-Service)
**Pros:**
- Setup 10x más rápido
- Auth built-in
- Database + API REST + Realtime en uno
- PostgreSQL + PostGIS incluido

**Cons:**
- Menos control sobre lógica compleja (ej: stories con expiración)
- Vendor lock-in
- Más caro al escalar

**Veredicto:** Considerar para MVP ultra-rápido (4 semanas). Para producto serio: Node.js custom.

#### Frontend Alternativo: Next.js
**Pros:**
- SSR (mejor SEO)
- API routes built-in (no necesitas backend separado para cosas simples)
- File-based routing

**Cons:**
- Overkill para SPA (Single Page App)
- SEO no es crítico para marketplace local
- Ya tenés React + Vite funcionando

**Veredicto:** Quedarse con Vite + React. Next.js para v2.0 si SEO se vuelve crítico.

---

## 14. CONCLUSIÓN

Este documento define un backend **robusto, escalable y realista** para BuZCalo. Las decisiones técnicas priorizan:

1. **Time-to-market:** Stack probado (Node.js + PostgreSQL)
2. **Costos bajos:** Infraestructura que escala con el crecimiento
3. **Mantenibilidad:** Código limpio, tipado, bien estructurado
4. **Seguridad:** Autenticación sólida, rate limiting, validaciones

**Próximos pasos inmediatos:**
1. ✅ Validar mercado (entrevistas a comerciantes)
2. ✅ Definir MVP mínimo (scope reducido)
3. ✅ Setup backend (este documento como referencia)
4. ✅ Integrar con frontend existente
5. ✅ Onboarding de primeros 20 comercios
6. ✅ Lanzar beta privada

**Pregunta crítica para responder ANTES de codear:**
> "¿Estamos resolviendo un problema real de la gente de Mercedes, o estamos construyendo algo que nosotros creemos que necesitan?"

Responder esto con entrevistas a usuarios y comerciantes. **El mejor código es el que no tienes que escribir** porque validaste que el producto no tiene demanda.

---

**Autor:** Documentación generada por Claude (Anthropic)
**Fecha:** Octubre 2025
**Versión:** 1.0
**Contacto:** [Tu email/contacto]

---

**Licencia:** Este documento es propiedad de BuZCalo. Confidencial.