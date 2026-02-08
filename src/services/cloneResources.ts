import { loadResources } from './loadResources';
import { writeResources } from './writeResources';
import { getI18nConstants } from '../constants';

export const cloneResources = async () => {
  const [mergedObj, constants] = await Promise.all([
    loadResources(),
    getI18nConstants()
  ]);

  await Promise.all([
    writeResources({ outputPath: constants.OUTPUT_PATH, resources: mergedObj, makeIndexFile: true }),
    writeResources({
      outputPath: constants.ANCHOR_OUTPUT_PATH,
      resources: mergedObj,
    })
  ]);
};
