# PWA Inversiones Drfic - Base de Datos

## Base de Datos: `db_trading`

La aplicación utiliza MongoDB con Mongoose para gestionar datos de trading. La base de datos `db_trading` contiene 9 colecciones principales con validadores JSON Schema.

## Colecciones Implementadas

### 1. Users (`users`)
Gestiona usuarios del sistema con roles y preferencias.

```typescript
interface IUser {
  email: string;
  full_name?: string;
  role: 'owner' | 'trader' | 'viewer';
  timezone: string;
  is_active?: boolean;
  preferences?: Record<string, any>;
}
```

### 2. Strategies (`strategies`)
Almacena estrategias de trading configurables.

```typescript
interface IStrategy {
  user_id?: ObjectId;
  name: string;
  description?: string;
  preset_code?: string;
  is_preset?: boolean;
  is_active?: boolean;
  enabled_cores?: Record<string, any>;
  indicator_config?: Record<string, any>;
  // ... más campos de configuración
  min_confidence_threshold: Decimal128;
}
```

### 3. Broker Accounts (`broker_accounts`)
Cuentas de broker conectadas al sistema.

```typescript
interface IBrokerAccount {
  user_id: ObjectId;
  broker_name: string;
  account_number: string;
  account_type: 'cash' | 'margin' | 'ira' | 'paper';
  balance?: Decimal128;
  buying_power?: Decimal128;
  is_active?: boolean;
  is_paper?: boolean;
  credentials?: Record<string, any>;
}
```

### 4. Orders (`orders`)
Órdenes de compra/venta ejecutadas o pendientes.

```typescript
interface IOrder {
  user_id: ObjectId;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: Decimal128;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  status: 'pending' | 'filled' | 'cancelled' | 'rejected' | 'partial';
  asset_type: 'STOCK' | 'OPTION' | 'ETF' | 'CRYPTO' | 'FOREX';
  // ... más campos
}
```

### 5. Positions (`positions`)
Posiciones abiertas/cerradas en el portafolio.

```typescript
interface IPosition {
  user_id: ObjectId;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: Decimal128;
  entry_price: Decimal128;
  current_price?: Decimal128;
  stop_loss?: Decimal128;
  take_profit?: Decimal128;
  unrealized_pnl?: Decimal128;
  asset_type: 'STOCK' | 'OPTION' | 'ETF' | 'CRYPTO' | 'FOREX';
  is_open?: boolean;
}
```

### 6. Risk Configs (`risk_configs`)
Configuraciones de riesgo por usuario.

```typescript
interface IRiskConfig {
  user_id: ObjectId;
  max_position_size_pct?: Decimal128;
  max_daily_loss_pct?: Decimal128;
  default_stop_loss_pct?: Decimal128;
  max_concurrent_positions?: number;
  // ... más configuraciones
}
```

### 7. Signal Events (`signal_events`)
Eventos de señales de trading generadas.

```typescript
interface ISignalEvent {
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M' | '1Y';
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: Decimal128;
  status: 'active' | 'executed' | 'dismissed' | 'expired';
  occurred_at: Date;
  // ... más campos
}
```

### 8. Signal Performance (`signal_performance`)
Rendimiento histórico de las señales.

```typescript
interface ISignalPerformance {
  signal_id: ObjectId;
  symbol: string;
  action: string;
  result: 'win' | 'loss' | 'open' | 'unknown';
  pnl?: Decimal128;
  pnl_pct?: Decimal128;
}
```

### 9. Watchlists (`watchlists`)
Listas de seguimiento de símbolos.

```typescript
interface IWatchlist {
  user_id: ObjectId;
  name: string;
  description?: string;
  is_default?: boolean;
  symbols: IWatchlistSymbol[];
}

interface IWatchlistSymbol {
  symbol: string;
  instrument_type: 'Stock' | 'ETF' | 'Index' | 'Option';
  sector?: string;
  is_active?: boolean;
  sort_order?: number;
}
```

## Inicialización de Base de Datos

Para crear todas las colecciones con validadores e índices:

```bash
# Ejecutar el script de inicialización
node scripts/init-db.js
```

O desde el código:

```typescript
import { initializeDatabase } from './src/services/db/init';

await initializeDatabase();
```

## Variables de Entorno

```env
VITE_MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
VITE_MONGO_DB_NAME=db_trading
```

## Uso de Modelos

```typescript
import {
  UserModel,
  StrategyModel,
  OrderModel,
  // ... otros modelos
} from './src/services/db';

// Crear un usuario
const user = await UserModel.create({
  email: 'trader@example.com',
  role: 'trader',
  timezone: 'America/New_York'
});

// Buscar estrategias activas
const strategies = await StrategyModel.find({ is_active: true });
```

## Validadores JSON Schema

Todas las colecciones incluyen validadores MongoDB que:
- Fuerzan tipos de datos específicos
- Validan valores enumerados
- Requieren campos obligatorios
- Previenen datos inconsistentes

## Índices Optimizados

Cada colección incluye índices estratégicos para:
- Búsquedas por usuario (`user_id`)
- Consultas temporales (`occurred_at`, `submitted_at`)
- Filtros por estado (`status`, `is_active`)
- Búsquedas por símbolo (`symbol`)