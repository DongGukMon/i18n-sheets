import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export async function parseLocalResources(outputPath: string): Promise<Record<string, Record<string, unknown>>> {
  const resources: Record<string, Record<string, unknown>> = {};
  if (!fs.existsSync(outputPath)) return resources;

  const files = fs.readdirSync(outputPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');

  for (const fileName of files) {
    const lan = fileName.split('.')[0];
    const fileUrl = pathToFileURL(path.join(outputPath, fileName)).href;
    const mod = await import(fileUrl);
    resources[lan] = mod[lan] || {};
  }

  return resources;
}
