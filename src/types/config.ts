export interface I18nSheetsConfig {
  outputPath: string;
  anchorOutputPath?: string;
  remoteOutputPath?: string;
  googleSheetId: string;
  googleCredentials: {
    clientEmail: string;
    privateKey: string;
  };
}