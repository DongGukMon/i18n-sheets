export interface I18nSheetsConfig {
  outputPath: string;
  anchorOutputPath?: string;
  googleSheetId: string;
  googleCredentials: {
    clientEmail: string;
    privateKey: string;
  };
}