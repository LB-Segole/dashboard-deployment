#!/bin/sh
set -e

wget --quiet --tries=1 --spider http://localhost:80/health || exit 1 