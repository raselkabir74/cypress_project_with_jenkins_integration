#!/bin/bash
# shellcheck shell=bash
set -e

# private staging area to run the tests on
BRANCH="$1"

if [[ -z "$BRANCH" ]]; then
  BRANCH="master"
fi

# Your given JSON file
# The path is relative to the directory used in Jenkinsfile
JSON_FILE="./cypress.env.prod.json"

jq --arg usr "${USERNAME}" --arg pwd "${PASSWORD}" --arg client_id "${CLIENT_ID}" --arg client_scr "${CLIENT_SECRET}" \
  '.CREDENTIALS.USERNAME = $usr | .CREDENTIALS.PASSWORD = $pwd | .CREDENTIALS.CLIENT_ID = $client_id | .CREDENTIALS.CLIENT_SECRET = $client_scr' \
  ${JSON_FILE} > "tmp_$$.json" && mv "tmp_$$.json" ${JSON_FILE}

fnm install
fnm use

npm install 
npm run cy:temp:prod
