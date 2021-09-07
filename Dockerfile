FROM node:14.17.3-alpine as builder

WORKDIR /usr/src/app

ARG REACT_APP_API_URL=https://api.tradezonemap.com/api/v1.0
ARG REACT_APP_ENVIROMENT='production'
# Copying source files
COPY . .
# Building app
RUN npm install --only=production && \
    npm i -g env-cmd && \
    env-cmd -f .env.production npm run build && \
    npm cache clean --force 

FROM node:14.17.3-alpine

# Create app directory
WORKDIR /usr/src/app

# copy from the builder
COPY --from=builder /usr/src/app/ .

RUN ls -la

EXPOSE 80

# Start the app
CMD npm run start
