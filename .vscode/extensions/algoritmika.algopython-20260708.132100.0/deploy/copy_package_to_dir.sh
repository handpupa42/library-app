#!/bin/bash

branchNameEscaped=$1
vscodeDir=$2

cd $vscodeDir

name="$(node -e "console.log(require('./package.json').name)")"
version="$(node -e "console.log(require('./package.json').version)")"
packageFilename="$name-$version.vsix"

rootDir="/home/mars/vscode-branches"
branchNameWithPostfix=$branchNameEscaped-singlepage
branchDir=$rootDir/$branchNameWithPostfix
downloadPackageUrl="http://$branchNameWithPostfix.dev.alg.team/$packageFilename"

create_branch_dir () {
  local branchDir=$1

  sudo rm -rf $branchDir
  sudo mkdir $branchDir
}

create_branch_dir $branchDir
sudo cp $packageFilename $branchDir

echo $downloadPackageUrl
