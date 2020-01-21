FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json
VOLUME [ "./:/app" ]
RUN npm install

COPY . .

EXPOSE 3000


CMD ["node","app.js"]
