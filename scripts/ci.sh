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

bower_release()
{
  # Check if tag exists
  TAG_NAME="v$VERSION"
  TAG_EXISTS=$(git tag -l "$TAG_NAME")

  if [ ! -z "$TAG_EXISTS" ]; then
    verbose "There is already a tag $TAG_EXISTS in git. Skipping git deploy."
  else
    verbose "Deploying $VERSION to git"

    LAST_COMMIT=$(git log -1 --pretty=%B)
    grep -v -e '^build$' -e '^build/$' .gitignore > /tmp/.gitignore
    mv /tmp/.gitignore .gitignore
    git add --force build/*
    git commit -am "$TAG_NAME"
    git tag "$TAG_NAME" -m "$LAST_COMMIT"
    git push origin $TAG_NAME
    success "$NPM_NAME version ready for bower"
  fi
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
if [ -n "$SAUCE_USERNAME" ]
then
  yarn run test
else
  yarn run test:cli
  yarn run test:jest
fi

# Clean
rm -f build/*.js

# Build & Release Webpack Bundle
yarn run dist build
git checkout -b dist
bower_release
new_line
cdn_release "$VERSION"
new_line

# Build & Release NPM
yarn run prepublish
npm_release "$VERSION"

git checkout master
git branch -D dist