FROM node:7.8.0

MAINTAINER opsxcq <opsxcq@thestorm.com.br>

WORKDIR /src

COPY package.json /src

RUN npm install

COPY . /src/

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["test"]
