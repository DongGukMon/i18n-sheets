import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { getI18nConstants } from '../constants';
import { loadConfig } from '../config';

export const getSpreadSheetInstance = async () => {
  const [constants, config] = await Promise.all([
    getI18nConstants(),
    loadConfig()
  ]);
  
  const serviceAccountAuth = new JWT({
    email: config.googleCredentials.clientEmail,
    key: config.googleCredentials.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  return new GoogleSpreadsheet(constants.GOOGLE_SHEET_ID, serviceAccountAuth);
};