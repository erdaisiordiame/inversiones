# PWA Inversiones Drfic: Documentación General de la Aplicación

## 1. Descripción del Proyecto

**PWA Inversiones Drfic** es una plataforma web progresiva (PWA) de nivel profesional orientada al ámbito financiero y de trading. Su propósito principal es brindar a los usuarios un ecosistema integral donde puedan simular, gestionar y monitorear operaciones financieras, armar carteras de inversión (portafolios) y crear alertas automatizadas basadas en movimientos reales del mercado de valores.

El proyecto está diseñado bajo una arquitectura cliente-servidor (Frontend + Backend) y destaca por su capacidad de integrarse con proveedores de datos financieros en tiempo real (Finnhub).

---

## 2. Arquitectura Tecnológica

El sistema sigue un modelo MERN (MongoDB, Express, React, Node.js) fuertemente tipado e impulsado por herramientas modernas:

*   **Frontend (Interfaz de Usuario):**
    *   **React + TypeScript:** Provee una interfaz reactiva, segura y de alto rendimiento.
    *   **Vite:** Herramienta de compilación súper rápida que reemplaza a Webpack.
    *   **Axios:** Cliente HTTP para la comunicación asíncrona con el backend.
    *   **CSS Modular (Variables CSS):** Arquitectura de estilos diseñada nativamente para soportar temas dinámicos (Modo Oscuro/Claro) sin frameworks pesados.
*   **Backend (Servidor y Lógica de Negocios):**
    *   **Node.js + Express.js:** Servidor RESTful asíncrono, liviano y escalable.
    *   **Motor Background (Cron/Intervalos):** Procesos en segundo plano para vigilancia constante del mercado.
*   **Bases de Datos (MongoDB Atlas):**
    *   Mongoose es utilizado como ODM (Object Data Modeling).
    *   **Estrategia Multi-DB:** La aplicación no es monolítica a nivel de datos. Utiliza `pwa_inversions_drfic_db` para la capa transaccional clásica (Órdenes, Estrategias) y `pwa_portfolios_db` para el ecosistema de gestión patrimonial (Portafolios, Alertas, Velas).

---

## 3. Módulos y Funcionalidades del Frontend

La interfaz está dividida en paneles especializados para separar las responsabilidades del trader:

### 3.1. CRUD Trading Dashboard (Transaccional)
Es el panel de control operativo. Permite al usuario emitir órdenes de compra (BUY) y venta (SELL) sobre distintos activos. Soporta tipos de órdenes (Market, Limit, Stop) y vigila el estado de cada transacción (pending, executed, cancelled). Incluye pestañas interactivas para consultar el historial general y configurar "Estrategias" de inversión a largo plazo.

### 3.2. Integración de Mercado en Tiempo Real (Finnhub)
Un módulo de consulta rápida donde el usuario puede introducir el ticker de una acción (Ej. AAPL, TSLA, MSFT) y obtener instantáneamente el precio de cierre de la bolsa, máximos, mínimos, apertura y el porcentaje de variación del activo. 

### 3.3. Centro de Gestión (Portafolios, Velas y Alertas)
Este panel utiliza un sistema de navegación por pestañas (*tabs*) para organizar las nuevas funcionalidades de la plataforma:
*   **Gestión de Portafolios:** Permite crear distintas carteras. Cuenta con una "Bóveda de Activos" donde el usuario ingresa cuántas acciones compró y a qué precio, y la plataforma calcula automáticamente subtotales individuales y el gran total del patrimonio.
*   **Historial de Mercado (Velas):** Extrae directamente desde Wall Street (vía Finnhub) los últimos 10 días de movimientos de un activo y los persiste en una base de datos local, permitiendo consultas ultrarrápidas y construcción de gráficos futuros.
*   **Motor de Alertas:** Permite definir un "Precio Meta" para una acción. El frontend cuenta con un sistema de auto-refresco silencioso que cambia visualmente la etiqueta de la alerta de "ACTIVA" a "DISPARADA" en tiempo real cuando el mercado cumple la condición impuesta.

---

## 4. Lógica de Negocios y Backend

El cerebro de la aplicación reside en la arquitectura del backend, el cual asegura que la plataforma opere de manera robusta y automatizada:

### 4.1. APIs RESTful
Toda la aplicación se comunica bajo el protocolo HTTP mediante estándares REST. Existen controladores específicos que manejan las operaciones CRUD puras (Crear, Leer, Actualizar, Borrar) devolviendo respuestas estructuradas en formato JSON y gestionando correctamente los códigos de estado HTTP (200, 201, 400, 500).

### 4.2. Motor Automático en Segundo Plano (Background Engine)
La plataforma no es estática. El backend cuenta con un servicio (`alertService.js`) que arranca automáticamente junto con el servidor. Este motor tiene un bucle configurado para ejecutarse cada 15 segundos. Su función es:
1. Consultar la base de datos para extraer qué símbolos tienen alertas activas.
2. Hacer peticiones por debajo del radar a la API de Finnhub para obtener los precios en vivo.
3. Comparar los precios obtenidos contra las metas del usuario.
4. Si la meta se cumple, ejecutar una transacción de actualización en MongoDB apagando la alerta y registrando el hito.

### 4.3. Middlewares y Seguridad
*   **CORS (Cross-Origin Resource Sharing):** Configurado para prevenir bloqueos de comunicación entre los puertos del servidor de desarrollo (React en el puerto 5173/5174 y Express en el puerto 4000).
*   **Manejo de Variables de Entorno (`.env`):** Las cadenas de conexión de la base de datos y los Tokens privados de las APIs (como `VITE_FINNHUB_API_KEY`) no están escritos (*hardcoded*) en el código fuente, garantizando seguridad a nivel de repositorio.

---

## 5. Diseño Visual y Experiencia de Usuario (UX/UI)

El frontend fue diseñado con una estética "Dark Mode" premium, ideal para interfaces financieras prolongadas donde la fatiga visual es un factor.
*   Se evitaron diseños saturados o con lenguajes informales; toda la redacción de la UI es estrictamente profesional.
*   Se utilizan acentos de color esmeralda (`#10b981`) y carmesí (`#ef4444`) únicamente para comunicar de manera instintiva al usuario el éxito, el peligro, o el estado financiero positivo/negativo de sus activos.
*   Todo el sistema de navegación está adaptado con transiciones suaves (`transition: all 0.2s`) y retroalimentación inmediata (*hover effects*) en los botones y tarjetas para una experiencia de usuario (UX) inmersiva y de alta calidad.
