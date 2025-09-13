# Etapa de construcción
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiamos el build del frontend a la carpeta que usa Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Crear configuración personalizada de Nginx para puerto 3000
RUN echo 'server { \
    listen 3000; \
    listen [::]:3000; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponemos el puerto 3000
EXPOSE 3000   

CMD ["nginx", "-g", "daemon off;"]