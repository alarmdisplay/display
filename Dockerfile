FROM node:20.18.3@sha256:bcf90f85634194bc51e92f8add1221c7fdeeff94b7f1ff360aeaa7498086d641 as build-console

WORKDIR /home/node/app/console
COPY ./console/package.json ./console/package-lock.json /home/node/app/console/
RUN npm ci --no-audit
COPY ./console /home/node/app/console
RUN npm run build

FROM node:20.18.3@sha256:bcf90f85634194bc51e92f8add1221c7fdeeff94b7f1ff360aeaa7498086d641 as build-frontend

WORKDIR /home/node/app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json /home/node/app/frontend/
RUN npm ci --no-audit
COPY ./frontend /home/node/app/frontend
RUN npm run build

FROM node:20.18.3@sha256:bcf90f85634194bc51e92f8add1221c7fdeeff94b7f1ff360aeaa7498086d641 as build-server

WORKDIR /home/node/app/server
COPY ./server/package.json ./server/package-lock.json /home/node/app/server/
RUN npm ci --no-audit
COPY ./server /home/node/app/server
RUN npm run compile

FROM node:20.18.3@sha256:bcf90f85634194bc51e92f8add1221c7fdeeff94b7f1ff360aeaa7498086d641
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
