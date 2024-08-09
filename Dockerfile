FROM node:20.16.0@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f as build-console

WORKDIR /home/node/app/console
COPY ./console/package.json ./console/package-lock.json /home/node/app/console/
RUN npm ci --no-audit
COPY ./console /home/node/app/console
RUN npm run build

FROM node:20.16.0@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f as build-frontend

WORKDIR /home/node/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json /home/node/app/frontend/
RUN npm ci --no-audit
COPY ./frontend /home/node/app/frontend
RUN npm run build

FROM node:20.16.0@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f as build-server

WORKDIR /home/node/app/server
COPY ./server/package.json ./server/package-lock.json /home/node/app/server/
RUN npm ci --no-audit
COPY ./server /home/node/app/server
RUN npm run compile

FROM node:20.16.0@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f
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
