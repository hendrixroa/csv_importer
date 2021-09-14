FROM hendrixroa/docker-image-nodejs:latest

COPY package.json ./
COPY yarn.lock ./
RUN yarn config set no-progress
RUN yarn --production=false
COPY . ./
RUN make build
RUN find ./* ! -name dist ! -name Makefile -maxdepth 0 -exec rm -rf {} +
RUN cp -R "./dist/"* . && rm -rf dist
CMD node src/apps/${APP}/main.js