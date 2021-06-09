#!/usr/bin/env bash

# The root directory of the project is one up
cd "$(dirname $0)/.."
PROJECT_DIR=$PWD
echo "Project root is $PROJECT_DIR"

if [[ -d build ]]; then
    echo "Removing old build folder..."
    rm -r build
fi

echo "Building server ..."
cd "$PROJECT_DIR/server"
npm ci
npm run compile || exit
cp package.json lib/
cp package-lock.json lib/
cp -r public lib/

mkdir lib/config
cp config/default.json lib/config/
cp config/docker.json lib/config/
cp config/production.json lib/config/

mv lib "$PROJECT_DIR/build"

echo "Building console ..."
cd "$PROJECT_DIR/console"
npm ci
npm run build || exit
mv dist "$PROJECT_DIR/build/ext-console"

echo "Building frontend ..."
cd "$PROJECT_DIR/frontend"
npm ci
npm run build || exit
mv dist "$PROJECT_DIR/build/ext-display"

cd "$PROJECT_DIR"
cp LICENSE build/
