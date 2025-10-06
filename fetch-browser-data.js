#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fetch data from browser storage and merge with sdlc-workflow.json
 * This script reads the sdlc-workflow-date.json file (downloaded from browser)
 * and merges it with the existing sdlc-workflow.json file
 */

const SDLC_WORKFLOW_FILE = 'sdlc-workflow.json';
const BROWSER_DATA_FILE = 'sdlc-workflow-date.json';

function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

function writeJSONFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
    }
}

function mergeData(existingData, browserData) {
    // Update metadata
    existingData.metadata.lastModified = new Date().toISOString();
    existingData.metadata.totalPhases = Object.keys(browserData.phases).length;
    
    // Count total categories and items
    let totalCategories = 0;
    let totalItems = 0;
    
    Object.values(browserData.phases).forEach(phase => {
        if (phase.categories) {
            totalCategories += Object.keys(phase.categories).length;
            Object.values(phase.categories).forEach(category => {
                if (category.items) {
                    totalItems += category.items.length;
                }
            });
        }
        if (phase.ownership) {
            totalItems += phase.ownership.length;
        }
    });
    
    existingData.metadata.totalCategories = totalCategories;
    existingData.metadata.totalItems = totalItems;
    
    // Merge phases data
    Object.keys(browserData.phases).forEach(phaseName => {
        if (existingData.phases[phaseName]) {
            // Update existing phase
            existingData.phases[phaseName] = {
                ...existingData.phases[phaseName],
                ...browserData.phases[phaseName]
            };
        } else {
            // Add new phase
            existingData.phases[phaseName] = browserData.phases[phaseName];
        }
    });
    
    return existingData;
}

function main() {
    console.log('🔄 Fetching data from browser storage...');
    
    // Check if browser data file exists
    if (!fs.existsSync(BROWSER_DATA_FILE)) {
        console.error(`❌ Browser data file '${BROWSER_DATA_FILE}' not found.`);
        console.log('💡 Make sure to download the file from the browser first.');
        process.exit(1);
    }
    
    // Read existing sdlc-workflow.json
    const existingData = readJSONFile(SDLC_WORKFLOW_FILE);
    if (!existingData) {
        console.error(`❌ Could not read ${SDLC_WORKFLOW_FILE}`);
        process.exit(1);
    }
    
    // Read browser data
    const browserData = readJSONFile(BROWSER_DATA_FILE);
    if (!browserData) {
        console.error(`❌ Could not read ${BROWSER_DATA_FILE}`);
        process.exit(1);
    }
    
    console.log('📊 Browser data summary:');
    console.log(`   - Phases: ${Object.keys(browserData.phases).length}`);
    console.log(`   - Categories: ${browserData.metadata?.totalCategories || 'N/A'}`);
    console.log(`   - Items: ${browserData.metadata?.totalItems || 'N/A'}`);
    console.log(`   - Last modified: ${browserData.metadata?.lastAutoSave || 'N/A'}`);
    
    // Merge data
    console.log('🔄 Merging data...');
    const mergedData = mergeData(existingData, browserData);
    
    // Write updated data
    writeJSONFile(SDLC_WORKFLOW_FILE, mergedData);
    
    console.log('✅ Data successfully merged!');
    console.log(`📈 Updated totals:`);
    console.log(`   - Phases: ${mergedData.metadata.totalPhases}`);
    console.log(`   - Categories: ${mergedData.metadata.totalCategories}`);
    console.log(`   - Items: ${mergedData.metadata.totalItems}`);
    console.log(`   - Last modified: ${mergedData.metadata.lastModified}`);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { mergeData, readJSONFile, writeJSONFile };
