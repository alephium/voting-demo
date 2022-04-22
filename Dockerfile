FROM node:16

#env NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000
WORKDIR /src

COPY . /src
RUN npm install

CMD ["npm", "run", "start"]