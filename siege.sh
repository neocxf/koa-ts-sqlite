#!/usr/bin/env bash

siege -b -t10S -c500 http://localhost:3000/users

