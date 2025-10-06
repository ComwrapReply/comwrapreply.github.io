#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Auto-sync script that monitors for changes and automatically merges data
 * This script can run in watch mode to automatically sync data when files change
 */

const SDLC_WORKFLOW_FILE = 'sdlc-workflow.json';
const BROWSER_DATA_FILE = 'sdlc-workflow-date.json';
const WATCH_MODE = process.argv.includes('--watch');

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

function checkFiles() {
    const files = [SDLC_WORKFLOW_FILE, BROWSER_DATA_FILE];
    const missingFiles = files.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        log(`Missing files: ${missingFiles.join(', ')}`, 'error');
        return false;
    }
    
    return true;
}

function runMerge() {
    if (!checkFiles()) {
        return;
    }
    
    log('Starting data merge process...');
    
    // Import and run the merge function
    const { mergeData, readJSONFile, writeJSONFile } = require('./fetch-browser-data.js');
    
    try {
        // Read existing data
        const existingData = readJSONFile(SDLC_WORKFLOW_FILE);
        if (!existingData) {
            log('Could not read sdlc-workflow.json', 'error');
            return;
        }
        
        // Read browser data
        const browserData = readJSONFile(BROWSER_DATA_FILE);
        if (!browserData) {
            log('Could not read browser data file', 'error');
            return;
        }
        
        // Merge data
        const mergedData = mergeData(existingData, browserData);
        
        // Write updated data
        writeJSONFile(SDLC_WORKFLOW_FILE, mergedData);
        
        log('Data successfully merged!', 'success');
        log(`Updated totals: ${mergedData.metadata.totalPhases} phases, ${mergedData.metadata.totalCategories} categories, ${mergedData.metadata.totalItems} items`);
        
    } catch (error) {
        log(`Error during merge: ${error.message}`, 'error');
    }
}

function watchFiles() {
    log('Starting watch mode...');
    log('Watching for changes to sdlc-workflow-date.json');
    
    fs.watchFile(BROWSER_DATA_FILE, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
            log('Browser data file changed, running merge...');
            runMerge();
        }
    });
    
    // Keep the process running
    process.on('SIGINT', () => {
        log('Stopping watch mode...');
        fs.unwatchFile(BROWSER_DATA_FILE);
        process.exit(0);
    });
}

function main() {
    log('SDLC Workflow Auto-Sync Tool');
    log('============================');
    
    if (WATCH_MODE) {
        watchFiles();
    } else {
        runMerge();
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { runMerge, checkFiles };
