# client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Compilar la app de React
RUN npm run build

# Servir la aplicación estática
RUN npm install -g serve
CMD ["serve", "-s", "build"]

EXPOSE 3000
