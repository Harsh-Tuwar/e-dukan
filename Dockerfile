# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.3.1
FROM node:${NODE_VERSION}-slim as base

ARG PAYLOAD_SECRET
ARG MONGODB_URL
ARG G_APP_PASS_KEY
ARG G_APP_PASS_USER
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG NEXT_PUBLIC_SERVER_URL

ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV MONGODB_URL=$MONGODB_URL
ENV G_APP_PASS_KEY=$G_APP_PASS_KEY
ENV G_APP_PASS_USER=$G_APP_PASS_USER
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.19
RUN npm install -g yarn@$YARN_VERSION --force


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY --link . .

# Build application
RUN yarn run build

# Remove development dependencies
RUN yarn install --production=true


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start" ]
