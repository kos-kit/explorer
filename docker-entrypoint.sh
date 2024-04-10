#!/bin/sh

set -e

yarn run build
mv out _site
