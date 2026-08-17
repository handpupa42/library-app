import * as fs from 'fs';
import * as path from 'path';
import { getType } from 'typesafe-actions';
import { ExtensionContext, FileSystemWatcher, RelativePattern, Uri, commands, window, workspace } from 'vscode';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ACCEPTED_FILE_TYPES } from '@algonova/accepted-file-types';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ExtensionAction,
  IBaseFileInfo,
  IEncodedBase64File,
  IError,
  IProgressState,
  ISyncData,
  VscodeActions,
  VscodePlatformAction,
  VscodePlatformActions,
  convertPathToUnix,
  convertPathToWindows,
} from '@algonova/vscode-integration';
import AlgoPanel from './algoPanel';
import { setHost } from './configuration';
import { VSCODE_FOLDER } from './env';
import { FsUtils } from './fsUtils';
import { localize, setLocale } from './i18n';
import { Sandbox } from './sandbox';
import { IReportChangeParams, IReportChangesParams, IValidationResult, Message, VscodeLevelType } from './types';
import { UploadLimitations } from './uploadLimitations';
import { walkSync } from './walkSync';

class Platform {
  private extensionContext: ExtensionContext;
  private algoPanel: AlgoPanel;
  private fsUtils: FsUtils;
  private sandbox: Sandbox;
  private isBackofficePreview = false;
  private projectSlug = '';
  private levelId = 0;
  private studentId = 0;
  private levelTitle = '';
  private levelType: VscodeLevelType = VscodeLevelType.PYTHON_OFFLINE;
  private levelFolderWatcher: FileSystemWatcher | null = null;
  private initialLevelFiles: IEncodedBase64File[] = [];

  constructor(extensionContext: ExtensionContext, panel: AlgoPanel) {
    this.extensionContext = extensionContext;
    this.algoPanel = panel;
    this.fsUtils = new FsUtils(extensionContext);
    this.sandbox = new Sandbox(extensionContext, this.algoPanel.postMessage);
    this.fsUtils.mkdir(path.join(this.extensionContext.extensionPath, 'temp'));

    this.bindAlgoPanelEvents();
  }

  getLevelFilePath(fileName: string): string {
    return path.join(this.getLevelFolder(), fileName);
  }

  getLevelFolder(): string {
    return path.join(
      this.fsUtils.getDataPath(),
      'student',
      this.studentId.toString(),
      this.projectSlug || this.levelId.toString(),
    );
  }

  syncLevelContent(syncData: ISyncData) {
    const { materials, projectFiles } = syncData;
    const levelFolder = this.getLevelFolder();
    this.initialLevelFiles = [...materials, ...(projectFiles || [])];
    try {
      this.fsUtils.mkdir(levelFolder);
      this.storeFiles(this.initialLevelFiles, true);
      this.reportProgress({ action: ExtensionAction.LOAD, complete: true });
      if (!this.isBackofficePreview) {
        this.saveUnsavedFiles();
      }
    } catch {
      this.reportError({
        failedAction: ExtensionAction.LOAD,
        message: Message.LOAD_ERROR,
      });
    }
  }

  saveUnsavedFiles() {
    const files = this.getLevelFilesList();

    const unsavedFiles = files
      .filter(
        file => !this.initialLevelFiles.find(initialFile => convertPathToUnix(initialFile.fileName) === file.filePath),
      )
      .filter(file => this.checkCanSaveFile(this.getLevelFilePath(file.filePath)));

    unsavedFiles.forEach(file => {
      this.reportFileChange({
        content: this.encodeFileToBase64(this.getLevelFilePath(file.filePath)),
        fileName: file.filePath,
        isDeleted: false,
        isNew: true,
      });
    });
  }

  getLevelFilesList(): IBaseFileInfo[] {
    const getUpdatedAtSecs = (filePath: string) => Math.round(fs.statSync(filePath).mtimeMs / 1000);

    const levelFolder = this.getLevelFolder();
    if (!fs.existsSync(levelFolder)) {
      return [];
    }

    const filePaths: string[] = [];
    walkSync(levelFolder, filePath => {
      filePaths.push(filePath);
    });

    return filePaths
      .filter(filePath => this.checkCanSaveFile(filePath))
      .map(filePath => ({
        filePath: convertPathToUnix(filePath.replace(levelFolder + path.sep, '')),
        updatedAt: getUpdatedAtSecs(filePath),
      }));
  }

  encodeFileToBase64(fileName: string) {
    const data = fs.readFileSync(fileName);
    return Buffer.from(data).toString('base64');
  }

  storeFiles(files: IEncodedBase64File[], overwrite: boolean) {
    const levelFolder = this.getLevelFolder();
    this.fsUtils.writeFiles(levelFolder, files, overwrite);
  }

  reportProgress(state: IProgressState) {
    this.algoPanel.postMessage(VscodeActions.progress(state));
  }

  reportError(error: IError) {
    this.algoPanel.postMessage(VscodeActions.error(error));
  }

