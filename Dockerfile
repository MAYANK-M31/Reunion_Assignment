FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080
ENV DATABASE_USERNAME=reunion
ENV DATABASE_PASSWORD=Mj3QPRisQt0ReBow
ENV JWT_SECRET=e47d0956a6652b06c2ae399d1f851894d3e73d6986c5fb64ebc352ddf0db1832e7022b94ca3de395d7f234523ff0cc698669f9ae5d5dfdfececdd9f8150b6765dbb00089a6e323887b758ddeae61ef5d2c2ac7cab58a1f279de3


EXPOSE 8080

CMD [ "npm","start" ]
