ARG LOCAL_REPO=dockerrepo.softdesign.dk:5000/
ARG NODE_VERSION=18.14.1

# ----------------------------------------------
# PRUNE
# ----------------------------------------------
FROM ${LOCAL_REPO}nodebuild:${NODE_VERSION} AS prune

ARG APPLICATION

WORKDIR /app

COPY . .

RUN turbo prune --scope=${APPLICATION} --docker

# ----------------------------------------------
# BUILD
# ----------------------------------------------
FROM ${LOCAL_REPO}nodebuild:${NODE_VERSION} AS build

ARG APPLICATION

WORKDIR /app

COPY --from=prune /app/.gitignore .gitignore
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/yarn.lock ./yarn.lock
COPY --from=prune /app/.yarnrc.yml .yarnrc.yml
COPY --from=prune /app/.yarn .yarn
yarn
RUN yarn install --immutable

COPY --from=prune /app/out/full/ .
COPY --from=prune /app/turbo.json turbo.json

RUN yarn turbo run build --filter=${APPLICATION}

# Run tests and copy reports
# RUN yarn turbo run test:ci
# RUN mkdir ./reports
# RUN find ./packages/**/.reports -name 'report-*' -exec cp --target-dir ./reports {} \;

# ----------------------------------------------
# TEST RESULTS AND COVERAGE
# ----------------------------------------------
# FROM scratch AS test
# COPY --from=build /app/reports/* /

# ----------------------------------------------
# PRODUCTION
# ----------------------------------------------
FROM ${LOCAL_REPO}nodeprod:${NODE_VERSION}

ARG APP_LOCATION

# Set workding directory
WORKDIR /app

# Copy files for production
COPY --from=build /app .

# Ensure only production modules are installed and clean up
RUN find . -type d -name node_modules -prune -exec rm -rf {} \;
RUN yarn workspaces focus --production --all
RUN rm -rf .yarn/cache .yarn/unplugged .yarn/build-state.yml .yarn/install-state.gz .yarn/plugins .yarn/releases .yarn/versions

WORKDIR /app/${APP_LOCATION}

# Setup user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

EXPOSE 5000

CMD ["node", "./dist/index.js"]