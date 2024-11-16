from node:18 AS  build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN apt-get update -y && apt-get install -y openssl

RUN npm run prisma:generate

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

CMD ["npm","start"]