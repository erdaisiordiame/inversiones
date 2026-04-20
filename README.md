# PWA Inversiones Drfic - Plataforma de Señales de Trading

Plataforma web progresiva para análisis de inversiones con señales de compra/venta en bolsa de Estados Unidos, desarrollada con React, TypeScript, Vite y MongoDB.

## 🚀 Características

- **Análisis de mercado**: Escaneo de símbolos y datos históricos
- **Motor de señales**: Generación de señales BUY/SELL/HOLD con IA heurística
- **Backtesting**: Validación histórica de estrategias
- **Persistencia**: MongoDB para datos de mercado y señales
- **PWA**: Instalable como aplicación web

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Base de datos**: MongoDB Atlas
- **ORM**: Mongoose
- **Estado**: React hooks (useState, useEffect)
- **Build**: Vite + TypeScript compiler

## 📋 Prerrequisitos

- Node.js >= 18
- npm >= 8
- Cuenta MongoDB Atlas (o instancia local)

## ⚙️ Configuración

1. **Clona el repositorio**
   ```bash
   git clone <repo-url>
   cd projects/pwa/pwa_inversions_drfic
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   Crea un archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edita las variables de MongoDB con tus credenciales.

4. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```

   Este comando iniciará el frontend de Vite y el backend Express en paralelo.

5. **Build para producción**
   ```bash
   npm run build
   npm run preview
   ```

## 🗄️ Base de Datos

### Conexión MongoDB
La aplicación se conecta automáticamente a MongoDB Atlas al iniciar. Las colecciones principales son:

- `symbols`: Instrumentos financieros
- `market_data`: Datos OHLC históricos
- `signals`: Señales generadas
- `backtests`: Resultados de backtesting

### Variables requeridas
```bash
VITE_MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
VITE_MONGO_DB_NAME=pwa_inversions_drfic_db
```

## 🏗️ Arquitectura

```
src/
├── features/          # Módulos funcionales
│   ├── market-scanner/
│   ├── signals/
│   └── backtesting/
├── services/          # Servicios externos
│   ├── db/           # MongoDB models y conexión
│   └── market-data/  # API de datos de mercado
├── ai_work_flow/     # Documentación metodológica
└── App.tsx           # Componente raíz
```

## 🧪 Desarrollo

### Scripts disponibles
- `npm run dev`: Inicia el servidor de desarrollo y la API backend en paralelo
- `npm run dev:client`: Inicia solo el frontend de Vite
- `npm run dev:server`: Inicia solo el backend Express
- `npm run build`: Build de producción
- `npm run preview`: Vista previa del build
- `npm run lint`: Linting con ESLint

### Generar señal de prueba
En la UI, ingresa un símbolo (ej: AAPL) y haz clic en "Generate Signal" para crear y persistir una señal en MongoDB.

## 📚 Metodología

Este proyecto sigue la metodología híbrida **AI SKILL DEVELOPMENT + SPEC DRIVEN ASSISTANCE**:

- **Fase 1**: Investigación y definición (completada)
- **Fase 2**: Estructura base (completada)
- **Fase 3**: Integración MongoDB (completada)

Documentación completa en `ai_global/`.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
