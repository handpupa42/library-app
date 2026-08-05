import { ErrorCode, IEncodedBase64File, REGEXP_PATH_SEP } from '@algonova/vscode-integration';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { ExtensionContext } from 'vscode';

export class FsUtils {
  constructor(private extensionContext: ExtensionContext) {}

  getDataPath(): string {
    return path.join(this.extensionContext.extensionPath, 'data');
  }

  mkdir(folderPath: string) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  writeFiles(folder: string, files: IEncodedBase64File[], overwrite?: boolean) {
    files.forEach(file => {
      const filePath = path.join(folder, file.fileName.replace(REGEXP_PATH_SEP, path.sep));

      if (!overwrite && fs.existsSync(filePath)) {
        throw {
          code: ErrorCode.FILE_ALREADY_EXISTS,
          filePath,
          name: 'FileAlreadyExists',
        };
      }

      this.writeFile(filePath, file);
    });
  }

  writeFile(filePath: string, file: IEncodedBase64File) {
    const fileFolder = path.dirname(filePath);
    // @temporary need this just to make it work in older VSCode versions
    // (i.e. 1.37) - when all users will upgrade their VSCode to 1.46
    // - then you can delete this "existsSync" check
    if (!fs.existsSync(fileFolder)) {
      this.mkdir(fileFolder);
    }
    fs.writeFileSync(filePath, Buffer.from(file.content, 'base64'));
  }

  rmDir(path: string) {
    rimraf.sync(path);
  }
}
