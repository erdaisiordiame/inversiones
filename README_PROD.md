# PWA Inversiones Drfic - Plataforma de Señales de Trading

Plataforma web progresiva completa con CRUD, REST API, MongoDB y análisis de mercado en tiempo real.

**Estado**: ✅ Fase 3.5 completada - Listo para producción

---

## 🚀 Despliegue Rápido

### Opción 1: Local (Desarrollo)

```bash
# Clona el repositorio
git clone <repo-url>
cd projects/pwa/pwa_inversions_drfic

# Ejecuta setup.sh (Linux/Mac) o setup.bat (Windows)
./setup.sh  # o setup.bat en Windows

# Inicia el proyecto
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

### Opción 2: Producción (Railway + Vercel)

Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

**URLs después del despliegue**:
- Frontend: `https://pwa-inversions.vercel.app`
- Backend: `https://your-railway-url.up.railway.app`

---

## ✨ Características

- **CRUD Completo**: Gestiona órdenes, estrategias y watchlists
- **Dashboard Interactivo**: Tablas con crear/editar/eliminar
- **REST API**: 9 endpoints CRUD con Express + MongoDB
- **Redux Toolkit**: Estado global centralizado
- **Finnhub API**: Datos de mercado en tiempo real
- **Responsivo**: CSS Grid y Flexbox para todos los dispositivos
- **PWA Ready**: Instalable como app nativa
- **TypeScript**: Tipado completo para seguridad

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| **Frontend** | React 19 + TypeScript | UI moderna |
| **Build** | Vite | Bundling rápido |
| **Estado** | Redux Toolkit + React-Redux | Manejo de estado |
| **Estilos** | CSS Grid/Flexbox | Diseño responsive |
| **Backend** | Express.js | API REST |
| **Base de Datos** | MongoDB + Mongoose | Persistencia |
| **API Externa** | Finnhub | Datos de mercado |
| **Despliegue** | Railway + Vercel | Cloud hosting |

---

## 📦 Configuración Inicial

### 1. Prerrequisitos

- Node.js >= 18
- npm >= 8
- Git
- Cuenta MongoDB Atlas (gratuita)
- Finnhub API Key (gratuita)

### 2. Instalación

```bash
git clone <repo-url>
cd projects/pwa/pwa_inversions_drfic
npm install --legacy-peer-deps
```

### 3. Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` con:
```
VITE_MONGO_URI=mongodb+srv://user:password@cluster...
VITE_MONGO_DB_NAME=pwa_inversions_drfic_db
VITE_FINNHUB_API_KEY=your_key_here
```

### 4. Desarrollo Local

```bash
npm run dev
```

Esto inicia:
- Frontend Vite: http://localhost:5173
- Backend Express: http://localhost:4000

---

## 📚 Scripts Disponibles

```bash
npm run dev              # Frontend + Backend en paralelo
npm run dev:client      # Solo frontend
npm run dev:server      # Solo backend
npm run build           # Build de producción
npm run preview         # Preview del build
npm run lint            # Linting
```

---

## 🏗️ Arquitectura

```
frontend/src/
├── store/                    # Redux state
│   ├── ordersSlice.ts       # Orders CRUD
│   ├── strategiesSlice.ts   # Strategies CRUD
│   ├── watchlistsSlice.ts   # Watchlists CRUD
│   └── index.ts             # Store config
├── features/
│   ├── crud/                # CRUD Dashboard
│   │   └── TradingCrudPage.tsx
│   └── market-data/
│       └── MarketDataPanel.tsx
└── App.tsx                  # Root con Redux Provider

backend/server/
├── server.js               # Express app
├── db.js                   # MongoDB connection
├── models/                 # Mongoose schemas
│   ├── order.js
│   ├── strategy.js
│   └── watchlist.js
└── routes/                 # CRUD endpoints
    ├── orders.js
    ├── strategies.js
    └── watchlists.js
```

---

## 📡 API Endpoints

### Órdenes
- `GET /api/orders` - Listar
- `POST /api/orders` - Crear
- `PUT /api/orders/:id` - Actualizar
- `DELETE /api/orders/:id` - Eliminar

### Estrategias
- `GET /api/strategies`
- `POST /api/strategies`
- `PUT /api/strategies/:id`
- `DELETE /api/strategies/:id`

### Watchlists
- `GET /api/watchlists`
- `POST /api/watchlists`
- `PUT /api/watchlists/:id`
- `DELETE /api/watchlists/:id`

---

## 📖 Documentación Adicional

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa de despliegue
- [SERVER_API_README.md](./SERVER_API_README.md) - Documentación API
- [PHASE_3_5_COMPLETION.md](./PHASE_3_5_COMPLETION.md) - Resumen técnico

---

## ✅ Checklist de Validación

- ✅ Build compila sin errores: `npm run build`
- ✅ Frontend funciona localmente: `npm run dev:client`
- ✅ Backend funciona localmente: `npm run dev:server`
- ✅ CRUD endpoints responden correctamente
- ✅ Redux Toolkit integrado
- ✅ Finnhub API funciona
- ✅ Responsive en mobile/tablet/desktop
- ✅ Deploy ready (railway.json, vercel.json)

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install --legacy-peer-deps
```

### "MongoDB connection failed"
- Verificar credenciales en `.env`
- Asegurar IP whitelist en MongoDB Atlas

### "CORS error"
- El servidor ya tiene CORS habilitado
- Verificar URL de API en frontend

### Frontend no conecta con backend
- En desarrollo: proxy automático via Vite
- En producción: actualizar VITE_API_URL en Vercel

---

## 📋 Requisitos de Clase

Este proyecto cumple con:

✅ **A) FrontEnd y BackEnd CRUD**
- Formularios CRUD en frontend (React)
- API REST en backend (Express)
- Tablas con crear/editar/eliminar

✅ **B) Infraestructura de Datos**
- MongoDB para persistencia
- Mongoose para modelado
- 3 colecciones implementadas

✅ **C) Estado Global**
- Redux Toolkit centralizado
- Async thunks para API
- DevTools integrado

✅ **D) Despliegue en Nube**
- Backend: Railway
- Frontend: Vercel
- Documentación: DEPLOYMENT_GUIDE.md

✅ **E) Repositorio Público**
- Código en GitHub
- `.env.example` para variables
- README con setup instructions

---

## 🔒 Seguridad

- Las credenciales están en `.env` (no versionado)
- API keys de terceros protegidas
- CORS configurado correctamente
- MongoDB Atlas con autenticación

---

## 📞 Soporte

Para problemas:
1. Revisar DEPLOYMENT_GUIDE.md
2. Verificar logs en Railway
3. Verificar logs en Vercel
4. Revisar PHASE_3_5_COMPLETION.md

---

## 📝 Licencia

Este proyecto es de propósito educativo (Clase DRFIC).

---

**Última actualización**: Abril 2026  
**Status**: ✅ Producción lista
