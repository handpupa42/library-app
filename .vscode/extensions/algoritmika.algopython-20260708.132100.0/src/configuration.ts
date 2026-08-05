import { workspace } from 'vscode';

const configuration = workspace.getConfiguration('algopython');

export const getHost = () => configuration.get('host');

export const setHost = (value: string) => configuration.update('host', value);
