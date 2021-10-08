# --------------> The build image
FROM node:latest AS build
WORKDIR /usr/src/app
COPY src /usr/src/app/src
COPY package.json /usr/src/app/
COPY tsconfig.json /usr/src/app/
RUN yarn global add typescript
RUN yarn global add yarn
RUN yarn install

# --------------> The production image
FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["yarn", "start"]

# # --------------> The build image
# FROM node:latest AS build
# WORKDIR /usr/src/app
# COPY . .
# RUN yarn install
# RUN yarn global add @vercel/ncc
# RUN ncc build . -o dist

# # --------------> The production image
# FROM node:lts-alpine
# ENV NODE_ENV production
# USER node
# WORKDIR /usr/src/app
# COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
# CMD ["node", "/usr/src/app/dist/index.js"]

