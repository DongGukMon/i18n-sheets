import { loadResources } from './services/loadResources';
import { parseLocalResources } from './services/parseLocalResources';
import { writeResources } from './services/writeResources';
import { getI18nConstants } from './constants';
import { flatten, unflatten, sortObjectKeys } from './utils';
import { threeWayMerge, type ConflictEntry } from './diff';
import fs from 'node:fs';
import path from 'node:path';

export const syncResources = async () => {
  const constants = await getI18nConstants();

  // Migration: clean up old-format anchor files (.json, *_YYYYMMDD.ts) before loading
  migrateOldAnchorFiles(constants.ANCHOR_OUTPUT_PATH);

  // Phase 1: Parallel loading (network + disk I/O)
  const [remoteResources, localResources, anchorResources] = await Promise.all([
    loadResources(),
    parseLocalResources(constants.OUTPUT_PATH),
    parseLocalResources(constants.ANCHOR_OUTPUT_PATH),  // anchor is .ts now
  ]);

  // Collect all languages from all sources
  const languages = new Set([
    ...Object.keys(remoteResources),
    ...Object.keys(localResources),
    ...Object.keys(anchorResources),
  ]);

  const allConflicts: Record<string, ConflictEntry[]> = {};
  const mergedResources: Record<string, unknown> = {};

  // Phase 2: Sequential merge (CPU-bound)
  for (const lan of languages) {
    const localFlat = Object.fromEntries(flatten((localResources[lan] || {}) as Record<string, unknown>));
    const anchorFlat = Object.fromEntries(flatten((anchorResources[lan] || {}) as Record<string, unknown>));
    const remoteFlat = Object.fromEntries(flatten((remoteResources[lan] || {}) as Record<string, unknown>));

    const { merged, conflicts } = threeWayMerge(localFlat, anchorFlat, remoteFlat);
    mergedResources[lan] = sortObjectKeys(unflatten(merged));

    if (conflicts.length > 0) {
      allConflicts[lan] = conflicts;
    }
  }

  // Phase 3: Parallel writing
  await Promise.all([
    writeResources({
      outputPath: constants.OUTPUT_PATH,
      resources: mergedResources,
      cleanBefore: true,
      makeIndexFile: true,
    }),
    writeResources({
      outputPath: constants.ANCHOR_OUTPUT_PATH,
      resources: mergedResources,
      cleanBefore: true,  // cleans old files automatically
    }),
  ]);

  // Report conflicts
  if (Object.keys(allConflicts).length > 0) {
    console.warn('\n⚠️  Merge conflicts detected (auto-resolved):');
    for (const [lan, conflicts] of Object.entries(allConflicts)) {
      console.warn(`\n  [${lan}]`);
      for (const c of conflicts) {
        console.warn(`    ${c.key}:`);
        console.warn(`      local:  ${c.localValue ?? '(deleted)'}`);
        console.warn(`      remote: ${c.remoteValue ?? '(deleted)'}`);
        console.warn(`      anchor: ${c.anchorValue ?? '(not exists)'}`);
      }
    }
    console.warn('');
  }
};

/** Remove old-format anchor files (.json, *_YYYYMMDD.ts) for migration */
function migrateOldAnchorFiles(anchorPath: string) {
  if (!fs.existsSync(anchorPath)) return;

  const files = fs.readdirSync(anchorPath);
  for (const file of files) {
    // Remove .json files (old anchor format)
    // Remove *_YYYYMMDD.ts files (old date-suffix format)
    if (file.endsWith('.json') || /^.+_\d{8}\.ts$/.test(file)) {
      fs.rmSync(path.join(anchorPath, file), { force: true });
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncResources();
}
