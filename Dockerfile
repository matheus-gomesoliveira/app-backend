FROM --platform=linux/amd64 node:lts

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# COPY .env
COPY .env.docker.example .env

# Install app dependencies
RUN yarn install

EXPOSE 3344

CMD [ "yarn", "start" ]
