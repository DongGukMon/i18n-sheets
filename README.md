# i18n-sheets 📊

A powerful CLI tool for synchronizing internationalization (i18n) resources between Google Sheets and your TypeScript project. Streamline your translation workflow with automated cloning, uploading, and three-way merge synchronization.

## 🌟 Features

- **📥 Clone**: Download translations from Google Sheets to local files
- **📤 Upload**: Push local translations to Google Sheets
- **🔄 Sync**: Intelligent three-way merge between local, remote, and anchor versions
- **⚙️ Configurable**: Support for JSON, JS, and MJS configuration files
- **🎯 Force Mode**: Skip sync checks when needed
- **✨ Auto-formatting**: Prettier integration for consistent code style
- **🛡️ Type-safe**: Full TypeScript support with proper type definitions

## 📦 Installation

```bash
npm install -g i18n-sheets
```

Or use locally in your project:

```bash
npm install --save-dev i18n-sheets
```

## 🚀 Quick Start

1. **Create a configuration file** in your project root:

```javascript
// i18n-sheets.config.js
export default {
  googleSheetId: 'your-google-sheet-id',
  clientEmail: 'your-service-account@project.iam.gserviceaccount.com',
  privateKey: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
  outputPath: './src/i18n/resources',
  anchorOutputPath: './src/i18n/anchor',
  remoteOutputPath: './src/i18n/remote'
};
```

2. **Run your first sync**:

```bash
i18n-sheets sync
```

## 📋 Commands

### `clone` - Download from Google Sheets
Download the latest translations from Google Sheets to your local files.

```bash
# Standard clone (runs sync first)
i18n-sheets clone

# Force clone (skip sync)
i18n-sheets clone -f
i18n-sheets clone --force
```

### `upload` - Push to Google Sheets
Upload your local translations to Google Sheets.

```bash
# Standard upload (runs sync first)
i18n-sheets upload

# Force upload (skip sync)
i18n-sheets upload -f
i18n-sheets upload --force
```

### `sync` - Three-way merge
Perform intelligent three-way merge between local, remote, and anchor versions.

```bash
i18n-sheets sync
```

## ⚙️ Configuration

Create a configuration file in your project root. Supported formats:

- `i18n-sheets.config.js` (ES modules)
- `i18n-sheets.config.mjs` (ES modules)
- `i18n-sheets.config.json` (JSON)

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `googleSheetId` | string | ✅ | Your Google Sheets document ID |
| `clientEmail` | string | ✅ | Service account email |
| `privateKey` | string | ✅ | Service account private key |
| `outputPath` | string | ✅ | Path for generated resource files |
| `anchorOutputPath` | string | ✅ | Path for anchor/backup files |
| `remoteOutputPath` | string | ✅ | Path for remote snapshot files |

### Example Configurations

#### JavaScript (ES Module)
```javascript
// i18n-sheets.config.js
export default {
  googleSheetId: '1ABC123def456GHI789jkl',
  clientEmail: 'i18n-service@my-project.iam.gserviceaccount.com',
  privateKey: process.env.GOOGLE_PRIVATE_KEY,
  outputPath: './src/i18n/resources',
  anchorOutputPath: './src/i18n/anchor', 
  remoteOutputPath: './src/i18n/remote'
};
```

#### JSON
```json
{
  "googleSheetId": "1ABC123def456GHI789jkl",
  "clientEmail": "i18n-service@my-project.iam.gserviceaccount.com",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "outputPath": "./src/i18n/resources",
  "anchorOutputPath": "./src/i18n/anchor",
  "remoteOutputPath": "./src/i18n/remote"
}
```

## 🔄 Workflow

### Standard Workflow
1. **Clone**: `i18n-sheets clone` - Downloads latest from Google Sheets
2. **Edit**: Make changes to your local translation files
3. **Upload**: `i18n-sheets upload` - Pushes changes to Google Sheets
4. **Sync**: Automatic three-way merge resolves conflicts

### Force Mode
Use force flags to skip automatic sync when you're confident about overwriting:

```bash
# Skip sync, directly clone from sheets
i18n-sheets clone --force

# Skip sync, directly upload to sheets  
i18n-sheets upload --force
```

