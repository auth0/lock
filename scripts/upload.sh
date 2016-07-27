#!/bin/bash

source scripts/common.sh

LOCAL_PATH="build"
DRY_RUN=""

LIBRARY_NAME=$1
VERSION=$2
REMOTE_PATH="s3://assets.us.auth0.com/js/$LIBRARY_NAME/$VERSION"

assert_non_empty()
{
  if [ -z "$1" ]
  then
    fail_with_error_usage
  fi
}

fail_with_error_usage ()
{
  echo ""
  echo -e "\033[1;31mERROR:\033[0m Missing one of the required parameters"

  echo "Usage: "
  echo "$ ./upload.sh library_name library_version"

  exit 1
}

s3_upload()
{
  if [ -f "$1" ]
  then
    echo ""
    verbose_item "Uploading '$1'"
    # aws s3 cp "$DRY_RUN" --region us-west-1 "$1" "$REMOTE_PATH/$1"
    aws s3 cp "$1" "$REMOTE_PATH/$1" --region us-west-1
    if [ -z "$DRY_RUN" ]
    then
      curl -fs -XDELETE "https://cdn.auth0.com/js/$LIBRARY_NAME/$VERSION/$1"
    else
      echo "(dryrun) curl -fs -XDELETE https://cdn.auth0.com/js/$LIBRARY_NAME/$VERSION/$1"
    fi
  fi
}

assert_non_empty $LIBRARY_NAME
assert_non_empty $VERSION
assert_non_empty $LOCAL_PATH

verbose "Uploading '$LIBRARY_NAME' ($VERSION) to CDN…"
echo ""
verbose "Local path is: $LOCAL_PATH"
verbose "Remote path is: $REMOTE_PATH"

cd $LOCAL_PATH
for file in *.js; do
  s3_upload "$file"
done;
