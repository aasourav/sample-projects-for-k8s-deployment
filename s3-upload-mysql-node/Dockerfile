# Use the official Node.js image from Docker Hub
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install the dependencies
RUN yarn

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your app will run on (3000)
EXPOSE 3000

# Set environment variables (Optional - Replace with your actual variables)
# ENV S3_BUCKET_NAME=your-bucket-name
# ENV AWS_REGION=your-region
# ENV AWS_ACCESS_KEY_ID=your-access-key
# ENV AWS_SECRET_ACCESS_KEY=your-secret-key

# Start the application
CMD ["node", "src/index.js"]

