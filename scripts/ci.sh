#!/bin/bash

npm install -g yarn

yarn install

MATCHER=${2:-"*"}
NPM_TAG=${3:-"beta"}

NPM_NAME=$(node scripts/utils/attribute.js name)
VERSION=$(node scripts/utils/attribute.js version)

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