import { IntlMessageFormat, PrimitiveType } from 'intl-messageformat';

import { translations } from './locales';

const DEFAULT_LOCALE = 'en-us';

let locale = DEFAULT_LOCALE;

const resolveLocale = (lang: string) => {
  const normalized = lang.toLowerCase();
  if (translations[normalized]) return normalized;

  const language = normalized.split('-')[0];
  if (translations[language]) return language;

  const match = Object.keys(translations).find(key => key.split('-')[0] === language);
  return match || DEFAULT_LOCALE;
};

const getMessage = (id: string) => {
  const messages = translations[locale] || {};
  return messages[id];
};

const getDefaultLocale = () => {
  const config = process.env.VSCODE_NLS_CONFIG || `{ "locale": "${DEFAULT_LOCALE}" }`;
  let lang: string = JSON.parse(config).locale;
  if (!lang.includes('-')) {
    lang = [lang, lang].join('-');
  }
  const msg = new IntlMessageFormat('', lang);
  return msg.resolvedOptions().locale;
};

export const getLocale = () => locale;

export const localize = (id: string, defaultMessage: string, values?: Record<string, PrimitiveType>) => {
  const msg = new IntlMessageFormat(getMessage(id) || defaultMessage, locale);
  return msg.format(values);
};

export const setLocale = (lang?: string) => {
  locale = resolveLocale(lang || getDefaultLocale());
};
