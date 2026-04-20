# Quick Start - Despliegue en 10 Minutos

## Antes de empezar

Necesitas:
- Cuenta GitHub con el repositorio
- Cuenta Railway (railway.app) - conectada con GitHub
- Cuenta Vercel (vercel.com) - conectada con GitHub

---

## Paso 1: Desplegar Backend en Railway (3 minutos)

1. Ir a https://railway.app
2. Hacer clic en "New Project"
3. Seleccionar "Deploy from GitHub"
4. Seleccionar tu repositorio
5. Railway detectará automáticamente que es Node.js
6. Agregar variables de entorno:
   ```
   MONGO_URI=mongodb+srv://erdaisiordiame_db_user:yDLbYS0WfQqYbW5S@cluster0.stgnee5.mongodb.net/
   MONGO_DB_NAME=pwa_inversions_drfic_db
   NODE_ENV=production
   ```
7. Hacer clic en "Deploy"
8. **Copiar la URL pública** (algo como `https://your-app-xxxx.up.railway.app`)

---

## Paso 2: Actualizar Vercel con URL de Railway (2 minutos)

1. Abrir el archivo `vercel.json` en tu editor
2. Reemplazar esta línea:
   ```json
   "destination": "https://your-railway-url.up.railway.app/api/$1"
   ```
   Con la URL real de Railway del Paso 1

3. Hacer git commit y push:
   ```bash
   git add vercel.json
   git commit -m "Update Railway URL in vercel.json"
   git push
   ```

---

## Paso 3: Desplegar Frontend en Vercel (2 minutos)

1. Ir a https://vercel.com
2. Hacer clic en "Add New" → "Project"
3. Seleccionar tu repositorio
4. Vercel detectará automáticamente Vite
5. Agregar variables de entorno:
   ```
   VITE_MONGO_URI=mongodb+srv://erdaisiordiame_db_user:yDLbYS0WfQqYbW5S@cluster0.stgnee5.mongodb.net/
   VITE_MONGO_DB_NAME=pwa_inversions_drfic_db
   VITE_FINNHUB_API_KEY=d7imqapr01qn2qauldegd7imqapr01qn2qauldf0
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
6. Hacer clic en "Deploy"
7. **Esperar 2-3 minutos** a que se complete

---

## Paso 4: Verificar que funciona (3 minutos)

1. Abrir la URL de Vercel en el navegador
2. Ver si carga el dashboard CRUD
3. Crear una orden/estrategia para verificar que el backend funciona
4. Si todo está bien: ✅ **Proyecto desplegado**

---

## Si algo falla

### Error en Railway
1. Ir a Railway → seleccionar proyecto → "Logs"
2. Ver qué error sale
3. Corregir en el código local
4. Hacer `git push` y Railway se redeploya automáticamente

### Error en Vercel
1. Ir a Vercel → seleccionar proyecto → "Deployments"
2. Hacer clic en el deployment fallido
3. Ver la sección de "Logs"
4. Corregir y hacer `git push`

### El frontend no conecta con backend
- Verificar que `VITE_API_URL` en Vercel sea la URL correcta de Railway
- Verificar que `vercel.json` tiene la URL correcta
- Hacer un nuevo deploy en Vercel después de cambios

---

## URLs Finales

Después del despliegue:

**Frontend**:
- https://tu-proyecto.vercel.app

**Backend**:
- https://tu-app-production-xxxx.up.railway.app

**API**:
- https://tu-app-production-xxxx.up.railway.app/api/orders
- https://tu-app-production-xxxx.up.railway.app/api/strategies
- https://tu-app-production-xxxx.up.railway.app/api/watchlists

---

## Próximos commits

Si necesitas cambios después del despliegue:

```bash
# Hacer cambios locales
# Probar con npm run dev

# Luego:
git add .
git commit -m "Tu mensaje"
git push

# Railway y Vercel se reedeploegarán automáticamente
```

---

## Que compartir con el profesor

1. **URL del frontend**: https://tu-proyecto.vercel.app
2. **URL del backend**: https://tu-app-production-xxxx.up.railway.app
3. **Link del GitHub**: https://github.com/tu-usuario/tu-repositorio
4. **Instrucciones locales**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio
   cd projects/pwa/pwa_inversions_drfic
   npm install --legacy-peer-deps
   npm run dev
   ```

---

**¡Eso es todo! 🎉**

Si necesitas más ayuda: ver DEPLOYMENT_GUIDE.md
