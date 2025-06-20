import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import type { I18nSheetsConfig } from './types/config';

const findConfigFile = (): { path: string; type: 'json' | 'js' | 'mjs' } | null => {
  const configNames = [
    { name: 'i18n-sheets.config.json', type: 'json' as const },
    { name: 'i18n-sheets.config.js', type: 'js' as const },
    { name: 'i18n-sheets.config.mjs', type: 'mjs' as const },
  ];
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    for (const config of configNames) {
      const configPath = path.join(currentDir, config.name);
      if (fs.existsSync(configPath)) {
        return { path: configPath, type: config.type };
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  return null;
};

export const loadConfig = async (): Promise<I18nSheetsConfig> => {
  const configFile = findConfigFile();
  
  if (!configFile) {
    throw new Error(
      'Config file not found. Please create one of the following in your project root:\n' +
      '- i18n-sheets.config.json\n' +
      '- i18n-sheets.config.js\n' +
      '- i18n-sheets.config.mjs\n\n' +
      'Example (JSON):\n' +
      '{\n' +
      '  "outputPath": "./src/i18n/resources",\n' +
      '  "anchorOutputPath": "./src/i18n/anchor",\n' +
      '  "remoteOutputPath": "./src/i18n/remote",\n' +
      '  "googleSheetId": "your-google-sheet-id",\n' +
      '  "googleCredentials": {\n' +
      '    "clientEmail": "your-service-account@project.iam.gserviceaccount.com",\n' +
      '    "privateKey": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n' +
      '  }\n' +
      '}\n\n' +
      'Example (JS/MJS):\n' +
      'export default {\n' +
      '  outputPath: "./src/i18n/resources",\n' +
      '  anchorOutputPath: "./src/i18n/anchor", // optional\n' +
      '  remoteOutputPath: "./src/i18n/remote", // optional\n' +
      '  googleSheetId: "your-google-sheet-id",\n' +
      '  googleCredentials: {\n' +
      '    clientEmail: "your-service-account@project.iam.gserviceaccount.com",\n' +
      '    privateKey: "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n' +
      '  }\n' +
      '}'
    );
  }
  
  try {
    let config: any;
    
    if (configFile.type === 'json') {
      const configContent = fs.readFileSync(configFile.path, 'utf8');
      config = JSON.parse(configContent);
    } else {
      // For .js and .mjs files
      const configUrl = pathToFileURL(configFile.path).href;
      const configModule = await import(configUrl);
      config = configModule.default || configModule;
    }
    
    if (!config.outputPath || !config.googleSheetId || !config.googleCredentials) {
      throw new Error('Invalid config: missing required fields (outputPath, googleSheetId, googleCredentials)');
    }
    
    if (!config.googleCredentials.clientEmail || !config.googleCredentials.privateKey) {
      throw new Error('Invalid config: missing googleCredentials.clientEmail or googleCredentials.privateKey');
    }
    
    return config as I18nSheetsConfig;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${configFile.path}: ${error.message}`);
    }
    throw error;
  }
};