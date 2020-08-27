#!/usr/bin/env bash

# Ensure an empty build folder
if [ -d build ]; then
    rm -rf build/
fi
mkdir build
cd build || exit

# Clone and build the Vue.js app for the Display Frontend
git clone https://github.com/alarmdisplay/display-frontend-vue
cd display-frontend-vue || exit
npm ci
npm run build || exit

# Move the result out of the build folder, so it can be bundled with the backend
rm -rf ../../ext-display
mv dist/ ../../ext-display

# Go back up to the build folder root
cd ..

# Clone and build the Vue.js app for the Display Console
git clone https://github.com/alarmdisplay/display-console
cd display-console || exit
npm ci
npm run build || exit

# Move the result out of the build folder, so it can be bundled with the backend
rm -rf ../../ext-console
mv dist/ ../../ext-console