## 📁 File Structure

After running i18n-sheets, your project will have this structure:

```
your-project/
├── i18n-sheets.config.js          # Configuration
├── src/i18n/
│   ├── resources/                 # 📄 Current working files (OUTPUT_PATH)
│   │   ├── en.ts
│   │   ├── ko.ts
│   │   └── index.ts
│   ├── anchor/                    # 📌 Anchor/backup versions (ANCHOR_OUTPUT_PATH)
│   │   ├── en_20250621.ts
│   │   └── ko_20250621.ts
│   └── remote/                    # 🌐 Temporary remote snapshots (REMOTE_OUTPUT_PATH)
│       ├── en_20250621.ts
│       └── ko_20250621.ts
```

### Directory Purposes:

- **`resources/` (OUTPUT_PATH)**: Contains your actual working translation files that you use in your application
- **`anchor/` (ANCHOR_OUTPUT_PATH)**: Stores snapshot versions used as comparison baseline for three-way merge operations
- **`remote/` (REMOTE_OUTPUT_PATH)**: Temporarily holds remote data during sync process - these files are automatically removed after sync completion

## 🔧 Google Sheets Setup

### Step 1: Create Google Cloud Project & Service Account

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project" and create a project

2. **Enable Google Sheets API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create a Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account name and click "Create"

4. **Generate and Download Credentials**
   - After creating the service account, click on it
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key" > "JSON"
   - Download the JSON file

5. **Extract Credentials from JSON**
   - Open the downloaded JSON file
   - Find `client_email` - this is your **clientEmail**
   - Find `private_key` - this is your **privateKey** (keep the `\n` characters)

   ```json
   {
     "client_email": "your-service@project.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   }
   ```

### Step 2: Get Google Sheet ID

1. **Open your Google Sheet**
2. **Copy the Sheet ID from URL**
   - The URL looks like: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - Copy the `[SHEET_ID]` part (between `/d/` and `/edit`)

   Example:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123def456GHI789jkl/edit#gid=0
                                      ^^^^^^^^^^^^^^^^^^^^
                                      This is your googleSheetId
   ```

### Step 3: Share Sheet with Service Account

1. **Share your Google Sheet**
   - Open your Google Sheet
   - Click the "Share" button
   - Add the `client_email` from your service account JSON
   - Give it "Editor" permissions

### Template Sheet Setup

**Important**: You must create a sheet named **`template`** in your Google Spreadsheet. This template sheet serves as the base template for creating resource sheets organized by domain.

Benefits of using a template sheet:
- **Conditional Formatting**: Pre-configure conditional formatting to highlight header areas or empty cells
- **Consistent Structure**: Ensures all domain-specific sheets follow the same format
- **Visual Aids**: Apply colors, borders, or other formatting to improve readability

### Sheet Format

Your Google Sheet should follow this structure with depth-based columns:

| level_1 | level_2        | level_3 | translation_key | ko | en | ... |
|---------|----------------|---------|-----------------|----|----|-----|
| common | label          | next | common.label.next | 다음 | Next | ... |
| common | label          | register | common.label.register | 등록 | Register | ... |
| game_card | title               |  | game_card.title | 게임 카드 | Game Card | ... |
| game_card | search_account | title | game_card.search_account.title | 계정 검색 | Search account | ... |

**Column Structure:**
- **`level_1`, `level_2`, `level_3`, etc.**: Individual depth levels of the translation key
- **`translation_key`**: The combined key formed by joining all levels with dots (e.g., `common.label.next`)
- **`ko`, `en`, etc.**: Language-specific translation values

**Key Features:**
- Keys are hierarchically organized by depth levels
- The `translation_key` column shows the final combined key
- Language columns contain the actual translations
- Empty level columns are allowed for simpler key structures

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm run dev

# Run tests (if available)
npm test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 [Report Issues](https://github.com/your-username/i18n-sheets/issues)
- 💬 [Discussions](https://github.com/your-username/i18n-sheets/discussions)
- 📧 Email: your-email@example.com

---

Made with ❤️ for the i18n community
