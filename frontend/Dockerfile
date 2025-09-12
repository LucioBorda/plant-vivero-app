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

# Exponemos el puerto donde Nginx sirve la app
EXPOSE 3000   
CMD ["nginx", "-g", "daemon off;"]
