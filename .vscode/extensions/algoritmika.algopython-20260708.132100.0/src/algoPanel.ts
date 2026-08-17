import * as path from 'path';
import {
  ExtensionContext,
  TextDocument,
  TextDocumentChangeEvent,
  Uri,
  ViewColumn,
  WebviewPanel,
  commands,
  window,
  workspace,
} from 'vscode';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { VscodeAction, VscodePlatformAction } from '@algonova/vscode-integration';
import { HOST, IS_LOCAL_DEV, PROTOCOL } from './env';
import { getLocale, localize } from './i18n';
import { TypedEventEmitter } from './typedEventEmitter';

type Events = {
  dispose: [];
  webViewMessage: [VscodePlatformAction];
};

/**
 * Manages algoritmika webview panel
 */
export default class AlgoPanel extends TypedEventEmitter<Events> {
  static readonly viewType = 'algo';

  private _panel?: WebviewPanel;
  private readonly extensionContext: ExtensionContext;
  private readonly extensionPath: string;
  private lastVisitedUrl = '';

  get panel(): WebviewPanel {
    if (!this._panel) {
      this._panel = this.createPanel();
    }
    return this._panel;
  }

  set panel(val: WebviewPanel) {
    if (this._panel) {
      this._panel.dispose();
    }
    this._panel = val;
  }

  constructor(extensionContext: ExtensionContext) {
    super();

    this.extensionContext = extensionContext;
    this.extensionPath = extensionContext.extensionPath;
    workspace.onDidSaveTextDocument((doc: TextDocument) => {
      if (doc.uri) {
        const fileName = path.basename(doc.uri.path);
        console.log(fileName);
      }
    });
  }

  setLastVisitedUrl(url: string) {
    this.lastVisitedUrl = url;
  }

  setContent(content: string) {
    this.panel.webview.html = content;
    return this.show();
  }

  async show(column: ViewColumn = ViewColumn.One) {
    await this.panel.reveal(column, false);
    await commands.executeCommand('workbench.action.focusLastEditorGroup');
    await this.pin();
  }

  pin() {
    return commands.executeCommand('workbench.action.pinEditor');
  }

  onDidChangeTextDocument(listener: (e: TextDocumentChangeEvent) => any) {
    workspace.onDidChangeTextDocument(listener);
  }

  postMessage = (action: VscodeAction): Thenable<boolean> => {
    return this.panel.webview.postMessage(action);
  };

  async openFile(fileName: string) {
    return workspace.openTextDocument(Uri.file(fileName)).then(async doc => {
      return window.showTextDocument(doc, ViewColumn.One, false).then(async () => {
        await this.closeOtherFiles();
        return commands.executeCommand('workbench.files.action.showActiveFileInExplorer').then(() => {
          return this.show(ViewColumn.Two);
        });
      });
    });
  }

  showProjectFiles(projectPath: string, title: string) {
    const folders = workspace.workspaceFolders;
    workspace.updateWorkspaceFolders(1, folders && folders.length > 1 ? folders.length - 1 : 0, {
      name: title ? title : localize('folders---Files', 'Files'),
      uri: Uri.file(projectPath),
    });
  }

  hideProjectFiles() {
    workspace.updateWorkspaceFolders(1, 1);
  }

  focusEditor() {
    return commands.executeCommand('workbench.action.focusFirstEditorGroup');
  }

  async closeOtherFiles() {
    if (!window.visibleTextEditors.length) return;
    await this.focusEditor();
    await commands.executeCommand('workbench.action.closeOtherEditors');
  }

  setWelcomePageText(text: string) {
    return this.setContent(this.getWelcomePageContent(text));
  }

  async saveAll() {
    return workspace.saveAll();
  }

  loadPlatform() {
    return this.setContent(this.getPlatformPageContent());
  }

  dispose() {
    this.lastVisitedUrl = '';
    this.panel.dispose();
    this._panel = undefined;
  }

  private getWelcomePageContent(text: string) {
    const html: string = require('raw-loader!./pages/welcome/index.html').default;

    return html.replace('{{LOCALE}}', getLocale()).replace('{{TEXT}}', text);
  }

  private getPlatformPageContent() {
    let iframeSrc = `${PROTOCOL}//${HOST}/${IS_LOCAL_DEV ? 'login' : 'site/logout'}`;

    if (this.lastVisitedUrl) {
      iframeSrc = this.lastVisitedUrl;
    }

    const html: string = require('raw-loader!./pages/platform/index.html').default;

    return html.replace('{{LOCALE}}', getLocale()).replace('{{URL}}', iframeSrc);
  }

  private createPanel() {
    const panel = window.createWebviewPanel(AlgoPanel.viewType, 'Algoritmika', ViewColumn.One, {
      enableScripts: true,
      localResourceRoots: [Uri.file(path.join(this.extensionPath, 'media'))],
      retainContextWhenHidden: true,
    });

    panel.onDidDispose(() => {
      this._panel = undefined;
      this.emit('dispose');
    });

    panel.webview.onDidReceiveMessage(message => {
      if (!message || typeof message !== 'object' || !message.type) return;
      this.emit('webViewMessage', message);
    });

    return panel;
  }
}
