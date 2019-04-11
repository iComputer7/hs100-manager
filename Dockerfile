FROM node:alpine

RUN mkdir -p /usr/src/meme
WORKDIR /usr/src/meme

RUN npm install

COPY ./src /usr/src/meme

CMD ["node", "index.js"]
