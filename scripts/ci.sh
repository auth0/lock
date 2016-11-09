#!/bin/bash

npm install

source scripts/common.sh

MATCHER=${2:-"*"}
NPM_TAG=${3:-"latest"}

NPM_NAME=$(node scripts/utils/attribute.js name)
VERSION=$(node scripts/utils/attribute.js version)

NPM_BIN=$(npm bin)
STABLE=$($NPM_BIN/semver $VERSION -r "*")

# Enable failing on exit status here because semver exits with 1 when the range
# doesn't match.
set -e

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
  NPM_EXISTS=$(npm info -s $NPM_NAME@$1 version)

  if [ ! -z "$NPM_EXISTS" ]; then
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
  npm run test
else
  npm run test:cli
fi

# Clean
rm -f build/*.js

# Build
npm run build
SRC_PATH="lib/i18n"

verbose "Processing i18n files…"
new_line

for file in $SRC_PATH/*.js; do
  verbose_item "Converting $file"
  node scripts/utils/i18n.js "$file"
done;

# Release
git checkout -b dist
bower_release
new_line
npm_release "$VERSION"
new_line
cdn_release "$VERSION"
git checkout master
git branch -D dist
