#!/usr/bin/env bash
kill -9 $(lsof -t -i:3000) > /dev/null 2>&1

rm -rf /root/runner/auth

git clone https://github.com/neocxf/koa-ts-sqlite /root/runner/auth

cd /root/runner/auth

npm install

export NODE_ENV=production && export HOST_URL='auth.neospot.top' && npm run prod

