FROM node:lts as build-console

WORKDIR /home/node/app/console
COPY ./console/package.json ./console/package-lock.json /home/node/app/console/
RUN npm ci
COPY ./console /home/node/app/console
RUN npm run build

FROM node:lts as build-frontend

WORKDIR /home/node/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json /home/node/app/frontend/
RUN npm ci
COPY ./frontend /home/node/app/frontend
RUN npm run build

FROM node:lts as build-server

WORKDIR /home/node/app/server
COPY ./server/package.json ./server/package-lock.json /home/node/app/server/
RUN npm ci
COPY ./server /home/node/app/server
RUN npm run compile

FROM node:lts
WORKDIR /home/node/app/
COPY ./server/package.json ./server/package-lock.json /home/node/app/
RUN npm ci --only=production --no-audit
COPY --from=build-server /home/node/app/server/lib /home/node/app/
COPY ./server/config /home/node/app/config
COPY ./server/public /home/node/app/public
COPY --from=build-console /home/node/app/console/dist /home/node/app/ext-console
COPY --from=build-frontend /home/node/app/frontend/dist /home/node/app/ext-display

EXPOSE 3031
ENV NODE_ENV production
ENV NODE_CONFIG_ENV docker
USER node
CMD [ "node", "index.js" ]
