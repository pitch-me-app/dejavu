#!/usr/bin/env bash

git remote add heroku 'https://git.heroku.com/pitchme-es.git'
git push heroku +HEAD:master --force