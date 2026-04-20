#!/bin/bash

# Setup script for PWA Inversions Drfic
# Clona, instala dependencias y prepara para desarrollo/despliegue

echo "======================================"
echo "PWA Inversions DRFIC - Setup Script"
echo "======================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Descargalo de https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Error durante la instalación de dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "📋 Copiando .env.example a .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita .env con tus credenciales de MongoDB y API keys"
    echo ""
fi

# Build test
echo "🔨 Compilando TypeScript y Vite..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error durante el build"
    exit 1
fi

echo "✅ Build completado sin errores"
echo ""

# Información final
echo "======================================"
echo "✅ Setup completado!"
echo "======================================"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Edita .env con tus credenciales"
echo "2. Para desarrollo: npm run dev"
echo "3. Para producción: npm run build && npm run preview"
echo ""
echo "📚 Para más info: cat DEPLOYMENT_GUIDE.md"
echo ""
