import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { ConfigurationTarget, Extension, ExtensionContext, commands, env, window, workspace } from 'vscode';

import { EXTENSION_NAME } from './env';
import { localize } from './i18n';
import { packageUpdates } from './package-updates';

enum ConfigKey {
  IS_PACKAGES_UPDATED = 'algopython-is-packages-updated',
}

export async function updateExtension(ext: Extension<any>, context: ExtensionContext): Promise<any> {
  try {
    await updateConfiguration();
  } catch {
    console.log('Settings update error');
  }
  const ver = ext.packageJSON.version;
  let result = null;
  let attempts = 0;
  while (result === null && attempts < 5) {
    try {
      attempts++;
      result = await executeUpdate();
    } catch (err) {
      console.log('Extension update error: ', err);
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    }
  }
  if (result === null) {
    window.showErrorMessage(localize('error---Failed to update extension', 'Failed to update extension'));
  } else if (result && result != ver) {
    context.globalState.update(ConfigKey.IS_PACKAGES_UPDATED, false);
    await commands.executeCommand('workbench.action.reloadWindow');
  }
}

export function updatePythonPackages(context: ExtensionContext) {
  const isPackagesUpdated = context.globalState.get(ConfigKey.IS_PACKAGES_UPDATED);
  if (isPackagesUpdated) return;
  console.log('updating packages');
  const winPath = '\\AppData\\Local\\Programs\\Algoritmika\\algovenv\\Lib\\site-packages';
  const unixPath = '/miniconda/envs/algoritmika/lib/python3.7/site-packages';
  try {
    const isWindows = process.platform === 'win32';
    const packagesPath = `${os.homedir()}${isWindows ? winPath : unixPath}`;
    const srcRootPath = path.join(context.extensionPath, 'package-updates');
    for (const packageName in packageUpdates) {
      const packageInfo = packageUpdates[packageName];
      const files = packageInfo.files;
      for (const relOrigPath in files) {
        const destPath = path.join(packagesPath, relOrigPath);
        const srcPath = path.join(srcRootPath, files[relOrigPath]);
        if (fs.existsSync(destPath) && fs.existsSync(srcPath)) {
          console.log('copying file');
          console.log(srcPath);
          console.log(destPath);
          fs.copyFileSync(srcPath, destPath);
        } else {
          console.warn(`Could not find file ${relOrigPath}`);
        }
      }
    }
    context.globalState.update(ConfigKey.IS_PACKAGES_UPDATED, true);
    return true;
  } catch {
    console.warn('algo packages update error');
    window.showErrorMessage(localize('error---Packages update error', 'Packages update error'));
    return false;
  }
}

function executeUpdate(): Promise<any> {
  const command = getUpdateCommand();
  const options = getExecOptions();
  return new Promise<any>((resolve, reject) => {
    cp.exec(command, options, (error, stdout) => {
      if (error) {
        reject(error.toString());
        return;
      }
      const out = stdout.toString();
      const regex =
        /\bv?((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)\b/gi;
      const version = regex.exec(out);
      if (!version || version.length < 2) {
        resolve(false);
        return;
      }
      resolve(version[1]);
    });
  });
}

function getUpdateCommand(): string {
  let path = env.appRoot;
  switch (process.platform) {
    case 'win32':
      path = path.replace('resources\\app', 'bin');
      return `"${path}\\code.cmd" --install-extension algoritmika.${EXTENSION_NAME} --force`;
    case 'linux':
      path = path.replace('resources/app', 'bin').replace(/ /g, '\\ ');
      return `${path}/code --install-extension algoritmika.${EXTENSION_NAME} --force`;
    case 'darwin':
      path = `${path}/bin`;
      path = path.replace(/ /g, '\\ ');
      return `${path}/code --install-extension algoritmika.${EXTENSION_NAME} --force`;
    default:
      return '';
  }
}

function getExecOptions(): object | null {
  let options = null;
  switch (process.platform) {
    case 'win32':
      options = {
        shell: 'cmd.exe',
      };
      break;
    case 'linux':
      options = {};
      break;
    case 'darwin':
      options = {};
      break;
  }
  return options;
}

async function updateConfiguration(): Promise<void> {
  if (workspace) {
    const config = workspace.getConfiguration('update');
    if (config.get('mode') !== 'none') {
      await config.update('mode', 'none', ConfigurationTarget.Global);
    }
    /* default settings to avoid installer changes */
    const shellConfig = workspace.getConfiguration('terminal.integrated.shell');
    if (shellConfig.get('windows') !== 'cmd.exe') {
      await shellConfig.update('windows', 'cmd.exe', ConfigurationTarget.Global);
    }
    const terminalConfig = workspace.getConfiguration('python.terminal');
    if (terminalConfig.get('executeInFileDir') === false) {
      await terminalConfig.update('executeInFileDir', true, ConfigurationTarget.Global);
    }
  }
}
