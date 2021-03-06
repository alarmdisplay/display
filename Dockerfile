FROM node:lts as build-console

COPY ./console /home/node/app/console
WORKDIR /home/node/app/console
RUN npm install --no-audit && npm run build

FROM node:lts as build-frontend

COPY ./frontend /home/node/app/frontend
WORKDIR /home/node/app/frontend
RUN npm install --no-audit && npm run build

FROM node:lts as build-server

COPY ./server /home/node/app/server
WORKDIR /home/node/app/server

RUN npm install --no-audit && npm run compile

FROM node:lts
COPY --from=build-server /home/node/app/server/lib /home/node/app/
COPY ./server/config /home/node/app/config
COPY ./server/public /home/node/app/public
COPY ./server/package*.json /home/node/app/
COPY --from=build-console /home/node/app/console/dist /home/node/app/ext-console
COPY --from=build-frontend /home/node/app/frontend/dist /home/node/app/ext-display

WORKDIR /home/node/app
RUN npm install --only=production --no-audit

EXPOSE 3031
ENV NODE_ENV production
ENV NODE_CONFIG_ENV docker
USER node
CMD [ "node", "index.js" ]
