# Guía de Despliegue - PWA Inversiones Drfic

## Resumen

Este proyecto se despliega en dos plataformas:

- **Backend (Express + MongoDB)**: Railway
- **Frontend (React + Vite)**: Vercel

Ambas plataformas ofrecen nivel gratuito y se integran automáticamente con Git.

---

## Parte 1: Despliegue del Backend en Railway

### Paso 1: Crear Cuenta en Railway

1. Ir a [railway.app](https://railway.app)
2. Hacer clic en "Get Started"
3. Registrarse con GitHub (recomendado) o crear cuenta
4. Autorizar Railway para acceder a tus repositorios

### Paso 2: Crear Proyecto en Railway

1. En el dashboard, hacer clic en "Create New Project"
2. Seleccionar "Deploy from GitHub"
3. Conectar tu repositorio (o crear un fork si es público)
4. Seleccionar el repositorio `pwa_inversions_drfic_vsc - copia` (o similar)

### Paso 3: Configurar Variables de Entorno

Una vez creado el proyecto en Railway:

1. Ir a la pestaña "Variables"
2. Agregar las siguientes variables:

```
MONGO_URI=mongodb+srv://erdaisiordiame_db_user:yDLbYS0WfQqYbW5S@cluster0.stgnee5.mongodb.net/
MONGO_DB_NAME=pwa_inversions_drfic_db
NODE_ENV=production
PORT=4000
```

3. Hacer clic en "Deploy"

### Paso 4: Obtener URL del Backend

1. Una vez desplegado, Railway te dará una URL pública (ej: `https://your-app-production-xxxx.up.railway.app`)
2. **Guardar esta URL** - la usaremos en el frontend
3. Verificar que el backend funciona: `https://your-app-production-xxxx.up.railway.app/api/health`

### Paso 5: Ver Logs (Debugging)

Si algo falla:
1. En Railway, selecciona tu servicio
2. Ir a "Logs"
3. Ver el error y corregir en tu código
4. Hacer git push para que se redepliegue automáticamente

---

## Parte 2: Despliegue del Frontend en Vercel

### Paso 1: Crear Cuenta en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Hacer clic en "Sign Up"
3. Registrarse con GitHub (recomendado)
4. Autorizar Vercel para acceder a tus repositorios

### Paso 2: Crear Proyecto en Vercel

1. En el dashboard, hacer clic en "Add New..."
2. Seleccionar "Project"
3. Importar tu repositorio Git
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Build Settings

Vercel debería detectar automáticamente:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Si no, configura manualmente:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Paso 4: Agregar Variables de Entorno

En la pestaña "Environment Variables":

```
VITE_MONGO_URI=mongodb+srv://erdaisiordiame_db_user:yDLbYS0WfQqYbW5S@cluster0.stgnee5.mongodb.net/
VITE_MONGO_DB_NAME=pwa_inversions_drfic_db
VITE_FINNHUB_API_KEY=d7imqapr01qn2qauldegd7imqapr01qn2qauldf0
VITE_API_URL=https://your-app-production-xxxx.up.railway.app
```

**Importante**: Reemplazar `https://your-app-production-xxxx.up.railway.app` con la URL real de Railway

### Paso 5: Desplegar

1. Hacer clic en "Deploy"
2. Esperar a que se complete el build (2-3 minutos)
3. Vercel mostrará la URL pública (ej: `https://pwa-inversions.vercel.app`)

### Paso 6: Verificar Despliegue

1. Abrir la URL en el navegador
2. Probar el dashboard CRUD
3. Crear una orden/estrategia para verificar que el backend funciona

---

## Configuración del Repositorio Git

Para que el despliegue automático funcione:

### Actualizar vercel.json

Reemplazar en `vercel.json`:

```json
"destination": "https://your-railway-url.up.railway.app/api/$1"
```

Con tu URL real de Railway.

### Actualizar package.json (si es necesario)

El `package.json` ya tiene todo configurado:

```json
"scripts": {
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
  "dev:client": "vite",
  "dev:server": "node server/server.js",
  "build": "tsc -b && vite build"
}
```

---

## Guía de Troubleshooting

### Error: Cannot find module 'express'

**Causa**: Faltan dependencias instaladas
**Solución**: En Railway, asegurarse de que `package.json` tiene todas las dependencias listadas

### Error: MongoDB connection failed

**Causa**: Variables de entorno no configuradas
**Solución**: 
1. Ir a Railway → Variables
2. Verificar `MONGO_URI` y `MONGO_DB_NAME`
3. Hacer redeploy

### Frontend no conecta con backend

**Causa**: URL de API incorrecta
**Solución**:
1. En Vercel, actualizar `VITE_API_URL` con la URL real de Railway
2. Actualizar `vercel.json` con la misma URL
3. Hacer git push para redepliegue

### CORS error en navegador

**Causa**: El backend no tiene CORS habilitado correctamente
**Solución**: El servidor ya tiene CORS. Si persiste:
1. Verificar `server/server.js`
2. Asegurarse de que `cors()` está antes de las rutas

---

## Flujo de Despliegue Automático

Una vez configurado, cada vez que hagas `git push`:

1. **GitHub** recibe los cambios
2. **Railway** detecta cambios en `main` → redeploya backend automáticamente
3. **Vercel** detecta cambios en `main` → redeploya frontend automáticamente
4. Los cambios están en vivo en ~2-3 minutos

---

## Variables de Entorno por Ambiente

### Development (local)

```bash
NODE_ENV=development
VITE_API_URL=http://localhost:4000
MONGO_URI=mongodb+srv://...
VITE_MONGO_URI=mongodb+srv://...
```

### Production (Railway + Vercel)

```bash
NODE_ENV=production
VITE_API_URL=https://your-railway-url.up.railway.app
MONGO_URI=mongodb+srv://...
VITE_MONGO_URI=mongodb+srv://...
```

---

## URLs Finales

Después del despliegue:

- **Frontend**: `https://pwa-inversions.vercel.app` (o tu URL de Vercel)
- **Backend**: `https://your-app-production-xxxx.up.railway.app` (tu URL de Railway)
- **API**: `https://your-app-production-xxxx.up.railway.app/api/*`

---

## Próximos Pasos

1. ✅ Desplegar backend en Railway
2. ✅ Desplegar frontend en Vercel
3. ✅ Verificar que todo funciona
4. ✅ Compartir URL pública con el profesor
5. ✅ Documentar en la portada del documento de clase

---

## Ayuda y Soporte

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Problemas con MongoDB**: Verificar credenciales en MongoDB Atlas

