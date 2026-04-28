# Frontend - Universidad PaaS

Interfaz web vanilla para gestionar estudiantes, cursos e inscripciones.

---

## Requisitos

- Node.js instalado (para servir localmente)

---

## Ejecutar Localmente

### Opción 1: Con npx serve

```bash
#Desde la raíz del proyecto
cd ..
npx serve frontend
```

O simplemente:

```bash
npx serve frontend
```

Esto iniciarán un servidor en `http://localhost:3000` (o el puerto disponible).

### Opción 2: Con Python

```bash
# Python 3
cd frontend
python -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

---

## URLs de la API

El frontend está configurado para detectar automáticamente el entorno:

### Desarrollo Local

```javascript
const STUDENTS_URL = 'http://localhost:3000';
const COURSES_URL = 'http://localhost:3001';
```

Cuando sirves el frontend desde localhost, automáticamente usa estos valores.

### Producción

Para usar las APIs desplegadas, edita los valores al final del archivo `index.html`:

```javascript
const STUDENTS_URL = 'https://students-api-tu-url.railway.app';
const COURSES_URL = 'https://courses-api-tu-url.railway.app';
```

O alternativamente, puedes usar variables de entorno en tu servidor estático.

---

## Desplegar como Static Site en Render

### Paso 1: Sube el proyecto a GitHub

 Asegúrate de que la carpeta `/frontend` esté en tu repositorio.

### Paso 2: Crea el Static Site en Render

1. Ve a [render.com](https://render.com)
2. Click en **"New"** > **"Static Site"**
3. Conecta tu repositorio GitHub
4. Configura:
   - **Name**: `university-frontend`
   - **Build Command**: (dejar vacío)
   - **Publish Directory**: `frontend`

### Paso 3: Configura las URLs de las APIs

Render permite variables de entorno. Para pasarlas al frontend:

1. En **"Environment Variables"** agrega:
   ```
   STUDENTS_URL=https://students-api-tu-url.railway.app
   COURSES_URL=https://courses-api-tu-url.railway.app
   ```

2. Pero como el frontend es HTML estático y no puede leer variables de entorno del servidor directamente, tienes dos opciones:

   **Opción A**: Edita el archivo `index.html` antes de subir a GitHub con las URLs correctas

   **Opción B**: Usa el script en el index.html para leer desde window.location o una variable global

### Paso 4: Verifica

Abre la URL de tu static site (algo como `https://university-frontend.onrender.com`) y verifica que:
- Puedes listar estudiantes
- Puedes crear cursos
- Puedes inscribir estudiantes

---

## Archivos

```
/frontend/
  index.html    → Toda la aplicación
  README.md   → Este archivo
```

---

## Notas

- No se necesita build ni dependencias
- Todo es vanilla: HTML + CSS + JS
- Responsive (funciona en móvil)
- three tabs: Estudiantes, Cursos, Inscripciones