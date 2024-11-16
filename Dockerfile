from node:18 AS  build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prisma:generate

RUN npm run build

FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

CMD ["npm","start"]