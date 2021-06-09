#!/bin/bash
set -ev

cd console
npm ci
npm run lint