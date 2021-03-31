# Alarmdisplay Display

This component takes care of displaying incident data in case of an emergency, and shows general information otherwise. The incidents can be created via API, or synced over from a [Hub](https://github.com/alarmdisplay/hub) instance.

This repository contains backend and frontend code.
For more info on how to run those parts, check out the README in the respective sub folder.

## Build
You can use the [build script](./scripts/build.sh) to create a runnable version of this project.
During this process, the single components in the sub folders should not be running in development mode.

## Deployment
At the moment, this project is not recommended for deployment outside a development or test environment.
