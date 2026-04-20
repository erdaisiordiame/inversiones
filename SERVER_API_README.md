# CRUD API Backend - PWA Inversiones Drfic

Este servidor Express proporciona una API RESTful para gestionar Órdenes, Estrategias y Watchlists, integrado con MongoDB.

## Configuración

### Variables de Entorno

```bash
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
MONGO_DB_NAME=pwa_inversions_drfic_db
PORT=4000
```

### Instalación de Dependencias

```bash
npm install
```

## Iniciar el Servidor

```bash
npm run dev:server
# O manualmente:
node server/server.js
```

El servidor estará disponible en `http://localhost:4000`

## Endpoints API

### Órdenes

- **GET** `/api/orders` - Listar todas las órdenes
- **POST** `/api/orders` - Crear una nueva orden
- **PUT** `/api/orders/:id` - Actualizar una orden
- **DELETE** `/api/orders/:id` - Eliminar una orden

### Estrategias

- **GET** `/api/strategies` - Listar todas las estrategias
- **POST** `/api/strategies` - Crear una nueva estrategia
- **PUT** `/api/strategies/:id` - Actualizar una estrategia
- **DELETE** `/api/strategies/:id` - Eliminar una estrategia

### Watchlists

- **GET** `/api/watchlists` - Listar todas las watchlists
- **POST** `/api/watchlists` - Crear una nueva watchlist
- **PUT** `/api/watchlists/:id` - Actualizar una watchlist
- **DELETE** `/api/watchlists/:id` - Eliminar una watchlist

### Health Check

- **GET** `/api/health` - Verificar que el servidor está activo

## Estructura del Servidor

```
server/
├── db.js                    # Conexión a MongoDB
├── server.js               # Aplicación principal
├── models/
│   ├── order.js           # Modelo de órdenes
│   ├── strategy.js        # Modelo de estrategias
│   └── watchlist.js       # Modelo de watchlists
└── routes/
    ├── orders.js          # Rutas CRUD de órdenes
    ├── strategies.js      # Rutas CRUD de estrategias
    └── watchlists.js      # Rutas CRUD de watchlists
```

## Modelos de Datos

### Order
```typescript
{
  user_id: ObjectId
  symbol: string
  side: "BUY" | "SELL"
  quantity: Decimal128
  order_type: "market" | "limit" | "stop" | "stop_limit"
  asset_type: "STOCK" | "ETF" | "CRYPTO" | "OPTION" | "FOREX"
  status: "pending" | "filled" | "cancelled" | "rejected" | "partial"
  limit_price?: Decimal128
  stop_price?: Decimal128
  filled_price?: Decimal128
  filled_quantity?: Decimal128
  created_at: Date
  updated_at: Date
}
```

### Strategy
```typescript
{
  user_id?: ObjectId
  name: string
  description?: string
  is_preset?: boolean
  is_active?: boolean
  recommended_timeframes: string[]
  min_confidence_threshold: Decimal128
  created_at: Date
  updated_at: Date
}
```

### Watchlist
```typescript
{
  user_id: ObjectId
  name: string
  description?: string
  is_default?: boolean
  is_active?: boolean
  symbols: Array<{
    symbol: string
    instrument_type: "Stock" | "ETF" | "Index" | "Option"
    is_active?: boolean
    sort_order?: number
  }>
  created_at: Date
  updated_at: Date
}
```

## Ejemplos de Uso

### Crear una Orden

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "side": "BUY",
    "quantity": "10",
    "order_type": "market",
    "asset_type": "STOCK",
    "status": "pending"
  }'
```

### Crear una Estrategia

```bash
curl -X POST http://localhost:4000/api/strategies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Estrategia",
    "description": "Estrategia de prueba",
    "recommended_timeframes": ["1D", "4H"],
    "min_confidence_threshold": "0.65",
    "is_active": true
  }'
```

### Crear una Watchlist

```bash
curl -X POST http://localhost:4000/api/watchlists \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Stocks",
    "description": "Seguimiento de tech",
    "symbols": "AAPL, MSFT, GOOGL",
    "is_default": false
  }'
```

## Notas

- El servidor usa CORS habilitado para acceso desde el frontend
- Las conexiones se establecen automáticamente al iniciar el servidor
- Los datos se persisten en MongoDB Atlas
- Se incluyen índices de base de datos para optimizar consultas
