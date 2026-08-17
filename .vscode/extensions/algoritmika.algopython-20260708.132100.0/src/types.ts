import { Uri } from 'vscode';

export enum Message {
  UPLOAD_ERROR = 'python_level_error_occurred_during_file_save',
  LOAD_ERROR = 'python_level_error_occurred_during_file_load',
  LIST_ERROR = 'python_level_error_occurred_during_file_listing',
}

export interface IValidationResult {
  isValid: boolean;
  isValidFileSize: boolean;
  isValidFileType: boolean;
  isValidRelativePath: boolean;
}

export type Messages = Record<string, string>;

export enum State {
  LOADING = 'loading',
  CHECKING_UPDATES = 'checking_updates',
  APP = 'app',
}

export enum VscodeLevelType {
  JS_VSCODE = 'js_vscode',
  PYTHON_OFFLINE = 'python_offline',
}

export interface IReportChangesParams {
  uri: Uri;
  isDeleted: boolean;
  isNew: boolean;
}

export interface IReportChangeParams {
  content: string;
  fileName: string;
  isDeleted: boolean;
  isNew: boolean;
}
