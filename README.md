# Proyecto Microservicios - Universidad PaaS

Arquitectura de microservicios para gestión de cursos universitarios.

---

## Estructura del Proyecto

```
/students-api/          → API de estudiantes (puerto 3000)
/courses-api/         → API de cursos e inscripciones (puerto 3001)
/frontend/           → Interfaz web vanilla (HTML + CSS + JS)
docker-compose.yml  → Orquestación de servicios
init.sql            → Script de base de datos
README.md           → Este archivo
```

---

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- [Git](https://git-scm.com) instalado
- Cuenta en GitHub (para desplegar)

---

## Paso 1: Ejecutar Local con Docker Compose

### 1.1 Clonar el proyecto

Si aún no tienes el proyecto:

```bash
git clone <tu-repo-url>
cd university-paas
```

### 1.2 Ejecutar los servicios

```bash
docker compose up --build
```

Esto hará:
- Descargar imagen de PostgreSQL 15
- Construir las imágenes de students-api y courses-api
- Crear contenedores y red
- Ejecutar init.sql con datos de ejemplo

### 1.3 Verificar que funciona

En otra terminal:

```bash
# Health checks
curl http://localhost:3000/health
curl http://localhost:3001/health

# Ver estudiantes (debe tener 2 ejemplos)
curl http://localhost:3000/students

# Ver cursos (debe tener 2 ejemplos)
curl http://localhost:3001/courses
```

### 1.4 Tests de ejemplo

```bash
# Crear estudiante
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Perez", "email": "juan@university.edu"}'

# Crear curso
curl -X POST http://localhost:3001/courses \
  -H "Content-Type: application/json" \
  -d '{"name": "Algoritmos", "description": "Diseño de algoritmos"}'

# Inscribir estudiante (student_id: 1, course_id: 1)
curl -X POST http://localhost:3001/enrollments \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1, "course_id": 1}'
```

### 1.5 Detener servicios

```bash
docker compose down
```

---

## Endpoints de la API

### Students API (puerto 3000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /students | Listar todos |
| GET | /students/:id | Obtener por ID |
| POST | /students | Crear estudiante |
| PUT | /students/:id | Actualizar |
| DELETE | /students/:id | Eliminar |

### Courses API (puerto 3001)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /courses | Listar todos |
| GET | /courses/:id | Obtener por ID |
| POST | /courses | Crear curso |
| PUT | /courses/:id | Actualizar |
| DELETE | /courses/:id | Eliminar |
| GET | /enrollments | Listar inscripciones |
| POST | /enrollments | Inscribir estudiante |

---

## Desplegar en Railway

### Paso 1: Crear proyecto en Railway
a
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click en **"New Project"**
4. Selecciona **"Empty Project"**
5. Nombra el proyecto (ej: `university-paas`)

### Paso 2: Agregar PostgreSQL

1. En el dashboard del proyecto, click en **"Add Plugin"**
2. Selecciona **"PostgreSQL"**
3. Espera a que-provisione
4. Click en **"PostgreSQL"** > **"Service Settings"**
5. Copia el valor de `DATABASE_URL` (lo necesitarás después)

### Paso 3: Desplegar Students API

1. Click en **"New"** > **"GitHub Repo"**
2. Selecciona tu repositorio de GitHub
3. En **"Root Directory"** selecciona `students-api`
4. En **"Environment Variables"** agrega:
   ```
   DATABASE_URL=<el-valor-que-copiaste-del-paso-2>
   ```
5. Click en **"Deploy"**
6. Espera a que termine el build

**Anota la URL pública del servicio** (está en el dashboard, algo como `https://students-api-xxxx.railway.app`)

### Paso 4: Desplegar Courses API

1. Click en **"New"** > **"GitHub Repo"**
2. Selecciona tu repositorio
3. En **"Root Directory"** selecciona `courses-api`
4. En **"Environment Variables"** agrega:
   ```
   DATABASE_URL=<el-valor-del-paso-2>
   STUDENTS_SERVICE_URL=https://<la-url-del-students-api>
   ```
   Ejemplo: `STUDENTS_SERVICE_URL=https://students-api-abc123.railway.app`
5. Click en **"Deploy"**

### Paso 5: Verificar

```
https://<students-api-url>/health
https://<courses-api-url>/health
```

Ambas deben responder `{ "status": "ok", "service": "..." }`

---

## Desplegar en Render

### Paso 1: Crear cuenta

1. Ve a [render.com](https://render.com)
2. Inicia sesión con GitHub
3. Click en **"New"** > **"Web Service"**

### Paso 2: Desplegar Students API

1. **Name**: `students-api`
2. **Git Repository**: Conecta tu repositorio GitHub
3. **Root Directory**: `students-api`
4. **Environment**: `Node`
5. **Build Command**: (dejar vacío)
6. **Start Command**: `node index.js`
7. Click en **"Advanced"** > **"Add Environment Variable"**:
   ```
   DATABASE_URL=<valor-de-postgresql>
   ```
8. Click en **"Create Web Service"**

**Anota la URL del servicio** (ej: `https://students-api.onrender.com`)

### Paso 3: Crear PostgreSQL

1. Click en **"New"** > **"PostgreSQL"**
2. **Name**: `university-db`
3. Selecciona la región más cercana
4. Click en **"Create Database"**
5. Espera a que-provisione
6. En **"Connections"** copia el valor de `Internal Database URL`

### Paso 4: Desplegar Courses API

1. Click en **"New"** > **"Web Service"**
2. **Name**: `courses-api`
3. **Git Repository**: Tu repositorio
4. **Root Directory**: `courses-api`
5. **Environment**: `Node`
6. **Build Command**: (vacío)
7. **Start Command**: `node index.js`
8. Click en **"Advanced"** > **"Add Environment Variables"**:
   ```
   DATABASE_URL=<Internal-Database-URL-del-paso-3>
   STUDENTS_SERVICE_URL=https://students-api.onrender.com
   ```
9. Click en **"Create Web Service"**

### Paso 5: Importante - Evitar que duerman

En el tier gratuito, Render apaga los servicios después de 15 min de inactividad. Para evitarlo:

1. Ve al dashboard de cada servicio
2. Click en **"Cron Schedule"**
3. Habilita un cron que ejecute cada 5 minutos (opción gratuita)
4. O simplemente haz upgrade a un plan pagado

---

## Variables de Entorno

### students-api

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| DATABASE_URL | Connection string de PostgreSQL | postgresql://postgres:postgres@postgres:5432/postgres |
| PORT | Puerto del servicio | 3000 |

### courses-api

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| DATABASE_URL | Connection string de PostgreSQL | postgresql://postgres:postgres@postgres:5432/postgres |
| PORT | Puerto del servicio | 3001 |
| STUDENTS_SERVICE_URL | URL del servicio de estudiantes | http://students-api:3000 |

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f students-api

# Reiniciar un servicio
docker compose restart students-api

# Eliminar datos de la base
docker compose down -v

# Acceso a la base de datos
docker exec -it university-postgres psql -U postgres
```

---

## Notas para la Entrega

1. **Universidad PaaS** es un ejercicio académico
2. Los microservicios se comunican via HTTP para validar estudiantes
3. PostgreSQL es compartido por ambos servicios
4. La arquitectura permite escalar cada servicio independientemente
5. Listo para desplegar en Railway o Render con los pasos anteriores