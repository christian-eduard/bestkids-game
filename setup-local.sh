#!/bin/bash

# Script de configuración para desarrollo local de BestKids

echo "🎮 Configurando BestKids para desarrollo local..."

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << 'EOF'
# BESTKIDS - VARIABLES DE ENTORNO (LOCAL)

# DATABASE (PostgreSQL LOCAL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bestkids_db
DATABASE_USER=$(whoami)
DATABASE_PASSWORD=
DATABASE_URL=postgresql://$(whoami)@localhost:5432/bestkids_db

# BACKEND (NestJS)
BACKEND_PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=bestkids-super-secret-jwt-key-2024-development
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=bestkids-super-secret-refresh-key-2024-development
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# FRONTEND (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=BestKids
NEXT_PUBLIC_APP_VERSION=2.0.0
EOF
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar PostgreSQL
echo "🔍 Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL instalado"
    
    # Verificar si el servicio está corriendo
    if pg_isready &> /dev/null; then
        echo "✅ PostgreSQL está corriendo"
    else
        echo "⚠️  PostgreSQL no está corriendo. Iniciando..."
        brew services start postgresql@15
    fi
    
    # Crear base de datos si no existe
    if psql -lqt | cut -d \| -f 1 | grep -qw bestkids_db; then
        echo "✅ Base de datos bestkids_db ya existe"
    else
        echo "📦 Creando base de datos bestkids_db..."
        createdb bestkids_db
        echo "✅ Base de datos creada"
    fi
    
    # Crear extensión UUID
    echo "🔧 Configurando extensiones..."
    psql bestkids_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" &> /dev/null
    echo "✅ Extensiones configuradas"
else
    echo "❌ PostgreSQL no está instalado"
    echo "   Instalar con: brew install postgresql@15"
    exit 1
fi

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencias del backend ya instaladas"
fi
cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ Dependencias del frontend ya instaladas"
fi
cd ..

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📚 Próximos pasos:"
echo "   1. cd backend && npm run start:dev    (Iniciar backend)"
echo "   2. cd frontend && npm run dev         (Iniciar frontend)"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo ""
