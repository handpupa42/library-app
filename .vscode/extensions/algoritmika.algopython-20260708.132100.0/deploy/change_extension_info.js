/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const pathPackageJson = path.join(__dirname, '../package.json');
const packageJson = require(pathPackageJson);

const [newName, newVersion] = process.argv.slice(2);

packageJson.version = newVersion;
packageJson.name = newName.replace(/-vscode/g, '');

fs.writeFile(pathPackageJson, JSON.stringify(packageJson, null, 2), error => {
  if (error) return console.log(error);
});
