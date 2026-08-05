#!/bin/bash

echo $(npx -c 'echo $npm_package_version')-$(date +%s)
