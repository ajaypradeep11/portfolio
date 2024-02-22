# Use an official lightweight Node.js image.
# https://hub.docker.com/_/node
FROM node:18 AS builder

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production && \
#     npm rebuild bcrypt

# ADD . /usr/src/app

# RUN npm install

# CMD [ "npm", "start" ]

# # Use an official Node.js runtime as the base image
# FROM node:14

# Set the working directory to /app
WORKDIR /app

# RUN rm -rf node_modules

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# RUN npm install bcrypt --only=dev

# # Rebuild the bcrypt package
# RUN npm rebuild bcrypt
# Install production and development dependencies
RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM node:18

# Set working directory
WORKDIR /app

# Copy built files from previous stage
COPY --from=builder /app .

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]