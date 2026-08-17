import { IEncodedBase64File, VscodeAction, VscodeActions } from '@algonova/vscode-integration';
import * as path from 'path';
import { ExtensionContext, Terminal, commands, window } from 'vscode';
import { FsUtils } from './fsUtils';

type PostMessageHandle = (action: VscodeAction) => void;

const MAIN_FILE = 'main.py';

export class Sandbox {
  fsUtils: FsUtils;
  terminal?: Terminal;
  projectId?: number;

  constructor(
    private extensionContext: ExtensionContext,
    private postMessage: PostMessageHandle,
  ) {
    this.fsUtils = new FsUtils(extensionContext);

    window.onDidCloseTerminal(terminal => {
      if (!this.terminal) return;
      if (terminal.processId === this.terminal.processId) {
        this.postMessage(VscodeActions.stopProject());
      }
      if (this.projectId) {
        this.fsUtils.rmDir(this.getProjectFolder(this.projectId));
      }
    });
  }

  getDataPath(): string {
    return path.join(this.extensionContext.extensionPath, 'data');
  }

  getProjectFolder(projectId: number): string {
    return path.join(this.getDataPath(), 'sandbox', String(projectId));
  }

  getSandboxFile(): string {
    return path.join(this.extensionContext.extensionPath, 'sandbox/sandbox.py');
  }

  createProjectFolder(projectId: number) {
    const projectFolder = this.getProjectFolder(projectId);
    this.fsUtils.mkdir(projectFolder);
  }

  async run(projectId: number, files: IEncodedBase64File[]) {
    const currentTerminalIds = window.terminals.map(terminal => terminal.processId);

    // create python terminal with conda for execute program
    await commands.executeCommand('python.createTerminal');

    this.projectId = projectId;
    this.stop();
    const projectFolder = this.getProjectFolder(projectId);
    this.fsUtils.rmDir(projectFolder);
    this.createProjectFolder(projectId);
    this.fsUtils.writeFiles(projectFolder, files);

    const command = `python "${this.getSandboxFile()}" "${projectFolder}" ${MAIN_FILE} && exit`;

    // find new python terminal
    this.terminal = window.terminals.find(terminal => !currentTerminalIds.includes(terminal.processId));

    if (this.terminal) {
      this.terminal.show();
      this.terminal.sendText(command, true);
    } else {
      console.error('New terminal not found');
    }
  }

  stop() {
    if (this.terminal) {
      this.terminal.dispose();
    }
  }
}
