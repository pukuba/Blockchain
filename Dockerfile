FROM node:14

RUN mkdir -p /server

WORKDIR /server

ADD ./ /server

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "on" ]