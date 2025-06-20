import path from 'node:path';
import { loadConfig } from './config';

let config: Awaited<ReturnType<typeof loadConfig>> | null = null;

const getConfig = async () => {
  if (!config) {
    config = await loadConfig();
  }
  return config;
};

export const getI18nConstants = async () => {
  const userConfig = await getConfig();

  return {
    OUTPUT_PATH: path.resolve(process.cwd(), userConfig.outputPath),
    ANCHOR_OUTPUT_PATH: userConfig.anchorOutputPath 
      ? path.resolve(process.cwd(), userConfig.anchorOutputPath)
      : path.resolve(process.cwd(), '.i18n-sheets/anchor'),
    REMOTE_OUTPUT_PATH: userConfig.remoteOutputPath 
      ? path.resolve(process.cwd(), userConfig.remoteOutputPath)
      : path.resolve(process.cwd(), '.i18n-sheets/remote'),
    TRANSLATION_KEY: 'translation_key',
    GOOGLE_SHEET_ID: userConfig.googleSheetId,
    TEMPLATE: 'template',
  };
};


