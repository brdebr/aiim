FROM node:16.14.2

EXPOSE 3005

COPY ./api /app

COPY .env /app

WORKDIR /app

RUN npm ci && npm run build

CMD ["npm", "run", "start:prod"]
