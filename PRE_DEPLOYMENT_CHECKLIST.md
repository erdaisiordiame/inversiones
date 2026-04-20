# Pre-Deployment Checklist

Antes de desplegar el proyecto en Railway + Vercel, asegúrate de que:

## ✅ Local Setup

- [ ] `npm install --legacy-peer-deps` completó sin errores
- [ ] `npm run build` compila sin errores
- [ ] `npm run dev` inicia sin errores
- [ ] Frontend carga en http://localhost:5173
- [ ] Backend carga en http://localhost:4000
- [ ] `/api/health` responde con `{ "status": "ok" }`

## ✅ Archivos de Configuración

- [ ] `.env` tiene credenciales reales (no versionado)
- [ ] `.env.example` tiene variables de ejemplo
- [ ] `railway.json` existe en root
- [ ] `vercel.json` existe en root
- [ ] `vite.config.ts` tiene proxy configurado
- [ ] `package.json` tiene todos los scripts
- [ ] `tsconfig.app.json` y `tsconfig.json` son válidos

## ✅ Código Frontend

- [ ] `src/App.tsx` importa Redux Provider
- [ ] `src/store/index.ts` configura el store
- [ ] `src/features/crud/TradingCrudPage.tsx` compila sin errores
- [ ] `src/App.css` tiene estilos CRUD
- [ ] Componentes usan `useAppDispatch` y `useAppSelector`
- [ ] No hay errores TypeScript: `npm run build`

## ✅ Código Backend

- [ ] `server/server.js` inicia sin errores
- [ ] `server/db.js` se conecta a MongoDB
- [ ] `server/routes/*` tienen todos los CRUD endpoints
- [ ] `server/models/*` tienen schemas válidos
- [ ] Express CORS está habilitado
- [ ] Proxy de Vite apunta a `http://localhost:4000`

## ✅ Base de Datos

- [ ] MongoDB Atlas cuenta existe
- [ ] Credenciales en `.env` son correctas
- [ ] IP whitelist en MongoDB Atlas incluye 0.0.0.0/0 (o tu IP)
- [ ] Collections existen en MongoDB (orders, strategies, watchlists)

## ✅ APIs Externas

- [ ] Finnhub API key es válido
- [ ] `VITE_FINNHUB_API_KEY` está en `.env`
- [ ] MarketDataPanel.tsx carga datos correctamente

## ✅ Git & GitHub

- [ ] Repositorio está en GitHub
- [ ] `.gitignore` excluye `.env` y `node_modules`
- [ ] `.env` no está versionado (checkear con `git status`)
- [ ] Último commit tiene mensaje descriptivo
- [ ] Rama principal es `main` o `master`

## ✅ Despliegue Railway

- [ ] Cuenta Railway creada
- [ ] GitHub conectado a Railway
- [ ] Variables de entorno agregadas en Railway:
  - [ ] `MONGO_URI`
  - [ ] `MONGO_DB_NAME`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=4000`

## ✅ Despliegue Vercel

- [ ] Cuenta Vercel creada
- [ ] GitHub conectado a Vercel
- [ ] Variables de entorno agregadas en Vercel:
  - [ ] `VITE_MONGO_URI`
  - [ ] `VITE_MONGO_DB_NAME`
  - [ ] `VITE_FINNHUB_API_KEY`
  - [ ] `VITE_API_URL` (URL de Railway)

## ✅ Integración Backend-Frontend

- [ ] `vercel.json` tiene URL de Railway correcta
- [ ] `vite.config.ts` proxy apunta a backend local
- [ ] Fetch requests en Redux thunks apuntan a `/api/*`
- [ ] CORS en Express permite requests desde Vercel

## ✅ Documentación

- [ ] README.md existe y está actualizado
- [ ] DEPLOYMENT_GUIDE.md existe
- [ ] QUICK_DEPLOY.md existe
- [ ] SERVER_API_README.md existe
- [ ] PHASE_3_5_COMPLETION.md existe
- [ ] setup.sh y setup.bat existen

## ✅ Testing Final

```bash
# Test 1: Build producción
npm run build
# Debe terminar sin errores

# Test 2: Preview
npm run preview
# Debe servir el build en http://localhost:4173

# Test 3: Desarrollo paralelo
npm run dev
# Frontend debe estar en :5173
# Backend debe estar en :4000
# Ambos sin errores

# Test 4: API endpoints
curl http://localhost:4000/api/health
# Debe responder: {"status":"ok","service":"pwa-inversions-drfic-api"}

curl http://localhost:4000/api/orders
# Debe responder: [] (array vacío o con datos)
```

## ✅ Limpieza Pre-Deploy

```bash
# Limpiar artefactos
rm -rf dist/
rm -rf .tsbuildinfo

# Reinstalar limpio
npm install --legacy-peer-deps
npm run build

# Verificar que no hay cambios no comprometidos
git status
# Debe estar limpio (solo untracked: node_modules, dist)
```

## ✅ Instrucciones para Profesor

Preparar documento con:

- [ ] URL de Vercel (frontend público)
- [ ] URL de Railway (backend público)
- [ ] URL de GitHub repository (público o acceso compartido)
- [ ] Instrucciones para clonar y ejecutar localmente:
  ```bash
  git clone <url>
  cd projects/pwa/pwa_inversions_drfic
  npm install --legacy-peer-deps
  npm run dev
  ```
- [ ] Nota: Frontend en :5173, Backend en :4000

---

## Paso Final: Deploy

1. **Backend**: Push a GitHub → Railway redeploya automáticamente
2. **Frontend**: Push a GitHub → Vercel redeploya automáticamente
3. **Verificar**: Abrir URL de Vercel → Dashboard CRUD debe funcionar
4. **Crear orden**: Probar crear/editar/eliminar datos
5. **Finnhub**: Cambiar símbolo en Market Panel → datos actualizan

---

## Estados Comunes

| Estado | Significa | Acción |
|--------|-----------|--------|
| "Building" | Compilando | Esperar |
| "Ready" | ✅ Funcionando | Probar |
| "Failed" | ❌ Error | Ver logs |
| "Queued" | En cola | Esperar o cancelar |

---

**Una vez que todo esté ✅, estás listo para desplegar!**

¿Necesitas ayuda? Ver QUICK_DEPLOY.md
