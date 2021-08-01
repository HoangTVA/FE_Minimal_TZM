FROM node:14.17.3-alpine as builder

WORKDIR /usr/src/app

# Copying source files
COPY . .

# Building app
RUN npm install && \
    npm run build && \
    npm cache clean --force 

FROM node:14.17.3-alpine

# Create app directory
WORKDIR /usr/src/app

# copy from the builder
COPY --from=builder /usr/src/app/ .

RUN ls -la

EXPOSE 3005

# Start the app
CMD npm run start