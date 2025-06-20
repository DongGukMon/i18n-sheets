#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('i18n-sheets')
  .description('🌐 i18n Google Sheets synchronization CLI - Manage your internationalization resources with Google Sheets')
  .version('1.0.0')
  .addHelpText('after', `
📖 Examples:
  $ i18n-sheets sync                    # Merge local and remote resources
  $ i18n-sheets clone                   # Download and overwrite with remote resources
  $ i18n-sheets clone --force           # Skip sync and force download
  $ i18n-sheets upload                  # Upload local resources to remote
  $ i18n-sheets upload -f               # Skip sync and force upload

⚙️  Configuration:
  Create i18n-sheets.config.json, i18n-sheets.config.js, or i18n-sheets.config.mjs in your project root.
  
  Example config:
  {
    "outputPath": "./src/i18n/resources",
    "anchorOutputPath": "./src/i18n/anchor",
    "remoteOutputPath": "./src/i18n/remote",
    "googleSheetId": "your-google-sheet-id",
    "googleCredentials": {
      "clientEmail": "your-service-account@project.iam.gserviceaccount.com",
      "privateKey": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
    }
  }

🔗 More info: https://github.com/your-org/i18n-sheets`);

program
  .command('clone')
  .description('📥 Download and overwrite local resources with remote Google Sheets data')
  .option('-f, --force', 'skip sync check and force download (⚠️  may overwrite local changes)')
  .addHelpText('after', `
💡 This command will:
  1. Run sync to merge changes (unless --force is used)
  2. Download latest data from Google Sheets
  3. Overwrite local i18n resource files
  4. Create anchor files for future sync operations`)
  .action(async (options) => {
    try {
      if (!options.force) {
        console.log('🔄 Running sync before clone...');
        const { syncResources } = await import('./sync_resources');
        await syncResources();
        console.log('✅ Sync completed successfully');
      }
      
      const { cloneResources } = await import('./services/cloneResources');
    await cloneResources();
      console.log('✅ Clone completed successfully');
    } catch (error) {
      console.error('❌ Clone failed:', error);
      process.exit(1);
    }
  });

program
  .command('upload')
  .description('📤 Upload local resources to Google Sheets, then download updated data')
  .option('-f, --force', 'skip sync check and force upload (⚠️  may overwrite remote changes)')
  .addHelpText('after', `
💡 This command will:
  1. Run sync to merge changes (unless --force is used)
  2. Upload local i18n files to Google Sheets
  3. Automatically run clone to sync back any changes
  4. Update anchor files for future sync operations`)
  .action(async (options) => {
    try {
      if (!options.force) {
        console.log('🔄 Running sync before upload...');
        const { syncResources } = await import('./sync_resources');
        await syncResources();
        console.log('✅ Sync completed successfully');
      }
      
      const { uploadResources } = await import('./upload_resources');
      await uploadResources();
      console.log('✅ Upload completed successfully');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('🔄 Merge local and remote resources using three-way merge')
  .addHelpText('after', `
💡 This command will:
  1. Download latest data from Google Sheets to temporary location
  2. Perform three-way merge between:
     - Local files (your current changes)
     - Anchor files (last known sync point)
     - Remote files (latest from Google Sheets)
  3. Update local files with merged result
  4. Update anchor files if no conflicts
  5. Report any merge conflicts that need manual resolution

⚠️  If conflicts are detected, you must resolve them manually before running other commands.`)
  .action(async () => {
    try {
      const { syncResources } = await import('./sync_resources');
      await syncResources();
      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    }
  });

program.parse();
