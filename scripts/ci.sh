#!/bin/bash

yarn install

MATCHER=${2:-"*"}
NPM_TAG=${3:-"beta"}

NPM_NAME=$(node scripts/utils/attribute.js name)
VERSION=$(node scripts/utils/attribute.js version)

NPM_BIN=$(npm bin)
STABLE=$($NPM_BIN/semver $VERSION -r "*")

# Enable failing on exit status here because semver exits with 1 when the range
# doesn't match.
set -e

new_line()
{
  echo ""
}

verbose()
{
  echo -e " \033[36m→\033[0m $1"
}

verbose_item()
{
  echo -e " \033[96m∙\033[0m $1"
}

success()
{
  echo -e " \033[1;32m✔︎\033[0m $1"
}

cdn_release()
{
  npm run publish:cdn
  new_line
  success "$NPM_NAME ($1) uploaded to cdn"
}

npm_release()
{
  verbose "Checking if version $1 of $NPM_NAME is already available in npm…"

  NPM_EXISTS=$(npm info -s $NPM_NAME@$1 version)

  if [ ! -z "$NPM_EXISTS" ] && [ "$NPM_EXISTS" == "$1" ]; then
    verbose "There is already a version $NPM_EXISTS in npm. Skipping npm publish…"
  else
    if [ ! -z "$STABLE" ]; then
      verbose "Deploying $1 to npm"
      npm publish
    else
      verbose "Deploying $1 to npm with tag $NPM_TAG"
      npm publish --tag "$NPM_TAG"
    fi
    success "$NPM_NAME uploaded to npm registry"
  fi
}

# Test
yarn test
yarn test:e2e

# Clean
rm -f build/*.js

# Build & Release Webpack Bundle
yarn dist build
git checkout -b dist
cdn_release "$VERSION"
new_line
git checkout master
git branch -D dist