# Multi-stage build for Angular application
# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist/panelAdmin /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
