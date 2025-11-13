# Use Node.js LTS version
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend code
COPY . .

# Expose the port your app runs on
EXPOSE 5001

# Start the server
CMD ["npx","nodemon","src/index.js"]
