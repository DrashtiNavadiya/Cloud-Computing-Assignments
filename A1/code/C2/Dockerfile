FROM node:14

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 6005

CMD ["npm", "start"]
