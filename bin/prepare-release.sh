#!/usr/bin/env bash

if [ "$NODE_ENV" != "production" ]; then
    echo "The NODE_ENV is not set to production"
    exit 1
fi

BUILD_FOLDER=build/display-backend/

# Ensure an empty build folder
if [ -d $BUILD_FOLDER ]; then
    rm -r $BUILD_FOLDER
fi
mkdir -p $BUILD_FOLDER

# Copy all required files into the build folder
mv ext-display $BUILD_FOLDER
mv node_modules $BUILD_FOLDER
mv src $BUILD_FOLDER
mv .env.example $BUILD_FOLDER
mv package.json $BUILD_FOLDER
mv package-lock.json $BUILD_FOLDER
mv LICENSE $BUILD_FOLDER

# shellcheck disable=SC2164
cd build
tar -czf release.tar.gz display-backend
