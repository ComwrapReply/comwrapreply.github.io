# SDLC Workflow Data Manager

A tool to fetch data from browser local storage and merge it with the main SDLC workflow JSON file.

## Overview

This tool helps you:
1. Fetch data from a local HTML file's browser storage
2. Merge that data with the main `sdlc-workflow.json` file
3. Keep your workflow data synchronized

## Files

- `fetch-local-browser-data.html` - Web interface to fetch data from browser storage
- `fetch-browser-data.js` - Node.js script to merge data
- `auto-sync.js` - Auto-sync script with watch mode
- `sdlc-workflow.json` - Main workflow data file
- `package.json` - Project configuration

## Usage

### Method 1: Using the Local Development Server (Recommended)

1. Start the local server: `npm run serve` or `node server.js`
2. Open your browser and go to: `http://localhost:5000/sdlc-workflow.html`
3. The page will automatically load data from `sdlc-workflow.json`
4. Make changes to the workflow data
5. Changes are automatically saved to the JSON file via the server

### Method 2: Using the Browser Data Fetcher

1. Start the local server: `npm run serve` or `node server.js`
2. Open `http://localhost:5000/fetch-local-browser-data.html` in your browser
3. Open the local SDLC file: `file:///Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html`
4. Add or modify data in the workflow
5. Return to the web interface and click "Fetch from Local Storage"
6. Review the data and click "Download for Merge"
7. Run the merge script: `node fetch-browser-data.js`

### Method 3: Using NPM Scripts

```bash
# Fetch and merge data
npm run fetch-data

# Auto-sync with watch mode
npm run sync-watch

# Start auto-sync
npm start
```

### Method 4: Direct Script Execution

```bash
# Merge data from downloaded file
node fetch-browser-data.js

# Auto-sync with watch mode
node auto-sync.js --watch
```

## Data Structure

The `sdlc-workflow.json` file contains:

- **metadata**: Version, timestamps, and counts
- **phases**: Each phase contains:
  - Basic info (name, description, user story)
  - Ownership (roles responsible)
  - Categories (deliverables, tools, conductors)

## Workflow

1. **Data Source**: Local HTML file with browser storage
2. **Fetch**: Use web interface to extract data
3. **Download**: Save as `sdlc-workflow-date.json`
4. **Merge**: Run script to merge with main JSON file
5. **Sync**: Optional auto-sync for continuous updates

## Requirements

- Node.js >= 14.0.0
- Modern web browser with localStorage support
- Access to the local SDLC file

## Troubleshooting

- Ensure the local file path is correct in the HTML file
- Check that browser storage contains data before fetching
- Verify file permissions for read/write operations
- Use watch mode for automatic synchronization
