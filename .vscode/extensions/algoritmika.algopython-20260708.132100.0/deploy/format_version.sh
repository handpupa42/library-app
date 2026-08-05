#!/bin/bash

newVersion=$1

# formating version number to meet VS Marketplace rules
# 's/-0\+/-/g' - remove all "0" after "-": "21.05.26-015614" >> "21.05.26-15614"
# 's/\.//g' - remove all dots ("."): "21.05.26-15614" >> "210526-15614"
# 's/-/./g' - replace "-" with ".": "210526-15614" >> "210526.15614"
newVersionFormatted="$(echo $newVersion | sed -e 's/-0\+/-/g' -e 's/\.//g' -e 's/-/./g')"

# result: "21.05.26-015614" >> "210526.15614.0"
echo $newVersionFormatted.0
