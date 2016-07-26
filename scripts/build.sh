#!/bin/bash

source scripts/common.sh

mkdir build
touch build/{1,2,3,4,5}.js
success 'Distributuion ready'

./scripts/i18n.sh
