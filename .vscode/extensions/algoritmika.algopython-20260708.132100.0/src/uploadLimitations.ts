import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ACCEPTED_FILE_TYPES } from '@algonova/accepted-file-types';
import { IValidationResult } from './types';

export class UploadLimitations {
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  static readonly REGEXP_VALID_NAME = /^[\w.-]+$/;

  static isValidFileSize(filePath: string, canBeEmpty: boolean): boolean {
    try {
      const stats = fs.statSync(filePath);
      if ((stats.size === 0 && !canBeEmpty) || stats.size > UploadLimitations.MAX_FILE_SIZE) {
        return false;
      }
    } catch {
      return false;
    }
    return true;
  }

  static isValidFileType(filePath: string): boolean {
    const ext = path.extname(filePath).toLocaleLowerCase();
    return ACCEPTED_FILE_TYPES.VSCODE.indexOf(ext) !== -1;
  }

  static isFile(filePath: string): boolean {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  }

  static isStartWith(filePath: string, levelFolder: string, char: string): boolean {
    return filePath.replace(`${levelFolder}/`, '')[0] === char;
  }

  static isPycache(filePath: string): boolean {
    return filePath.includes('__pycache__');
  }

  static isTempFile(filePath: string): boolean {
    return path.extname(filePath).toLocaleLowerCase() === '.tmp';
  }

  static validate(filePath: string, levelFolder: string, canBeEmpty = false): IValidationResult {
    const isValidRelativePath = UploadLimitations.isValidRelativePath(filePath, levelFolder);
    const isValidFileType = UploadLimitations.isValidFileType(filePath);
    const isValidFileSize = UploadLimitations.isValidFileSize(filePath, canBeEmpty);
    return {
      isValid: isValidRelativePath && isValidFileType && isValidFileSize,
      isValidFileSize,
      isValidFileType,
      isValidRelativePath,
    };
  }

  static isValidRelativePath(filePath: string, levelFolder: string): boolean {
    return UploadLimitations.REGEXP_VALID_NAME.test(path.relative(levelFolder, filePath).split(path.sep).join(''));
  }

  static isIgnoredFile(filePath: string, levelFolder: string): boolean {
    return (
      UploadLimitations.isStartWith(filePath, levelFolder, '.') ||
      UploadLimitations.isStartWith(filePath, levelFolder, '-') ||
      UploadLimitations.isStartWith(filePath, levelFolder, '_') ||
      UploadLimitations.isStartWith(filePath, levelFolder, '~') ||
      UploadLimitations.isTempFile(filePath) ||
      UploadLimitations.isPycache(filePath) ||
      !UploadLimitations.isFile(filePath)
    );
  }
}
