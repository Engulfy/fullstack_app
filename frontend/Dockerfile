FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Dev mode: Vite server binds to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
