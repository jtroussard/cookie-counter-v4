# Stage 1: Build the React Client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# Stage 2: Build the Express Server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production Image
FROM node:20-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install production dependencies for the server
COPY server/package*.json ./
RUN npm install --only=production

# Copy built server files
COPY --from=server-build /app/server/dist ./dist

# Copy built client files (for future static serving)
COPY --from=client-build /app/client/dist ./client/dist

# Expose the server port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
