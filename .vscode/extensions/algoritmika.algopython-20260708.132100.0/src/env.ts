import { getHost } from './configuration';

const STAGING_EXTENSION_NAME = 'gorit-beta';
const PRODUCTION_EXTENSION_NAME = 'algopython';

export const EXTENSION_NAME = process.env.EXTENSION_NAME;
const IS_STAGING = EXTENSION_NAME === STAGING_EXTENSION_NAME;
const IS_PRODUCTION = EXTENSION_NAME === PRODUCTION_EXTENSION_NAME;
export const IS_DEVELOPMENT = !IS_STAGING && !IS_PRODUCTION;
export const IS_LOCAL_DEV = EXTENSION_NAME === '';

export const PROTOCOL = IS_LOCAL_DEV ? 'http:' : 'https:';

const DEVELOP_HOST = IS_LOCAL_DEV ? 'localhost:4000' : `${EXTENSION_NAME}-vscode-singlepage.dev.alg.team`;

export const HOST = String(IS_DEVELOPMENT ? DEVELOP_HOST : getHost());

export const VSCODE_FOLDER = '.vscode';
