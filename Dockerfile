# Multi-stage build para aplicación Angular

# Etapa 1: Build de la aplicación (Node 22 requerido por Angular 20)
FROM node:22-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar manifest de dependencias
COPY package*.json ./

# Instalar dependencias (usa npm ci si hay lockfile, si no, npm install)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi \
  && npm cache clean --force

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Normalizar salida a /app/build (soporta dist/panelAdmin o dist/panelAdmin/browser)
RUN mkdir -p /app/build \
  && if [ -d "/app/dist/panelAdmin/browser" ]; then cp -r /app/dist/panelAdmin/browser/* /app/build/; \
     elif [ -d "/app/dist/panelAdmin" ]; then cp -r /app/dist/panelAdmin/* /app/build/; \
     else echo "No se encontró la carpeta de salida del build" && ls -la /app/dist && exit 1; fi

# Etapa 2: Servir con nginx
FROM nginx:alpine AS production

# Copiar archivos construidos normalizados
COPY --from=build /app/build /usr/share/nginx/html

# Configuración de nginx para SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