  reportChanges({ isDeleted = false, isNew, uri }: IReportChangesParams) {
    let encodedBase64File = '';

    if (isNew) {
      try {
        const stats = fs.statSync(uri.fsPath);
        if (!stats.size) return;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    if (!isDeleted) {
      encodedBase64File = this.encodeFileToBase64(uri.fsPath);
    }

    const fileNameWindows = convertPathToWindows(uri.fsPath.replace(this.getLevelFolder() + path.sep, ''));

    const fileNameUnix = convertPathToUnix(fileNameWindows);

    const initialFile = this.initialLevelFiles.find(
      initialFile => initialFile.fileName === fileNameWindows || initialFile.fileName === fileNameUnix,
    );

    let fileName = fileNameUnix;

    if (initialFile) {
      if (initialFile.content === encodedBase64File) return;
      fileName = initialFile.fileName;
    }

    this.reportFileChange({
      content: encodedBase64File,
      fileName,
      isDeleted,
      isNew,
    });
  }

  reportFileChange({ content, fileName, isDeleted, isNew }: IReportChangeParams) {
    this.algoPanel.postMessage(
      VscodeActions.fileChange({
        file: {
          content,
          fileName,
        },
        isDeleted,
        isNew,
      }),
    );
  }

  reportSaveLocallyRequest() {
    this.algoPanel.postMessage(VscodeActions.saveLocallyRequest());
  }

  uploadFiles(files: IEncodedBase64File[], overwrite = false) {
    try {
      this.storeFiles(files, overwrite);
      this.reportProgress({ action: ExtensionAction.UPLOAD, complete: true });
    } catch (e) {
      this.reportError({
        code: (e as IError).code,
        failedAction: ExtensionAction.UPLOAD,
        message: Message.UPLOAD_ERROR,
      });
    }
  }

  handleDocumentChange() {
    this.reportSaveLocallyRequest();
  }

  handleWebViewMessage = (action: VscodePlatformAction) => {
    console.log('Received action: ', action);
    switch (action.type) {
      case getType(VscodePlatformActions.updateLocale):
        setLocale(action.payload.locale);
        break;
      case getType(VscodePlatformActions.levelInit): {
        this.isBackofficePreview = action.payload.isBackofficePreview;
        this.levelId = action.payload.levelId;
        this.studentId = action.payload.studentId;
        this.levelTitle = action.payload.levelTitle;
        this.levelType = action.payload.levelType as VscodeLevelType;
        this.projectSlug = action.payload.projectSlug;

        this.algoPanel.postMessage(
          VscodeActions.levelState({
            files: this.getLevelFilesList(),
          }),
        );

        if (action.payload.isProjectOutdated) {
          window.showErrorMessage(
            localize('error---Have newer version, project was updated', 'Have newer version, project was updated'),
          );
        }
        break;
      }
      case getType(VscodePlatformActions.syncFiles):
        this.syncLevelContent(action.payload);
        this.openProject(action.payload);
        break;
      case getType(VscodePlatformActions.saveRequest):
        this.algoPanel.saveAll();
        break;
      case getType(VscodePlatformActions.uploadFiles):
        this.uploadFiles(action.payload.files, action.payload.overwrite);
        break;
      case getType(VscodePlatformActions.runProject):
        this.sandbox.run(action.payload.projectId, action.payload.files);
        break;
      case getType(VscodePlatformActions.stopProject):
        this.sandbox.stop();
        break;
      case getType(VscodePlatformActions.closeAllEditors):
        this.closeAllEditors();
        break;
      case getType(VscodePlatformActions.locationChange):
        this.algoPanel.setLastVisitedUrl(action.payload.href);
        break;
      case getType(VscodePlatformActions.reload):
        this.reload();
        break;
      case getType(VscodePlatformActions.updateHost):
        setHost(action.payload.host);
        break;
      case getType(VscodePlatformActions.dispose):
        this.dispose();
        break;
      default:
        break;
    }
  };

  watchProjectFiles() {
    this.levelFolderWatcher = workspace.createFileSystemWatcher(new RelativePattern(this.getLevelFolder(), '**'));

    this.levelFolderWatcher.onDidCreate(uri => {
      const stats = fs.statSync(uri.fsPath);
      if (stats.isFile()) {
        this.checkCanChangeFile(uri, true);
      } else if (stats.isDirectory()) {
        // emit new files after rename folder
        walkSync(uri.fsPath, filePath => {
          this.checkCanChangeFile(Uri.file(filePath), true);
        });
      }
    });

    this.levelFolderWatcher.onDidChange(uri => {
      this.checkCanChangeFile(uri);
    });

    this.levelFolderWatcher.onDidDelete(uri => {
      this.reportChanges({
        isDeleted: true,
        isNew: false,
        uri,
      });
    });
  }

  showValidationError(fileName: string, validationResult: IValidationResult) {
    if (validationResult.isValid) {
      console.error('Trying to show error message on valid file');
      return;
    }

    const message = [`"${fileName.replace(this.getLevelFolder() + path.sep, '')}"`];
    if (!validationResult.isValidRelativePath) {
      message.push(localize('error---Upload wrong file name', 'Upload wrong file name'));
    }
    if (!validationResult.isValidFileType) {
      message.push(
        ` ${localize('error---Upload file type limits', 'Upload file type limits')} ${ACCEPTED_FILE_TYPES.VSCODE}`,
      );
    }
    if (!validationResult.isValidFileSize) {
      message.push(localize('error---Upload size limits', 'Upload size limits'));
    }

    // error
    window.showErrorMessage(message.join(' '));
  }

  checkCanSaveFile(filePath: string): boolean {
    if (UploadLimitations.isIgnoredFile(filePath, this.getLevelFolder())) {
      return false;
    }

    const validationResult = UploadLimitations.validate(filePath, this.getLevelFolder(), true);

    if (!validationResult.isValid) {
      this.showValidationError(filePath, validationResult);
    }

    return validationResult.isValid;
  }

  checkCanChangeFile(uri: Uri, isNew = false) {
    if (!this.checkCanSaveFile(uri.fsPath)) return false;

    this.reportChanges({
      isDeleted: false,
      isNew,
      uri,
    });
  }

  createProjectConfig(levelTypeIsPython: boolean) {
    try {
      const configFile = 'launch.json';
      const configFolder = path.join(this.getLevelFolder(), VSCODE_FOLDER);
      const pythonConfig = {
        configurations: [
          {
            console: 'integratedTerminal',
            cwd: '${fileDirname}',
            name: 'Python: File',
            program: '${file}',
            request: 'launch',
            type: 'python',
          },
        ],
        version: '0.2.0',
      };
      const htmlConfig = {
        configurations: [
          {
            file: '${file}',
            name: 'Html: File',
            request: 'launch',
            type: 'chrome',
          },
        ],
        version: '0.2.0',
      };
      this.fsUtils.mkdir(configFolder);
      fs.writeFileSync(
        path.join(configFolder, configFile),
        JSON.stringify(levelTypeIsPython ? pythonConfig : htmlConfig, null, 4),
      );
    } catch {
      window.showErrorMessage(
        localize('error---Failed to create a project config file', 'Failed to create a project config file'),
      );
    }
  }

  async openProject(levelData: ISyncData) {
    const levelTypeIsPython = this.levelType === VscodeLevelType.PYTHON_OFFLINE;
    this.createProjectConfig(levelTypeIsPython);
    this.algoPanel.showProjectFiles(this.getLevelFolder(), this.levelTitle);
    const defaultCode = levelData.level.config.files.defaultCode;
    const mainFile = this.getLevelFilePath(
      defaultCode ? defaultCode.filePath : levelTypeIsPython ? 'main.py' : 'index.html',
    );

    if (!fs.existsSync(mainFile)) {
      fs.writeFileSync(
        mainFile,
        levelTypeIsPython ? 'print("hello")' : require('raw-loader!./jsLevelMain.html').default,
      );
    }

    await this.algoPanel.openFile(mainFile);

    if (this.isBackofficePreview) {
      this.algoPanel.onDidChangeTextDocument(() => {
        // сохраняем внесенные учителем измнения в файле, чтобы не вылетало уведомление,
        // что есть несохраненные изменения при попытке закрыть файл
        this.algoPanel.saveAll();
      });
    } else {
      this.algoPanel.onDidChangeTextDocument(event => {
        if (!event.document.uri.fsPath.includes(this.getLevelFolder())) return;

        this.initialLevelFiles = [];
        return this.handleDocumentChange();
      });

      this.watchProjectFiles();
    }

    if (levelTypeIsPython) {
      this.disposeTerminals();

      window.createTerminal({
        cwd: this.getLevelFolder(),
      });
    }
  }

  async closeAllEditors() {
    await window.visibleTextEditors.forEach(editor => {
      editor.hide();
    });
    await this.algoPanel.pin();
  }

  bindAlgoPanelEvents() {
    this.algoPanel.on('webViewMessage', this.handleWebViewMessage);
    this.algoPanel.on('dispose', this.handleAlgoPanelDispose);
  }

  unbindAlgoPanelEvents() {
    this.algoPanel.off('webViewMessage', this.handleWebViewMessage);
    this.algoPanel.off('dispose', this.handleAlgoPanelDispose);
  }

  handleAlgoPanelDispose = async () => {
    await this.closeAllEditors();
    this.dispose();
    await this.algoPanel.loadPlatform();
  };

  reload() {
    this.unbindAlgoPanelEvents();
    this.algoPanel.dispose();
    this.dispose();
    commands.executeCommand('workbench.action.closeFolder');
  }

  dispose() {
    if (this.levelFolderWatcher) {
      this.levelFolderWatcher.dispose();
      this.levelFolderWatcher = null;
    }
    this.algoPanel.hideProjectFiles();
    this.disposeTerminals();
  }

  disposeTerminals() {
    window.terminals.forEach(terminal => {
      terminal.dispose();
    });
  }
}

export default Platform;
