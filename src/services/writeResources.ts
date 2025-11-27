import fs from 'node:fs';
import prettier from 'prettier';
import path from 'node:path';
import { sortObjectKeys } from '../utils';

export const writeResources = async ({
  outputPath,
  resources,
  fileNameSuffix,
  makeIndexFile,
}: {
  outputPath?: string;
  resources: Record<string, unknown>;
  fileNameSuffix?: string;
  makeIndexFile?: boolean;
}) => {
  const { getI18nConstants } = await import('../constants');
  const constants = await getI18nConstants();
  const finalOutputPath = outputPath || constants.OUTPUT_PATH;
  fs.rmSync(finalOutputPath, {
    recursive: true,
    force: true,
  });

  const languages: string[] = [];

  const applyPrettier = async (content: string) => {
    return await prettier.format(content, {
      parser: 'typescript',
      quoteProps: 'as-needed',
      singleQuote: true,
    });
  };

  await Promise.all(
    Object.entries(resources).map(async ([lan, obj]) => {
      languages.push(lan);
      const sortedObj = sortObjectKeys(obj);
      const content = `export const ${lan} = ${JSON.stringify(sortedObj, null, 2)} as const;`;
      const formattedContent = await applyPrettier(content);

      const outPath = path.join(finalOutputPath, `${lan}${fileNameSuffix ? `_${fileNameSuffix}` : ''}.ts`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, formattedContent, 'utf8');
      console.log(`✓ ${outPath}`);
    }),
  );

  if (makeIndexFile) {
    const importLine = languages.map((lan) => `import { ${lan} } from './${lan}';`).join('\n');
    const exportLine = `export const resources = {\n ${languages.join(',\n')}};`;
    const content = `${importLine}\n\n${exportLine}`;
    const formattedContent = await applyPrettier(content);

    const outPath = path.join(finalOutputPath, `index.ts`);
    fs.writeFileSync(outPath, formattedContent, 'utf8');
    console.log(`✓ ${outPath}`);
  }
};
