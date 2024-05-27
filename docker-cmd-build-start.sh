#!/bin/sh

set -e

cd /app
npm run build
npm run start
