.PHONY: default all clean build serve

export NODE_ENV=development
export HOST_URL='auth.neospot.top'
export HOST_FULL_URL='https://auth.neospot.top'

default: all

all: install clean build serve

install:
	npm install

clean:
	npm run clean

build:
	npm run prod:build

serve:
	npm run prod:server




