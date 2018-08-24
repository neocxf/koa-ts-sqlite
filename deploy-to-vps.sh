#! /bin/bash
# kill -9 $(lsof -t -i:3000) > /dev/null 2>&1

DEPLOY_PATH=/root/runner/auth

if [ ! -d "$DEPLOY_PATH" ]; then
    mkdir -p $DEPLOY_PATH
    git clone https://github.com/neocxf/koa-ts-sqlite $DEPLOY_PATH
else
    cd $DEPLOY_PATH
    git checkout -- .
    git pull origin master
    npm run prod:stop
fi  

cd $DEPLOY_PATH

npm install

export PORT=3000 && export NODE_ENV=development && export HOST_URL='auth.neospot.top' && export HOST_FULL_URL='https://auth.neospot.top' && npm run prod