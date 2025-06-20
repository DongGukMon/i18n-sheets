#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('i18n-sheets')
  .description('Sample TypeScript CLI')
  .version('0.1.0');

program
  .command('hello [name]')
  .description('Print a greeting')
  .action((name = 'world') => {
    console.log(`👋  Hello ${name}!`);
  });

program.parse();
