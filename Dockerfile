FROM node:alpine

RUN mkdir -p /usr/src/meme
WORKDIR /usr/src/meme

COPY ./src /usr/src/meme

RUN npm install

CMD ["node", "index.js"]
