// ============================================================
// SCRIPT: Inicialización de base de datos db_trading
// Ejecutar en: Node.js con el proyecto corriendo
// ============================================================

import { initializeDatabase } from './src/services/db/init';

// Ejecutar inicialización (solo una vez)
initializeDatabase()
  .then(() => {
    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  });