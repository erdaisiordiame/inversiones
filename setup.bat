@echo off
REM Setup script for PWA Inversions Drfic (Windows)
REM Instala dependencias y prepara para desarrollo/despliegue

echo ======================================
echo PWA Inversions DRFIC - Setup Script
echo ======================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js no está instalado. Descargalo de https://nodejs.org
    pause
    exit /b 1
)

echo OK Node.js version:
node --version
echo OK npm version:
npm --version
echo.

REM Instalar dependencias
echo Instalando dependencias...
call npm install --legacy-peer-deps

if errorlevel 1 (
    echo X Error durante la instalación de dependencias
    pause
    exit /b 1
)

echo OK Dependencias instaladas
echo.

REM Crear .env si no existe
if not exist .env (
    echo Copiando .env.example a .env...
    copy .env.example .env
    echo IMPORTANTE: Edita .env con tus credenciales de MongoDB y API keys
    echo.
)

REM Build test
echo Compilando TypeScript y Vite...
call npm run build

if errorlevel 1 (
    echo X Error durante el build
    pause
    exit /b 1
)

echo OK Build completado sin errores
echo.

REM Información final
echo ======================================
echo OK Setup completado!
echo ======================================
echo.
echo Próximos pasos:
echo.
echo 1. Edita .env con tus credenciales
echo 2. Para desarrollo: npm run dev
echo 3. Para producción: npm run build ^&^& npm run preview
echo.
echo Documentacion: DEPLOYMENT_GUIDE.md
echo.
pause
