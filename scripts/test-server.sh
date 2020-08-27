#!/bin/bash
set -ev

cd server
npm run ci
mysqladmin --user root create display_backend
npm test
