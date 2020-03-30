#!/usr/bin/env bash

# Ensure an empty build folder
if [ -d build ]; then
    rm -r build/
fi
mkdir build
cd build || exit

# Clone and build the Vue.js app for the Display Frontend
git clone https://github.com/alarmdisplay/display-frontend-vue
cd display-frontend-vue || exit
npm ci
npm run build || exit

# Move the result out of the build folder, so it can be bundled with the backend
mv dist/ ../../ext-display

# TODO Build and include the Display Console
