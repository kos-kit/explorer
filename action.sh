#!/bin/sh

set -e

cd /app
npm run build

if [ -d "/github/workspace" ]; then
    mv /app/out /github/workspace/_site
fi
