FROM node:12.22.11-alpine3.15 as base

RUN npm install -g nodemon bower
RUN apk --update add git python2 bash

WORKDIR /home/node

FROM base as builder
COPY package.json  bower.json .bowerrc ./
# COPY package-lock.json .

RUN npm install

COPY --chown=node . .
COPY --chown=node config.docker.json ./config.json
USER node
RUN ls -alR /home/node/public && sleep 5
RUN npm run build
#&& du -s . && sleep 5

EXPOSE 3000
CMD ["npm", "dev"]


FROM base as prod
WORKDIR /home/node

COPY  --from=builder  /home/node/package.json .
RUN npm install --only=production

COPY --from=builder --chown=node  /home/node/api ./api
COPY --from=builder --chown=node  /home/node/config ./config
COPY --from=builder --chown=node  /home/node/helpers  ./helpers
COPY --from=builder --chown=node  /home/node/public  ./public
COPY --from=builder --chown=node  /home/node/views  ./views
COPY --from=builder --chown=node  /home/node/bin ./bin
COPY --from=builder --chown=node  /home/node/*.js ./
COPY --from=builder --chown=node  /home/node/config.json ./config.json
USER node

CMD ["/usr/local/bin/node", "./bin/www"]
