# Always use the current LTS version of Node.js
FROM node:lts

WORKDIR /app

# In production, the server runs on port 8080
EXPOSE 8080

# Copy the important files, see .dockerignore
COPY . /app

# install dependencies
RUN npm install --only=production --no-audit

# run as unprivileged user
USER node:node

CMD ["node", "src/index.js"]
