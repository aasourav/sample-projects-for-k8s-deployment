# Use the official Node.js image for the frontend build
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the entire project
COPY . .

# Build the React app (production build)
RUN yarn run build

# Use a lightweight Nginx image to serve the React app
FROM nginx:alpine

# Copy the build files from the previous build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default Nginx port)
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

