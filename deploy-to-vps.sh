#!/usr/bin/env bash
kill -9 $(lsof -t -i:3000) > /dev/null 2>&1

rm -rf /root/runner/auth

git clone https://github.com/neocxf/koa-ts-sqlite /root/runner/auth

cd /root/runner/auth

npm run prod:stop

npm install

export NODE_ENV=development && npm run prod

