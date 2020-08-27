#!/bin/bash
set -ev

cd frontend
npm run ci
npm run lint