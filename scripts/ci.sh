#!/bin/bash

npm install

source scripts/common.sh

CDN_NAME=${1:-"lock"}
MATCHER=${2:-"*"}
NPM_TAG=${3:-"latest"}

CDN_FILE="lock.min.js"
NPM_NAME=$(node scripts/utils/attribute.js name)
VERSION=$(node scripts/utils/attribute.js version)

NPM_BIN=$(npm bin)
RELEASE=$($NPM_BIN/semver $VERSION -r "$MATCHER")
STABLE=$($NPM_BIN/semver $VERSION -r "*")

WILDCARD_VERSION=$(node scripts/utils/wildcard_version.js)

# Enable failing on exit status here because semver exits with 1 when the range
# doesn't match.
set -e

cdn_release()
{
  scripts/upload.sh "$CDN_NAME" "$1"
  new_line
  success "$NPM_NAME ($1) uploaded to cdn"
}

bower_release()
{
  # Check if tag exists
  TAG_NAME="v$VERSION"
  TAG_EXISTS=$(git tag -l "$TAG_NAME")

  if [ ! -z "$TAG_EXISTS" ]; then
    verbose "There is already a tag $TAG_EXISTS in git. Skiping git deploy."
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
    verbose "There is already a version $NPM_EXISTS in npm. Skiping npm publish…"
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

./scripts/test.sh
./scripts/clean.sh
./scripts/build.sh

if [ -z "$RELEASE" ]
  then
  verbose "Current version $VERSION is dev-only. Uploading as development…"
  cdn_release "development"
elif [ -n "$AUTH0_WIDGET_CI_NAME" ]; then
  git checkout -b dist
  bower_release
  new_line
  npm_release "$VERSION"
  new_line
  CDN_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" https://cdn.auth0.com/js/$CDN_NAME/$VERSION/$CDN_FILE | grep 200 || true)
  if [ -z "$CDN_EXISTS" ]; then
    cdn_release "$VERSION"
    if [ -n "$WILDCARD_VERSION" ]
      then
      cdn_release "$WILDCARD_VERSION"
    fi
  else
    verbose "Lock ($VERSION) already in CDN"
  fi
  git checkout master
  git branch -D dist
fi
