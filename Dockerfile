FROM node:12.22.11-alpine3.15
ARG dev

RUN if [ "$dev" = "true" ] ; then npm install -g nodemon ; fi;

RUN npm install -g bower

RUN apk --update add git python2

#USER node

WORKDIR /home/node

COPY package.json .

# COPY package-lock.json .

COPY bower.json .

COPY .bowerrc .

RUN npm install --only=production
# RUN npm install

COPY . .

RUN npm run build

RUN npm run config -- -d

EXPOSE 3000

CMD ["node", "./bin/www"]
