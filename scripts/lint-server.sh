#!/bin/bash
set -ev

cd server
npm ci
npm run lint