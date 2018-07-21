#!/usr/bin/env bash
kill -9 $(lsof -t -i:3000) > /dev/null 2>&1

mv /root/runner/auth/dappstore.sqlite /root

rm -rf /root/runner/auth

git clone https://github.com/neocxf/koa-ts-sqlite /root/runner/auth

mv /root/dappstore.sqlite /root/runner/auth

cd /root/runner/auth

npm install

export NODE_ENV=development && export HOST_URL='auth.neospot.top' && export HOST_FULL_URL='https://auth.neospot.top' && npm run prod

