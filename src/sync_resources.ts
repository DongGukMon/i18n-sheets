import { loadResources } from './services/loadResources';
import { writeResources } from './services/writeResources';
import { getI18nConstants } from './constants';
import fs from 'fs';
import * as diff3 from 'node-diff3';
import path from 'node:path';
import { getTodayYMD } from './utils';

export const syncResources = async () => {
  const constants = await getI18nConstants();

  fs.mkdirSync(constants.OUTPUT_PATH, { recursive: true });
  fs.mkdirSync(constants.ANCHOR_OUTPUT_PATH, { recursive: true });
  fs.mkdirSync(constants.REMOTE_OUTPUT_PATH, { recursive: true });

  const mergedObj = await loadResources();
  await writeResources({ outputPath: constants.REMOTE_OUTPUT_PATH, resources: mergedObj });

  const languages: string[] = [];
  const localFiles = fs.existsSync(constants.OUTPUT_PATH) ? fs.readdirSync(constants.OUTPUT_PATH) : [];
  const anchorFiles = fs.existsSync(constants.ANCHOR_OUTPUT_PATH) ? fs.readdirSync(constants.ANCHOR_OUTPUT_PATH) : [];
  const remoteFiles = fs.existsSync(constants.REMOTE_OUTPUT_PATH) ? fs.readdirSync(constants.REMOTE_OUTPUT_PATH) : [];
  [...anchorFiles, ...localFiles, ...remoteFiles].forEach((fileName) => {
    const lan = fileName.split('.')[0].split('_')[0];
    if (languages.includes(lan)) {
      return;
    }
    languages.push(lan);
  });

  const results = await Promise.allSettled(
    languages.map(async (lan) => {
      const localFile = localFiles.find((it: string) => it.startsWith(lan));
      const localText = localFile
        ? fs.readFileSync(path.join(constants.OUTPUT_PATH, localFile), 'utf8').split('\n')
        : [];
      const anchorFile = anchorFiles.find((it: string) => it.startsWith(lan));
      const anchorText = anchorFile
        ? fs.readFileSync(path.join(constants.ANCHOR_OUTPUT_PATH, anchorFile), 'utf8').split('\n')
        : [];
      const remoteFile = remoteFiles.find((it: string) => it.startsWith(lan));
      const remoteText = remoteFile
        ? fs.readFileSync(path.join(constants.REMOTE_OUTPUT_PATH, remoteFile), 'utf8').split('\n')
        : [];

      const mergeResult = diff3.merge(localText, anchorText, remoteText);

      const outPath = path.join(constants.OUTPUT_PATH, `${lan}.ts`);

      fs.rmSync(outPath, {
        recursive: true,
        force: true,
      });

      fs.writeFileSync(outPath, mergeResult.result.join('\n'), 'utf8');

      if (mergeResult.conflict) {
        return lan;
      }

      const anchorOutPath = path.join(constants.ANCHOR_OUTPUT_PATH, `${lan}_${getTodayYMD()}.ts`);
      fs.writeFileSync(anchorOutPath, mergeResult.result.join('\n'), 'utf8');
    }),
  );

  fs.rmSync(constants.REMOTE_OUTPUT_PATH, {
    recursive: true,
    force: true,
  });

  const conflictLans = results.map((result) => (result as PromiseFulfilledResult<string>).value).filter(Boolean);
  if (conflictLans?.length) {
    {
      const lans = conflictLans.join(', ');
      throw new Error(`Please resolve conflicts on ${lans}`);
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  syncResources();
}