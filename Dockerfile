FROM node:lts-alpine3.13

WORKDIR /srv
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
ENV HOST 0.0.0.0
ENV PORT 3000
CMD ["node", "start.js"];