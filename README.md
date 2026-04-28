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