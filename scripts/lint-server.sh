#!/bin/bash
set -ev

cd server
npm run ci
npm run lint