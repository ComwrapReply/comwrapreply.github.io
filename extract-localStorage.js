#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Extract localStorage data from local HTML file using browser automation
 */

const LOCAL_HTML_FILE = '/Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html';
const SDLC_WORKFLOW_FILE = 'sdlc-workflow.json';
const TEMP_DATA_FILE = 'sdlc-workflow-date.json';

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

function createExtractionScript() {
    const script = `
// Extract localStorage data and save to file
const data = localStorage.getItem('sdlc-auto-save');
if (data) {
    try {
        const parsedData = JSON.parse(data);
        console.log('Data found in localStorage:', parsedData);
        
        // Create download link
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sdlc-workflow-date.json';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Data downloaded as sdlc-workflow-date.json');
    } catch (error) {
        console.error('Error parsing localStorage data:', error);
    }
} else {
    console.log('No data found in localStorage');
}
`;
    
    fs.writeFileSync('extract-script.js', script);
    return 'extract-script.js';
}

function openInBrowser() {
    return new Promise((resolve, reject) => {
        console.log('🌐 Opening HTML file in browser...');
        
        // Try different browsers
        const browsers = [
            `open "${LOCAL_HTML_FILE}"`,
            `open -a "Google Chrome" "${LOCAL_HTML_FILE}"`,
            `open -a "Safari" "${LOCAL_HTML_FILE}"`,
            `open -a "Firefox" "${LOCAL_HTML_FILE}"`
        ];
        
        let currentBrowser = 0;
        
        function tryNextBrowser() {
            if (currentBrowser >= browsers.length) {
                reject(new Error('Could not open file in any browser'));
                return;
            }
            
            exec(browsers[currentBrowser], (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Browser ${currentBrowser + 1} failed: ${error.message}`);
                    currentBrowser++;
                    tryNextBrowser();
                } else {
                    console.log(`✅ Opened in browser ${currentBrowser + 1}`);
                    resolve();
                }
            });
        }
        
        tryNextBrowser();
    });
}

function waitForDataFile() {
    return new Promise((resolve, reject) => {
        console.log('⏳ Waiting for sdlc-workflow-date.json to be created...');
        console.log('💡 Please:');
        console.log('   1. Add or modify data in the opened HTML file');
        console.log('   2. Open browser console (F12)');
        console.log('   3. Run: localStorage.getItem("sdlc-auto-save")');
        console.log('   4. Copy the JSON data and save it as sdlc-workflow-date.json');
        console.log('   5. Press Enter when done...');
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Press Enter when sdlc-workflow-date.json is ready...', () => {
            rl.close();
            
            // Check if file exists
            if (fs.existsSync(TEMP_DATA_FILE)) {
                console.log('✅ Data file found!');
                resolve();
            } else {
                console.log('❌ Data file not found. Please try again.');
                reject(new Error('Data file not found'));
            }
        });
    });
}

async function main() {
    try {
        console.log('🔄 Extracting localStorage data from local HTML file...');
        
        // Check if local HTML file exists
        if (!fs.existsSync(LOCAL_HTML_FILE)) {
            console.error(`❌ Local HTML file not found: ${LOCAL_HTML_FILE}`);
            return;
        }
        
        // Open HTML file in browser
        await openInBrowser();
        
        // Wait for user to extract data
        await waitForDataFile();
        
        // Read extracted data
        const extractedData = readJSONFile(TEMP_DATA_FILE);
        if (!extractedData) {
            console.error('❌ Could not read extracted data');
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
        
        // Clean up
        if (fs.existsSync(TEMP_DATA_FILE)) {
            fs.unlinkSync(TEMP_DATA_FILE);
            console.log('🧹 Cleaned up temporary files');
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
