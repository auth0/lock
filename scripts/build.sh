#!/bin/bash

set -e

source scripts/common.sh

npm run build
./scripts/i18n.sh
