#!/bin/bash

source scripts/common.sh

if [ -n "$SAUCE_USERNAME" ]
then
  npm run test
else
  npm run test:cli
fi
