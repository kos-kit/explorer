#!/bin/sh

set -e

cd /app
yarn run build

if [ -d "/github/workspace" ]; then
    mv /app/out /github/workspace/_site
fi
