# --- Base image ---
FROM node:20-alpine

# --- Set working directory ---
WORKDIR /app

# --- Install dependencies ---
COPY package*.json ./
RUN npm install

# --- Copy app source ---
COPY . .

# Prisma needs the client to be generated inside container
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
