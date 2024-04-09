FROM node:20

ENV NEXT_TELEMETRY_DISABLED 1

COPY . /explorer

# Install Node.js packages
RUN cd /explorer && yarn install && yarn build-lib

# Delete files we don't need 
RUN yarn cache clean
