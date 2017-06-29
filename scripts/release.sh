#!/bin/bash

# Usage:
# It receives only one parameter with is the version level (major, minor or patch)
#
# Running the script directly:
#    scripts/release.sh minor
#
# Running the npm script
#    npm run release -- major
#
# or the tag it should use the final version number starting with `v`
#
# Running the script directly:
#    scripts/release.sh v8.0.0-beta.1
#
# Running the npm script
#    npm run release -- v8.0.0-beta.1

NEW_VERSION=""
VALID_VERSION_LEVELS=(major minor patch)
CURR_DATE=`date +%Y-%m-%d`

IS_VALID_VERSION_LEVEL=false
VERSION_LEVEL=$1

REPO_URL=$( jq .repository.url package.json | sed 's/\"//g' | sed 's/\.git//g')
REPO_NAME=$( basename $REPO_URL )
TMP_CHANGELOG_FILE="/tmp/$REPO_NAME-TMPCHANGELOG-$RANDOM"

if [ "$REPO_NAME" = "null" ] || [ "$REPO_NAME" = "" ]; then
   echo "Could not parse repository url"
   exit 1
fi

if [ "$VERSION_LEVEL" = "" ]; then
   echo "Version level not provided"
   exit 1
fi

for i in "${!VALID_VERSION_LEVELS[@]}"; do
   if [[ "${VALID_VERSION_LEVELS[$i]}" = "${VERSION_LEVEL}" ]]; then
       IS_VALID_VERSION_LEVEL=true
   fi
done

if [ $IS_VALID_VERSION_LEVEL = false ]; then
  FIRST_LETER=${VERSION_LEVEL:0:1}

  if [ "$FIRST_LETER" != "v" ]; then
    echo "Version level is not valid (major, minor, patch or the version tag (v#.#.#) supported)"
    exit 1
  fi

  NEW_V_VERSION=$VERSION_LEVEL
  NEW_VERSION=${VERSION_LEVEL:1}
fi

echo "Release process init"

ORIG_VERSION=$(jq .version package.json | sed 's/\"//g')
ORIG_V_VERSION="v$ORIG_VERSION"

echo "Current version" $ORIG_VERSION

if [ "$NEW_VERSION" == "" ]; then
  NEW_VERSION=$( node_modules/.bin/semver $ORIG_VERSION -i $VERSION_LEVEL )
  NEW_V_VERSION="v$NEW_VERSION"
fi

QUOTED_NEW_VERSION="\"$NEW_VERSION\""

echo "New version" $NEW_VERSION

read -p "Do you want to continue? (y/n)" choice
case "$choice" in
  y|Y ) echo "Releasing" $NEW_VERSION;;
  * ) exit 0;;
esac

echo "Updating package.json"
jq ".version=$QUOTED_NEW_VERSION" package.json > package.json.new
jq ".version=$QUOTED_NEW_VERSION" bower.json > bower.json.new

echo "Generating tmp changelog"
echo "# Change Log" > $TMP_CHANGELOG_FILE
echo "" >> $TMP_CHANGELOG_FILE
echo "## [$NEW_V_VERSION](https://github.com/auth0/$REPO_NAME/tree/$NEW_V_VERSION) ($CURR_DATE)" >> $TMP_CHANGELOG_FILE
echo "[Full Changelog](https://github.com/auth0/$REPO_NAME/compare/$ORIG_V_VERSION...$NEW_V_VERSION)" >> $TMP_CHANGELOG_FILE
echo "" >> $TMP_CHANGELOG_FILE

CHANGELOG_WEBTASK="https://webtask.it.auth0.com/api/run/wt-hernan-auth0_com-0/oss-changelog.js?webtask_no_cache=1&repo=$REPO_NAME&milestone=$NEW_V_VERSION"

curl -f -s -H "Accept: text/markdown" $CHANGELOG_WEBTASK >> $TMP_CHANGELOG_FILE

echo "Updating README.md"
sed -i .old "s/lock\/$ORIG_VERSION\/lock.min.js/lock\/$NEW_VERSION\/lock.min.js/g" README.md

echo "Updating CHANGELOG.md"

sed "s/\# Change Log//" CHANGELOG.md >> $TMP_CHANGELOG_FILE

echo "Replacing files"

mv package.json.new package.json
mv bower.json.new bower.json
mv $TMP_CHANGELOG_FILE CHANGELOG.md
rm README.md.old

git commit -am "Release $NEW_V_VERSION"
git push origin HEAD

