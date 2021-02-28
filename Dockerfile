FROM node:lts
COPY ./build /home/node/app

WORKDIR /home/node/app
RUN npm install --only=production --no-audit

EXPOSE 3031
ENV NODE_ENV production
ENV NODE_CONFIG_ENV docker
USER node
CMD [ "node", "index.js" ]
