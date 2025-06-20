import { getI18nConstants } from '../constants';
import { mergeDeep, setNestedValue } from '../utils';
import { getSpreadSheetInstance } from '../services/getSpreadSheetInstance';

export const loadResources = async () => {
  const [doc, constants] = await Promise.all([
    getSpreadSheetInstance(),
    getI18nConstants()
  ]);
  await doc.loadInfo();

  const sheets = doc.sheetsByIndex;

  const results = await Promise.all(
    sheets
      .filter((sheet) => sheet.title !== constants.TEMPLATE)
      .map(async (sheet) => {
        const rows = await sheet.getRows(); // 모든 데이터 행 가져오기

        const headers = sheet.headerValues;

        const languagesIndex = headers.reduce((acc, cur, index) => {
          if (!!cur && !cur.startsWith('level') && cur !== constants.TRANSLATION_KEY) {
            return {
              ...acc,
              [cur]: index,
            };
          }
          return acc;
        }, {} as Record<string, number>);
        const translationKeyIndex = headers.findIndex((it) => it === constants.TRANSLATION_KEY);

        return rows.reduce((acc, cur) => {
          const rowData = (cur as unknown as { _rawData: string[] })._rawData;
          const translationKey = rowData[translationKeyIndex].split('.');

          let newAcc = { ...acc };
          Object.keys(languagesIndex).forEach((lan) => {
            const languageIndex = languagesIndex[lan];

            newAcc = setNestedValue(newAcc, [lan, sheet.title, ...translationKey], rowData[languageIndex] ?? '');
          });
          return newAcc;
        }, {} as Record<string, unknown>);
      }),
  );

  return mergeDeep(...results);
};
