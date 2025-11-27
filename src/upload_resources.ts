import { getSpreadSheetInstance } from './services/getSpreadSheetInstance';
import { getI18nConstants } from './constants';
import fs from 'fs';
import { pathToFileURL } from 'node:url';
import path from 'path';
import { flatten, mergeDeep, numberToLetter, sortObjectKeys } from './utils';
import { cloneResources } from './services/cloneResources';

type RowObj = Record<string, string>;

export const uploadResources = async () => {
  const [doc, constants] = await Promise.all([
    getSpreadSheetInstance(),
    getI18nConstants()
  ]);

  if (!fs.existsSync(constants.OUTPUT_PATH)) {
    throw new Error(`Output path does not exist: ${constants.OUTPUT_PATH}\nPlease run 'i18n-sheets clone' first to download resources.`);
  }

  let mergedResources = {} as Record<string, Record<string, unknown>>;

  for (const fileName of fs.readdirSync(constants.OUTPUT_PATH)) {
    if (fileName === 'index.ts') {
      continue;
    }
    const fileUrl = pathToFileURL(path.join(constants.OUTPUT_PATH, fileName)).href;
    const mod = await import(fileUrl);
    const lan = fileName.split('.')[0];
    const resource = sortObjectKeys(mod[lan]);

    const reversedResource: Record<string, Record<string, unknown>> = {};
    Object.entries(resource).forEach(([entity, obj]) => {
      reversedResource[entity] = { [lan]: obj };
    });
    mergedResources = mergeDeep(mergedResources, reversedResource);
  }

  await doc.loadInfo();
  const sheets = doc.sheetsByIndex;

  for (const sheet of sheets) {
    if (sheet.title !== constants.TEMPLATE) {
      await sheet.delete();
    }
  }
  const templateSheet = doc.sheetsByTitle[constants.TEMPLATE];

  await Promise.all(Object.entries(mergedResources).map(async ([entity, resource]) => {
    const localeMaps: Record<string, Map<string, string>> = {};
    Object.entries(resource).forEach(([lan, obj]) => {
      localeMaps[lan] = new Map(flatten(obj as Record<string, unknown>));
    });

    const allKeys = Array.from(new Set([...Object.values(localeMaps)].flatMap((map) => Array.from(map.keys())))).sort();
    const maxDepth = Math.max(...allKeys.map((k) => k.split('.').length));

    const rows: RowObj[] = allKeys.map((key, index) => {
      const row: RowObj = {};
      key.split('.').forEach((p, idx) => (row[`level_${idx + 1}`] = p));

      row.translation_key = `=TEXTJOIN(".", TRUE, A${index + 2}:${numberToLetter(maxDepth)}${index + 2})`;

      for (const locale of Object.keys(localeMaps)) {
        row[locale] = localeMaps[locale].get(key) ?? '';
      }
      return row;
    });

    const header = [
      ...Array.from({ length: maxDepth }, (_, i) => `level_${i + 1}`),
      constants.TRANSLATION_KEY,
      ...Object.keys(localeMaps),
    ];

    const newSheet = await templateSheet.duplicate({
      title: entity,
      index: 0,
    });
    await newSheet.setHeaderRow(header);
    await newSheet.addRows(rows);
  }));

  setTimeout(() => cloneResources(), 1000);
};

const run = async () => {
  await uploadResources();
};

if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}
