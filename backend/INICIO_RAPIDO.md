# 🚀 Inicio Rápido - BuZCalo Backend

## Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- Git

## Pasos para iniciar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar Docker (PostgreSQL + Redis)

**IMPORTANTE:** Si ya tienes Redis corriendo localmente en el puerto 6379, detén lo primero:

```bash
# Verificar si Redis está corriendo
sudo systemctl status redis

# Si está corriendo, detenerlo
sudo systemctl stop redis
```

Ahora inicia los contenedores:

```bash
docker-compose up -d
```

Verificar que estén corriendo:

```bash
docker-compose ps
```

Deberías ver:

```
NAME               IMAGE                     STATUS
buzcalo-postgres   postgis/postgis:15-3.3   Up
buzcalo-redis      redis:7-alpine           Up
```

### 3. Configurar base de datos

Genera los tipos de Prisma:

```bash
npm run prisma:generate
```

Ejecuta las migraciones:

```bash
npm run prisma:migrate
```

Carga datos de prueba (opcional):

```bash
npm run prisma:seed
```

### 4. Iniciar el servidor

```bash
npm run dev
```

El servidor debería iniciar en `http://localhost:3000`

Verás estos mensajes en la consola:

```
Upload directories initialized
Redis connected successfully
Database connected successfully
Story expiration job scheduled (runs daily at 23:59)
Old stories cleanup job scheduled (runs weekly on Sunday at 02:00)
Subscription expiration job scheduled (runs daily at 00:00)
All cron jobs started
Server running on port 3000 in development mode
API URL: http://localhost:3000
```

### 5. Probar el API

```bash
# Health check
curl http://localhost:3000/health

# Debería responder:
# {"status":"ok","timestamp":"2025-10-29T...","environment":"development"}
```

## 🎯 Endpoints disponibles

### Autenticación
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/me` - Ver perfil (requiere auth)

### Usuarios de prueba

Después de ejecutar `npm run prisma:seed`:

```
Email: cliente@test.com
Password: Test1234
Role: CUSTOMER

Email: negocio@test.com
Password: Test1234
Role: BUSINESS

Email: servicios@test.com
Password: Test1234
Role: SERVICE_PROVIDER
```

## 🛠️ Comandos útiles

```bash
# Ver logs de Docker
docker-compose logs -f

# Ver solo logs de PostgreSQL
docker-compose logs -f postgres

# Ver solo logs de Redis
docker-compose logs -f redis

# Detener Docker
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Acceder a Prisma Studio (GUI para ver la BD)
npm run prisma:studio
# Abre en http://localhost:5555

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start
```

## 🐛 Solución de problemas

### Error: "port is already allocated"

Si ves este error al iniciar Docker:

```bash
Error: Bind for 0.0.0.0:6379 failed: port is already allocated
```

**Solución:** Detén el servicio local de Redis:

```bash
sudo systemctl stop redis
# O si usas macOS:
brew services stop redis
```

### Error: "DATABASE_URL not found"

Asegúrate de que existe el archivo `.env` en la raíz del proyecto backend:

```bash
# Debe existir este archivo
backend/.env
```

Si no existe, cópialo desde el ejemplo:

```bash
cp .env.example .env
```

### Error: "Cannot find module 'sharp'"

Sharp es una dependencia nativa que a veces falla al instalarse:

```bash
# Reinstalar sharp
npm uninstall sharp
npm install sharp --save
```

### Error de conexión a PostgreSQL

Verifica que Docker esté corriendo:

```bash
docker-compose ps
```

Si `buzcalo-postgres` no está "Up", inícialo:

```bash
docker-compose up -d postgres
```

## 📊 Estructura de carpetas importantes

```
backend/
├── src/
│   ├── controllers/      # Lógica de negocio
│   ├── routes/          # Definición de endpoints
│   ├── middleware/      # Auth, rate limit, uploads, etc
│   ├── utils/           # Funciones utilitarias
│   ├── config/          # Configuración (env, DB, redis)
│   └── jobs/            # Cron jobs
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos de prueba
├── uploads/             # Imágenes subidas (se crea automáticamente)
└── .env                 # Variables de entorno
```

## 🎨 Próximos pasos

1. **Probar autenticación:**
   - Registrar un usuario con `POST /api/auth/register`
   - Hacer login con `POST /api/auth/login`
   - Usar el token JWT en el header `Authorization: Bearer <token>`

2. **Subir una imagen:**
   - `POST /api/upload/image` con form-data key="image"
   - Obtendrás una URL: `/uploads/general/12345-uuid.webp`

3. **Crear un producto:**
   - `POST /api/products` con el body y la imagen URL

4. **Ver la documentación completa:**
   - Lee el [README.md](README.md) para ver todos los endpoints disponibles

## 🎯 Siguientes objetivos

- [ ] Conectar el frontend con el backend
- [ ] Implementar autenticación en el frontend
- [ ] Crear formularios para productos y servicios
- [ ] Implementar sistema de Stories
- [ ] Integrar MercadoPago para suscripciones

## 💡 Tips

- **Prisma Studio** es muy útil para ver y editar datos en desarrollo: `npm run prisma:studio`
- Los **logs** te ayudarán a debuggear: el servidor usa Winston que muestra logs claros
- Las **stories expiran automáticamente** a las 23:59 gracias al cron job
- Las **imágenes se optimizan automáticamente** a WebP al subirlas

---

¿Problemas? Consulta el [README.md](README.md) completo o crea un issue en GitHub.
