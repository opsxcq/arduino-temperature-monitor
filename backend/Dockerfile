FROM node:7.8.0

MAINTAINER opsxcq <opsxcq@thestorm.com.br>

WORKDIR /src

COPY package.json /src

RUN npm install

COPY *.js /src/

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["run"]
