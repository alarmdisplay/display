#!/bin/bash
set -ev

cd frontend
npm ci
npm run lint