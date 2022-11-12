FROM node:16.14.2

EXPOSE 3005

COPY . /app

WORKDIR /app

RUN npm ci && npm run generate && npm run build

CMD ["npm", "run", "preview"]
