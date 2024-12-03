FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .
RUN rm -rf node_modules
RUN npm i
RUN apt-get update -y && apt-get install -y openssl
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]