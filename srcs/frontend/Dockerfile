FROM node:20-alpine

COPY . /app/

WORKDIR /app

RUN npm install && npm run build

CMD ["npm", "run", "start"]

EXPOSE 3000