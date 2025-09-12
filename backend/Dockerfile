# Imagen base oficial de Node
FROM node:22

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero (para aprovechar la caché de Docker)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Expone el puerto donde corre tu backend
EXPOSE 5000   
# Comando para iniciar el servidor
CMD ["npm", "start"]
