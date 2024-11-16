from node:18 AS  build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

RUN npm run prisma:generate

FROM node:18-slim

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm","start"]