# Guía de Despliegue (Deployment) - BestKids

Esta guía detalla los pasos para desplegar la aplicación en un entorno de producción, específicamente optimizado para servidores **Plesk** con Node.js.

## Prerrequisitos del Servidor
*   **Node.js**: Versión 18 o superior (Recomendado: 20 LTS).
*   **PostgreSQL**: Versión 15 o superior.
*   **Gestor de Paquetes**: npm o yarn.
*   **Proxy Inverso**: Nginx (gestionado por Plesk).

---

## 1. Configuración de Base de Datos (PostgreSQL)

1.  Crear una base de datos vacía (ej. `bestkids_prod`).
2.  Crear un usuario con permisos totales sobre esa DB.
3.  Restaurar el esquema inicial si es necesario, o dejar que TypeORM sincronice (no recomendado para prod estricto, mejor usar migraciones).

**Variables de Entorno (Backend):**
Asegúrate de configurar estas variables en el panel de Plesk o `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=usuario_prod
DB_PASSWORD=password_seguro
DB_DATABASE=bestkids_prod
JWT_SECRET=secreto_super_largo_y_aleatorio
PORT=3001
CORS_ORIGIN=https://tu-dominio.com
```

---

## 2. Backend (NestJS)

1.  **Subir Archivos**: Sube el contenido de la carpeta `backend/` al servidor (o haz git pull).
2.  **Instalar Dependencias**:
    ```bash
    npm install --production=false
    ```
    *Nota: Se requiere `production=false` inicialmente para compilar, luego se pueden podar.*
3.  **Compilar (Build)**:
    ```bash
    npm run build
    ```
    Esto generará la carpeta `dist/`.
4.  **Ejecutar Migraciones**:
    ```bash
    npm run migration:run
    ```
5.  **Punto de Entrada**: Configura en Plesk el "Application Startup File" como `dist/main.js`.

---

## 3. Frontend (Next.js)

1.  **Subir Archivos**: Sube la carpeta `frontend/`.
2.  **Variables de Entorno**:
    ```env
    NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
    ```
3.  **Instalar y Compilar**:
    ```bash
    npm install
    npm run build
    ```
4.  **Punto de Entrada**:
    *   Next.js necesita un servidor propio. Configura el script de inicio como `npm run start` o apunta a `node_modules/.bin/next start`.
    *   Puerto por defecto: 3000.

---

## 4. Configuración Nginx (Proxy Reverso)

Si usas Plesk, configura las reglas de Nginx para redirigir el tráfico:

*   **Frontend**: Tráfico a `tu-dominio.com` -> `localhost:3000`
*   **Backend**: Tráfico a `api.tu-dominio.com` -> `localhost:3001`

Ejemplo Nginx Directive:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 5. Verificación Post-Despliegue

1.  Acceder a `https://tu-dominio.com`. ¿Carga el Login?
2.  Intentar loguearse. ¿Recibe Token JWT?
3.  Verificar logs en Plesk (Passenger logs o PM2 logs) si hay errores 500.

---

## Solución de Problemas Comunes

*   **Error 502 Bad Gateway**: El servicio Node.js no está corriendo. Revisa logs.
*   **Errores CORS**: Verifica que `CORS_ORIGIN` en backend coincida con el dominio del frontend.
*   **Database Connection Error**: Revisa credenciales y asegúrate que PostgreSQL acepta conexiones locales.
