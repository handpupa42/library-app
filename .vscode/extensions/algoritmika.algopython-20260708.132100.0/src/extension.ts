import * as fs from 'fs';
import * as path from 'path';
import {
  commands,
  ExtensionContext,
  extensions,
  StatusBarAlignment,
  StatusBarItem,
  Uri,
  window,
  workspace,
} from 'vscode';
import AlgoPanel from './algoPanel';
import { EXTENSION_NAME, IS_DEVELOPMENT } from './env';
import { localize, setLocale } from './i18n';
import Platform from './platform';
import { State } from './types';
import { updateExtension, updatePythonPackages } from './updateExtension';

const WORKSPACE_FILENAME = 'level.code-workspace';
/**
 * Current state - welcome panel or SPA
 */
let state: State = State.LOADING;

class AlgoExtension {
  private panel?: AlgoPanel;
  private context: ExtensionContext;
  private statusBarCaption?: StatusBarItem;

  constructor(context: ExtensionContext) {
    this.context = context;
    this.init()
      .then(() => {
        this.panel = new AlgoPanel(context);
        new Platform(context, this.panel);

        updatePythonPackages(context);

        setLocale();
      })
      .then(() => {
        if (IS_DEVELOPMENT) {
          state = State.APP;
        } else {
          state = State.CHECKING_UPDATES;
          this.checkUpdates();
        }
        this.showPanel();
      });
  }

  showPanel() {
    if (!this.panel) {
      return;
    }

    switch (state) {
      case State.APP:
        this.panel.loadPlatform();
        break;
      case State.LOADING:
        this.panel.setWelcomePageText('Loading...');
        break;
      case State.CHECKING_UPDATES:
        this.panel.setWelcomePageText(localize('extension---update', 'Update available'));
        break;
    }
  }

  private init(): Thenable<void> {
    this.registerCommands();
    this.createStatusBar();
    return this.initWorkspace();
  }

  private initFileSystem() {
    if (workspace) {
      const watcher = workspace.createFileSystemWatcher('**/*.py');
      watcher.onDidCreate(e => {
        console.log('create: ', e);
      });
      watcher.onDidChange(e => {
        if (e.path.indexOf('/tkinter.py') > -1 || e.path.indexOf('/turtle.py') > -1) {
          window.showErrorMessage(localize('error---File name collision', 'File name collision'), {
            modal: true,
          });
        }
      });
    }
  }

  private createStatusBar() {
    this.statusBarCaption = window.createStatusBarItem(StatusBarAlignment.Left);
    this.statusBarCaption.text = 'Algoritmika!';
    this.statusBarCaption.show();
  }

  private createWorkspaceFile(fileName: string) {
    const config = {
      folders: [{ name: ' ', path: 'temp' }],
      settings: {
        'breadcrumbs.enabled': false,
        'files.hotExit': 'on',
        'window.restoreWindows': 'none',
        'workbench.editor.tabCloseButton': 'off',
      },
    };
    const fullPath = path.join(this.context.extensionPath, fileName);
    fs.writeFileSync(fullPath, JSON.stringify(config));
  }

  private async initWorkspace() {
    await workspace.saveAll(false);
    await commands.executeCommand('workbench.action.closeAllEditors');
    await commands.executeCommand('workbench.view.explorer');
    await commands.executeCommand('workbench.action.toggleSidebarVisibility');
    this.createWorkspaceFile(WORKSPACE_FILENAME);
    return commands
      .executeCommand('vscode.openFolder', Uri.file(path.join(this.context.extensionPath, WORKSPACE_FILENAME)))
      .then(() => {
        this.initFileSystem();
      });
  }

  private registerCommands() {
    commands.registerCommand('algoritmika.show', () => {
      this.showPanel();
    });
  }

  private async checkUpdates() {
    const ext = extensions.getExtension(`Algoritmika.${EXTENSION_NAME}`);
    if (ext) {
      await updateExtension(ext, this.context);
      state = State.APP;
      this.showPanel();
    }
  }
}

export function activate(context: ExtensionContext) {
  new AlgoExtension(context);
}
