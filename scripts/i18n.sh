#!/bin/bash

source scripts/common.sh

SRC_PATH="lib/i18n"

verbose "Processing i18n files…"
new_line

for file in $SRC_PATH/*.js; do
  verbose_item "Converting $file"
  node scripts/utils/i18n.js "$file"
done;
