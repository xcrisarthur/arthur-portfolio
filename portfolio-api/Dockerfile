FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js seed-default.js media.js ./
ENV PORT=3002 DATA_DIR=/data
EXPOSE 3002
CMD ["node", "server.js"]
