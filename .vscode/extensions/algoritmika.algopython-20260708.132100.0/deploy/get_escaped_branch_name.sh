#!/bin/bash

branchName=$1

# escaping: remove all before "/" (and "/") and replace "_" with "-" and convert to lower case
branchNameEscaped="$(echo $branchName | sed -e 's/_/-/g' -e 's/^.*\///g' | tr '[:upper:]' '[:lower:]')"

echo $branchNameEscaped
