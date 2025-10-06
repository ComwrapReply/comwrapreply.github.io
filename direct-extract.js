#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Direct extraction using AppleScript to access browser localStorage
 */

const LOCAL_HTML_FILE = '/Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html';
const SDLC_WORKFLOW_FILE = 'sdlc-workflow.json';

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

function mergeData(existingData, newData) {
    if (!newData || !newData.phases) {
        console.log('❌ No valid data found to merge');
        return existingData;
    }
    
    // Update metadata
    existingData.metadata.lastModified = new Date().toISOString();
    existingData.metadata.totalPhases = Object.keys(newData.phases).length;
    
    // Count total categories and items
    let totalCategories = 0;
    let totalItems = 0;
    
    Object.values(newData.phases).forEach(phase => {
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
    Object.keys(newData.phases).forEach(phaseName => {
        if (existingData.phases[phaseName]) {
            // Update existing phase
            existingData.phases[phaseName] = {
                ...existingData.phases[phaseName],
                ...newData.phases[phaseName]
            };
        } else {
            // Add new phase
            existingData.phases[phaseName] = newData.phases[phaseName];
        }
    });
    
    return existingData;
}

function createAppleScript() {
    const script = `
tell application "Safari"
    activate
    open POSIX file "${LOCAL_HTML_FILE}"
    delay 3
    
    tell document 1
        do JavaScript "localStorage.getItem('sdlc-auto-save')"
    end tell
end tell
`;
    
    fs.writeFileSync('extract-localStorage.scpt', script);
    return 'extract-localStorage.scpt';
}

function extractWithAppleScript() {
    return new Promise((resolve, reject) => {
        console.log('🍎 Using AppleScript to extract localStorage data...');
        
        const script = createAppleScript();
        
        exec(`osascript ${script}`, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ AppleScript error:', error.message);
                reject(error);
                return;
            }
            
            console.log('📊 AppleScript output:', stdout);
            
            // Try to parse the output as JSON
            try {
                const data = JSON.parse(stdout.trim());
                resolve(data);
            } catch (parseError) {
                console.log('❌ Could not parse output as JSON');
                console.log('Raw output:', stdout);
                reject(parseError);
            }
        });
    });
}

async function main() {
    try {
        console.log('🔄 Direct extraction from localStorage...');
        
        // Check if local HTML file exists
        if (!fs.existsSync(LOCAL_HTML_FILE)) {
            console.error(`❌ Local HTML file not found: ${LOCAL_HTML_FILE}`);
            return;
        }
        
        // Try AppleScript extraction
        try {
            const extractedData = await extractWithAppleScript();
            
            if (!extractedData) {
                console.log('❌ No data extracted');
                return;
            }
            
            console.log('📊 Extracted data summary:');
            console.log(`   - Phases: ${Object.keys(extractedData.phases).length}`);
            console.log(`   - Categories: ${extractedData.metadata?.totalCategories || 'N/A'}`);
            console.log(`   - Items: ${extractedData.metadata?.totalItems || 'N/A'}`);
            
            // Read existing sdlc-workflow.json
            const existingData = readJSONFile(SDLC_WORKFLOW_FILE);
            if (!existingData) {
                console.error(`❌ Could not read ${SDLC_WORKFLOW_FILE}`);
                return;
            }
            
            // Merge data
            console.log('🔄 Merging data...');
            const mergedData = mergeData(existingData, extractedData);
            
            // Write updated data
            writeJSONFile(SDLC_WORKFLOW_FILE, mergedData);
            
            console.log('✅ Data successfully extracted and merged!');
            console.log(`📈 Updated totals:`);
            console.log(`   - Phases: ${mergedData.metadata.totalPhases}`);
            console.log(`   - Categories: ${mergedData.metadata.totalCategories}`);
            console.log(`   - Items: ${mergedData.metadata.totalItems}`);
            console.log(`   - Last modified: ${mergedData.metadata.lastModified}`);
            
        } catch (error) {
            console.log('❌ AppleScript extraction failed, trying manual method...');
            console.log('💡 Please follow the manual extraction steps:');
            console.log('   1. Open the HTML file in your browser');
            console.log('   2. Add or modify data');
            console.log('   3. Open browser console (F12)');
            console.log('   4. Run: localStorage.getItem("sdlc-auto-save")');
            console.log('   5. Copy the JSON data and save it as sdlc-workflow-date.json');
            console.log('   6. Run: node auto-sync.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { mergeData, readJSONFile, writeJSONFile };
