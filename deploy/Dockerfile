FROM node:14.17.3-alpine as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Building app
RUN npm run build

FROM node:14.17.3-alpine

# Copying source files
COPY . /usr/src/app

EXPOSE 3000

#Copying entrypoint.sh file
COPY ./build/entrypoint.sh entrypoint.sh
RUN chmod+x entrypoint.sh

#start app
ENTRYPOINT ["./entrypoint.sh"]
