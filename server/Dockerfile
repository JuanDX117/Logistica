# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Exponer puerto y comando de inicio
EXPOSE 5000
CMD ["npm", "start"]
