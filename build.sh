#!/bin/bash -e

# This script builds the "build" folder containing the frontend app

rm -rf node_modules build
npm ci
npm run-script build