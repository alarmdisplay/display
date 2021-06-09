#!/bin/bash
set -ev

cd server
npm ci
mysqladmin --user root create display_backend
npm test
